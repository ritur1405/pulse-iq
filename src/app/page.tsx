'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import AuthPortal from '@/components/AuthPortal';

interface CurrentUser {
  name: string;
  email: string;
  org: string;
  initials: string;
}

export default function Page() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [startingTab, setStartingTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Load existing session on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('pulseiq_current_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('pulseiq_current_user');
        }
      }
    }
  }, []);

  const handleEnterDashboard = (tab?: string) => {
    if (tab) {
      setStartingTab(tab);
    }
    
    // Gate with Authentication: if no session exists, redirect to auth first!
    if (!currentUser) {
      setScreen('auth');
    } else {
      setScreen('dashboard');
    }
  };

  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    setScreen('dashboard');
  };

  const handleBackToLanding = () => {
    setScreen('landing');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulseiq_current_user');
    }
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing' && (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
      
      {screen === 'auth' && (
        <AuthPortal 
          onLoginSuccess={handleLoginSuccess}
          onClose={handleBackToLanding}
        />
      )}
      
      {screen === 'dashboard' && (
        <Dashboard 
          onBackToLanding={handleSignOut} // Clicking log out in sidebar triggers clean session exit!
          initialTab={startingTab}
        />
      )}
    </>
  );
}
