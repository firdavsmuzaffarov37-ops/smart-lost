import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Gift,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export default function ItemCard({ item, matchScore, matchReasons }) {
  const navigate = useNavigate();
  const { t, language } = useApp();

  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';

  const displayTitle =
    language === 'uz' && item.titleUz
      ? item.titleUz
      : language === 'ru' && item.titleRu
      ? item.titleRu
      : item.title;

  const displayDescription =
    language === 'uz' && item.descriptionUz
      ? item.descriptionUz
      : language === 'ru' && item.descriptionRu
      ? item.descriptionRu
      : item.description;

  return (
    <div
      onClick={() => navigate(`/item/${item.id}`)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Thumbnail and Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-md ${
              isReunited
                ? 'bg-purple-600/90 text-white'
                : isLost
                ? 'bg-rose-500/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {isReunited
              ? t('common.reunited')
              : isLost
              ? t('common.lost')
              : t('common.found')}
          </span>

          {item.reward && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1 backdrop-blur-md">
              <Gift className="w-3 h-3" />
              <span>{item.reward}</span>
            </span>
          )}
        </div>

        {/* AI Match Score Badge (if passed) */}
        {matchScore !== undefined && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-violet-700 shadow-md border border-violet-100 flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>
              {matchScore}% {language === 'ru' ? 'совпадение' : language === 'uz' ? 'moslik' : 'Match'}
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-900/70 text-white backdrop-blur-md flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-300" />
            <span className="capitalize">{t(`categories.${item.category}`) || item.category.replace('-', ' & ')}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
            {displayTitle}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {displayDescription}
          </p>

          {/* Location & Date Meta */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{item.city}</span>
              <span className="text-slate-300">•</span>
              <span className="truncate">{item.district || item.locationAddress}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {item.date} {item.time ? `(${item.time})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.reporterAvatar}
              alt={item.reporterName}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[11px] font-medium text-slate-600 truncate max-w-[110px]">
              {item.reporterName}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/item/${item.id}`);
            }}
            className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors hover:underline"
          >
            <span>{t('common.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
