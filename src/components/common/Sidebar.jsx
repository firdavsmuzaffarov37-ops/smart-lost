import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  PlusCircle,
  MapPin,
  Sparkles,
  MessageSquare,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
  LogIn,
  UserPlus,
  X,
  Compass,
} from 'lucide-react';

export default function Sidebar() {
  const {
    t,
    reports,
    unreadMessagesCount,
    currentUser,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();
  const navigate = useNavigate();

  const lostCount = reports.filter((r) => r.type === 'lost' && r.status === 'open').length;
  const foundCount = reports.filter((r) => r.type === 'found' && r.status === 'open').length;

  const navItems = [
    {
      to: '/',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/lost',
      label: t('nav.lostItems'),
      icon: Search,
      badge: lostCount,
      badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200/60',
    },
    {
      to: '/found',
      label: t('nav.foundItems'),
      icon: CheckSquare,
      badge: foundCount,
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    },
    {
      to: '/report/lost',
      label: t('nav.reportItem'),
      icon: PlusCircle,
      badge: 'New',
      badgeColor: 'bg-blue-600 text-white text-[10px]',
    },
    {
      to: '/map',
      label: t('nav.interactiveMap'),
      icon: MapPin,
      badge: null,
    },
    {
      to: '/matching',
      label: t('nav.aiMatching'),
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-violet-100 text-violet-700 font-bold text-[10px]',
    },
    {
      to: '/messages',
      label: t('nav.messages'),
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      to: '/my-reports',
      label: t('nav.myReports'),
      icon: FileText,
      badge: null,
    },
    {
      to: '/settings',
      label: t('nav.settings'),
      icon: Settings,
      badge: null,
    },
  ];

  const authItems = [
    {
      to: '/login',
      label: t('nav.login'),
      icon: LogIn,
    },
    {
      to: '/register',
      label: t('nav.register'),
      icon: UserPlus,
    },
  ];

  const handleNavClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#f8fafc] border-r border-slate-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/70 bg-white/60">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo.png"
              alt="FindIt AI Logo"
              className="w-9 h-9 rounded-xl object-cover shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                FindIt
              </span>
              <span className="text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200/60">
                AI
              </span>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t('nav.platformMenu')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Account & Access Section */}
          <div className="pt-3">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t('nav.accountMenu')}
            </div>
            {authItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Report Promo Box in Sidebar */}
        <div className="px-3 pb-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-100 text-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">
                {t('sidebar.promoTitle')}
              </span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-3">
              {t('sidebar.promoDesc')}
            </p>
            <button
              onClick={() => {
                navigate('/report/lost');
                handleNavClick();
              }}
              className="w-full py-1.5 px-3 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('sidebar.promoBtn')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* User Profile Pill / Login CTA */}
        <div className="p-3 border-t border-slate-200/80 bg-white/70">
          {currentUser ? (
            <div
              onClick={() => {
                navigate('/my-reports');
                handleNavClick();
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=2563eb&color=fff&size=240&bold=true`}
                  alt={currentUser?.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=2563eb&color=fff&size=240&bold=true`;
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || 'User'}
                  </p>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.role || t('sidebar.verifiedCitizen')}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ) : (
            <div
              onClick={() => {
                navigate('/login');
                handleNavClick();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <LogIn className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-900">
                  {t('nav.login')}
                </p>
                <p className="text-[10px] text-blue-600 truncate">
                  {t('auth.registerTab') || "Kirish / Ro'yxatdan o'tish"}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
