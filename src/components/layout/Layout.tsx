import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { Page } from '../../types';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden marble-bg relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <div className="relative flex-shrink-0 z-20">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="page-enter max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
