import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckSquare,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function PopularServices() {
  const navigate = useNavigate();
  const { t, reports } = useApp();

  const lostCount = reports.filter((r) => r.type === 'lost').length;
  const foundCount = reports.filter((r) => r.type === 'found').length;

  const services = [
    {
      id: 'report-lost',
      title: t('services.reportLostTitle'),
      desc: t('services.reportLostDesc'),
      icon: Search,
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      badge: `${lostCount} active lost`,
      badgeColor: 'bg-rose-50 text-rose-700',
      actionText: 'Report Lost',
      onClick: () => navigate('/report/lost'),
    },
    {
      id: 'report-found',
      title: t('services.reportFoundTitle'),
      desc: t('services.reportFoundDesc'),
      icon: CheckSquare,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badge: `${foundCount} active found`,
      badgeColor: 'bg-emerald-50 text-emerald-700',
      actionText: 'Report Found',
      onClick: () => navigate('/report/found'),
    },
    {
      id: 'explore-map',
      title: t('services.exploreMapTitle'),
      desc: t('services.exploreMapDesc'),
      icon: MapPin,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'Live Map View',
      badgeColor: 'bg-blue-50 text-blue-700',
      actionText: 'Open Map',
      onClick: () => navigate('/map'),
    },
    {
      id: 'ai-matching',
      title: t('services.aiMatchingTitle'),
      desc: t('services.aiMatchingDesc'),
      icon: Sparkles,
      iconBg: 'bg-violet-50 text-violet-600 border border-violet-100',
      badge: 'Smart Engine',
      badgeColor: 'bg-violet-50 text-violet-700',
      actionText: 'View Matches',
      onClick: () => navigate('/matching'),
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t('dashboard.popularServicesTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('dashboard.popularServicesSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              onClick={service.onClick}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${service.iconBg} shadow-xs group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${service.badgeColor}`}
                  >
                    {service.badge}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                  {service.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {service.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                <span>{service.actionText}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
