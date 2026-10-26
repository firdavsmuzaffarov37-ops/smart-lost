import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb, ShieldCheck, Lock, Eye, AlertCircle } from 'lucide-react';

export default function TipsSection() {
  const { t } = useApp();

  const tipIcons = [Lightbulb, ShieldCheck, Lock];

  const tips = [
    {
      title: 'Be specific with unique marks',
      desc: 'Mention distinct serial numbers, unique stickers, scratches, or phone lockscreens to verify ownership without exposing private data.',
      tag: 'Best Practice',
      tagColor: 'bg-blue-50 text-blue-600 border border-blue-200/60',
    },
    {
      title: 'Meet in public, safe zones',
      desc: 'Always arrange item handoffs in well-lit public spots like Metro stations, police information booths, or shopping mall security desks.',
      tag: 'Safety Guide',
      tagColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    },
    {
      title: 'Keep sensitive ID numbers private',
      desc: 'Never post full passport, card numbers, or PINs publicly. Use our secure masked verification prompt to ask only the true owner.',
      tag: 'Data Privacy',
      tagColor: 'bg-violet-50 text-violet-600 border border-violet-200/60',
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {t('dashboard.helpfulTipsTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('dashboard.helpfulTipsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => {
          const Icon = tipIcons[idx] || Lightbulb;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tip.tagColor}`}
                  >
                    {tip.tag}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                  {tip.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {tip.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Verified community standard</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
