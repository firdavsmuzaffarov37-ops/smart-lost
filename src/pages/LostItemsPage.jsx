import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/common/ItemCard';
import { categories, citiesInUzbekistan } from '../data/initialData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function LostItemsPage() {
  const navigate = useNavigate();
  const { reports, t, language, globalSearch, setGlobalSearch } = useApp();

  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'reward'

  const filteredItems = useMemo(() => {
    return reports
      .filter((item) => item.type === 'lost')
      .filter((item) => {
        if (category !== 'all' && item.category !== category) return false;
        if (city !== 'all' && item.city.toLowerCase() !== city.toLowerCase()) return false;
        if (globalSearch.trim()) {
          const query = globalSearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchCity = item.city.toLowerCase().includes(query);
          const matchAddr = (item.locationAddress || '').toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCity && !matchAddr) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        if (sortBy === 'oldest') return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        if (sortBy === 'reward') {
          const rewardA = a.reward ? 1 : 0;
          const rewardB = b.reward ? 1 : 0;
          return rewardB - rewardA;
        }
        return 0;
      });
  }, [reports, category, city, globalSearch, sortBy]);

  const hasActiveFilters = category !== 'all' || city !== 'all' || globalSearch.trim() !== '' || sortBy !== 'newest';

  const clearAllFilters = () => {
    setCategory('all');
    setCity('all');
    setSortBy('newest');
    setGlobalSearch('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('items.lostDirectoryTitle')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
              {filteredItems.length} {t('items.missingCount')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('items.lostDirectorySubtitle')}
          </p>
        </div>

        <button
          onClick={() => navigate('/report/lost')}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('items.reportLostBtn')}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t('items.searchLostPlaceholder')}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
            >
              <option value="all">{t('categories.all')}</option>
              {categories.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {t(`categories.${cat.id}`) || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* City in Uzbekistan */}
          <div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
            >
              <option value="all">{t('items.allCitiesOption')}</option>
              {citiesInUzbekistan.map((c) => (
                <option key={c.name} value={c.name}>
                  {language === 'uz' ? (c.nameUz || c.name) : language === 'ru' ? (c.nameRu || c.name) : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
            >
              <option value="newest">{t('items.sortNewest')}</option>
              <option value="oldest">{t('items.sortOldest')}</option>
              <option value="reward">{t('items.sortReward')}</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t('items.activeFilters')}
              </span>
              {category !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 text-slate-700 flex items-center gap-1">
                  {t(`categories.${category}`) || category}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('all')} />
                </span>
              )}
              {city !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 text-slate-700 flex items-center gap-1">
                  {city}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setCity('all')} />
                </span>
              )}
              {globalSearch && (
                <span className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 text-slate-700 flex items-center gap-1">
                  "{globalSearch}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setGlobalSearch('')} />
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
            >
              {t('common.clearFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('items.noLostTitle')}</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {t('items.noLostDesc')}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {t('items.resetFilters')}
            </button>
            <button
              onClick={() => navigate('/report/lost')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {t('items.reportLostBtn')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
