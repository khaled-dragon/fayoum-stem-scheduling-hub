'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const gradeColors = {
  G10: { from: '#1d4ed8', to: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' },
  G11: { from: '#0e7490', to: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)' },
  G12: { from: '#7c3aed', to: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' },
};

export default function ClassCard({ className, schedule, index }) {
  const router = useRouter();
  const grade = className.split(' ')[0];
  const colors = gradeColors[grade] || gradeColors.G10;
  const section = className.split(' ')[1];
  const hasSchedule = !!schedule?.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => router.push(`/class/${encodeURIComponent(className)}`)}
      className="cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(5, 13, 26, 0.7)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = colors.glow.replace('0.3', '0.6');
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(0,0,0,0.5), 0 0 30px ${colors.glow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
      />

      <div className="p-6">
        {/* Grade badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="px-3 py-1 rounded-lg text-xs font-medium"
            style={{
              background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}11)`,
              border: `1px solid ${colors.from}44`,
              color: colors.to,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            {grade}
          </div>

          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: hasSchedule ? '#22c55e' : '#475569',
              boxShadow: hasSchedule ? '0 0 8px #22c55e' : 'none',
            }}
          />
        </div>

        {/* Class name */}
        <div className="mb-3">
          <h3
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: '28px',
              color: '#f1f5f9',
              lineHeight: 1,
            }}
          >
            {className}
          </h3>
          <p
            className="mt-1"
            style={{ color: '#334155', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}
          >
            Section {section}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: hasSchedule ? '#4ade80' : '#475569', fontFamily: 'DM Sans, sans-serif' }}
          >
            {hasSchedule ? 'Schedule available' : 'No schedule yet'}
          </span>
          <span style={{ color: colors.to, fontSize: '18px' }}>→</span>
        </div>
      </div>
    </motion.div>
  );
}
