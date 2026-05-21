'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  SlidersHorizontal, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  ArrowRight,
  TrendingDown,
  Layers,
  Clock
} from 'lucide-react';
import { HindsightRecord } from '@/lib/hindsight';

interface ReportGeneratorProps {
  records: HindsightRecord[];
}

export default function ReportGenerator({ records }: ReportGeneratorProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledReport, setCompiledReport] = useState<any | null>(null);

  const categories = ['ALL', 'UI/UX', 'Performance', 'Bugs', 'Authentication', 'Payments', 'Features', 'Support'];
  const priorities = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchCategory = filterCategory === 'ALL' || r.category === filterCategory;
    const matchPriority = filterPriority === 'ALL' || r.urgency === filterPriority;
    return matchCategory && matchPriority;
  });

  const compileReport = () => {
    setIsCompiling(true);
    setCompiledReport(null);

    setTimeout(() => {
      // Aggregate data for report
      const totalFiltered = filteredRecords.length;
      const criticalCount = filteredRecords.filter(r => r.urgency === 'HIGH').length;
      
      const categoryCounts: Record<string, number> = {};
      filteredRecords.forEach(r => {
        categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      });

      const primaryCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

      const negativeRecordSum = filteredRecords.filter(r => r.sentiment === 'negative').length;
      const averageDriftIndex = totalFiltered > 0 
        ? Math.round((negativeRecordSum / totalFiltered) * 100) 
        : 0;

      setCompiledReport({
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        compiledAt: new Date().toLocaleString(),
        totalAudited: totalFiltered,
        criticalAnomalies: criticalCount,
        primaryFrictionCategory: primaryCategory,
        riskDriftScore: averageDriftIndex,
        recordsUsed: [...filteredRecords]
      });
      setIsCompiling(false);
    }, 1200); // Simulated compilations latency
  };

  const handleDownload = () => {
    if (!compiledReport) return;
    
    // Create and download JSON report
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(compiledReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PulseIQ_Executive_Report_${compiledReport.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    alert("Executive Stakeholder Package JSON successfully compiled and downloaded.");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Executive Report Generator</h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Compile priority filters and context records into stakeholder-ready PDF summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FILTERS & COMPILE TRIGGER */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 h-fit">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-white/5">
            <SlidersHorizontal className="w-4 h-4 text-brand-pink" />
            Report Filter Configuration
          </span>

          {/* Category Filter */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Product Module Category</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-pink/40 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-bg-card">{cat}</option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Urgency Score Level</label>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-pink/40 transition-colors"
            >
              {priorities.map(pr => (
                <option key={pr} value={pr} className="bg-bg-card">{pr}</option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2 text-xs text-left">
            <div className="flex justify-between items-center text-text-muted font-medium">
              <span>Matching records</span>
              <span className="font-bold text-white">{filteredRecords.length} files</span>
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed">
              Compile includes processed audio logs and pasted reviews stored in Hindsight memory.
            </p>
          </div>

          <button 
            onClick={compileReport}
            disabled={isCompiling || filteredRecords.length === 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-xs font-bold text-white shadow-md shadow-brand-pink/20 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isCompiling ? (
              <>
                <SlidersHorizontal className="w-4 h-4 animate-spin" />
                Compiling Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Compile Stakeholder briefing
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: DETAILED REPORT PREVIEW CONTAINER */}
        <div className="lg:col-span-2">
          {compiledReport ? (
            <div className="glass-panel p-8 rounded-3xl border border-brand-cyan/20 bg-brand-cyan/[0.01] space-y-8 relative text-left">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-brand-cyan uppercase tracking-widest leading-none">PulseIQ Executive Briefing</h3>
                  <span className="text-[10px] text-text-muted font-mono block mt-1.5">{`STAKEHOLDER PACKAGE ID: ${compiledReport.id}`}</span>
                </div>
                
                <button 
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan hover:bg-brand-cyan/95 text-black font-bold text-xs shadow-md shadow-brand-cyan/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Package JSON
                </button>
              </div>

              {/* Aggregated KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: "Audited Feedbacks", value: compiledReport.totalAudited, label: "Parsed entries" },
                  { title: "Critical alerts", value: compiledReport.criticalAnomalies, label: "Urgent issues" },
                  { title: "Primary friction", value: compiledReport.primaryFrictionCategory, label: "Core bottleneck" },
                  { title: "risk drift index", value: `${compiledReport.riskDriftScore}%`, label: "Negative proportion" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">{stat.title}</span>
                    <p className="text-lg font-black text-white mt-1.5">{stat.value}</p>
                    <span className="text-[8px] text-text-muted mt-1 block uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Core Summaries */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-brand-cyan" />
                    Autonomous Executive Synthesis
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Based on the {compiledReport.totalAudited} feedback files parsed, customer sentiment revolves around {compiledReport.primaryFrictionCategory} issues. We identified {compiledReport.criticalAnomalies} critical bottlenecks that require immediate attention from engineering teams to prevent transactional checkout bounce rates and onboarding cognitive fatigue.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Formulated Hotfix Pathways
                  </h4>
                  
                  <div className="space-y-2.5">
                    {compiledReport.recordsUsed.slice(0, 3).map((r: HindsightRecord) => (
                      <div key={r.id} className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex gap-3 text-xs leading-relaxed">
                        <span className="text-[10px] font-bold text-brand-cyan">{r.version}</span>
                        <div className="text-left flex-1">
                          <h5 className="font-extrabold text-white">{r.category} Friction</h5>
                          <p className="text-[10px] text-text-muted mt-0.5">{r.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-[9px] text-text-muted flex justify-between">
                <span>Compiled: {compiledReport.compiledAt}</span>
                <span>Requires review: Product Ops & Engineering Leads</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4 text-center h-[420px] text-text-muted">
              <FileText className="w-12 h-12 text-white/10 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-white">No active compiled brief</h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-xs">Adjust the configuration on the left and click "Compile Stakeholder briefing" to generate preview.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
