import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  PlusCircle,
  MapPin,
  MessageSquare,
} from 'lucide-react';

export default function MobileBottomNav() {
  const { t, unreadMessagesCount } = useApp();

  const links = [
    { to: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/lost', label: t('common.lost'), icon: Search },
    {
      to: '/report/lost',
      label: t('nav.reportItem'),
      icon: PlusCircle,
      isPrimary: true,
    },
    { to: '/found', label: t('common.found'), icon: CheckSquare },
    { to: '/map', label: t('nav.interactiveMap'), icon: MapPin },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-lg safe-bottom">
      {links.map((link) => {
        const Icon = link.icon;
        if (link.isPrimary) {
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex flex-col items-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 border-2 border-white">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 mt-0.5 tracking-tight">
                {link.label}
              </span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="text-[10px] mt-0.5">{link.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
