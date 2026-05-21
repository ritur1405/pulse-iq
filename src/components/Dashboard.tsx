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
  Layers,
  ChevronRight
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

export default function Dashboard({ onBackToLanding, initialTab = 'dashboard' }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [hindsightEngine] = useState(() => new HindsightEngine());
  
  // Shared reactive data states
  const [records, setRecords] = useState<HindsightRecord[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'n-1',
      title: 'MFA Anomaly Detected',
      body: 'Authentication complaints spiked 18% following SMS gateway lockouts.',
      type: 'critical',
      time: '15 mins ago',
      read: false
    },
    {
      id: 'n-2',
      title: 'Safari iOS Touch Error',
      body: 'Safari mobile navigation bar touch boundary warning reported in v2.2.',
      type: 'warn',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'n-3',
      title: 'Weekly Report Generated',
      body: 'The automated executive report for Sprint 24 is compiled and ready.',
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

  // Sync records from local storage
  const syncRecords = () => {
    setRecords(hindsightEngine.getRecords());
  };

  useEffect(() => {
    syncRecords();
    
    // Listen to changes (if uploaded)
    const interval = setInterval(syncRecords, 1000);
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
    // Check if high priority to trigger instant notification
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
    syncRecords();
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-bg-base flex relative overflow-hidden font-sans">
      {/* Subtle glowing ambient layer */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      
      {/* LEFT SIDEBAR */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-30">
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
              <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase mt-1">Product Intelligence</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-6 space-y-1">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-3 block mb-3">Intelligence Center</span>
            
            {[
              { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'uploads', name: 'Upload Center', icon: <UploadCloud className="w-4 h-4" /> },
              { id: 'workflows', name: 'AI Workflow Engine', icon: <Cpu className="w-4 h-4" /> },
              { id: 'hindsight', name: 'Hindsight Memory', icon: <Brain className="w-4 h-4" /> },
              { id: 'analytics', name: 'Analytics & Trends', icon: <LineChart className="w-4 h-4" /> },
              { id: 'reports', name: 'Reports', icon: <FileText className="w-4 h-4" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
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
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-brand-pink hover:text-white hover:bg-brand-pink/10 transition-all border border-transparent hover:border-brand-pink/20"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            Exit Console
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          {/* Search bar Mockup */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search login issues, payments or reviews..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* AI Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
              </span>
              <span className="text-[10px] tracking-wider text-brand-cyan font-bold uppercase">AI Status: ONLINE</span>
            </div>

            {/* Notifications Alert Bell */}
            <div className="relative group">
              <button 
                onClick={markNotificationsRead}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-white flex items-center justify-center transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-base">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Simple dropdown notifications hover */}
              <div className="absolute right-0 top-12 w-80 glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</h4>
                  <span className="text-[9px] text-brand-pink font-bold">{unreadCount} New</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase ${n.type === 'critical' ? 'text-brand-pink' : n.type === 'warn' ? 'text-brand-orange' : 'text-brand-cyan'}`}>
                          {n.title}
                        </span>
                        <span className="text-[8px] text-text-muted">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed mt-1">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-pink/20">
                JD
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">Jordan Davis</span>
                <span className="text-[9px] text-text-muted mt-1 font-semibold uppercase">Platform Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* MASTER SCROLLABLE CONTENT VIEW AREA */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          
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
                syncRecords();
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
            <div className="max-w-4xl mx-auto glass-panel p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6">SaaS System Settings</h2>
              <p className="text-text-muted text-sm mb-6">Configure priority triggers, threshold variables, and neural network configurations.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Automated Alerting Threshold</label>
                  <input type="range" className="w-full accent-brand-pink" defaultValue={75} />
                  <span className="text-[10px] text-text-muted mt-1 block">Trigger instant Slack and SMS notifications when priority scores hit 75+</span>
                </div>
                
                <div className="border-t border-white/5 pt-6 grid grid-cols-2 gap-6">
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

                <div className="border-t border-white/5 pt-6 flex justify-between">
                  <button 
                    onClick={() => {
                      hindsightEngine.resetMemory();
                      syncRecords();
                      alert("Context memory successfully flushed.");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-brand-pink/20 hover:border-brand-pink text-xs font-bold text-brand-pink hover:bg-brand-pink/10 transition-all"
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
