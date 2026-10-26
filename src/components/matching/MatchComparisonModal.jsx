import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Gift,
} from 'lucide-react';

export default function MatchComparisonModal({ match, onClose }) {
  const navigate = useNavigate();
  const { createConversation } = useApp();

  if (!match) return null;

  const { lostItem, foundItem, score, reasons, confidenceLevel } = match;

  const handleStartConversation = () => {
    onClose();
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
      initialMessage: `Assalomu alaykum! I noticed our reports match on FindIt AI (${score}% match score). Could we verify if this item belongs to me?`,
    });
    navigate('/messages');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  AI Match Analysis
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                  {score}% Score ({confidenceLevel})
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule-based heuristic comparison between lost and found listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side by side items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lost Card */}
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500 text-white">
                  Lost Item
                </span>
                {lostItem.reward && (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <Gift className="w-3 h-3" /> {lostItem.reward}
                  </span>
                )}
              </div>

              <div className="aspect-16/10 rounded-xl overflow-hidden bg-white shadow-2xs">
                <img
                  src={lostItem.image}
                  alt={lostItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {lostItem.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {lostItem.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-rose-100/80">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{lostItem.locationAddress}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{lostItem.date} ({lostItem.time || 'N/A'})</span>
                </div>
              </div>
            </div>

            {/* Found Card */}
            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-600 text-white">
                  Found Item
                </span>
                <span className="text-[11px] font-medium text-emerald-700">
                  By {foundItem.reporterName}
                </span>
              </div>

              <div className="aspect-16/10 rounded-xl overflow-hidden bg-white shadow-2xs">
                <img
                  src={foundItem.image}
                  alt={foundItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {foundItem.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {foundItem.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-emerald-100/80">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{foundItem.locationAddress}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{foundItem.date} ({foundItem.time || 'N/A'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Matching Criteria Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              Algorithm Breakdown & Similarity Signals
            </h4>

            <div className="space-y-2">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-100 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">{r.factor}: </span>
                      <span className="text-slate-600">{r.desc}</span>
                    </div>
                  </div>
                  <span className="font-bold text-violet-700 shrink-0">
                    +{r.score} pts
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Verification Safety:</strong> To protect privacy, do not wire money in advance.
                Ask the finder about secret distinguishing marks before meeting.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              navigate(`/item/${foundItem.id}`);
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View Full Found Report
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartConversation}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Finder Safely</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
