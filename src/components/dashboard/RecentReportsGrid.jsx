import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ItemCard from '../common/ItemCard';
import { categories } from '../../data/initialData';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';

export default function RecentReportsGrid() {
  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { reports, t } = useApp();

  const filteredReports = reports.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t('dashboard.recentReportsTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('dashboard.recentReportsSubtitle')}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('dashboard.filterAll')}
          </button>
          <button
            onClick={() => setFilterType('lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'lost'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('dashboard.filterLost')}
          </button>
          <button
            onClick={() => setFilterType('found')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('dashboard.filterFound')}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t(`categories.${cat.id}`) || cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            {t('items.noLostTitle')}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {t('items.noLostDesc')}
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('items.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredReports.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => navigate(filterType === 'found' ? '/found' : '/lost')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <span>{t('dashboard.viewAll')}</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
