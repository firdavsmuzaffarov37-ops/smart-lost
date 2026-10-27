import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Globe,
  Bell,
  RotateCcw,
  User,
  CheckCircle2,
  Database,
  Save,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Server,
  Camera,
  Upload,
} from 'lucide-react';
import { citiesInUzbekistan, AVATAR_PRESETS } from '../data/initialData';

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    setCurrentUser,
    language,
    setLanguage,
    resetAllData,
    addToast,
    supabaseStatus,
    t,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+998 90 123 45 67');
  const [city, setCity] = useState(currentUser?.city || 'Tashkent');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '+998 90 123 45 67');
      setCity(currentUser.city || 'Tashkent');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const [matchAlerts, setMatchAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zigmkgwbrhwcyuzrmxce.supabase.co';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      city,
      avatar: avatar || prev?.avatar,
    }));
    addToast(t('settings.profileUpdated'), 'success');
  };

  const handleResetData = () => {
    const confirmMsg =
      language === 'uz'
        ? "Barcha e'lonlar va ma'lumotlarni boshlang'ich holatga qaytarishni xohlaysizmi?"
        : language === 'ru'
        ? 'Сбросить все данные к исходным демонстрационным?'
        : 'Reset all demo data back to default Uzbekistan sample reports?';

    if (window.confirm(confirmMsg)) {
      resetAllData();
      addToast(
        language === 'uz'
          ? "Ma'lumotlar boshlang'ich holatga qaytarildi"
          : language === 'ru'
          ? 'Данные сброшены'
          : 'Data reset to defaults',
        'info'
      );
    }
  };

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto my-12 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Settings className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          {t('settings.title')}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'uz'
            ? "Profil sozlamalarini boshqarish uchun tizimga kiring."
            : language === 'ru'
            ? 'Войдите в систему для управления настройками.'
            : 'Please sign in to manage your settings.'}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          {t('nav.login')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('settings.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('settings.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Language & Localization Panel */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            {t('settings.langTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settings.langSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'uz', label: "O'zbekcha", desc: "O'zbek tilida", flag: '🇺🇿' },
            { code: 'ru', label: 'Русский', desc: 'Русскоязычный интерфейс', flag: '🇷🇺' },
            { code: 'en', label: 'English', desc: 'Default international', flag: '🇬🇧' },
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                language === lang.code
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{lang.flag}</span>
                {language === lang.code ? (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{lang.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{lang.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Details Panel */}
      <form onSubmit={handleSaveProfile} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500/30 bg-slate-100">
                  <img
                    src={avatar || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=2563eb&color=fff&size=240&bold=true`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Rasm yuklash">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setAvatar(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  {t('settings.profileTitle')}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentUser?.role || 'Verified Citizen'} • {currentUser?.city || 'Tashkent'}
                </p>
                <label className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer inline-flex items-center gap-1 mt-1">
                  <Upload className="w-3 h-3" />
                  <span>{language === 'uz' ? 'Yangi rasm yuklash' : language === 'ru' ? 'Загрузить новое фото' : 'Upload photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setAvatar(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser?.trustScore || 98}% Trust Score
            </span>
          </div>

          {/* Quick preset avatars */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-400">
              {language === 'uz' ? 'Tayyor rasmlar:' : language === 'ru' ? 'Выбрать аватар:' : 'Presets:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    avatar === preset
                      ? 'border-blue-600 scale-110 ring-2 ring-blue-500/30'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('settings.fullName')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('settings.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('settings.phone')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('settings.city')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
              >
                {citiesInUzbekistan.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{t('settings.saveProfileBtn')}</span>
          </button>
        </div>
      </form>

      {/* Notifications Preferences */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          {t('settings.notificationsTitle')}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">{t('settings.matchAlertsTitle')}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('settings.matchAlertsDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">{t('settings.messageAlertsTitle')}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('settings.messageAlertsDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={messageAlerts}
              onChange={(e) => setMessageAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Supabase Cloud Database Panel */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${supabaseStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {t('settings.databaseTitle')}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            supabaseStatus.connected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {supabaseStatus.connected ? t('settings.connected') : t('settings.notConnected')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-bold text-slate-700">{t('settings.projectEndpoint')}</span>
            <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] truncate max-w-full">
              {supabaseUrl}
            </span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-bold text-slate-700">{t('settings.apiKeyStatus')}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('settings.keyActive')}
            </span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-bold text-slate-700">{t('settings.syncArchitecture')}</span>
            <span className="text-slate-600">{t('settings.syncArchDesc')}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
          <Server className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-blue-950">
              {language === 'uz'
                ? "Bulutli ma'lumotlar bazasi faolligi"
                : language === 'ru'
                ? 'Статус облачной базы данных'
                : 'Cloud Database Status'}
            </p>
            <p className="text-blue-800">
              {t('settings.schemaNotice')}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          {t('settings.dataManagementTitle')}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('settings.dataManagementDesc')}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('settings.resetDataBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
