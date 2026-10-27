import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import TelegramModal from '../common/TelegramModal';
import QrTagModal from '../common/QrTagModal';
import RewardPaymentModal from '../common/RewardPaymentModal';
import {
  Search,
  CheckSquare,
  MapPin,
  Sparkles,
  ArrowRight,
  QrCode,
  Send,
  CreditCard,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function PopularServices() {
  const navigate = useNavigate();
  const { t, reports } = useApp();

  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

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

      {/* Smart Platform Innovations (QR Tag, Telegram Bot, Payme/Click Escrow) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {/* Smart QR Tag Card */}
        <div
          onClick={() => setIsQrOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-violet-900/10 via-purple-500/5 to-indigo-900/10 border border-violet-200/80 hover:border-violet-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                Smart QR Stikerlar
              </h4>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                Yangi
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Hamyon, kalit yoki sumkaga yopishtirish uchun xavfsiz QR-kod stikeri
            </p>
          </div>
        </div>

        {/* Telegram Bot Card */}
        <div
          onClick={() => setIsTelegramOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-sky-900/10 via-blue-500/5 to-sky-900/10 border border-sky-200/80 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Telegram Bot Alerts
              </h4>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              AI 90%+ moslik topganda Telegramingizga zudlik bilan bildirishnoma
            </p>
          </div>
        </div>

        {/* Payme / Click Escrow Card */}
        <div
          onClick={() => setIsRewardOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-teal-900/10 via-emerald-500/5 to-teal-900/10 border border-teal-200/80 hover:border-teal-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Kafolatlangan Suyunchi
              </h4>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                Escrow
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Topuvchiga Payme yoki Click orqali xavfsiz mukofot o'tkazish
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TelegramModal isOpen={isTelegramOpen} onClose={() => setIsTelegramOpen(false)} />
      <QrTagModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <RewardPaymentModal isOpen={isRewardOpen} onClose={() => setIsRewardOpen(false)} />
    </div>
  );
}
