import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slice/auth/authThunk';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.password) { toast.error('Please fill all fields'); return; }
    try {
      const result = await dispatch(registerUser(formData));
      if (result.error) { toast.error(result.payload); }
      else { toast.success('Account created!'); navigate('/login'); }
    } catch { toast.error('Error during registration'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1b3e 40%,#0a2240 70%,#061428 100%)' }}>

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#3b82f6', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#8b5cf6', transform: 'translate(-30%,30%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
            <span className="text-white font-bold text-xl tracking-tight">NovaShare</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-slate-400 text-sm mt-2">Start sharing files securely</p>
        </div>

        <div className="border border-white/10 rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">Sign in</Link>
          </p>
        </div>
        <p className="text-center text-xs text-slate-600 mt-6">&copy; {new Date().getFullYear()} NovaShare.</p>
      </div>
    </div>
  );
};

export default Signup;