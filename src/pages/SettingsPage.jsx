import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  RotateCcw,
  User,
  CheckCircle2,
  Database,
  Smartphone,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    currentUser,
    setCurrentUser,
    language,
    setLanguage,
    resetAllData,
    addToast,
    t,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Azizbek Rakhimov');
  const [email, setEmail] = useState(currentUser?.email || 'azizbek.r@example.uz');
  const [phone, setPhone] = useState(currentUser?.phone || '+998 90 123 45 67');
  const [city, setCity] = useState(currentUser?.city || 'Tashkent');

  const [matchAlerts, setMatchAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      city,
    }));
    addToast('Profile preferences updated.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default Uzbekistan sample reports?')) {
      resetAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-600" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your account profile, localization languages, notifications, and local storage data.
        </p>
      </div>

      {/* Language & Localization Panel */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          Language & Localization
        </h2>
        <p className="text-xs text-slate-500">
          Select the interface language for FindIt AI.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en', label: 'English', desc: 'Default international', flag: '🇬🇧' },
            { code: 'uz', label: "O'zbekcha", desc: "O'zbek tilida", flag: '🇺🇿' },
            { code: 'ru', label: 'Русский', desc: 'Русскоязычный интерфейс', flag: '🇷🇺' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                language === lang.code
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{lang.flag}</span>
                {language === lang.code && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{lang.label}</p>
                <p className="text-[11px] text-slate-500">{lang.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Details Panel */}
      <form onSubmit={handleSaveProfile} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          User Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Home City in Uzbekistan
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Notifications Preferences */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          Notification Alerts
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-900">AI Match Notifications</p>
              <p className="text-[11px] text-slate-500">Alert me when a found item scores high similarity with my lost reports</p>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-900">In-App Chat Messages</p>
              <p className="text-[11px] text-slate-500">Notify me when finders or owners reply to my inquiry</p>
            </div>
            <input
              type="checkbox"
              checked={messageAlerts}
              onChange={(e) => setMessageAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Supabase Cloud Database Panel */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Cloud Database
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Connected
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Project Endpoint:</span>
            <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              https://xtgeypjjpmliszukabdk.supabase.co
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">API Key Status:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Publishable Key Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Sync Architecture:</span>
            <span className="text-slate-600">Hybrid (Supabase Cloud + LocalStorage Offline Cache)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
          <strong>Database Schema:</strong> We have generated the complete SQL migration file{' '}
          <code className="bg-blue-100/70 px-1.5 py-0.5 rounded font-mono font-bold">supabase_schema.sql</code> in your
          workspace root. Run it in your Supabase SQL Editor to initialize the <code className="font-mono">reports</code>,{' '}
          <code className="font-mono">conversations</code>, and <code className="font-mono">messages</code> tables.
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          Data Synchronization & Cache
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          This application persists all added lost & found reports, messages, and notifications in your browser's
          <strong> LocalStorage</strong> and syncs with your <strong>Supabase</strong> database. You can reset anytime back to initial pre-seeded sample data.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            className="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('common.resetData')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
