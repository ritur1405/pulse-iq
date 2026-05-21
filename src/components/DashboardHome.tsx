'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Brain, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { HindsightRecord } from '@/lib/hindsight';
import { SystemNotification } from './Dashboard';

interface DashboardHomeProps {
  records: HindsightRecord[];
  onNavigate: (tab: string) => void;
  notifications: SystemNotification[];
}

export default function DashboardHome({ records, onNavigate, notifications }: DashboardHomeProps) {
  const [mounted, setMounted] = useState(false);

  // SSR hydration bypass guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute live statistics based on records
  const totalProcessed = records.length;
  
  const positiveRecords = records.filter(r => r.sentiment === 'positive').length;
  const negativeRecords = records.filter(r => r.sentiment === 'negative').length;
  const neutralRecords = records.filter(r => r.sentiment === 'neutral').length;
  
  const positivePercentage = totalProcessed > 0 
    ? Math.round((positiveRecords / totalProcessed) * 100) 
    : 0;

  const criticalIssuesCount = records.filter(r => r.urgency === 'HIGH').length;

  // Compute category counts for charting
  const categoryMap: Record<string, number> = {};
  records.forEach(r => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  // Recharts colors
  const COLORS = ['#FF003C', '#FF5F1F', '#00F5FF', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

  const sentimentData = [
    { name: 'Positive', value: positiveRecords, color: '#10B981' },
    { name: 'Neutral', value: neutralRecords, color: '#FF5F1F' },
    { name: 'Negative', value: negativeRecords, color: '#FF003C' }
  ].filter(item => item.value > 0);

  // Quick Action
  const latestCriticalRecord = [...records]
    .filter(r => r.urgency === 'HIGH')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return (
    <div className="space-y-8">
      {/* Page Title & Sparkle Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Intelligence Overview
          </h1>
          <p className="text-text-muted text-xs md:text-sm mt-1">Real-time sentiment indices, Cascadeflow pipe logs, and Hindsight version audits.</p>
        </div>
        
        <button 
          onClick={() => onNavigate('uploads')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-xs font-bold text-white shadow-md shadow-brand-pink/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          Ingest Feedback
        </button>
      </div>

      {/* TOP KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Ingested",
            value: totalProcessed,
            icon: <Layers className="w-5 h-5 text-brand-pink" />,
            glow: "hover:shadow-[0_0_20px_rgba(255,0,60,0.15)]",
            label: "Processed Feedback Records"
          },
          {
            title: "Positive Sentiment",
            value: `${positivePercentage}%`,
            icon: <TrendingUp className="w-5 h-5 text-brand-orange" />,
            glow: "hover:shadow-[0_0_20px_rgba(255,95,31,0.15)]",
            label: `Valence: ${positiveRecords} Pos / ${negativeRecords} Neg`
          },
          {
            title: "Critical Anomalies",
            value: criticalIssuesCount,
            icon: <AlertTriangle className="w-5 h-5 text-brand-pink" />,
            glow: "hover:shadow-[0_0_20px_rgba(255,0,60,0.2)]",
            label: "Active High-Priority Alert Triggers",
            isDanger: criticalIssuesCount > 0
          },
          {
            title: "AI Confidence Index",
            value: "99.8%",
            icon: <ShieldCheck className="w-5 h-5 text-brand-cyan" />,
            glow: "hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]",
            label: "NLP Core Vector Integrity"
          }
        ].map((metric, i) => (
          <div 
            key={i}
            className={`glass-panel p-6 rounded-2xl border border-white/5 transition-all duration-300 relative group overflow-hidden ${metric.glow} ${
              metric.isDanger ? 'border-brand-pink/20 bg-brand-pink/[0.02]' : ''
            }`}
          >
            {/* Top right corner ambient light */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/3 group-hover:bg-white/5 transition-colors rounded-bl-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                {metric.icon}
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${metric.isDanger ? 'text-brand-pink text-glow-pink' : 'text-white'}`}>
                {metric.value}
              </span>
              <span className="text-[10px] text-text-muted mt-1.5 font-medium">{metric.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* EXECUTIVE HERO AI INSIGHT PANEL */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-pink/20 glass-panel p-8">
        {/* Glow orb inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-pink/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/30 text-[10px] font-bold text-brand-pink uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" />
              Hindsight Cognitive Summary
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              {latestCriticalRecord 
                ? `Critical Regression Identified in ${latestCriticalRecord.category}`
                : "Active Onboarding Friction & System Integrity Stable"}
            </h2>
            <p className="text-text-muted text-xs md:text-sm leading-relaxed">
              {latestCriticalRecord
                ? `Summary: "${latestCriticalRecord.summary}"`
                : "Core satisfaction holds at 74% aggregate score. Minor responsive rendering glitches detected on Safari browsers during payment checkout screens."}
            </p>
            
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('hindsight')}
                className="inline-flex items-center gap-2 text-xs text-brand-pink hover:text-white font-bold transition-all group"
              >
                Inspect Memory Timeline
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4 text-center md:text-left">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Contextual Suggestion</span>
            <p className="text-xs text-white leading-relaxed">
              {latestCriticalRecord && latestCriticalRecord.category === 'Authentication'
                ? "MFA changes broke Twilio SMS OTP gateway. fall back to SMS-redundancy route or grace by user IP."
                : "A/B test a dynamic 3-step tour instead of the current 7-step onboarding tutorial to minimize cognitive bounce rate."}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] text-text-muted">
              <span>Confidence: 98%</span>
              <span>Impact: HIGH</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER (PIE & BARS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PIE CHART: SENTIMENT VALENCE */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[360px] relative group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Sentiment Valence</span>
            <TrendingUp className="w-4 h-4 text-brand-orange" />
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center">
            {mounted && sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0B0B0B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}
                    itemStyle={{ color: '#FFFFFF', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-muted">Empty analysis state</div>
            )}
          </div>

          <div className="flex justify-around text-center text-xs mt-3">
            {[
              { label: 'Positive', count: positiveRecords, color: 'bg-green-500' },
              { label: 'Neutral', count: neutralRecords, color: 'bg-brand-orange' },
              { label: 'Negative', count: negativeRecords, color: 'bg-brand-pink' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-text-muted">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  {item.label}
                </div>
                <span className="text-white font-bold text-sm mt-1">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART: ISSUE CATEGORIES */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[360px] lg:col-span-2 relative group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Bottlenecks by Category</span>
            <Layers className="w-4 h-4 text-brand-cyan" />
          </div>

          <div className="flex-1 w-full flex items-center justify-center">
            {mounted && categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#BFBFBF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#BFBFBF" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0B0B0B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}
                    itemStyle={{ color: '#FFFFFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-muted">Empty analysis state</div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: CASCADEFLOW WORKFLOWS & ALERTS MINIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cascadeflow Engine Mini console */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[280px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-brand-cyan" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Cascadeflow Orchestrator Status</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-bold uppercase">Automated</span>
          </div>

          <div className="flex-1 py-4 flex flex-col justify-center space-y-3.5">
            {[
              { step: "Upload Ingest", desc: "Verifies size boundaries & character casings", status: "Active" },
              { step: "Linguistic vectors", desc: "Extracts key-phrases & tags", status: "Active" },
              { step: "Hindsight storage", desc: "Injects computed insights into memory", status: "Pending Trigger" }
            ].map((st, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="text-left">
                  <h4 className="text-white font-bold">{st.step}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">{st.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-brand-cyan shrink-0">{st.status}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('workflows')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white border border-white/5 transition-all text-center"
          >
            Open Orchestration Node Console
          </button>
        </div>

        {/* Real-time Alerts Engine Mini console */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[280px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-brand-pink" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Recent System Alerts</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-brand-pink/10 border border-brand-pink/20 text-brand-pink font-bold uppercase">Integrity</span>
          </div>

          <div className="flex-1 py-4 overflow-y-auto space-y-3 hide-scrollbar">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 text-xs leading-relaxed">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${n.type === 'critical' ? 'bg-brand-pink' : n.type === 'warn' ? 'bg-brand-orange' : 'bg-brand-cyan'}`} />
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-bold">{n.title}</h4>
                    <span className="text-[8px] text-text-muted font-semibold">{n.time}</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-snug">{n.body}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('hindsight')}
            className="w-full py-2 bg-brand-pink/5 hover:bg-brand-pink/10 rounded-xl text-xs font-semibold text-brand-pink border border-brand-pink/10 hover:border-brand-pink/20 transition-all text-center"
          >
            Audit Version Milestones
          </button>
        </div>

      </div>

    </div>
  );
}
