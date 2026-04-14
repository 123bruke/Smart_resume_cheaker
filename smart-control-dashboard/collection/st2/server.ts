import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "resucheck-secret-key";

// Database Setup
const db = new Database("database.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    fullName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (email, password, fullName) VALUES (?, ?, ?)");
    const result = stmt.run(email, hashedPassword, fullName);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName } });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  const user: any = db.prepare("SELECT id, email, fullName, createdAt FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// File Upload Setup
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/analyze-resume", authenticateToken, upload.single('resume'), async (req, res) => {
  // In a real app, we'd parse the PDF/Docx here. 
  // For this demo, we'll assume the client sends the text or we just simulate analysis.
  res.json({ message: "Resume received for analysis" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
