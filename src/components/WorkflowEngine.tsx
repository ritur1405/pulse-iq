'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Loader2, 
  HelpCircle,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  Database
} from 'lucide-react';
import { CascadeflowEngine, PipelineStage, PipelineResult } from '@/lib/cascadeflow';

interface WorkflowEngineProps {
  activePipeline: {
    inputText: string;
    stages: PipelineStage[];
    activeStageId: string | null;
    currentLog: string;
    result?: PipelineResult;
  } | null;
  onRunComplete?: (result: PipelineResult) => void;
}

export default function WorkflowEngine({ activePipeline, onRunComplete }: WorkflowEngineProps) {
  const [stages, setStages] = useState<PipelineStage[]>(() => CascadeflowEngine.getInitialStages());
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(["[System Initialization] Ready for pipeline execution.", "[Database Router] Hindsight contextual memory layer synced."]);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | undefined>(undefined);
  const [isRunningManual, setIsRunningManual] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Sync with active pipeline state from UploadCenter (if active)
  useEffect(() => {
    if (activePipeline) {
      setStages(activePipeline.stages);
      setActiveStageId(activePipeline.activeStageId);
      setPipelineResult(activePipeline.result);
      
      if (activePipeline.currentLog) {
        setConsoleLogs(prev => [...prev, activePipeline.currentLog]);
      }
    }
  }, [activePipeline]);

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  // Execute a default sandbox run manually from this page
  const runManualTest = async () => {
    setIsRunningManual(true);
    setPipelineResult(undefined);
    setConsoleLogs([
      "[Manual Core Trigger] Initiating system health check pipeline...",
      "[Data Router] Fetching feedback reviews payload from sandbox store..."
    ]);

    const defaultText = "Stripe checkout session fails consistently on mobile Safari layouts. Authentication works but billing webhook latency causes seat activation delay.";
    const engine = new CascadeflowEngine();

    await engine.executePipeline(defaultText, (stages, activeStageId, currentLog, result) => {
      setStages(stages);
      setActiveStageId(activeStageId);
      if (currentLog) {
        setConsoleLogs(prev => [...prev, currentLog]);
      }
      
      if (result) {
        setPipelineResult(result);
        setIsRunningManual(false);
        if (onRunComplete) {
          onRunComplete(result);
        }
      }
    }, 800); // 800ms latency for beautiful visual pacing!
  };

  const getStageIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 text-brand-cyan animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-brand-pink" />;
      default:
        return <HelpCircle className="w-5 h-5 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Cascadeflow AI Workflow Engine
          </h1>
          <p className="text-text-muted text-xs md:text-sm mt-1">Detailed visualization of the 10-stage autonomous feedback orchestration pipeline.</p>
        </div>

        <button
          onClick={runManualTest}
          disabled={isRunningManual || !!activeStageId}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-brand-cyan/10 hover:text-brand-cyan border border-white/5 hover:border-brand-cyan/20 text-xs font-bold text-white transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {isRunningManual ? "Orchestrating..." : "Trigger System-Wide Pipeline"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER PANEL: DETAILED NODE VISUALIZER */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* ORCHESTRATION PIPELINE CONNECTED GRID */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Pipeline Node Grid</span>
              <span className="text-[10px] text-text-muted font-mono">Connected Orchestration Graph</span>
            </div>

            {/* Grid of Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
              {stages.map((st, idx) => {
                const isActive = activeStageId === st.id;
                const isCompleted = st.status === 'completed';
                
                let borderStyle = "border-white/5 bg-black/40";
                let glowStyle = "";

                if (isActive) {
                  borderStyle = "border-brand-cyan bg-brand-cyan/[0.04] scale-[1.03]";
                  glowStyle = "shadow-[0_0_20px_rgba(0,245,255,0.2)]";
                } else if (isCompleted) {
                  borderStyle = "border-green-500/30 bg-green-500/[0.02]";
                }

                return (
                  <div 
                    key={st.id} 
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[150px] relative group text-left ${borderStyle} ${glowStyle}`}
                  >
                    {/* Top right marker */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-text-muted font-bold uppercase">{`Node ${idx + 1}`}</span>
                      {getStageIcon(st.status)}
                    </div>

                    <div className="space-y-1 mt-4">
                      <h4 className={`text-xs font-bold ${isActive ? 'text-brand-cyan' : isCompleted ? 'text-green-400' : 'text-white'}`}>
                        {st.name}
                      </h4>
                      <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                        {st.description}
                      </p>
                    </div>

                    {/* Active pulse bar bottom */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-orange animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMPLETED RUN RESULT DETAILS (IF DONE) */}
          {pipelineResult && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-brand-cyan/20 bg-brand-cyan/[0.01] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-2 bg-gradient-to-r from-brand-cyan to-brand-purple" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Synthesis Pipeline Output Complete
                </span>
                <span className="text-[10px] text-text-muted">Calculated via Cascadeflow Heuristics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Linguistic Tag</span>
                  <p className="text-sm font-extrabold text-white mt-1.5">{pipelineResult.category.toUpperCase()}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Sentiment Profile</span>
                  <p className={`text-sm font-extrabold mt-1.5 ${
                    pipelineResult.sentiment === 'positive' ? 'text-green-400' : pipelineResult.sentiment === 'negative' ? 'text-brand-pink' : 'text-brand-orange'
                  }`}>{pipelineResult.sentiment.toUpperCase()} ({pipelineResult.sentimentScore.toFixed(2)})</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Weighted Priority</span>
                  <p className={`text-sm font-extrabold mt-1.5 ${
                    pipelineResult.priority === 'HIGH' ? 'text-brand-pink text-glow-pink' : 'text-white'
                  }`}>{pipelineResult.priority} ({pipelineResult.priorityScore}/100)</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Abstractive Summary</span>
                  <p className="text-xs text-white leading-relaxed">{pipelineResult.summary}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">AI Recommended Hotfix Pathway</span>
                  <p className="text-xs text-text-muted leading-relaxed italic">"{pipelineResult.recommendation}"</p>
                </div>

                {pipelineResult.alertTriggered && (
                  <div className="p-3.5 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-xs text-brand-pink font-semibold flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>System Anomaly Notification Dispatched: Alert successfully broadcasted to engineering channels.</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: TERMINAL CONSOLE LOGS */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-[650px] relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              Linguistic Shell logs
            </span>
            <span className="text-[9px] font-mono text-brand-cyan uppercase">Terminal v1.0</span>
          </div>

          {/* Console Output Area */}
          <div className="flex-1 w-full bg-black/60 rounded-2xl p-4 font-mono text-[10px] text-text-muted leading-relaxed overflow-y-auto space-y-2 border border-white/5 text-left select-text hide-scrollbar">
            {consoleLogs.map((log, idx) => {
              let textClass = "text-text-muted";
              if (log.includes("[System Initialization]") || log.includes("[Database Router]")) {
                textClass = "text-brand-cyan font-semibold";
              } else if (log.includes("completed") || log.includes("Success")) {
                textClass = "text-green-400 font-semibold";
              } else if (log.includes("processing") || log.includes("Initiating")) {
                textClass = "text-brand-orange animate-pulse";
              } else if (log.includes("ALERT") || log.includes("CRITICAL")) {
                textClass = "text-brand-pink font-bold";
              }
              
              return (
                <div key={idx} className={textClass}>
                  {`> `} {log}
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-text-muted text-left shrink-0">
            Memory stack trace fully aligned with Cascadeflow orchestration. All nodes synced.
          </div>
        </div>

      </div>

    </div>
  );
}
