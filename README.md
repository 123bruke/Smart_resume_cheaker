               ## Smart Resume Checker

# An intelligent AI-powered Resume Analysis System that evaluates resumes, classifies job domains, and provides feedback using Machine Learning, NLP, and Web Technologies.
The Smart Resume Checker is designed to:

Analyze resumes (PDF/text)
Classify them into domains (IT, Engineering, Medicine, Accounting, etc.)
Evaluate skills, experience, and content quality
Provide intelligent suggestions using AI
Offer an interactive dashboard with chatbot support

## Key Features
✅ Resume Parsing (PDF & Text Extraction)
✅ Domain Classification using ML
✅ Skill Detection & Matching
✅ AI-Based Resume Feedback
✅ Chatbot Integration (Gemini API / AI assistant)
✅ Web Dashboard (React + TypeScript)
✅ Backend API (Flask)
✅ Data Storage & Processing

Smart_resume_cheaker-main/
│
├── MODEL DATA/                  # Training data for different domains
│   ├── Accountant.json/
│   ├── IT/
│   ├── engineering/
│   └── medicine/
│
├── smart-control-dashboard/     # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── FONT_API/
│   │   └── App.tsx
│
├── thinkingmodel/               # Backend + ML logic
│   ├── flask.py                # Main Flask server
│   ├── Machine_Learning_model/
│   │   ├── preprocessing.py
│   │   ├── saving.py
│   │   └── full_langchain_system/
│   ├── extraction/             # PDF & Image extraction
│   ├── storing/                # Database connection
│   └── collective/             # SQL & storage logic
│
└── README.md


⚙️ Technologies Used
Frontend:
React.js
TypeScript
Vite
CSS
Backend:
Flask (Python)
REST API
Machine Learning & AI:
NLP (Resume Parsing)
Classification Models
LangChain System
AI Chatbot (Gemini API)
Database:
SQL (Custom storage system)
