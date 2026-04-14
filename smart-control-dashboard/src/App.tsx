import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, MessageSquare, User, LayoutDashboard, Menu, X, Bell, Search, Zap } from 'lucide-react';
import Auth from './components/Auth';
import ResumeChecker from './components/ResumeChecker';
import Chatbot from './components/Chatbot';
import Account from './components/Account';
import DashboardHome from './components/DashboardHome';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const handleAuth = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Auth onAuth={handleAuth} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Resume Checker', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'account', label: 'My Account', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-green to-primary-blue bg-clip-text text-transparent">
            Smart Control
          </h1>
        </div>

        <nav className="px-4 mt-4 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase px-4 mb-2 tracking-widest">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary-blue text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Storage</p>
            <div className="h-1.5 bg-slate-200 rounded-full mb-2">
              <div className="h-full bg-primary-green w-1/3 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500">1.2GB of 5GB used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Student ID: #8829</p>
              </div>
              <button 
                onClick={() => setActiveTab('account')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform"
              >
                {user.fullName?.[0]}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <DashboardHome user={user} onNavigate={setActiveTab} />}
                {activeTab === 'upload' && <ResumeChecker />}
                {activeTab === 'chat' && <Chatbot />}
                {activeTab === 'account' && <Account user={user} onLogout={handleLogout} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
