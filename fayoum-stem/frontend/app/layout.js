import './globals.css';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../lib/auth';

export const metadata = {
  title: 'Fayoum STEM Scheduling Hub',
  description: 'Smart. Organized. Reliable. — The official scheduling platform for STEM High School Fayoum.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(7, 20, 38, 0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(59, 130, 246, 0.1)',
              },
              success: {
                iconTheme: { primary: '#3b82f6', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
