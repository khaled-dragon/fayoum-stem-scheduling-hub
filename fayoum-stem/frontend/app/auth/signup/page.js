'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import toast from 'react-hot-toast';
import ParticleBackground from '../../../components/ParticleBackground';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'student' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Sign up failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    padding: '12px 16px',
    width: '100%',
    transition: 'all 0.2s',
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative py-12"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(29, 78, 216, 0.1) 0%, #03060f 60%)' }}
    >
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="glass-card rounded-2xl p-8"
          style={{
            background: 'rgba(5, 13, 26, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(59, 130, 246, 0.08)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>FS</span>
            </div>
          </div>

          <h1
            className="text-center mb-1"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#f1f5f9', fontSize: '24px' }}
          >
            Create Account
          </h1>
          <p
            className="text-center mb-6"
            style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}
          >
            Join the STEM Fayoum community
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1.5 text-xs" style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs" style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs" style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs" style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>
                CONFIRM PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 py-3.5 rounded-xl text-white font-medium flex items-center justify-center"
              style={{
                background: loading ? 'rgba(59, 130, 246, 0.4)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(59, 130, 246, 0.35)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </motion.button>
          </form>

          <p
            className="text-center mt-6 text-sm"
            style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif' }}
          >
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/signin')}
              style={{ color: '#60a5fa' }}
              className="hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
