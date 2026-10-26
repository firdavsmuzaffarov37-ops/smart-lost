import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { findMatchesForItem, discoverAllSystemMatches } from '../services/aiMatchingService';
import MatchComparisonModal from '../components/matching/MatchComparisonModal';
import {
  Sparkles,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Cpu,
  Zap,
} from 'lucide-react';

export default function AiMatchingPage() {
  const navigate = useNavigate();
  const { reports, createConversation } = useApp();

  const lostItems = useMemo(() => reports.filter((r) => r.type === 'lost'), [reports]);
  const [selectedLostItemId, setSelectedLostItemId] = useState(lostItems[0]?.id || '');
  const [selectedMatchForModal, setSelectedMatchForModal] = useState(null);
  const [viewMode, setViewMode] = useState('single'); // 'single' (matches for selected item) or 'all' (system-wide pairs)

  const activeLostItem = lostItems.find((item) => item.id === selectedLostItemId) || lostItems[0];

  // Calculate matches for currently selected lost item
  const itemMatches = useMemo(() => {
    if (!activeLostItem) return [];
    return findMatchesForItem(activeLostItem, reports);
  }, [activeLostItem, reports]);

  // Discover all system-wide high probability pairs
  const systemPairs = useMemo(() => {
    return discoverAllSystemMatches(reports);
  }, [reports]);

  const handleStartChat = (foundItem, score) => {
    createConversation({
      itemId: foundItem.id,
      itemTitle: foundItem.title,
      itemImage: foundItem.image,
      otherUser: {
        id: foundItem.userId,
        name: foundItem.reporterName,
        avatar: foundItem.reporterAvatar,
        role: 'Finder',
        verified: true,
      },
      initialMessage: `Assalomu alaykum! Our reports match on FindIt AI (${score}% match score). I believe this might be my belonging!`,
    });
    navigate('/messages');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AI Smart Matching Engine
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                Local Heuristic v1.2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Our intelligent engine cross-analyzes item categories, keyword tokens, geo-coordinates,
              and date proximity to connect lost reports with found belongings.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200/60">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inspect Lost Item
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All System Pairs ({systemPairs.length})
            </button>
          </div>
        </div>

        {/* Algorithm Factor Pill Explanation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              <strong>Category:</strong> 30% weight
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <span>
              <strong>Keywords:</strong> 35% weight
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              <strong>Proximity:</strong> 20% weight
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Date Closeness:</strong> 15% weight
            </span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Single item inspector */}
      {viewMode === 'single' && (
        <div className="space-y-6">
          {/* Lost Item Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select a Lost Item to find matching candidate reports:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <select
                value={selectedLostItemId}
                onChange={(e) => setSelectedLostItemId(e.target.value)}
                className="md:col-span-2 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium cursor-pointer"
              >
                {lostItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — {item.city} ({item.date})
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate('/report/lost')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>+ Report Another Lost Item</span>
              </button>
            </div>

            {/* Currently selected item preview pill */}
            {activeLostItem && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <img
                  src={activeLostItem.image}
                  alt={activeLostItem.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-rose-500 text-white">
                      Lost
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {activeLostItem.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {activeLostItem.locationAddress} • {activeLostItem.date}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Discovered Candidates ({itemMatches.length})
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by AI match confidence
              </span>
            </div>

            {itemMatches.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mx-auto mb-2">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  No matches discovered yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No found items currently meet the similarity threshold for this report.
                  Our matching engine checks newly submitted reports continuously.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemMatches.map((match) => {
                  const target = match.targetItem;
                  const isHigh = match.score >= 80;

                  return (
                    <div
                      key={target.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-200 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                              isHigh
                                ? 'bg-violet-100 text-violet-800 border border-violet-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                            {match.score}% Match Confidence
                          </span>

                          <span className="text-[11px] font-semibold text-slate-400">
                            Found Item #{target.id}
                          </span>
                        </div>

                        {/* Item Card Body */}
                        <div className="flex gap-3.5">
                          <img
                            src={target.image}
                            alt={target.title}
                            className="w-20 h-20 rounded-2xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">
                              {target.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                              {target.description}
                            </p>
                            <div className="text-[11px] text-slate-500 space-y-0.5 mt-2">
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{target.locationAddress}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{target.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reasons Breakdown */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                          {match.reasons.map((r, i) => (
                            <div
                              key={i}
                              className="text-[11px] flex items-center justify-between text-slate-700"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{r.desc}</span>
                              </div>
                              <span className="font-bold text-violet-700 shrink-0">
                                +{r.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() =>
                            setSelectedMatchForModal({
                              lostItem: activeLostItem,
                              foundItem: target,
                              score: match.score,
                              reasons: match.reasons,
                              confidenceLevel: match.confidenceLevel,
                            })
                          }
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                        >
                          Compare Side-by-Side
                        </button>

                        <button
                          onClick={() => handleStartChat(target, match.score)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Contact Finder</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: System-Wide Pairs Discovery */}
      {viewMode === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              All Discovered Match Pairs in System ({systemPairs.length})
            </h3>
            <span className="text-xs text-slate-500">Threshold: ≥ 50% match score</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {systemPairs.map((pair) => (
              <div
                key={pair.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-200 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-violet-100 text-violet-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      {pair.score}% Match
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {pair.confidenceLevel} Confidence
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedMatchForModal(pair)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View Breakdown
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-rose-500">
                      Lost Item
                    </span>
                    <p className="font-bold text-slate-900 truncate mt-0.5">
                      {pair.lostItem.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pair.lostItem.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600">
                      Found Item
                    </span>
                    <p className="font-bold text-slate-900 truncate mt-0.5">
                      {pair.foundItem.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pair.foundItem.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleStartChat(pair.foundItem, pair.score)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Connect Finder & Owner</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {selectedMatchForModal && (
        <MatchComparisonModal
          match={selectedMatchForModal}
          onClose={() => setSelectedMatchForModal(null)}
        />
      )}
    </div>
  );
}
