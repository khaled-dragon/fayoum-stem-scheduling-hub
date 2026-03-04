'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(3, 6, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}
          >
            <span className="text-white text-xs font-bold">FS</span>
          </div>
          <span
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#e2e8f0', fontSize: '16px' }}
            className="group-hover:text-blue-400 transition-colors"
          >
            STEM Fayoum
          </span>
        </button>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: user.role === 'admin' ? '#f59e0b' : '#3b82f6',
                    boxShadow: `0 0 8px ${user.role === 'admin' ? '#f59e0b' : '#3b82f6'}`,
                  }}
                />
                <span className="text-sm" style={{ color: '#94a3b8' }}>
                  {user.name || user.email}
                </span>
                {user.role === 'admin' && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
