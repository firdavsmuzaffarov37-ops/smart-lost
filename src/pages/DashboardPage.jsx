import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HeroPromoBanner from '../components/dashboard/HeroPromoBanner';
import PopularServices from '../components/dashboard/PopularServices';
import RecentReportsGrid from '../components/dashboard/RecentReportsGrid';
import TipsSection from '../components/dashboard/TipsSection';
import {
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, reports, currentUser } = useApp();

  const totalLost = reports.filter((r) => r.type === 'lost').length;
  const totalFound = reports.filter((r) => r.type === 'found').length;
  const reunitedCount = reports.filter((r) => r.status === 'reunited').length + 14; // includes historical reunites

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('dashboard.welcomeTitle')}
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
              Active Community
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {t('dashboard.welcomeSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/report/lost')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Lost Item</span>
          </button>
          <button
            onClick={() => navigate('/report/found')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Main Promotional Card (Voiceon Inspired) */}
      <HeroPromoBanner />

      {/* Quick Community Impact Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{totalLost}</div>
            <div className="text-xs text-slate-500 font-medium">Active Lost Reports</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{totalFound}</div>
            <div className="text-xs text-slate-500 font-medium">Found Items Logged</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">89%</div>
            <div className="text-xs text-slate-500 font-medium">AI Match Accuracy</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{reunitedCount}+</div>
            <div className="text-xs text-slate-500 font-medium">Reunited in Uzbekistan</div>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <PopularServices />

      {/* Recent Reports Section */}
      <RecentReportsGrid />

      {/* Helpful Tips Section */}
      <TipsSection />
    </div>
  );
}
