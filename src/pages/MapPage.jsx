import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import LostFoundMap from '../components/map/LostFoundMap';
import { categories, citiesInUzbekistan } from '../data/initialData';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Search,
  CheckCircle2,
  Calendar,
  Gift,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

export default function MapPage() {
  const navigate = useNavigate();
  const { reports, t } = useApp();

  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCityName, setSelectedCityName] = useState('Tashkent');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSplitView, setIsSplitView] = useState(true);

  // Selected city center coordinates
  const currentCityObj = citiesInUzbekistan.find((c) => c.name === selectedCityName) || citiesInUzbekistan[0];
  const [mapCenter, setMapCenter] = useState({ lat: currentCityObj.lat, lng: currentCityObj.lng });
  const [mapZoom, setMapZoom] = useState(12);

  const handleCitySelect = (cityName) => {
    setSelectedCityName(cityName);
    const city = citiesInUzbekistan.find((c) => c.name === cityName);
    if (city) {
      setMapCenter({ lat: city.lat, lng: city.lng });
      setMapZoom(12);
    }
  };

  const filteredItems = useMemo(() => {
    return reports.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedCityName !== 'all' && item.city.toLowerCase() !== selectedCityName.toLowerCase()) return false;
      return true;
    });
  }, [reports, filterType, selectedCategory, selectedCityName]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
      setMapCenter({ lat: item.coordinates.lat, lng: item.coordinates.lng });
      setMapZoom(15);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Map Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Interactive Lost & Found Map
            </h1>
            <p className="text-xs text-slate-500">
              Sample coordinates across Uzbekistan. Filter by status, category, or city.
            </p>
          </div>

          {/* Quick Stats & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setFilterType('lost')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterType === 'lost' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setFilterType('found')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterType === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Found
              </button>
            </div>

            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isSplitView ? 'Switch to Full Map' : 'Switch to Split List View'}
            >
              {isSplitView ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSplitView ? 'Full Map' : 'Split View'}</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* City selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select City
            </label>
            <select
              value={selectedCityName}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-800 cursor-pointer"
            >
              <option value="all">{t('items.allCitiesOption')}</option>
              {citiesInUzbekistan.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.region})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {t('common.category')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-800 cursor-pointer"
            >
              <option value="all">{t('categories.all')}</option>
              {categories.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {t(`categories.${cat.id}`) || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 self-end pb-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white ring-1 ring-rose-300" />
              <span className="text-slate-700">{t('common.lost')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-1 ring-emerald-300" />
              <span className="text-slate-700">{t('common.found')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Content Layout */}
      <div className={`grid gap-4 ${isSplitView ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Map Container */}
        <div className={`${isSplitView ? 'lg:col-span-8' : 'w-full'}`}>
          <LostFoundMap
            items={filteredItems}
            selectedItem={selectedItem}
            center={mapCenter}
            zoom={mapZoom}
            height="620px"
            onMarkerClick={(item) => setSelectedItem(item)}
          />
        </div>

        {/* Side List in Split View */}
        {isSplitView && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col h-[620px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Reports on Map ({filteredItems.length})
              </span>
              <span className="text-[11px] text-slate-400">Click to focus pin</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2 pt-2">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No reports located in this city or category.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isLost = item.type === 'lost';
                  const isCurrent = selectedItem && selectedItem.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 ${
                        isCurrent
                          ? 'bg-blue-50 border border-blue-200 shadow-2xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded-sm text-[9px] font-extrabold uppercase ${
                              isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.reward && (
                            <span className="text-[10px] font-bold text-amber-600">
                              {item.reward}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.locationAddress}</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
