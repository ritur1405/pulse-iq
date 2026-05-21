'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  const [screen, setScreen] = useState<'landing' | 'dashboard'>('landing');
  const [startingTab, setStartingTab] = useState<string>('dashboard');

  const handleEnterDashboard = (tab?: string) => {
    if (tab) {
      setStartingTab(tab);
    }
    setScreen('dashboard');
  };

  const handleBackToLanding = () => {
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing' ? (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      ) : (
        <Dashboard 
          onBackToLanding={handleBackToLanding} 
          initialTab={startingTab}
        />
      )}
    </>
  );
}
