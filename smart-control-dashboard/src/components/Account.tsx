import { User, Mail, Calendar, LogOut } from 'lucide-react';

interface AccountProps {
  user: any;
  onLogout: () => void;
}

export default function Account({ user, onLogout }: AccountProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-green to-primary-blue" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-slate-500">Student Account</p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Mail className="w-5 h-5 text-primary-blue" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-5 h-5 text-primary-green" />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
