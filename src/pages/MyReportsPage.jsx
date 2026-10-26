import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { findMatchesForItem } from '../services/aiMatchingService';
import {
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Gift,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Plus,
  X,
  Save,
} from 'lucide-react';

export default function MyReportsPage() {
  const navigate = useNavigate();
  const {
    reports,
    currentUser,
    updateReport,
    deleteReport,
    addToast,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', 'found'
  const [editingItem, setEditingItem] = useState(null);

  // Filter reports belonging to current user
  const myReports = reports.filter((r) => r.userId === currentUser?.id);

  const myLostCount = myReports.filter((r) => r.type === 'lost').length;
  const myFoundCount = myReports.filter((r) => r.type === 'found').length;

  // Total potential matches across user's reports
  const totalPotentialMatches = myReports.reduce((acc, report) => {
    const matches = findMatchesForItem(report, reports);
    return acc + matches.length;
  }, 0);

  const displayedReports = myReports.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    return true;
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteReport(id);
    }
  };

  const handleToggleStatus = (item) => {
    const newStatus = item.status === 'reunited' ? 'open' : 'reunited';
    updateReport(item.id, { status: newStatus });
    addToast(
      newStatus === 'reunited'
        ? `Status updated: "${item.title}" marked as reunited!`
        : `Status updated: "${item.title}" marked as open.`,
      'success'
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateReport(editingItem.id, {
      title: editingItem.title,
      description: editingItem.description,
      locationAddress: editingItem.locationAddress,
      reward: editingItem.reward,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Profile Overview Card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {currentUser?.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser?.email} • {currentUser?.phone} • {currentUser?.city}, Uzbekistan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => navigate('/report/lost')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Lost Report</span>
          </button>
          <button
            onClick={() => navigate('/report/found')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>New Found Report</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Reports
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{myReports.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Submitted by you</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
            Lost Items
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{myLostCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Currently searched</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            Found Items
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{myFoundCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Safely registered</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Potential Matches
          </div>
          <div className="text-2xl font-extrabold text-violet-700">{totalPotentialMatches}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Suggested candidate pairs</div>
        </div>
      </div>

      {/* Reports Management Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Tab Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Reports ({myReports.length})
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'lost' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Lost ({myLostCount})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Found ({myFoundCount})
            </button>
          </div>
        </div>

        {/* Content list */}
        {displayedReports.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            No reports in this category yet. Submit a new report above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedReports.map((item) => {
              const isLost = item.type === 'lost';
              const isReunited = item.status === 'reunited';
              const itemMatches = findMatchesForItem(item, reports);

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isReunited
                              ? 'bg-purple-100 text-purple-700'
                              : isLost
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isReunited ? 'Reunited' : item.type}
                        </span>

                        {item.reward && (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                            <Gift className="w-3 h-3" /> {item.reward}
                          </span>
                        )}

                        {itemMatches.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {itemMatches.length} AI matches
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.locationAddress}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isReunited
                          ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                          : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700'
                      }`}
                    >
                      {isReunited ? 'Reopen Report' : 'Mark as Reunited'}
                    </button>

                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Report"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Edit Report #{editingItem.id}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  value={editingItem.locationAddress}
                  onChange={(e) => setEditingItem({ ...editingItem, locationAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.reward || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, reward: e.target.value })}
                  placeholder="e.g. 500,000 UZS"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
