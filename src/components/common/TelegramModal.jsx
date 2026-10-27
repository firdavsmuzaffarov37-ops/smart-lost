import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Bell, Shield, Smartphone, ExternalLink, X, RefreshCw } from 'lucide-react';
import { telegramService } from '../../services/telegramService';
import { useApp } from '../../context/AppContext';

export default function TelegramModal({ isOpen, onClose }) {
  const { addToast, language } = useApp();
  const [settings, setSettings] = useState(telegramService.getSettings());
  const [testSent, setTestSent] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    setSettings(telegramService.getSettings());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    telegramService.saveSettings(settings);
    addToast(
      language === 'uz'
        ? 'Telegram sozlamalari saqlandi!'
        : language === 'ru'
        ? 'Настройки Telegram сохранены!'
        : 'Telegram settings saved!',
      'success'
    );
    onClose();
  };

  const handleSendTest = async () => {
    setTestSent(true);
    const res = await telegramService.sendAlert({
      type: 'MATCH',
      title: 'iPhone 14 Pro (Space Black)',
      location: 'Toshkent, Amir Temur xiyoboni',
      reward: '500,000 UZS',
      matchScore: 98,
      url: window.location.href,
    });
    setLastMessage(res.text);
    addToast(
      language === 'uz'
        ? 'Telegram botga test bildirishnoma yuborildi!'
        : language === 'ru'
        ? 'Тестовое уведомление отправлено в Telegram!'
        : 'Test notification sent to Telegram!',
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with Telegram Branding */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Telegram Bot Integratsiyasi
                <span className="text-[10px] bg-sky-400/30 text-sky-100 px-2 py-0.5 rounded-full font-semibold">
                  Online
                </span>
              </h3>
              <p className="text-xs text-sky-100/90">
                @FindItAi_Robot — Jonli bildirishnomalar va AI mosliklar
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

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status info */}
          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-sky-200">
                {language === 'uz'
                  ? 'Qanday ishlaydi?'
                  : language === 'ru'
                  ? 'Как это работает?'
                  : 'How it works'}
              </p>
              <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                {language === 'uz'
                  ? 'Siz yo\'qotgan buyumga 90%+ mos topilgan buyum paydo bo\'lsa yoki topuvchi sizga xabar yozsa, Telegramingizga zudlik bilan bildirishnoma keladi.'
                  : 'Мгновенное уведомление в Telegram при обнаружении совпадения AI (90%+) или получении нового сообщения от нашедшего.'}
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telegram Foydalanuvchi nomi (@username)
              </label>
              <input
                type="text"
                value={settings.userHandle}
                onChange={(e) => setSettings({ ...settings, userHandle: e.target.value })}
                placeholder="@username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnMatch}
                  onChange={(e) => setSettings({ ...settings, notifyOnMatch: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  AI yangi moslik topganda ogohlantirish (90%+)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnMessage}
                  onChange={(e) => setSettings({ ...settings, notifyOnMessage: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Topuvchi xabar yozganda yoki talab bildirilganda
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnReward}
                  onChange={(e) => setSettings({ ...settings, notifyOnReward: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Suyunchi to'lovi amalga oshirilganda
                </span>
              </label>
            </div>
          </div>

          {/* Telegram Preview Bubble */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Telegramda ko'rinishi (Preview)
              </span>
              <button
                type="button"
                onClick={handleSendTest}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                Test xabar yuborish
              </button>
            </div>

            <div className="bg-[#17212b] rounded-xl p-3 text-white text-xs border border-sky-900/30 space-y-1.5 font-sans">
              <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold">
                  🤖
                </div>
                <span className="font-semibold text-sky-300 text-[11px]">FindIt AI Bot</span>
                <span className="text-[10px] text-slate-400 ml-auto">14:00</span>
              </div>
              <div
                className="text-[11px] leading-relaxed text-slate-200"
                dangerouslySetInnerHTML={{
                  __html:
                    lastMessage ||
                    `🎯 <b>AI YANGI MOSLIK TOPDI! (98%)</b><br/>📦 Buyum: <b>iPhone 14 Pro (Space Black)</b><br/>📍 Joylashuv: <b>Toshkent, Amir Temur xiyoboni</b><br/>💰 Suyunchi: <b>500,000 UZS</b>`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            @FindItAi_Robot ga o'tish
          </a>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-md shadow-sky-600/30 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
