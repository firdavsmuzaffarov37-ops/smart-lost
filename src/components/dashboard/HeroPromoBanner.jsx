import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Shield,
  Radio,
} from 'lucide-react';

export default function HeroPromoBanner() {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/10 p-6 sm:p-8 md:p-10">
      {/* Decorative background circles & radar waves */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-24 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
      
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>AI Lost & Found Network • Uzbekistan</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t('dashboard.bannerTitle')}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
            {t('dashboard.bannerSubtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/report/lost')}
              className="px-5 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>{t('dashboard.bannerBtn')}</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => navigate('/found')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{t('dashboard.bannerSecondaryBtn')}</span>
            </button>
          </div>
        </div>

        {/* Right Illustration Card */}
        <div className="hidden lg:flex flex-col gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 w-72 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live Matching
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                98% Match
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=120&q=80"
                alt="Matched Item"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
              />
              <div className="text-xs min-w-0">
                <p className="font-bold text-white truncate">iPhone 15 Pro</p>
                <p className="text-[11px] text-blue-200 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Magic City Park
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 w-64 self-end shadow-md flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-300 shrink-0" />
            <div className="text-[11px] text-blue-100">
              <span className="font-bold text-white">Safe Verification:</span> Masked
              contact info protects owners.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
