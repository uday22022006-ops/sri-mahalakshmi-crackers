import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onBackToStore: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onBackToStore, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black bg-dark-gradient relative flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-luxury-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-luxury-maroon/10 blur-3xl pointer-events-none" />
      
      {/* Sparkles / Gold Accents */}
      <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-luxury-gold animate-spark pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-luxury-gold-light animate-spark pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 text-white/50 hover:text-luxury-gold font-body text-xs font-semibold tracking-wider uppercase mb-8 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Store
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 mb-4 animate-float">
            <Flame className="w-8 h-8 text-luxury-gold" />
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white mb-2">
            ADMIN <span className="gold-gradient-text">PORTAL</span>
          </h1>
          <p className="font-body text-xs uppercase tracking-widest text-white/40">
            Sri Mahalakshmi Crackers
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-md p-8 shadow-luxury border border-luxury-gold/20"
        >
          <h2 className="font-heading text-2xl font-bold text-white mb-6 text-center">
            Sign In to Dashboard
          </h2>

          {errors.general && (
            <div className="mb-6 p-4 rounded-sm bg-red-950/20 border border-red-900/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-black/40 border ${
                    errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                  } rounded-sm py-3.5 pl-10 pr-4 text-white font-body text-sm placeholder:text-white/20 focus:outline-none transition-colors duration-300`}
                  placeholder="admin@smc.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-red-400 font-body">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/50 font-body text-[10px] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/40 border ${
                    errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-luxury-gold'
                  } rounded-sm py-3.5 pl-10 pr-12 text-white font-body text-sm placeholder:text-white/20 focus:outline-none transition-colors duration-300`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white/60 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] text-red-400 font-body">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-sm bg-luxury-gold text-luxury-black font-body font-semibold text-xs tracking-widest uppercase shadow-gold hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-luxury-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Secure Login'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
