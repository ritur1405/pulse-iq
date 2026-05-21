'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Cpu, 
  Brain, 
  LineChart, 
  FileText, 
  Bell, 
  Settings, 
  Search,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  Info,
  Sliders
} from 'lucide-react';
import DashboardHome from './DashboardHome';
import UploadCenter from './UploadCenter';
import WorkflowEngine from './WorkflowEngine';
import HindsightTimeline from './HindsightTimeline';
import AnalyticsPanel from './AnalyticsPanel';
import ReportGenerator from './ReportGenerator';
import { HindsightEngine, HindsightRecord } from '@/lib/hindsight';
import { PipelineStage, PipelineResult } from '@/lib/cascadeflow';

interface DashboardProps {
  onBackToLanding: () => void;
  initialTab?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warn' | 'critical';
  time: string;
  read: boolean;
}

interface CurrentUser {
  name: string;
  email: string;
  org: string;
  initials: string;
}

export default function Dashboard({ onBackToLanding, initialTab = 'dashboard' }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [hindsightEngine] = useState(() => new HindsightEngine());
  
  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Current authenticated user session state
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "Jordan Davis",
    email: "admin@pulseiq.co",
    org: "PulseIQ Corp",
    initials: "JD"
  });

  // Shared reactive data states
  const [records, setRecords] = useState<HindsightRecord[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'n-1',
      title: 'MFA Anomaly Spike',
      body: 'Multiple user lockouts detected due to SMS authentication routing delays.',
      type: 'critical',
      time: '15 mins ago',
      read: false
    },
    {
      id: 'n-2',
      title: 'Safari Layout Alert',
      body: 'Responsive sidebar overlap reported in Safari iOS 17 on mobile layouts.',
      type: 'warn',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'n-3',
      title: 'System Health Brief',
      body: 'Daily customer friction trends report has been successfully compiled.',
      type: 'info',
      time: '1 day ago',
      read: true
    }
  ]);

  const [activePipeline, setActivePipeline] = useState<{
    inputText: string;
    stages: PipelineStage[];
    activeStageId: string | null;
    currentLog: string;
    result?: PipelineResult;
  } | null>(null);

  // Sync records and user session from local storage
  const syncDashboardData = () => {
    setRecords(hindsightEngine.getRecords());
    
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('pulseiq_current_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          // Keep default admin
        }
      }
    }
  };

  useEffect(() => {
    syncDashboardData();
    
    // Listen to changes at short interval
    const interval = setInterval(syncDashboardData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update active tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle addition of a new processed feedback record
  const handleFeedbackProcessed = (result: PipelineResult) => {
    if (result.priority === 'HIGH') {
      const newNotif: SystemNotification = {
        id: `n-${Date.now()}`,
        title: `Priority Anomaly: ${result.category}`,
        body: result.summary,
        type: 'critical',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    syncDashboardData();
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'uploads', name: 'Upload Center', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'workflows', name: 'AI Workflow Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'hindsight', name: 'Hindsight Memory', icon: <Brain className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics & Trends', icon: <LineChart className="w-4 h-4" /> },
    { id: 'reports', name: 'Reports', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      
      {/* 1. TRADITIONAL LEFT SIDEBAR: DESKTOP ONLY */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl hidden lg:flex flex-col justify-between shrink-0 relative z-30 text-left">
        <div>
          {/* Logo Branding */}
          <div 
            onClick={onBackToLanding}
            className="h-20 border-b border-white/5 flex items-center px-8 gap-3 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center shadow-lg shadow-brand-pink/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-widest text-white leading-none">PULSE<span className="text-brand-pink">IQ</span></span>
              <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase mt-1">{currentUser.org}</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-6 space-y-1">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-3 block mb-3">Intelligence Center</span>
            
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all group ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-brand-pink/15 to-transparent border-l-2 border-brand-pink text-white shadow-[0_0_15px_rgba(255,0,60,0.05)]' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${activeTab === item.id ? 'text-brand-pink' : 'text-text-muted group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                {activeTab === item.id && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-pink" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'settings' 
                ? 'bg-white/10 text-white border border-white/10' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            System Settings
          </button>
          
          <button 
            onClick={onBackToLanding}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase text-brand-pink hover:text-white hover:bg-brand-pink/10 transition-all border border-transparent hover:border-brand-pink/20"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. RESPONSIVE MOBILE SLIDING DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          
          {/* Drawer Body */}
          <div className="relative w-80 bg-zinc-950 border-r border-white/10 flex flex-col justify-between p-6 z-10 text-left">
            <div>
              {/* Drawer Logo */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold tracking-widest text-white leading-none">PULSE<span className="text-brand-pink">IQ</span></span>
                    <span className="text-[8px] text-text-muted font-bold uppercase mt-1">{currentUser.org}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="space-y-1.5">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-brand-pink/20 to-transparent border-l-2 border-brand-pink text-white' 
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={activeTab === item.id ? 'text-brand-pink' : 'text-text-muted'}>
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <button 
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase transition-all ${
                  activeTab === 'settings' 
                    ? 'bg-white/10 text-white' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                System Settings
              </button>
              
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBackToLanding();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase text-brand-pink hover:text-white hover:bg-brand-pink/10 transition-all"
              >
                <LogOut className="w-4 h-4 rotate-180" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RIGHT SIDE CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden text-left">
        
        {/* TOP NAVBAR */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md px-6 md:px-8 flex items-center justify-between shrink-0 relative z-40">
          
          {/* Hamburger trigger + Small screen Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-black tracking-widest text-white leading-none">PULSE<span className="text-brand-pink">IQ</span></span>
          </div>

          {/* Search bar Mockup (Desktop only) */}
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search user complaints, payment logs or hotfixes..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* AI Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
              </span>
              <span className="text-[8px] md:text-[10px] tracking-wider text-brand-cyan font-bold uppercase">AI: ONLINE</span>
            </div>

            {/* Notifications Alert Bell */}
            <div className="relative group">
              <button 
                onClick={markNotificationsRead}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-white flex items-center justify-center transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-base animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* HIGH CONTRAST DROPDOWN NOTIFICATIONS */}
              <div className="absolute right-0 top-12 w-80 bg-zinc-950/98 backdrop-blur-3xl border border-white/15 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Linguistic Anomalies</h4>
                  <span className="text-[9px] text-brand-pink font-extrabold bg-brand-pink/15 px-2 py-0.5 rounded">{unreadCount} New Alerts</span>
                </div>
                
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-xl border transition-all text-left ${
                        n.type === 'critical' 
                          ? 'bg-brand-pink/10 border-brand-pink/20 hover:bg-brand-pink/15' 
                          : n.type === 'warn' 
                            ? 'bg-brand-orange/5 border-brand-orange/10 hover:bg-brand-orange/10' 
                            : 'bg-white/3 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {n.type === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-brand-pink" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-brand-orange" />
                          )}
                          <span className="text-xs font-extrabold text-white">
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[8px] text-zinc-400 shrink-0 font-medium">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-zinc-200 leading-relaxed mt-1.5 font-medium">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC USER PROFILE AVATAR */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-brand-pink/20 shrink-0">
                {currentUser.initials}
              </div>
              <div className="hidden md:flex flex-col text-left shrink-0">
                <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
                <span className="text-[9px] text-text-muted mt-1 font-semibold uppercase">Platform Admin</span>
              </div>
            </div>

          </div>
        </header>

        {/* MASTER SCROLLABLE CONTENT VIEW AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {activeTab === 'dashboard' && (
            <DashboardHome 
              records={records} 
              onNavigate={setActiveTab}
              notifications={notifications}
            />
          )}

          {activeTab === 'uploads' && (
            <UploadCenter 
              onFeedbackProcessed={handleFeedbackProcessed}
              onProgressStateChange={setActivePipeline}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowEngine 
              activePipeline={activePipeline} 
              onRunComplete={handleFeedbackProcessed}
            />
          )}

          {activeTab === 'hindsight' && (
            <HindsightTimeline 
              hindsight={hindsightEngine}
              records={records}
              onReset={() => {
                hindsightEngine.resetMemory();
                syncDashboardData(); // Local sync handled automatically in intervals
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPanel records={records} />
          )}

          {activeTab === 'reports' && (
            <ReportGenerator records={records} />
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto glass-panel p-6 md:p-8 rounded-3xl border border-white/5 text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-pink" />
                SaaS System Settings
              </h2>
              <p className="text-text-muted text-xs md:text-sm mb-6">Configure priority triggers, threshold variables, and neural network configurations.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Automated Alerting Threshold</label>
                  <input type="range" className="w-full accent-brand-pink" defaultValue={75} />
                  <span className="text-[10px] text-text-muted mt-1 block">Trigger instant Slack and SMS notifications when priority scores hit 75+</span>
                </div>
                
                <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Cascadeflow Simulation Latency</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none">
                      <option value="400">400ms (High Speed)</option>
                      <option value="800">800ms (Standard Visuals)</option>
                      <option value="1500">1500ms (Detailed Pipeline Inspection)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Hindsight Memory Size</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none" defaultValue="Unlimited (Auto-purging enabled)" disabled />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex justify-between gap-4">
                  <button 
                    onClick={() => {
                      hindsightEngine.resetMemory();
                      alert("Context memory successfully flushed.");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-brand-pink/20 hover:border-brand-pink text-xs font-bold text-brand-pink hover:bg-brand-pink/10 transition-all shrink-0"
                  >
                    Flush Memory Store
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-xs font-bold text-white">
                    Apply Adjustments
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
