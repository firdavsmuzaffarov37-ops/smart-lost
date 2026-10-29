import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { findMatchesForItem } from '../services/aiMatchingService';
import LostFoundMap from '../components/map/LostFoundMap';
import MatchComparisonModal from '../components/matching/MatchComparisonModal';
import QrTagModal from '../components/common/QrTagModal';
import RewardPaymentModal from '../components/common/RewardPaymentModal';
import { telegramService } from '../services/telegramService';
import {
  MapPin,
  Calendar,
  Gift,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  Printer,
  MessageSquare,
  Tag,
  CheckCircle2,
  Clock,
  HelpCircle,
  Eye,
  Trash2,
  Edit3,
  QrCode,
  CreditCard,
  Send,
} from 'lucide-react';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    reports,
    currentUser,
    createConversation,
    updateReport,
    deleteReport,
    addToast,
    t,
    language,
  } = useApp();

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showSecretAnswerPrompt, setShowSecretAnswerPrompt] = useState(false);
  const [userClaimAnswer, setUserClaimAnswer] = useState('');
  const [isClaimVerified, setIsClaimVerified] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isRewardPaymentOpen, setIsRewardPaymentOpen] = useState(false);

  const item = reports.find((r) => r.id === id);

  const matches = useMemo(() => {
    if (!item) return [];
    return findMatchesForItem(item, reports);
  }, [item, reports]);

  if (!item) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {language === 'uz' ? "E'lon topilmadi" : language === 'ru' ? "Объявление не найдено" : "Report Not Found"}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'uz' ? "Ushbu e'lon o'chirilgan bo'lishi mumkin yoki havola noto'g'ri." : language === 'ru' ? "Это объявление могло быть удалено или ссылка неверна." : "This report may have been deleted or the link is invalid."}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {language === 'uz' ? "Bosh sahifaga qaytish" : language === 'ru' ? "Вернуться на главную" : "Return to Dashboard"}
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === item.userId;
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

  const handleStartChat = () => {
    createConversation({
      itemId: item.id,
      itemTitle: displayTitle,
      itemImage: item.image,
      otherUser: {
        id: item.userId,
        name: item.reporterName,
        avatar: item.reporterAvatar,
        role: isLost ? (language === 'uz' ? 'Ega' : 'Owner') : (language === 'uz' ? 'Topuvchi' : 'Finder'),
        verified: true,
      },
      initialMessage: isLost
        ? (language === 'uz'
            ? `Assalomu alaykum, ${item.reporterName}! Men sizning "${displayTitle}" bo'yicha e'loningizni ko'rdim. Sizga ma'lumot berishim mumkin.`
            : language === 'ru'
            ? `Здравствуйте, ${item.reporterName}! Я по поводу вашего объявления "${displayTitle}".`
            : `Hello ${item.reporterName}! I saw your lost report for "${displayTitle}". I might have information about it.`)
        : (language === 'uz'
            ? `Assalomu alaykum, ${item.reporterName}! Siz topib olgan "${displayTitle}" bo'yicha yozyapman. Bu buyum menga tegishli bo'lishi mumkin.`
            : language === 'ru'
            ? `Здравствуйте, ${item.reporterName}! Я пишу по поводу найденной вещи "${displayTitle}".`
            : `Hello ${item.reporterName}! I am reaching out regarding the found item "${displayTitle}".`),
    });
    navigate('/messages');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast(
      language === 'uz'
        ? "E'lon havolasi nusxalandi!"
        : language === 'ru'
        ? 'Ссылка на объявление скопирована!'
        : 'Report link copied to clipboard!',
      'info'
    );
  };

  const handleToggleReunited = () => {
    const nextStatus = isReunited ? 'open' : 'reunited';
    updateReport(item.id, { status: nextStatus });
    addToast(
      nextStatus === 'reunited'
        ? (language === 'uz' ? "Ajoyib xabar! Buyum egasiga qaytarildi deb belgilandi." : language === 'ru' ? "Отличная новость! Вещь отмечена как возвращенная." : 'Great news! Item marked as reunited with owner.')
        : (language === 'uz' ? "E'lon qayta ochiq deb belgilandi." : language === 'ru' ? "Объявление снова открыто." : 'Report marked as open.'),
      'success'
    );
  };

  const handleDelete = () => {
    const confirmMsg = language === 'uz'
      ? "Haqiqatan ham ushbu e'lonni o'chirmoqchimisiz?"
      : language === 'ru'
      ? 'Вы уверены, что хотите удалить это объявление?'
      : 'Are you sure you want to delete this report?';
    if (window.confirm(confirmMsg)) {
      deleteReport(item.id);
      navigate('/my-reports');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'uz' ? "Ro'yxatga qaytish" : language === 'ru' ? "Назад к списку" : "Back to listings"}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Smart QR Sticker Generator Button */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="p-2 rounded-xl border border-violet-200 bg-violet-50/70 hover:bg-violet-100 text-violet-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Smart QR Stiker yaratish"
          >
            <QrCode className="w-4 h-4 text-violet-600" />
            <span className="hidden sm:inline">QR Stiker</span>
          </button>

          {/* Telegram Share Button */}
          <button
            onClick={() => {
              const text = encodeURIComponent(`🔍 FindIt AI: ${item.title}\n📍 Joylashuv: ${item.locationAddress}`);
              window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
            }}
            className="p-2 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Telegramda ulashish"
          >
            <Send className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Telegram</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share report"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'uz' ? "Ulashish" : language === 'ru' ? "Поделиться" : "Share Link"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print Missing Notice"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'uz' ? "Chop etish" : language === 'ru' ? "Печать" : "Print Notice"}</span>
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Large Image Column */}
          <div className="lg:col-span-5 relative bg-slate-900 aspect-4/3 lg:aspect-auto min-h-[300px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                  isReunited
                    ? 'bg-purple-600 text-white'
                    : isLost
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isReunited ? t('common.reunited') : isLost ? t('common.lost') : t('common.found')}
              </span>

              {item.reward && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  {item.reward}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-300" />
                <span className="capitalize">{t(`categories.${item.category}`) || item.category.replace('-', ' & ')}</span>
              </span>
            </div>
          </div>

          {/* Details Content Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status header */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{language === 'uz' ? "E'lon IDsi" : language === 'ru' ? "ID объявления" : "Report ID"}: #{item.id}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {item.viewsCount || 1} {language === 'uz' ? "marta ko'rildi" : language === 'ru' ? "просмотров" : "views"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
                {displayTitle}
              </h1>

              {/* Description */}
              <div className="space-y-1 mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('reportForm.descriptionLabel')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {displayDescription}
                </p>
              </div>

              {/* Key Location and Time Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{t('common.location')}:</span>
                    <span>{item.locationAddress}</span>
                    <span className="text-slate-400 block text-[11px]">{item.city}, Uzbekistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {item.type === 'lost' ? (t('reportForm.dateLostLabel') || t('common.date')) : (t('reportForm.dateFoundLabel') || t('common.date'))}:
                    </span>
                    <span>{item.date}</span>
                    {item.time && <span className="text-slate-400 block text-[11px]">{item.time}</span>}
                  </div>
                </div>

                {item.custodyLocation && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Current Custody:</span>
                      <span>{item.custodyLocation}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Profile & Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.reporterAvatar}
                    alt={item.reporterName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <span>{item.reporterName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {isLost ? 'Item Owner' : 'Finder'} • Verified
                    </span>
                  </div>
                </div>

                {/* Owner controls */}
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRewardPaymentOpen(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Suyunchi to'lash</span>
                    </button>
                    <button
                      onClick={handleToggleReunited}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isReunited
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isReunited ? 'Mark as Open' : 'Mark as Reunited'}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons if not owner */}
              {!isOwner && (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleStartChat}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isLost ? t('common.contactOwner') : t('common.contactFinder')}</span>
                  </button>

                  <button
                    onClick={() => setIsRewardPaymentOpen(true)}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold shadow-sm shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Suyunchi to'lash (Payme / Click)</span>
                  </button>

                  {item.secretQuestion && (
                    <button
                      onClick={() => setShowSecretAnswerPrompt(!showSecretAnswerPrompt)}
                      className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>{language === 'uz' ? 'Egalikni tasdiqlash' : language === 'ru' ? 'Подтвердить владение' : 'Verify Ownership'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Secret Question Verification Box */}
              {showSecretAnswerPrompt && item.secretQuestion && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Secret Ownership Question</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    "{item.secretQuestion}"
                  </p>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={userClaimAnswer}
                      onChange={(e) => setUserClaimAnswer(e.target.value)}
                      placeholder="Type your verification answer..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-xl"
                    />
                    <button
                      onClick={() => {
                        if (userClaimAnswer.trim()) {
                          setIsClaimVerified(true);
                          addToast('Answer submitted to the finder for verification!', 'success');
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
                    >
                      Submit
                    </button>
                  </div>
                  {isClaimVerified && (
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Answer transmitted to chat
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map Location Preview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Location on Map
        </h3>
        <p className="text-xs text-slate-500">
          Reported around {item.locationAddress}, {item.city}
        </p>

        <LostFoundMap
          items={[item]}
          selectedItem={item}
          center={item.coordinates || { lat: 41.311081, lng: 69.279737 }}
          zoom={15}
          height="280px"
        />
      </div>

      {/* Possible AI Matches for This Report */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AI Match Candidates ({matches.length})
              </h3>
              <p className="text-xs text-slate-500">
                Potential {isLost ? 'found' : 'lost'} belongings that align with this report
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/matching')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Open Matching Hub
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
            No high-confidence match candidates discovered for this item yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match) => {
              const target = match.targetItem;
              return (
                <div
                  key={target.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-violet-300 transition-all space-y-3 bg-slate-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                      {match.score}% Match
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {target.type}
                    </span>
                  </div>

                  <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-200">
                    <img
                      src={target.image}
                      alt={target.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {target.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {target.locationAddress}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedMatch({
                        lostItem: isLost ? item : target,
                        foundItem: isLost ? target : item,
                        score: match.score,
                        reasons: match.reasons,
                        confidenceLevel: match.confidenceLevel,
                      })
                    }
                    className="w-full py-1.5 px-2 bg-white hover:bg-violet-50 text-violet-700 text-xs font-bold rounded-xl border border-violet-200 transition-colors"
                  >
                    Compare Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {selectedMatch && (
        <MatchComparisonModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Smart QR Sticker Generator Modal */}
      <QrTagModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        item={item}
      />

      {/* Payme / Click Escrow Reward Payment Modal */}
      <RewardPaymentModal
        isOpen={isRewardPaymentOpen}
        onClose={() => setIsRewardPaymentOpen(false)}
        item={item}
      />
    </div>
  );
}
