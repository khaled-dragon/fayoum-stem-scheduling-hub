'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(29, 78, 216, 0.15) 0%, #03060f 60%)' }}
    >
      <ParticleBackground />

      {/* Ambient orbs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(29, 78, 216, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top-left logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-6 left-6 z-10 flex items-center gap-3"
      >
        {!logoError ? (
          <img
            src="/school.png"
            alt="STEM Fayoum"
            onError={() => setLogoError(true)}
            className="h-10 w-auto"
          />
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
            >
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>FS</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', color: '#93c5fd', fontWeight: 700, fontSize: 16 }}>
              STEM Fayoum
            </span>
          </div>
        )}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 px-4 py-1.5 rounded-full text-sm"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#93c5fd',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: 11,
          }}
        >
          Academic Scheduling Platform
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mb-4 leading-tight"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: '#f1f5f9',
            textShadow: '0 0 60px rgba(59, 130, 246, 0.3)',
            lineHeight: 1.1,
          }}
        >
          Fayoum STEM
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #93c5fd, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Scheduling Hub
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12 text-lg"
          style={{
            color: '#64748b',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '13px',
            fontWeight: 400,
          }}
        >
          Smart&nbsp;&nbsp;·&nbsp;&nbsp;Organized&nbsp;&nbsp;·&nbsp;&nbsp;Reliable
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/auth/signin')}
            className="px-8 py-3.5 rounded-xl text-white font-medium text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              boxShadow: '0 4px 24px rgba(59, 130, 246, 0.4)',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/auth/signup')}
            className="px-8 py-3.5 rounded-xl font-medium text-sm transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#93c5fd',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              backdropFilter: 'blur(12px)',
              letterSpacing: '0.02em',
            }}
          >
            Create Account
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: '#334155', fontFamily: 'DM Sans, sans-serif' }}
        >
          <div className="w-8 h-px" style={{ background: 'rgba(59,130,246,0.3)' }} />
          STEM High School · Fayoum · Egypt
          <div className="w-8 h-px" style={{ background: 'rgba(59,130,246,0.3)' }} />
        </div>
      </motion.div>
    </main>
  );
}
