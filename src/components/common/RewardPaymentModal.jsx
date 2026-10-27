import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, X, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { telegramService } from '../../services/telegramService';

export default function RewardPaymentModal({ isOpen, onClose, item, onPaymentSuccess }) {
  const { addToast, language, currentUser } = useApp();
  const [method, setMethod] = useState('payme'); // 'payme' | 'click'
  const [step, setStep] = useState(1); // 1: Card details, 2: SMS OTP, 3: Success
  const [cardNumber, setCardNumber] = useState('8600 4589 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [smsCode, setSmsCode] = useState('');
  const [amount, setAmount] = useState(item?.reward || '150 000 UZS');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00cccc', '#0073ff', '#10b981', '#f59e0b'],
        });
      } catch (err) {}

      // Send simulated Telegram notification
      telegramService.sendAlert({
        type: 'REWARD_PAID',
        title: item?.title || 'Yo\'qolgan buyum',
        reward: amount,
      });

      addToast(
        language === 'uz'
          ? 'Suyunchi to\'lovi muvaffaqiyatli o\'tkazildi!'
          : language === 'ru'
          ? 'Вознаграждение успешно выплачено!'
          : 'Reward successfully paid!',
        'success'
      );

      if (onPaymentSuccess) {
        onPaymentSuccess({ amount, method, date: new Date().toISOString() });
      }
    }, 700);
  };

  const handleClose = () => {
    setStep(1);
    setSmsCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          method === 'payme' ? 'bg-gradient-to-r from-teal-700 to-emerald-600' : 'bg-gradient-to-r from-blue-700 to-indigo-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Suyunchi to'lash
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                  Escrow Xavfsiz
                </span>
              </h3>
              <p className="text-xs text-white/80">
                Topuvchiga rasmiy kafolatlangan mukofot o'tkazish
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {step === 1 && (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Method Selector (Payme vs Click) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('payme')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    method === 'payme'
                      ? 'border-teal-500 bg-teal-950/40 text-teal-200 ring-2 ring-teal-500/30'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black tracking-wider text-teal-400 text-sm">payme</span>
                    {method === 'payme' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400">Uzcard / Humo</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('click')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    method === 'click'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200 ring-2 ring-blue-500/30'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black tracking-wider text-blue-400 text-sm">CLICK</span>
                    {method === 'click' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400">Click Up / Uzcard</p>
                </button>
              </div>

              {/* Amount Display */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">To'lov summasi:</span>
                  <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                    {amount}
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  Komissiya 0%
                </span>
              </div>

              {/* Card Inputs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Karta raqami (Uzcard / Humo)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    maxLength={19}
                    placeholder="8600 •••• •••• ••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-hidden focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amal qilish muddati
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-hidden focus:border-teal-500 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Xavfsizlik
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>3D-Secure 256-bit</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                  method === 'payme'
                    ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                {isProcessing ? 'Ulanmoqda...' : `${amount} to'lash`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">SMS kodni kiriting</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Karta egasining telefon raqamiga yuborilgan 6 xonali kodni kiriting.
                </p>
              </div>

              <div className="max-w-[200px] mx-auto">
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  maxLength={6}
                  placeholder="••••••"
                  required
                  autoFocus
                  className="w-full text-center text-xl tracking-widest font-mono py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Demo 1-click OTP filler */}
              <button
                type="button"
                onClick={() => setSmsCode('884422')}
                className="text-[11px] text-teal-400 hover:text-teal-300 underline cursor-pointer"
              >
                Demo SMS kodni avtomatik to'ldirish (884422)
              </button>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Tasdiqlanmoqda...' : 'Tasdiqlash va O\'tkazish'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-lg">Suyunchi to'landi!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  <b>{amount}</b> miqdoridagi mukofot topuvchining hisobiga muvaffaqiyatli o'tkazildi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tranzaksiya ID:</span>
                  <span className="text-white">TRX-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">To'lov tizimi:</span>
                  <span className="text-teal-400 uppercase font-bold">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Holat:</span>
                  <span className="text-emerald-400 font-bold">KAFOLATLANGAN (ESCROW)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
