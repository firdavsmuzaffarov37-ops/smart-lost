import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LanguageSelector from '../components/common/LanguageSelector';
import { citiesInUzbekistan } from '../data/initialData';
import confetti from 'canvas-confetti';
import {
  Compass,
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Zap,
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setCurrentUser, addToast, t, language } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [city, setCity] = useState('Tashkent');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', percent: 0, color: 'bg-slate-700' };
    if (password.length < 5) {
      return {
        label: language === 'uz' ? 'Zaif' : language === 'ru' ? 'Слабый' : 'Weak',
        percent: 30,
        color: 'bg-rose-500',
      };
    }
    if (password.length < 8) {
      return {
        label: language === 'uz' ? "O'rtacha" : language === 'ru' ? 'Средний' : 'Medium',
        percent: 65,
        color: 'bg-amber-500',
      };
    }
    return {
      label: language === 'uz' ? 'Kuchli' : language === 'ru' ? 'Надежный' : 'Strong',
      percent: 100,
      color: 'bg-emerald-500',
    };
  };

  const strength = getPasswordStrength();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      addToast(
        language === 'uz'
          ? 'Iltimos, barcha kerakli maydonlarni to\'ldiring'
          : language === 'ru'
          ? 'Пожалуйста, заполните все обязательные поля'
          : 'Please fill in all required fields',
        'warning'
      );
      return;
    }

    if (!agreedToTerms) {
      addToast(
        language === 'uz'
          ? 'Iltimos, xizmat shartlariga rozilik bildiring'
          : language === 'ru'
          ? 'Пожалуйста, примите условия сервиса'
          : 'Please accept the terms and conditions',
        'warning'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser({
        id: `user-${Date.now()}`,
        name,
        email,
        phone: phone.trim() || '+998 90 000 00 00',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
        verified: true,
        city,
        role: 'Community Member',
        trustScore: 100,
        joinedDate: 'Just now',
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // fallback
      }

      addToast(
        language === 'uz'
          ? `Akkaunt muvaffaqiyatli yaratildi! Xush kelibsiz, ${name}.`
          : language === 'ru'
          ? `Аккаунт успешно создан! Добро пожаловать, ${name}.`
          : `Account created! Welcome to FindIt AI, ${name}.`,
        'success'
      );

      setIsLoading(false);
      navigate('/');
    }, 450);
  };

  const handleSocialRegister = (provider) => {
    const demoName = provider === 'Google' ? 'Sardor Aliyev' : 'Javohir Toshmatov';
    setCurrentUser({
      id: `user-social-${Date.now()}`,
      name: demoName,
      email: `${demoName.toLowerCase().replace(' ', '.')}@example.uz`,
      phone: '+998 97 123 45 67',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&h=240&q=80',
      verified: true,
      city: 'Tashkent',
      role: 'Verified Citizen',
      trustScore: 100,
      joinedDate: 'Just now',
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {}

    addToast(
      language === 'uz'
        ? `${provider} orqali ro'yxatdan muvaffaqiyatli o'tildi!`
        : language === 'ru'
        ? `Регистрация через ${provider} успешно завершена!`
        : `Registered via ${provider} successfully!`,
      'success'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="FindIt AI Logo"
            className="w-10 h-10 rounded-2xl object-cover shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                FindIt
              </span>
              <span className="text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xs">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider font-medium hidden sm:block">
              {language === 'uz'
                ? "Yo'qolgan buyumlar qidiruv tarmog'i"
                : language === 'ru'
                ? 'Сервис поиска потерянных вещей'
                : 'Lost & Found Intelligent Network'}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('auth.backToHome')}</span>
            <span className="sm:hidden">{language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}</span>
          </Link>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-0.5 border border-slate-700/60">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center">
        <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Showcase & Community Proof */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col space-y-8 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>
                {language === 'uz'
                  ? "Hamjamiyatga qo'shiling va 1 daqiqada e'lon bering"
                  : language === 'ru'
                  ? 'Присоединяйтесь и создайте заявку за 1 минуту'
                  : 'Join the community & submit reports in 1 minute'}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-tight">
                {language === 'uz' ? (
                  <>
                    Birgalikda buyumlarni{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      o'z egalariga
                    </span>{' '}
                    qaytaramiz
                  </>
                ) : language === 'ru' ? (
                  <>
                    Возвращаем вещи{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      законным владельцам
                    </span>{' '}
                    вместе с вами
                  </>
                ) : (
                  <>
                    Join the movement to{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      reunite lost items
                    </span>{' '}
                    across Uzbekistan
                  </>
                )}
              </h1>
              <p className="text-sm xl:text-base text-slate-400 leading-relaxed max-w-xl">
                {language === 'uz'
                  ? "Hisobingiz orqali yo'qolgan buyumingiz haqida e'lon bering, AI mos kelgan yangiliklarni kuzating va topilgan narsalarni egalariga xavfsiz yetkazishga yordam bering."
                  : language === 'ru'
                  ? 'Создавайте объявления о пропаже, получайте автоматические уведомления от AI при совпадениях и помогайте возвращать найденные вещи.'
                  : 'Report lost belongings, receive automated instant AI match alerts, and help fellow citizens recover items safely.'}
              </p>
            </div>

            {/* Platform Stats & Trust Card */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="text-2xl font-black text-white mb-0.5">1,240+</div>
                <div className="text-xs font-semibold text-blue-400">
                  {language === 'uz' ? 'Topilgan buyumlar' : language === 'ru' ? 'Найдено вещей' : 'Items Reunited'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'uz' ? 'Muvaffaqiyatli yakun' : language === 'ru' ? 'Успешные возвраты' : 'Safe returns'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="text-2xl font-black text-white mb-0.5">99.4%</div>
                <div className="text-xs font-semibold text-emerald-400">
                  {language === 'uz' ? 'AI Aniqligi' : language === 'ru' ? 'Точность AI' : 'AI Accuracy'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'uz' ? 'Moslik darajasi' : language === 'ru' ? 'Степень совпадения' : 'Match confidence'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="text-2xl font-black text-white mb-0.5">8</div>
                <div className="text-xs font-semibold text-indigo-400">
                  {language === 'uz' ? 'Katta shahar' : language === 'ru' ? 'Крупных городов' : 'Main Cities'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {language === 'uz' ? 'O\'zbekiston bo\'ylab' : language === 'ru' ? 'По Узбекистану' : 'All regions'}
                </div>
              </div>
            </div>

            {/* Safety Guarantee */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/70 to-blue-950/40 border border-indigo-500/20 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">
                  {language === 'uz' ? 'Shaxsiy ma\'lumotlar to\'liq himoyalangan' : language === 'ru' ? 'Полная конфиденциальность данных' : 'Privacy First Guarantee'}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'uz'
                    ? "Telefon raqamingiz faqat tasdiqlangan va o'zaro kelishilgan holatda ko'rinadi."
                    : language === 'ru'
                    ? "Ваш номер телефона виден только после подтверждения владения вещью."
                    : "Your phone number is only revealed upon mutual verified claim confirmation."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Register Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 relative">
              
              {/* Card Header & Tab Switcher */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <Link
                    to="/login"
                    className="py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('auth.loginTab')}</span>
                  </Link>
                  <button
                    type="button"
                    className="py-2 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('auth.registerTab')}</span>
                  </button>
                </div>

                <div className="text-left space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {t('auth.registerTitle')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t('auth.registerSubtitle')}
                  </p>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth.fullName')} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Azizbek Rakhimov"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('auth.email')} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="azizbek@mail.uz"
                        required
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('auth.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth.primaryCity')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition-all cursor-pointer appearance-none"
                    >
                      {citiesInUzbekistan.map((c) => (
                        <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                          {c.name} ({c.region})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth.password')} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{language === 'uz' ? 'Parol mustahkamligi' : language === 'ru' ? 'Надежность' : 'Strength'}:</span>
                        <span className="font-bold text-slate-300">{strength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded-sm border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="leading-tight">
                      {t('auth.termsAgree')}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.completeRegistration')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Signup */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialRegister('Google')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialRegister('Telegram')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-[#229ED9]" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                    </svg>
                    <span>Telegram</span>
                  </button>
                </div>
              </div>

              {/* Bottom Switch to Login */}
              <div className="text-center text-xs text-slate-400 pt-4 mt-4 border-t border-slate-800/80">
                {t('auth.alreadyRegistered')}{' '}
                <Link
                  to="/login"
                  className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors"
                >
                  {t('auth.logInHere')}
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal Notice */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <div>© 2025 FindIt AI Uzbekistan. {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : language === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="hover:text-slate-400 cursor-pointer">{language === 'uz' ? 'Maxfiylik siyosati' : language === 'ru' ? 'Конфиденциальность' : 'Privacy Policy'}</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">{language === 'uz' ? 'Foydalanish shartlari' : language === 'ru' ? 'Условия' : 'Terms'}</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">{language === 'uz' ? 'Xavfsizlik' : language === 'ru' ? 'Безопасность' : 'Security'}</span>
        </div>
      </footer>
    </div>
  );
}
