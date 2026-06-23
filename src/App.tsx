import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import SplashScreen from './pages/SplashScreen';
import DashboardPage from './pages/DashboardPage';
import AIAssistantPage from './pages/AIAssistantPage';
import StainsPage from './pages/StainsPage';
import ChemicalsPage from './pages/ChemicalsPage';
import CareLabelsPage from './pages/CareLabelsPage';
import PriceListPage from './pages/PriceListPage';
import EmployeesPage from './pages/EmployeesPage';
import ShiftsPage from './pages/ShiftsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import FloatingParticles from './components/FloatingParticles';
import type { Page } from './types';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'stains':
        return <StainsPage />;
      case 'chemicals':
        return <ChemicalsPage />;
      case 'care-labels':
        return <CareLabelsPage />;
      case 'price-list':
        return <PriceListPage />;
      case 'employees':
        return <EmployeesPage />;
      case 'shifts':
        return <ShiftsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <FloatingParticles />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
