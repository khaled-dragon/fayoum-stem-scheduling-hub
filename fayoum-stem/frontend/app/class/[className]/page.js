'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import { scheduleService, getImageUrl } from '../../../services/api';
import Navbar from '../../../components/Navbar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ParticleBackground from '../../../components/ParticleBackground';
import toast from 'react-hot-toast';

const VALID_CLASSES = ['G10 A', 'G10 B', 'G10 C', 'G11 A', 'G11 B', 'G11 C', 'G12 A', 'G12 B'];

export default function ClassPage() {
  const { className: rawClass } = useParams();
  const className = decodeURIComponent(rawClass);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !VALID_CLASSES.includes(className)) return;

    const fetchSchedule = async () => {
      try {
        const res = await scheduleService.getByClass(className);
        setSchedule(res.data.schedule);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error('Failed to load schedule');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user, className]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('schedule_image', selectedFile);
      formData.append('class_name', className);

      const res = await scheduleService.upload(formData);
      setSchedule(res.data.schedule);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadSuccess(true);
      toast.success('Schedule uploaded successfully!');

      // Refresh schedule
      const fresh = await scheduleService.getByClass(className);
      setSchedule(fresh.data.schedule);

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const imageUrl = schedule?.image_url ? getImageUrl(schedule.image_url) : null;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#03060f' }}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!VALID_CLASSES.includes(className)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#03060f' }}>
        <p style={{ color: '#ef4444' }}>Invalid class.</p>
      </div>
    );
  }

  const grade = className.split(' ')[0];

  return (
    <main className="relative min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(29, 78, 216, 0.1) 0%, #03060f 55%)' }}>
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6 max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm hover:text-blue-400 transition-colors"
            style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Dashboard
          </button>
          <span style={{ color: '#1e293b' }}>/</span>
          <span className="text-sm" style={{ color: '#3b82f6', fontFamily: 'DM Sans, sans-serif' }}>{className}</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <span
              className="px-3 py-1 rounded-lg text-xs"
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#60a5fa',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {grade}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#f1f5f9',
              lineHeight: 1.1,
            }}
          >
            {className}
          </h1>
          <p
            className="mt-1"
            style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          >
            {schedule?.updated_at
              ? `Last updated: ${new Date(schedule.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
              : 'No schedule uploaded yet'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" text="Loading schedule..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Schedule Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {imageUrl ? (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.08)',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`${className} Schedule`}
                    className="w-full h-auto"
                    style={{ maxHeight: '70vh', objectFit: 'contain', background: 'rgba(255,255,255,0.02)' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                // Empty state
                <div
                  className="rounded-2xl flex flex-col items-center justify-center py-20"
                  style={{
                    border: '1px dashed rgba(59, 130, 246, 0.2)',
                    background: 'rgba(5, 13, 26, 0.5)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                  >
                    <span style={{ fontSize: 28 }}>📋</span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      color: '#475569',
                      fontSize: '18px',
                    }}
                  >
                    No schedule uploaded yet
                  </p>
                  <p
                    className="mt-1"
                    style={{ color: '#334155', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}
                  >
                    {user.role === 'admin' ? 'Upload a schedule image below.' : 'Check back later.'}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Admin Upload Section */}
            {user.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(5, 13, 26, 0.7)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
                    >
                      <span style={{ fontSize: 14 }}>⬆</span>
                    </div>
                    <div>
                      <h2
                        style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#f1f5f9', fontSize: '16px' }}
                      >
                        Upload New Schedule
                      </h2>
                      <p style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>
                        This will replace the current schedule image.
                      </p>
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer mb-4 transition-all"
                    style={{
                      border: `2px dashed ${selectedFile ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)'}`,
                      background: selectedFile ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {previewUrl ? (
                      <div className="w-full">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg object-contain"
                        />
                        <p
                          className="text-center mt-3 text-xs"
                          style={{ color: '#60a5fa', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {selectedFile?.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                        >
                          <span style={{ fontSize: 22 }}>🖼️</span>
                        </div>
                        <p style={{ color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500 }}>
                          Drop image here or click to browse
                        </p>
                        <p className="mt-1" style={{ color: '#475569', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>
                          JPEG, PNG, GIF, WEBP — Max 10MB
                        </p>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex gap-3">
                    {selectedFile && (
                      <button
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="flex-1 py-3 rounded-xl text-sm transition-all"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        Clear
                      </button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile}
                      className="flex-1 py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center"
                      style={{
                        background: !selectedFile || uploading
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                        boxShadow: !selectedFile || uploading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.35)',
                        cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {uploading ? <LoadingSpinner size="sm" /> : 'Upload Schedule'}
                    </motion.button>
                  </div>

                  {/* Success notification */}
                  <AnimatePresence>
                    {uploadSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3"
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.25)',
                          boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)',
                        }}
                      >
                        <span>✅</span>
                        <p style={{ color: '#86efac', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                          Schedule uploaded and saved successfully!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
