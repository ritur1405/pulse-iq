'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  Brain, 
  TrendingUp, 
  FileSpreadsheet, 
  Volume2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  LineChart
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (startingTab?: string) => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  // Features Data
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-brand-pink" />,
      title: "Hindsight Memory Engine",
      description: "Retain long-term contextual memory of customer pain points, track repeated issue streaks, and capture historical sentiment shifts across product releases."
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand-cyan" />,
      title: "Cascadeflow Orchestration",
      description: "Automate feedback parsing through a 10-stage ingestion-to-alerting pipeline, processing text, CSVs, and audio logs with detailed workflow tracing."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-orange" />,
      title: "AI Sentiment Indexing",
      description: "Evaluate user emotions with multi-dimensional positive, neutral, and negative vectors to calculate granular health and priority indexes."
    },
    {
      icon: <LineChart className="w-6 h-6 text-brand-pink" />,
      title: "Trend Forecasting",
      description: "Detect micro-trends, anomaly spikes, and sentiment drift after deployments, ensuring you pinpoint bugs before they impact user retention."
    },
    {
      icon: <Volume2 className="w-6 h-6 text-brand-cyan" />,
      title: "Voice-to-Insight Analysis",
      description: "Upload actual audio feedback recordings, extract raw transcriptions, and run them through our sentiment and topic engines with real-time waveform previews."
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-brand-orange" />,
      title: "Executive Report Generator",
      description: "Compile critical product insights and trends into clean, comprehensive, stakeholder-ready PDFs and reports with a single click."
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      quote: "PulseIQ transformed how we handle post-release bug triaging. The Cascadeflow workflow automatically alerts our engineers within seconds, while Hindsight reminds us if the bug has occurred in previous updates.",
      author: "Evelyn Vance",
      role: "VP of Product, CloudScale AI",
      avatar: "EV"
    },
    {
      quote: "The visual Memory Timeline is spectacular. We can literally watch customer sentiment shift positively over weeks since releasing our UI overhaul, validating our entire roadmap.",
      author: "Marcus Chen",
      role: "Director of Engineering, Hyperion",
      avatar: "MC"
    }
  ];

  return (
    <div className="relative min-h-screen bg-bg-base overflow-hidden">
      {/* Cinematic Glowing Background Orbs */}
      <div className="glowing-orb w-[500px] h-[500px] bg-brand-pink -top-40 -left-40 animate-pulse-glow" />
      <div className="glowing-orb w-[600px] h-[600px] bg-brand-orange -bottom-60 -right-40 animate-pulse-orange" />
      <div className="glowing-orb w-[400px] h-[400px] bg-brand-purple top-1/2 left-1/3 opacity-10 animate-float" />
      
      {/* Decorative Cyber Grid overlay overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="absolute top-0 left-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center shadow-lg shadow-brand-pink/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">PULSE<span className="text-brand-pink">IQ</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-white transition-colors">AI Pipeline</a>
            <a href="#insights" className="hover:text-white transition-colors">Insights</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>

          <div>
            <button 
              onClick={() => onEnterDashboard('dashboard')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-full border border-white/10 hover:border-brand-pink/40 text-sm font-semibold text-white transition-all bg-white/5 hover:shadow-[0_0_15px_rgba(255,0,60,0.2)]"
            >
              Enter Console
            </button>
          </div>
        </div>
      </header>

      {/* Section 1: Hero Section */}
      <section className="relative pt-44 pb-24 px-6 flex flex-col items-center justify-center text-center max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-pink/20 text-xs font-semibold tracking-wider text-brand-pink mb-8 uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Enterprise Product Intelligence Suite
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight md:leading-none mb-6"
        >
          Transform Customer Feedback <br />
          <span className="text-gradient-pink-orange">Into Actionable Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-xl text-text-muted max-w-3xl leading-relaxed mb-12"
        >
          AI-powered product intelligence platform integrated with <span className="text-white font-semibold">Hindsight Memory</span> and <span className="text-white font-semibold">Cascadeflow Orchestration</span> for automatic sentiment indexing, recurring bug tracking, and automated alert triggering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-5 justify-center z-20"
        >
          <button 
            onClick={() => onEnterDashboard('uploads')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-pink to-brand-orange text-white hover:shadow-[0_0_30px_rgba(255,0,60,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            Upload Feedback
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => onEnterDashboard('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:bg-white/10"
          >
            View Dashboard
          </button>
        </motion.div>
      </section>

      {/* Section 2: Features Grid */}
      <section id="features" className="py-24 px-6 relative max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Autonomous AI Operations</h2>
          <p className="text-text-muted max-w-xl mx-auto">Discover the enterprise-grade frameworks driving context, memory, and automation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-5 relative group overflow-hidden"
            >
              {/* Subtle glass border glow */}
              <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-brand-pink/20 transition-colors pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-brand-pink/10 group-hover:border-brand-pink/20 transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Live Analytics Preview */}
      <section id="insights" className="py-24 px-6 relative max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-bold text-brand-orange uppercase mb-6">
              <Zap className="w-3.5 h-3.5" />
              Live Analytics Engine
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              Stunning Interactive <br />
              Product Intelligence
            </h2>
            
            <p className="text-text-muted leading-relaxed mb-8 text-sm md:text-base">
              PulseIQ provides immediate clarity across unstructured streams. Witness negative spikes, track bugs as recurring milestones, and trigger Slack webhooks when threshold indexes pass warning levels.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">99.8% Accuracy Index</h4>
                  <p className="text-text-muted text-xs md:text-sm mt-0.5">Dual NLP cleaning layers remove boilerplate data to prevent token dilution.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Hindsight Version Comparison</h4>
                  <p className="text-text-muted text-xs md:text-sm mt-0.5">Compare current releases directly with older deployment timelines to catch regressions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: AI Insights Panel Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 to-brand-orange/10 rounded-3xl filter blur-3xl opacity-30" />
            
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-black/80"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-pink"></span>
                  </span>
                  <span className="text-xs tracking-wider text-brand-pink font-bold uppercase">Critical AI Anomaly Alert</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-brand-pink/10 border border-brand-pink/20 text-[10px] font-bold text-brand-pink uppercase">
                  Urgency: 92/100
                </div>
              </div>

              {/* Card Body */}
              <div className="py-6 space-y-5">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white font-medium text-sm md:text-base leading-relaxed italic">
                    "Users appreciate the redesigned interface, but onboarding confusion increased by 23% after the latest v2.2 update."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-text-muted uppercase font-semibold">Sentiment Shift</span>
                    <p className="text-lg md:text-xl font-extrabold text-brand-pink mt-1">-23% Regression</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-text-muted uppercase font-semibold">AI Confidence Score</span>
                    <p className="text-lg md:text-xl font-extrabold text-brand-cyan mt-1">98.4% Acc.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Contextual Suggestion (Hindsight)</span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    MFA changes deployed in v2.2 forced active mobile logins to terminate. Users are trapped on the 7-step onboarding slide deck. A/B test with a 3-step dynamic tour.
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">Orchestrated via Cascadeflow Engine</span>
                <button 
                  onClick={() => onEnterDashboard('dashboard')}
                  className="text-xs text-brand-pink hover:text-white font-bold transition-colors flex items-center gap-1"
                >
                  Investigate
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Animated Cascadeflow Node Visualization */}
      <section id="pipeline" className="py-24 px-6 relative max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-bold text-brand-cyan uppercase mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Connected Workflow Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Cascadeflow Pipeline</h2>
          <p className="text-text-muted max-w-xl mx-auto">Watch raw client uploads transition through 7 primary layers of synthesis and scoring.</p>
        </div>

        {/* Pipeline Nodes Map */}
        <div className="relative p-6 md:p-12 rounded-3xl glass-panel border border-white/5 overflow-hidden">
          {/* Connecting Laser Glow Pipe */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-cyan to-brand-orange -translate-y-1/2 opacity-30 z-0 hidden md:block" />
          
          <div className="grid md:grid-cols-7 gap-6 relative z-10">
            {[
              { num: "01", name: "Upload", color: "border-brand-pink shadow-brand-pink/20", label: "Ingest CSV/Text" },
              { num: "02", name: "Process", color: "border-brand-pink shadow-brand-pink/20", label: "Cleanse Inputs" },
              { num: "03", name: "Analyze", color: "border-brand-cyan shadow-brand-cyan/20", label: "Sentiment Index" },
              { num: "04", name: "Categorize", color: "border-brand-cyan shadow-brand-cyan/20", label: "Tag UI/UX & Bug" },
              { num: "05", name: "Prioritize", color: "border-brand-orange shadow-brand-orange/20", label: "Weight Negatives" },
              { num: "06", name: "Recommend", color: "border-brand-orange shadow-brand-orange/20", label: "Query Hindsight" },
              { num: "07", name: "Report", color: "border-brand-orange shadow-brand-orange/20", label: "Generate PDFs" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 rounded-full bg-black/60 border-2 ${node.color} flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-4 animate-float`} style={{ animationDelay: `${i * 0.3}s` }}>
                  {node.num}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{node.name}</h4>
                <p className="text-[10px] text-text-muted leading-tight max-w-[100px]">{node.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <button 
            onClick={() => onEnterDashboard('workflows')}
            className="inline-flex items-center gap-2 text-brand-pink hover:text-white font-bold text-sm transition-colors group"
          >
            Launch Automation Console
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section id="testimonials" className="py-24 px-6 relative max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Enterprise Verification</h2>
          <p className="text-text-muted max-w-xl mx-auto">See how top product teams run user intelligence with high confidence scores.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl border border-white/10 relative flex flex-col gap-6">
              <div className="absolute top-0 right-8 w-12 h-8 bg-gradient-to-b from-brand-pink/10 to-transparent rounded-b-xl pointer-events-none" />
              <p className="text-white/90 text-sm md:text-base leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center text-white font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{t.author}</h4>
                  <p className="text-text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Call To Action */}
      <section className="py-24 px-6 relative max-w-7xl mx-auto z-10 border-t border-white/5 mb-16">
        <div className="relative rounded-3xl p-8 md:p-16 overflow-hidden glass-panel border border-brand-pink/20 text-center">
          <div className="absolute inset-0 bg-radial-gradient opacity-80" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Ready to Upgrade Your <br />
              <span className="text-gradient-pink-orange">Product Intelligence?</span>
            </h2>
            
            <p className="text-text-muted leading-relaxed text-sm md:text-base mb-10 max-w-xl">
              Equip your development and support units with full contextual memory. Spot bugs, track recurring complaints, and prioritize updates in real-time.
            </p>

            <button 
              onClick={() => onEnterDashboard('dashboard')}
              className="px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              Initialize SaaS Platform
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-text-muted">
        <p>© 2026 PulseIQ Inc. Powered by Cascadeflow and Hindsight Memory Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
