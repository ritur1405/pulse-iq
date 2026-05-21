'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { HindsightRecord } from '@/lib/hindsight';

interface AnalyticsPanelProps {
  records: HindsightRecord[];
}

export default function AnalyticsPanel({ records }: AnalyticsPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format data for Line Chart over time
  // Group records by version to compare sentiment scores
  const versionDataMap: Record<string, { positiveSum: number; negativeSum: number; count: number }> = {};
  
  // Sort records chronologically first to align timeline
  const chronologicalRecords = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  chronologicalRecords.forEach(r => {
    if (!versionDataMap[r.version]) {
      versionDataMap[r.version] = { positiveSum: 0, negativeSum: 0, count: 0 };
    }
    versionDataMap[r.version].count += 1;
    if (r.sentiment === 'positive') {
      versionDataMap[r.version].positiveSum += r.sentimentScore;
    } else if (r.sentiment === 'negative') {
      // Use absolute value to plot positive-bound negative trends nicely
      versionDataMap[r.version].negativeSum += Math.abs(r.sentimentScore);
    }
  });

  const lineChartData = Object.entries(versionDataMap).map(([version, data]) => ({
    version,
    Positive: parseFloat((data.positiveSum / data.count).toFixed(2)),
    Negative: parseFloat((data.negativeSum / data.count).toFixed(2)),
    Count: data.count
  }));

  // Mocked comparison columns for enterprise competitor analysis
  const competitorMatrix = [
    {
      feature: "Orchestration Engine",
      pulseiq: "Cascadeflow (10-Stage Pipeline)",
      compA: "Standard single-pass API call",
      compB: "Manual Zapier webhook triggers",
      status: true
    },
    {
      feature: "Contextual Memory Layer",
      pulseiq: "Hindsight (Permanent Memory Store)",
      compA: "None (Stateless queries)",
      compB: "ElasticSearch database lookup only",
      status: true
    },
    {
      feature: "Voice-to-Insight transcription",
      pulseiq: "Audio transcription & Sentiment Indexing",
      compA: "Not supported",
      compB: "Requires separate Whispering APIs",
      status: true
    },
    {
      feature: "Automated Issue Streaks",
      pulseiq: "Version-drift and Bottleneck alert triggers",
      compA: "Simple CSV exports",
      compB: "Basic manual category sorting",
      status: true
    },
    {
      feature: "Processing Pipeline latency",
      pulseiq: "< 400ms average execution duration",
      compA: "2.4 seconds manual loading page",
      compB: "800ms API fetching times",
      status: true
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Advanced Analytics</h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Multi-dimensional sentiment trends, category clusters, and competitor comparison analytics.</p>
      </div>

      {/* TRENDS CHART */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative">
        <div className="absolute top-0 right-0 w-24 h-2 bg-gradient-to-r from-brand-pink to-brand-orange" />
        
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-brand-orange" />
            Linguistic Sentiment shifts over Releases
          </span>
          <span className="text-[10px] text-text-muted">Chronological version comparison</span>
        </div>

        <div className="w-full h-80 flex items-center justify-center">
          {mounted && lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="version" stroke="#BFBFBF" fontSize={10} tickLine={false} />
                <YAxis stroke="#BFBFBF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0B0B0B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="Positive" stroke="#10B981" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Negative" stroke="#FF003C" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-text-muted">Empty analysis state</div>
          )}
        </div>
      </div>

      {/* ADVANCED CATEGORIES HEATMAP LIST & RECENT METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LATEST RELEASE DISCREPANCIES */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-brand-pink" />
            Release Discrepancy Warnings
          </span>

          <div className="space-y-3.5">
            {[
              { title: "MFASMS Late Tokens", score: "92 Critical Weight", version: "v2.1" },
              { title: "Safari Mobile touch overlapped drawer", score: "52 Alert Weight", version: "v2.2" },
              { title: "Stripe hook timeouts on activation", score: "68 Action Weight", version: "v1.9" }
            ].map((warn, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs text-left">
                <div>
                  <h4 className="text-white font-bold">{warn.title}</h4>
                  <span className="text-[9px] text-text-muted mt-0.5 block">{`Captured in version release ${warn.version}`}</span>
                </div>
                <span className="text-[10px] font-bold text-brand-pink shrink-0">{warn.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARATIVE METRIC GAINS */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 lg:col-span-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Linguistic Category cluster Weights</span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { tag: "Authentication", count: "3 alerts", rate: "HIGH urgency", color: "border-brand-pink/20 bg-brand-pink/[0.01] text-brand-pink" },
              { tag: "Payments", count: "2 alerts", rate: "MEDIUM urgency", color: "border-brand-orange/20 bg-brand-orange/[0.01] text-brand-orange" },
              { tag: "Performance", count: "1 log", rate: "LOW urgency", color: "border-brand-cyan/20 bg-brand-cyan/[0.01] text-brand-cyan" },
              { tag: "UI/UX", count: "3 logs", rate: "MEDIUM urgency", color: "border-brand-orange/20 bg-brand-orange/[0.01] text-brand-orange" },
              { tag: "Bugs", count: "1 alert", rate: "HIGH urgency", color: "border-brand-pink/20 bg-brand-pink/[0.01] text-brand-pink" },
              { tag: "Features", count: "2 requests", rate: "LOW urgency", color: "border-brand-cyan/20 bg-brand-cyan/[0.01] text-brand-cyan" }
            ].map((cat, idx) => (
              <div key={idx} className={`p-4 rounded-xl border text-center ${cat.color}`}>
                <span className="text-[10px] font-extrabold uppercase tracking-widest block">{cat.tag}</span>
                <p className="text-sm font-black mt-1.5">{cat.count}</p>
                <span className="text-[9px] font-bold mt-1 block uppercase tracking-wider">{cat.rate}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* COMPETITOR COMPARISON MATRIX */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-brand-cyan" />
            Enterprise Architectural Matrix Comparison
          </span>
          <span className="text-[10px] text-text-muted">PulseIQ v1.0 vs Legacy Sentiment platforms</span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 text-text-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Feature Vector</th>
                <th className="py-3 px-4 text-brand-pink">PulseIQ Suite</th>
                <th className="py-3 px-4">Legacy Competitor A</th>
                <th className="py-3 px-4">Legacy Competitor B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {competitorMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                  <td className="py-4 px-4 font-bold text-white">{row.feature}</td>
                  <td className="py-4 px-4 text-brand-cyan font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    {row.pulseiq}
                  </td>
                  <td className="py-4 px-4 text-text-muted">{row.compA}</td>
                  <td className="py-4 px-4 text-text-muted">{row.compB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
