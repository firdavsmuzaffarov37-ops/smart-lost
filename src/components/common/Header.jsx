import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import LanguageSelector from './LanguageSelector';
import {
  Search,
  Plus,
  Settings,
  Menu,
  RotateCcw,
  User,
  ShieldCheck,
  FileText,
  ChevronDown,
  X,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    t,
    language,
    currentUser,
    globalSearch,
    setGlobalSearch,
    setIsMobileMenuOpen,
    resetAllData,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const userMenuRef = useRef(null);
  const reportModalRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (reportModalRef.current && !reportModalRef.current.contains(event.target)) {
        setIsReportModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title based on pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return t('nav.dashboard');
    if (path.startsWith('/lost')) return t('nav.lostItems');
    if (path.startsWith('/found')) return t('nav.foundItems');
    if (path === '/report/lost') return t('nav.reportLost');
    if (path === '/report/found') return t('nav.reportFound');
    if (path === '/map') return t('nav.interactiveMap');
    if (path === '/matching') return t('nav.aiMatching');
    if (path === '/messages') return t('nav.messages');
    if (path === '/my-reports') return t('nav.myReports');
    if (path === '/settings') return t('nav.settings');
    if (path === '/login') return t('nav.login');
    if (path === '/register') return t('nav.register');
    if (path.startsWith('/item/')) {
      return language === 'uz' ? "Buyum ma'lumotlari" : language === 'ru' ? 'Детали объявления' : 'Item Details';
    }
    return t('nav.dashboard');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/lost' && location.pathname !== '/found') {
      navigate('/lost');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
            className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50/90 border border-slate-200/90 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800"
          />
          {globalSearch ? (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-sm shadow-2xs">
              ⌘K
            </kbd>
          )}
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Report Action Dropdown */}
        <div className="relative" ref={reportModalRef}>
          <button
            onClick={() => setIsReportModalOpen(!isReportModalOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('header.reportBtn')}</span>
            <span className="sm:hidden">Report</span>
            <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          {isReportModalOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Select Report Type
              </div>
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  navigate('/report/lost');
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-rose-50/80 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Report Lost Item
                  </div>
                  <div className="text-[11px] text-slate-500">
                    I lost a personal belonging and want help finding it.
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  navigate('/report/found');
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50/80 transition-colors text-left group mt-1"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Report Found Item
                  </div>
                  <div className="text-[11px] text-slate-500">
                    I found someone's item and want to return it safely.
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Language Selector */}
        <LanguageSelector />

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:flex"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors focus:outline-hidden"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <span>{currentUser?.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {currentUser?.email}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/my-reports');
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.myReports')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.settings')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span>{t('nav.login')} / {t('nav.register')}</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    resetAllData();
                  }}
                  className="w-full px-4 py-2 text-xs text-amber-600 hover:bg-amber-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>{t('common.resetData')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
