import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Zap, 
  Shield, 
  Clock,
  ArrowUpRight,
  Activity
} from 'lucide-react';

interface DashboardHomeProps {
  user: any;
  onNavigate: (tab: string) => void;
}

export default function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const stats = [
    { label: 'AI Analysis', value: '98%', icon: Zap, color: 'text-yellow-500' },
    { label: 'System Health', value: 'Optimal', icon: Activity, color: 'text-primary-green' },
    { label: 'Security', value: 'Encrypted', icon: Shield, color: 'text-primary-blue' },
    { label: 'Uptime', value: '99.9%', icon: Clock, color: 'text-slate-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, <span className="text-primary-blue">{user.fullName.split(' ')[0]}</span>!
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your smart control center.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <div className="w-3 h-3 rounded-full bg-primary-green animate-pulse" />
          <span className="text-sm font-medium text-slate-600">AI Engine Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
              <p className="text-lg font-bold text-slate-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Module */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate('upload')}
          className="md:col-span-2 glass-card p-8 rounded-3xl cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-32 h-32 text-primary-green" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-primary-green" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Resume Intelligence</h3>
            <p className="text-slate-500 max-w-md mb-6">
              Upload and analyze your professional documents with our advanced AI scoring engine.
            </p>
            <div className="flex items-center gap-2 text-primary-green font-bold">
              Launch Module <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Module */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate('chat')}
          className="glass-card p-8 rounded-3xl cursor-pointer group bg-gradient-to-br from-primary-blue to-dark-blue text-white border-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-2">AI Assistant</h3>
          <p className="text-blue-100 mb-6">
            Get real-time career advice and resume tips from Gemini.
          </p>
          <div className="flex items-center gap-2 font-bold">
            Chat Now <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Account Quick View */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate('account')}
          className="glass-card p-8 rounded-3xl cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-primary-blue">
              {user.fullName[0]}
            </div>
            <div>
              <h4 className="font-bold">{user.fullName}</h4>
              <p className="text-xs text-slate-400">Student Member</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-green w-3/4" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Profile Completion: 75%</p>
          </div>
        </motion.div>

        {/* Insights Widget */}
        <div className="md:col-span-2 glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-blue" />
              AI Career Insights
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Weekly Update</span>
          </div>
          <div className="space-y-4">
            {[
              "Tech roles are seeing a 15% increase in demand for AI skills.",
              "Remote-first companies are prioritizing communication clarity in resumes.",
              "Soft skills like 'Adaptability' are trending in top-tier job descriptions."
            ].map((insight, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-primary-blue mt-2 shrink-0" />
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
