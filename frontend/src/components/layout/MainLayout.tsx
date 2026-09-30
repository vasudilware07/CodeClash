import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)' }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: 'var(--bg-elevated)' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'var(--bg-elevated)' },
          },
        }}
      />

      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;