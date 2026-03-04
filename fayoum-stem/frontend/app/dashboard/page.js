'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { scheduleService } from '../../services/api';
import Navbar from '../../components/Navbar';
import ClassCard from '../../components/ClassCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ParticleBackground from '../../components/ParticleBackground';
import toast from 'react-hot-toast';

const GRADE_GROUPS = {
  'Grade 10': ['G10 A', 'G10 B', 'G10 C'],
  'Grade 11': ['G11 A', 'G11 B', 'G11 C'],
  'Grade 12': ['G12 A', 'G12 B'],
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchSchedules = async () => {
      try {
        const res = await scheduleService.getAll();
        setSchedules(res.data.schedules || []);
      } catch (err) {
        toast.error('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user]);

  const getScheduleForClass = (className) =>
    schedules.find(s => s.class_name === className) || null;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#03060f' }}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  let cardIndex = 0;

  return (
    <main className="relative min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(29, 78, 216, 0.12) 0%, #03060f 55%)' }}>
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            {user.role === 'admin' && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Admin Panel
              </span>
            )}
          </div>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#f1f5f9',
              lineHeight: 1.2,
            }}
          >
            Class Schedules
          </h1>
          <p
            className="mt-2"
            style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif', fontSize: '15px' }}
          >
            {user.role === 'admin'
              ? 'Select a class to view or update its schedule.'
              : `Welcome, ${user.name}. Select your class to view your schedule.`}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" text="Loading schedules..." />
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(GRADE_GROUPS).map(([gradeName, classes]) => (
              <motion.section
                key={gradeName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#94a3b8',
                    }}
                  >
                    {gradeName}
                  </h2>
                  <div className="flex-1 h-px" style={{ background: 'rgba(59, 130, 246, 0.1)' }} />
                  <span
                    className="text-xs"
                    style={{ color: '#334155', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {classes.length} sections
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((className) => (
                    <ClassCard
                      key={className}
                      className={className}
                      schedule={getScheduleForClass(className)}
                      index={cardIndex++}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
