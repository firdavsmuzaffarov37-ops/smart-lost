import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { getAvatarForEmail, AVATAR_PRESETS } from '../data/initialData';
import LanguageSelector from '../components/common/LanguageSelector';
import {
  Compass,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Users,
  Search,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser, addToast, t, language } = useApp();
  const [email, setEmail] = useState('azizbek.r@example.uz');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast(
        language === 'uz'
          ? 'Iltimos, barcha maydonlarni to\'ldiring'
          : language === 'ru'
          ? 'Пожалуйста, заполните все поля'
          : 'Please fill in all fields',
        'warning'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      let account = storageService.findAccountByEmail(cleanEmail);

      const avatarUrl = selectedAvatar || (account ? account.avatar : getAvatarForEmail(cleanEmail));

      if (!account) {
        const rawName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = rawName
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        account = {
          id: `user-${Date.now()}`,
          name: formattedName || 'Foydalanuvchi',
          email: cleanEmail,
          phone: '+998 90 000 00 00',
          avatar: avatarUrl,
          verified: true,
          city: 'Tashkent',
          role: 'Verified Citizen',
          trustScore: 98,
          joinedDate: 'Bugun',
        };
        storageService.saveAccount(account);
      } else if (selectedAvatar && account.avatar !== selectedAvatar) {
        account = { ...account, avatar: selectedAvatar };
        storageService.saveAccount(account);
      }

      setCurrentUser(account);
      addToast(
        language === 'uz'
          ? `Xush kelibsiz, ${account.name}!`
          : language === 'ru'
          ? `Добро пожаловать, ${account.name}!`
          : `Welcome back, ${account.name}!`,
        'success'
      );
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  const handleQuickDemoUser = (userType) => {
    let targetEmail = '';
    if (userType === 'azizbek') targetEmail = 'azizbek.r@example.uz';
    else if (userType === 'malika') targetEmail = 'malika.u@example.uz';
    else if (userType === 'sherzod') targetEmail = 'sherzod.aliyev@example.uz';
    else if (userType === 'jasur') targetEmail = 'jasur.m@example.uz';
    else if (userType === 'nigora') targetEmail = 'nigora.k@example.uz';
    else if (userType === 'sardor') targetEmail = 'sardor.aliyev@gmail.com';

    let account = storageService.findAccountByEmail(targetEmail);
    if (!account) {
      account = {
        id: `user-${userType}`,
        name: userType.charAt(0).toUpperCase() + userType.slice(1),
        email: targetEmail,
        phone: '+998 90 123 45 67',
        avatar: getAvatarForEmail(targetEmail),
        verified: true,
        city: 'Tashkent',
        role: 'Verified Citizen',
        trustScore: 98,
        joinedDate: 'January 2025',
      };
      storageService.saveAccount(account);
    }
    setEmail(targetEmail);
    setPassword('demo1234');
    setSelectedAvatar(account.avatar);
    setCurrentUser(account);
    addToast(
      language === 'uz'
        ? `${account.name} sifatida tizimga kirildi`
        : language === 'ru'
        ? `Вы вошли как ${account.name}`
        : `Logged in as ${account.name}`,
      'success'
    );
    navigate('/');
  };

  const handleSocialLogin = (provider) => {
    let socialAccount = null;
    if (provider === 'Google') {
      const email = 'sardor.aliyev@gmail.com';
      socialAccount = storageService.findAccountByEmail(email) || {
        id: 'user-google-sardor',
        name: 'Sardor Aliyev',
        email,
        phone: '+998 97 123 45 67',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80',
        verified: true,
        city: 'Tashkent',
        role: 'Verified Citizen',
        trustScore: 100,
        joinedDate: 'Google Auth',
      };
    } else {
      const email = 'javohir.toshmatov@telegram.me';
      socialAccount = storageService.findAccountByEmail(email) || {
        id: 'user-tg-javohir',
        name: 'Javohir Toshmatov',
        email,
        phone: '+998 99 888 77 66',
        avatar:
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=240&h=240&q=80',
        verified: true,
        city: 'Tashkent',
        role: 'Telegram Verified',
        trustScore: 100,
        joinedDate: 'Telegram Auth',
      };
    }
    storageService.saveAccount(socialAccount);
    setCurrentUser(socialAccount);
    addToast(
      language === 'uz'
        ? `${socialAccount.name} (${provider}) akkaunti orqali tizimga kirildi!`
        : language === 'ru'
        ? `Вход через ${provider} выполнен (${socialAccount.name})!`
        : `Logged in via ${provider} as ${socialAccount.name}!`,
      'success'
    );
    navigate('/');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast(
      language === 'uz'
        ? `Parolni tiklash havolasi ${email} manziliga yuborildi!`
        : language === 'ru'
        ? `Ссылка для восстановления отправлена на ${email}!`
        : `Password recovery link sent to ${email}!`,
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
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
          
          {/* Left Column: Visual Showcase & Brand Value (hidden on mobile, visible on lg) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col space-y-8 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>
                {language === 'uz'
                  ? "O'zbekistondagi #1 Yo'qolgan va topilgan buyumlar tarmog'i"
                  : language === 'ru'
                  ? '№1 Сервис поиска вещей в Узбекистане'
                  : "Uzbekistan's #1 Lost & Found AI Platform"}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-tight">
                {language === 'uz' ? (
                  <>
                    Qadrli buyumlaringizni{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      AI yordamida
                    </span>{' '}
                    tez va oson toping
                  </>
                ) : language === 'ru' ? (
                  <>
                    Найдите ценные вещи{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      с помощью AI
                    </span>{' '}
                    быстро и надежно
                  </>
                ) : (
                  <>
                    Recover what matters most{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                      powered by AI
                    </span>{' '}
                    effortlessly
                  </>
                )}
              </h1>
              <p className="text-sm xl:text-base text-slate-400 leading-relaxed max-w-xl">
                {language === 'uz'
                  ? 'Smart AI taqqoslash, interaktiv xarita va tasdiqlangan fuqarolar hamjamiyati orqali hamyon, telefon, kalit yoki hujjatlaringizni xavfsiz qaytarib oling.'
                  : language === 'ru'
                  ? 'Умное AI-сопоставление, интерактивная карта и верифицированные пользователи помогут вернуть ваш телефон, кошелек, ключи или документы.'
                  : 'Smart AI matching, geolocation maps, and a verified citizen network connect lost belongings with their rightful owners safely.'}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  {language === 'uz' ? 'AI Moslashtirish' : language === 'ru' ? 'AI Сопоставление' : 'AI Matching'}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {language === 'uz' ? '98.4% aniqlikda rasm va parametrlar taqqoslanadi' : language === 'ru' ? 'Сравнение фото и деталей с точностью 98.4%' : 'Semantic keyword & visual match'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  {language === 'uz' ? 'Xarita qidiruvi' : language === 'ru' ? 'Карта находок' : 'Geo Tracking'}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {language === 'uz' ? 'Toshkent va butun respublika bo\'ylab manzillar' : language === 'ru' ? 'Точные локации по всему Узбекистану' : 'Interactive live map of Uzbekistan'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  {language === 'uz' ? '100% Xavfsiz' : language === 'ru' ? '100% Безопасно' : 'Verified & Safe'}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {language === 'uz' ? 'Maxfiy seriya raqami va egalikni tekshirish' : language === 'ru' ? 'Защита номеров и проверка владельца' : 'Secure masked ownership check'}
                </div>
              </div>
            </div>

            {/* Live Success Proof Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/70 to-indigo-950/40 border border-blue-500/20 backdrop-blur-md flex items-center gap-4">
              <div className="w-11 h-11 rounded-full ring-2 ring-blue-500/40 overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                  alt="Verified User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {language === 'uz' ? "Oxirgi muvaffaqiyatli topshiruv" : language === 'ru' ? 'Последний возврат' : 'Recent Reunite'}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'uz' ? 'Topildi' : language === 'ru' ? 'Возвращено' : 'Reunited'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {language === 'uz'
                    ? "Toshkent: AirPods Pro 2 soat ichida egasiga yetkazildi"
                    : language === 'ru'
                    ? "Ташкент: AirPods Pro переданы владельцу за 2 часа"
                    : "Tashkent: AirPods Pro reunited in less than 2 hours"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Authentication Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 relative">
              
              {/* Card Header & Tab Switcher */}
              <div className="space-y-4 mb-6">
                {/* Visual Pill Tabs for Kirish / Ro'yxatdan o'tish */}
                <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    className="py-2 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('auth.loginTab')}</span>
                  </button>
                  <Link
                    to="/register"
                    className="py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('auth.registerTab')}</span>
                  </Link>
                </div>

                <div className="text-left space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {t('auth.loginTitle')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t('auth.loginSubtitle')}
                  </p>
                </div>
              </div>

              {/* Fast 1-Click Demo Profiles */}
              <div className="mb-6 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('auth.quickDemoProfiles')}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    1-Click Login
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('azizbek')}
                    className="group relative p-2 rounded-2xl border border-blue-500/30 bg-blue-950/30 hover:bg-blue-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Azizbek"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-blue-200 truncate group-hover:text-blue-100">
                        Azizbek
                      </span>
                    </div>
                    <div className="text-[9px] text-blue-400/80 font-medium truncate">
                      {language === 'uz' ? 'Ega • 98%' : language === 'ru' ? 'Владелец' : 'Owner'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('malika')}
                    className="group relative p-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Malika"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-emerald-200 truncate group-hover:text-emerald-100">
                        Malika
                      </span>
                    </div>
                    <div className="text-[9px] text-emerald-400/90 font-medium truncate">
                      {language === 'uz' ? 'Topuvchi' : language === 'ru' ? 'Нашедший' : 'Finder'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('sherzod')}
                    className="group relative p-2 rounded-2xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Sherzod"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-amber-200 truncate group-hover:text-amber-100">
                        Sherzod
                      </span>
                    </div>
                    <div className="text-[9px] text-amber-400/90 font-medium truncate">
                      {language === 'uz' ? 'Xavfsizlik' : language === 'ru' ? 'Охрана' : 'Security'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('jasur')}
                    className="group relative p-2 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Jasur"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-indigo-200 truncate group-hover:text-indigo-100">
                        Jasur
                      </span>
                    </div>
                    <div className="text-[9px] text-indigo-400/90 font-medium truncate">
                      {language === 'uz' ? 'Fuqaro' : language === 'ru' ? 'Гражданин' : 'Citizen'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('nigora')}
                    className="group relative p-2 rounded-2xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Nigora"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-purple-200 truncate group-hover:text-purple-100">
                        Nigora
                      </span>
                    </div>
                    <div className="text-[9px] text-purple-400/90 font-medium truncate">
                      {language === 'uz' ? 'Ko\'ngilli' : language === 'ru' ? 'Волонтер' : 'Volunteer'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoUser('sardor')}
                    className="group relative p-2 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80"
                        alt="Sardor"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400 shrink-0"
                      />
                      <span className="text-[11px] font-bold text-cyan-200 truncate group-hover:text-cyan-100">
                        Sardor
                      </span>
                    </div>
                    <div className="text-[9px] text-cyan-400/90 font-medium truncate">
                      {language === 'uz' ? 'Talaba' : language === 'ru' ? 'Студент' : 'Student'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {language === 'uz' ? 'yoki boshqa akkaunt bilan kirish' : language === 'ru' ? 'или войти под другим аккаунтом' : 'or login with any account'}
                </span>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="azizbek.r@example.uz"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      {t('auth.password')}
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
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
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{t('auth.rememberMe')}</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.signInBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins */}
              <div className="mt-5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
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
                    onClick={() => handleSocialLogin('Telegram')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-[#229ED9]" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                    </svg>
                    <span>Telegram</span>
                  </button>
                </div>
              </div>

              {/* Bottom Switch to Register */}
              <div className="text-center text-xs text-slate-400 pt-5 mt-5 border-t border-slate-800/80">
                {t('auth.noAccount')}{' '}
                <Link
                  to="/register"
                  className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors"
                >
                  {t('auth.registerFree')}
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
