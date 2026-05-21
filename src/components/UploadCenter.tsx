'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Mic, 
  Play, 
  Square, 
  Trash2, 
  Sparkles, 
  Cpu, 
  ArrowRight,
  Plus,
  Volume2
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { CascadeflowEngine, PipelineStage, PipelineResult } from '@/lib/cascadeflow';

interface UploadCenterProps {
  onFeedbackProcessed: (result: PipelineResult) => void;
  onProgressStateChange: (state: {
    inputText: string;
    stages: PipelineStage[];
    activeStageId: string | null;
    currentLog: string;
    result?: PipelineResult;
  } | null) => void;
  onNavigate: (tab: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'ready' | 'processing' | 'completed';
  content: string;
}

export default function UploadCenter({ onFeedbackProcessed, onProgressStateChange, onNavigate }: UploadCenterProps) {
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [audioWaves, setAudioWaves] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'f-1',
      name: 'q1_checkout_tickets.csv',
      size: '24.8 KB',
      type: 'CSV',
      status: 'ready',
      content: 'I tried checking out using Apple Pay but the stripe gateway crashed. Please refund.'
    },
    {
      id: 'f-2',
      name: 'safari_rendering_complaint.txt',
      size: '1.2 KB',
      type: 'Text',
      status: 'ready',
      content: 'The responsive side navigation panel is overlapping the core analytics widget on Safari iOS 17.'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-configured templates for quick-click premium sandbox experience
  const templates = [
    {
      title: "MFA Authentication Crash",
      text: "Ever since version 2.1 deployed, the Multi-Factor Authentication SMS system is completely broken. When I try to sign in, the SMS token arrives 20 minutes late, leading to persistent verification lockouts. I am locked out of my corporate workspace! Fix this ASAP!",
      badge: "Auth Anomaly"
    },
    {
      title: "Billing Stripe Delay",
      text: "I upgraded to the team subscription tier, but my billing checkout failed and Stripe threw an internal error. The checkout was successfully charged to my card, but our workspace tier is still marked as free. Please activate our seats immediately.",
      badge: "Payment Issue"
    },
    {
      title: "Dark Mode Appreciate",
      text: "The new dark mode aesthetic released in v1.8 is spectacular! Our operations teams are using the analytics console for 10 hours a day and the dark layout has completely eradicated eye strains. Keyboard shortcuts are incredibly smooth too.",
      badge: "UX Approval"
    },
    {
      title: "Safari iOS Mobile Crash",
      text: "The main page freezes when trying to load on Safari iOS 17 on my iPhone. The side menu drawers completely overlap with the metrics widget, and I literally cannot tap any dashboard charts. Highly annoying layout bug.",
      badge: "Responsive Bug"
    }
  ];

  // Simulating custom audio waveform movements
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
        setAudioWaves(Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 5));
      }, 150);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRecordingTimer(0);
      setAudioWaves([]);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      addNewFile(file.name, `${(file.size / 1024).toFixed(1)} KB`, "Uploaded CSV");
    }
  };

  const addNewFile = (name: string, size: string, type: string) => {
    const newFile: UploadedFile = {
      id: `f-${Date.now()}`,
      name,
      size,
      type,
      status: 'ready',
      content: 'A customer review submitted regarding checkout Stripe billing error. OTP is missing.'
    };
    setUploadedFiles(prev => [newFile, ...prev]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addNewFile(file.name, `${(file.size / 1024).toFixed(1)} KB`, file.name.endsWith('.csv') ? 'CSV' : 'Text');
    }
  };

  // Run Cascadeflow Orchestration Pipeline
  const runSimulation = async (textToProcess: string) => {
    if (!textToProcess.trim()) {
      alert("Please enter feedback reviews or select a template to synthesize.");
      return;
    }

    const engine = new CascadeflowEngine();
    
    // Redirect user to the AI Workflow Engine tab
    onNavigate('workflows');

    // Run the pipeline and stream progress updates to the active states
    await engine.executePipeline(textToProcess, (stages, activeStageId, currentLog, result) => {
      onProgressStateChange({
        inputText: textToProcess,
        stages,
        activeStageId,
        currentLog,
        result
      });

      if (result) {
        // Success complete callback!
        onFeedbackProcessed(result);
        
        // Trigger premium celebratory feedback
        canvasConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF003C', '#FF5F1F', '#00F5FF']
        });
      }
    });
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Upload Center</h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Ingest raw reviews, drop CSV files, or transcribe audio. Analyze outputs instantly via Cascadeflow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PASTE TEXT AREA & QUICK TEMPLATES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Paste Customer Feedback</span>
              <span className="text-[10px] text-text-muted">Supports raw text, support tickets, and reviews</span>
            </div>
            
            <textarea 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste raw customer feedback here... (e.g. 'I am locked out of our workspace since the MFA token fails to send...')" 
              className="w-full h-48 bg-white/3 border border-white/5 focus:border-brand-pink/40 rounded-xl p-4 text-sm text-white placeholder-text-muted outline-none transition-all resize-none leading-relaxed"
            />

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => setTextInput('')}
                className="px-4 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-white transition-all hover:bg-white/5"
              >
                Clear input
              </button>
              
              <button 
                onClick={() => runSimulation(textInput)}
                disabled={!textInput.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-xs font-bold text-white shadow-md shadow-brand-pink/20 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                Synthesize Feedback
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* QUICK START PREFILLED SANDBOX TEMPLATES */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                Sandbox Quick Templates
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-brand-orange/15 border border-brand-orange/30 text-brand-orange font-bold uppercase tracking-wider">Zero Latency Simulator</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setTextInput(t.text)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-pink/20 transition-all text-left flex flex-col justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-6 h-6 bg-brand-pink/10 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block mb-1">{t.badge}</span>
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                  </div>
                  <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">{t.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DRAG-DROP CSV & VOICE-TO-INSIGHT AUDIO */}
        <div className="space-y-6">
          
          {/* DRAG AND DROP CSV */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-panel p-8 rounded-2xl border border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 relative group ${
              isDragging ? 'border-brand-pink bg-brand-pink/5 shadow-[0_0_15px_rgba(255,0,60,0.1)]' : 'border-white/10'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept=".csv,.txt" 
              className="hidden" 
            />
            
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-pink/20 group-hover:bg-brand-pink/10 transition-all">
              <Upload className="w-5 h-5 text-text-muted group-hover:text-brand-pink transition-colors" />
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white">Drag & drop CSV/Text here</h4>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">or click to search system folders</p>
            </div>
            
            <span className="text-[9px] text-text-muted">Maximum file size: 50MB</span>
          </div>

          {/* VOICE-TO-INSIGHT AUDIO PORTAL */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-brand-cyan" />
                Voice-to-Insight Portal
              </span>
              <span className="text-[9px] text-brand-cyan font-bold uppercase">Beta</span>
            </div>

            <p className="text-[10px] text-text-muted leading-relaxed">
              Upload customer audio voice logs. Our AI automatically transcribes, classifies, and audits sentiment profiles.
            </p>

            {isRecording ? (
              <div className="py-4 rounded-xl bg-brand-cyan/[0.02] border border-brand-cyan/20 flex flex-col items-center gap-3">
                <div className="h-8 flex items-center gap-1">
                  {audioWaves.map((w, idx) => (
                    <span 
                      key={idx} 
                      className="w-1 bg-brand-cyan rounded-full transition-all duration-150" 
                      style={{ height: `${w}px` }} 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan animate-pulse">
                  <Square className="w-3.5 h-3.5 fill-brand-cyan" />
                  Recording: {recordingTimer}s
                </div>
                
                <button 
                  onClick={() => {
                    setIsRecording(false);
                    // Add mock transcript!
                    setTextInput("The checkout gateway is throwing billing errors when upgrading seats on Safari mobile layout.");
                  }}
                  className="px-4 py-1.5 rounded-lg bg-brand-cyan text-[10px] font-bold text-black uppercase"
                >
                  Stop & Transcribe
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsRecording(true)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-brand-cyan/10 hover:text-brand-cyan border border-white/5 hover:border-brand-cyan/20 transition-all text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Record Audio
                </button>
                
                <button 
                  onClick={() => {
                    // Inject a mock audio transcript
                    setTextInput("Hello, I am trying to access my billing profile but the page keeps loading. It is super slow and lagging. Please resolve this checkout issue.");
                    alert("Audio file 'customer_call_audio.wav' loaded. Raw transcription generated.");
                  }}
                  className="w-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-all text-white"
                  title="Upload audio clip"
                >
                  <Volume2 className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE UPLOADED FILE LIST */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Recent Ingest Records</span>
            
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between gap-3 text-xs group hover:border-brand-pink/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4.5 h-4.5 text-text-muted" />
                    <div className="text-left">
                      <h4 className="text-white font-bold truncate max-w-[140px]">{file.name}</h4>
                      <span className="text-[9px] text-text-muted block mt-0.5">{file.size} • {file.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => runSimulation(file.content)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-brand-pink hover:text-white rounded border border-white/5 hover:border-brand-pink text-[9px] font-bold text-white transition-all uppercase"
                    >
                      Process
                    </button>
                    <button 
                      onClick={() => deleteFile(file.id)}
                      className="text-text-muted hover:text-brand-pink transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
