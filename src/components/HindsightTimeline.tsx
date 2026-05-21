'use client';

import React from 'react';
import { 
  Brain, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  AlertOctagon, 
  ShieldAlert,
  Zap, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HindsightEngine, HindsightRecord } from '@/lib/hindsight';

interface HindsightTimelineProps {
  hindsight: HindsightEngine;
  records: HindsightRecord[];
  onReset: () => void;
}

export default function HindsightTimeline({ hindsight, records, onReset }: HindsightTimelineProps) {
  const shifts = hindsight.getSentimentShifts();
  const bottlenecks = hindsight.getRecurringBottlenecks();
  const recommendations = hindsight.getContextualRecommendations();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Hindsight Contextual Memory Timeline
          </h1>
          <p className="text-text-muted text-xs md:text-sm mt-1">Audit historic version releases, sentiment regressions, and recurring architectural bottlenecks.</p>
        </div>

        <button 
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-brand-pink/40 hover:bg-brand-pink/5 text-xs font-bold text-text-muted hover:text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Flush Context memory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: METRICS, SHIFTS, & RECURRING BOOTLENECKS */}
        <div className="space-y-6">
          
          {/* SENTIMENT DRIFTS COMPARISON */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-brand-pink" />
              Sentiment Drift shifts
            </span>
            
            <div className="space-y-4">
              {shifts.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-2 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{`Version ${s.previousVersion} → ${s.currentVersion}`}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      s.shiftType === 'regression' ? 'bg-brand-pink/15 text-brand-pink' : s.shiftType === 'improvement' ? 'bg-green-500/15 text-green-400' : 'bg-brand-orange/15 text-brand-orange'
                    }`}>
                      {s.shiftType === 'regression' ? `-${s.percentageChange}% Regression` : s.shiftType === 'improvement' ? `+${s.percentageChange}% Upgrade` : 'Stable'}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECURRING COMPLAINT STREAKS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-brand-orange" />
              Recurring Issue Streaks
            </span>
            
            <div className="space-y-3">
              {bottlenecks.map((b, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 text-left ${
                    b.severity === 'CRITICAL' ? 'border-brand-pink/20 bg-brand-pink/[0.01]' : 'border-white/5 bg-white/3'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <h4 className="text-white font-extrabold">{b.category}</h4>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      b.severity === 'CRITICAL' ? 'bg-brand-pink/10 text-brand-pink' : 'bg-brand-orange/10 text-brand-orange'
                    }`}>{`${b.streakWeeks} Week Streak`}</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI CONTEXTUAL ROADMAP RECOMMENDATIONS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              AI Contextual Recommendations
            </span>
            
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed text-left">
                  <div className="w-5 h-5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5 font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">{rec}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SCROLLABLE VERTICAL MEMORY TIMELINE */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 relative">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-8">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Memory Milestone Track</span>
            <span className="text-[10px] text-text-muted">Vertical chronologue</span>
          </div>

          {/* TIMELINE CONTAINER */}
          <div className="relative border-l border-white/10 pl-6 md:pl-8 space-y-10 text-left">
            {records.map((r, index) => {
              const isPositive = r.sentiment === 'positive';
              const isNegative = r.sentiment === 'negative';
              
              let badgeColor = "bg-white/5 border-white/10 text-white";
              let markerGlow = "bg-white/20 border-white/20";
              
              if (isPositive) {
                badgeColor = "bg-green-500/10 border-green-500/20 text-green-400";
                markerGlow = "bg-green-500 border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.4)]";
              } else if (isNegative) {
                badgeColor = "bg-brand-pink/10 border-brand-pink/20 text-brand-pink";
                markerGlow = "bg-brand-pink border-brand-pink/40 shadow-[0_0_10px_rgba(255,0,60,0.4)]";
              } else {
                badgeColor = "bg-brand-orange/10 border-brand-orange/20 text-brand-orange";
                markerGlow = "bg-brand-orange border-brand-orange/40 shadow-[0_0_10px_rgba(255,95,31,0.4)]";
              }

              return (
                <div key={r.id} className="relative group">
                  {/* Rotating visual node bullet on vertical line */}
                  <span className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-black z-10 transition-all ${markerGlow}`} />

                  {/* Glassmorphic timeline card */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all">
                    
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-white/10">{r.version}</span>
                        <span className="text-[10px] text-text-muted">{new Date(r.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                          {r.category}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          r.urgency === 'HIGH' ? 'bg-brand-pink/20 border-brand-pink/30 text-brand-pink' : 'bg-white/5 border-white/5 text-text-muted'
                        }`}>
                          {r.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-4">
                      <p className="text-xs text-white leading-relaxed">
                        "{r.summary}"
                      </p>

                      {/* Weight progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] text-text-muted">
                          <span>Priority impact weight</span>
                          <span className="font-bold text-white">{r.impactPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isNegative ? 'bg-brand-pink' : isPositive ? 'bg-green-500' : 'bg-brand-orange'
                            }`}
                            style={{ width: `${r.impactPercent}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
