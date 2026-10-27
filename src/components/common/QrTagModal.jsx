import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, X, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function QrTagModal({ isOpen, onClose, item }) {
  const { addToast, language, currentUser } = useApp();
  const [copied, setCopied] = useState(false);
  const [tagTitle, setTagTitle] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [tagCategory, setTagCategory] = useState('Kalit / Hamyon');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const initialTitle = item ? item.title : `${currentUser?.name || 'Foydalanuvchi'}ning shaxsiy buyumi`;
      setTagTitle(initialTitle);
      generateCode(initialTitle);
    }
  }, [isOpen, item]);

  const generateCode = async (title) => {
    try {
      const targetUrl = item?.id
        ? `${window.location.origin}/item/${item.id}`
        : `${window.location.origin}/?tag_owner=${encodeURIComponent(currentUser?.email || 'user')}`;
      
      const url = await QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  };

  if (!isOpen) return null;

  const handleCopy = () => {
    const targetUrl = item?.id
      ? `${window.location.origin}/item/${item.id}`
      : `${window.location.origin}/?tag_owner=${encodeURIComponent(currentUser?.email || 'user')}`;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    addToast(
      language === 'uz' ? 'Havola nusxalandi!' : 'Ссылка скопирована!',
      'success'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `FindIt-QR-Tag-${tagTitle.replace(/\s+/g, '_')}.png`;
    link.href = qrDataUrl;
    link.click();
    addToast(
      language === 'uz' ? 'QR stiker yuklab olindi!' : 'QR стикер скачан!',
      'success'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Smart QR Stiker Generatori
              </h3>
              <p className="text-xs text-violet-100/90">
                Buyumlaringizga yopishtirib qo'yish uchun xavfsiz stiker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Preview */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tag Title Input if custom */}
          {!item && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Buyum nomi (Stikerda yoziladi):
              </label>
              <input
                type="text"
                value={tagTitle}
                onChange={(e) => {
                  setTagTitle(e.target.value);
                  generateCode(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-hidden focus:border-violet-500"
              />
            </div>
          )}

          {/* Physical Sticker Card Preview */}
          <div className="p-4 rounded-3xl bg-white text-slate-900 shadow-xl border-4 border-dashed border-indigo-200 text-center relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-[11px] font-extrabold tracking-wider text-indigo-600 uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                FindIt AI • SMART TAG
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                Xavfsiz
              </span>
            </div>

            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Agar topib olsangiz, skanerlang:
            </p>
            <h4 className="text-sm font-extrabold text-slate-900 truncate mb-3">
              {tagTitle || 'Shaxsiy buyum'}
            </h4>

            {/* QR Image */}
            <div className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-slate-200 mb-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-44 h-44 mx-auto rounded-xl object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                  QR hosil qilinmoqda...
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-2 text-[11px] text-slate-600 border border-slate-100 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Skanerlanganda egasining telefoniga zudlik bilan bildirishnoma boradi</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            💡 Ushbu stikerni chop etib noutbukingiz, hamyoningiz, kalitingiz yoki sumkangizga yopishtirib qo'yishingiz mumkin.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Nusxalandi' : 'Havola'}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Chop etish
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-md shadow-violet-600/30 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Yuklab olish
          </button>
        </div>
      </div>
    </div>
  );
}
