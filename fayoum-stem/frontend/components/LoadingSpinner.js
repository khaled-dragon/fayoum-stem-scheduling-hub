'use client';

export default function LoadingSpinner({ size = 'md', text = null }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        style={{
          width: s,
          height: s,
          border: `2px solid rgba(59, 130, 246, 0.15)`,
          borderTop: `2px solid #3b82f6`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          boxShadow: '0 0 16px rgba(59, 130, 246, 0.3)',
        }}
      />
      {text && (
        <p className="text-sm" style={{ color: '#64748b', fontFamily: 'DM Sans, sans-serif' }}>
          {text}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
