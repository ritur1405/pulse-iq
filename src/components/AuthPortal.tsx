'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (user: { name: string; email: string; org: string; initials: string }) => void;
  onClose: () => void;
}

export default function AuthPortal({ onLoginSuccess, onClose }: AuthPortalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');

  // Handle dynamic user initials extraction
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all mandatory parameters.");
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim() || !orgName.trim()) {
        setError("Please enter your name and organization to build your space.");
        return;
      }

      // Save credentials in local storage
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      if (accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
        setError("An account associated with this email already exists.");
        return;
      }

      const newUser = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        org: orgName.trim(),
        initials: getInitials(fullName)
      };

      accounts.push(newUser);
      localStorage.setItem('pulseiq_accounts', JSON.stringify(accounts));
      
      // Auto login after sign up
      localStorage.setItem('pulseiq_current_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    } else {
      // Sign In Flow
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      
      // Seed default sandbox credential if empty
      const defaultUser = {
        name: "Jordan Davis",
        email: "admin@pulseiq.co",
        password: "admin",
        org: "PulseIQ Corp",
        initials: "JD"
      };

      const foundUser = accounts.find(
        (acc: any) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (foundUser) {
        localStorage.setItem('pulseiq_current_user', JSON.stringify(foundUser));
        onLoginSuccess(foundUser);
      } else if (email.toLowerCase() === defaultUser.email && password === defaultUser.password) {
        localStorage.setItem('pulseiq_current_user', JSON.stringify(defaultUser));
        onLoginSuccess(defaultUser);
      } else {
        setError("Invalid credentials. Try using 'admin@pulseiq.co' / 'admin' for sandbox entry.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Cinematic Glowing Background Orbs */}
      <div className="glowing-orb w-[400px] h-[400px] bg-brand-pink -top-20 -left-20 animate-pulse-glow" />
      <div className="glowing-orb w-[500px] h-[500px] bg-brand-orange -bottom-40 -right-20 animate-pulse-orange" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10 text-left"
      >
        {/* Glowing border top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink to-brand-orange rounded-t-3xl" />
        
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-orange flex items-center justify-center shadow-lg shadow-brand-pink/20 mb-4 animate-float">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-widest text-white leading-none">
            PULSE<span className="text-brand-pink">IQ</span>
          </h2>
          <span className="text-[10px] text-text-muted mt-2 font-bold tracking-widest uppercase">
            {mode === 'signin' ? 'Access Intelligence Dashboard' : 'Initialize Stakeholder Profile'}
          </span>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-start gap-2.5 text-xs text-brand-pink mb-6"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleAuthentication} className="space-y-4">
          
          {/* FULL NAME (Only in Sign Up) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ORGANIZATION (Only in Sign Up) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Company / Workspace</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. CloudScale AI"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signin' ? "admin@pulseiq.co" : "alex@cloudscale.co"}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Password</label>
              {mode === 'signin' && (
                <button type="button" className="text-[9px] text-brand-pink hover:text-white transition-colors font-semibold uppercase">Forgot?</button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signin' ? "••••••••" : "Create password"}
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/5 border border-white/5 focus:border-brand-pink/40 text-xs text-white placeholder-text-muted outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-xs font-bold text-white shadow-md shadow-brand-pink/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
          >
            {mode === 'signin' ? 'Verify Credentials' : 'Configure workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* BOTTOM MODE SWITCH */}
        <div className="pt-6 mt-6 border-t border-white/5 flex flex-col items-center gap-3 text-center text-xs text-text-muted">
          {mode === 'signin' ? (
            <p>
              New stakeholder?{" "}
              <button 
                type="button" 
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-brand-pink font-bold hover:text-white transition-colors"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already verified?{" "}
              <button 
                type="button" 
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-brand-pink font-bold hover:text-white transition-colors"
              >
                Sign In
              </button>
            </p>
          )}
          
          <button 
            type="button"
            onClick={onClose}
            className="text-[10px] text-text-muted hover:text-white transition-colors tracking-wide uppercase font-semibold"
          >
            ← Back to portal home
          </button>
        </div>

      </motion.div>
    </div>
  );
}
