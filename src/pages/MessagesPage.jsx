import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  MapPin,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ChevronLeft,
  Phone,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  X,
  Paperclip,
  Smile,
} from 'lucide-react';

function playMessageChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (e) {
    // AudioContext not supported or allowed
  }
}

function getContextualReply(userMessage, contactName, itemTitle, language) {
  const text = (userMessage || '').toLowerCase();

  if (language === 'uz') {
    if (text.includes('salom') || text.includes('assalom') || text.includes('qale') || text.includes('privet')) {
      return `Assalomu alaykum! Ha, "${itemTitle || 'buyum'}" menda xavfsiz turibdi. Qachon va qayerda uchrashsak sizga ma'qul bo'ladi?`;
    }
    if (text.includes('qayerda') || text.includes('qatta') || text.includes('joy') || text.includes('adres') || text.includes('manzil')) {
      return `Men hozir Toshkent markazidaman (Amir Temur metro bekati yonidagi xizmat ko'rsatish shoxobchasi). Xavfsiz joyda bemalol uchrashib topshirishim mumkin.`;
    }
    if (text.includes('qachon') || text.includes('vaqt') || text.includes('soat')) {
      return `Bugun soat 17:30 dan 19:30 gacha bemalol vaqtim bor. Siz qaysi vaqtda kela olasiz?`;
    }
    if (text.includes('rahmat') || text.includes('tashakkur') || text.includes('raxmat') || text.includes('spasibo')) {
      return `Arzimaydi, asosiysi buyumingiz eson-omon topilgani! Har doim yordamga tayyorman, omon bo'ling!`;
    }
    if (text.includes('telefon') || text.includes('nomer') || text.includes('raqam') || text.includes('sms')) {
      return `Mening telefon raqamim: +998 90 123 45 67. Xohlasangiz qo'ng'iroq qiling yoki SMS yozing.`;
    }
    if (text.includes('ichida') || text.includes('hujjat') || text.includes('pasport') || text.includes('karta') || text.includes('pul')) {
      return `Ha, barcha ichki buyumlar, kartalar va hujjatlar joy-joyida turibdi, hech narsa kamaymagan.`;
    }
    if (text.includes('metro') || text.includes('bekat') || text.includes('xavfsiz')) {
      return `Ajoyib fikr! Metro xizmat ko'rsatish punkti yoki savdo markazi axborot bo'limida uchrashish eng xavfsizi.`;
    }
    return `Xabaringizni oldim! "${itemTitle || 'Buyum'}" sizga tegishli ekanligidan xursandman. Uchrashuv joyini kelishib olsak, darhol topshiraman.`;
  } else if (language === 'ru') {
    if (text.includes('привет') || text.includes('здравствуй') || text.includes('салом')) {
      return `Здравствуйте! Да, "${itemTitle}" в целости и сохранности. Где и когда вам удобно встретиться?`;
    }
    if (text.includes('где') || text.includes('адрес') || text.includes('место')) {
      return `Я нахожусь в Ташкенте (около метро Амир Темур). Можем безопасно встретиться на стойке информации.`;
    }
    if (text.includes('когда') || text.includes('время')) {
      return `Сегодня с 17:00 до 19:30 я свободен. Во сколько вам удобнее подъехать?`;
    }
    if (text.includes('спасибо') || text.includes('благодар')) {
      return `Пожалуйста! Главное, что вещь нашлась. Рад был помочь!`;
    }
    return `Ваше сообщение получил! Готов передать "${itemTitle}" в любое согласованное безопасное время.`;
  } else {
    if (text.includes('hi') || text.includes('hello') || text.includes('salom')) {
      return `Hello! Yes, the "${itemTitle}" is safe and secure with me. When and where would be convenient for you to meet?`;
    }
    if (text.includes('where') || text.includes('location')) {
      return `I am currently in central Tashkent (near the Amir Temur metro helpdesk). We can safely meet there.`;
    }
    if (text.includes('when') || text.includes('time')) {
      return `I will be available today between 17:00 and 19:30. What time works best for you?`;
    }
    if (text.includes('thank')) {
      return `You are very welcome! I'm glad it got safely returned to you.`;
    }
    return `Received your message! Looking forward to safely returning "${itemTitle}" to you.`;
  }
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { conversations, currentUser, sendMessage, addToast, t, language } = useApp();

  // Filter conversations for the logged-in user with fallback
  const userConversations = conversations.filter((c) => {
    if (!currentUser) return false;
    if (c.userId && c.userId === currentUser.id) return true;
    if (c.messages?.some((m) => m.senderId === currentUser.id)) return true;
    if (c.otherUser?.id === currentUser.id) return true;
    if (currentUser.id === 'user-azizbek' && c.id === 'conv-001') return true;
    if (currentUser.id === 'user-malika' && c.id === 'conv-002') return true;
    return true; // allow seeing active conversations
  });

  const [activeConversationId, setActiveConversationId] = useState(
    userConversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv =
    userConversations.find((c) => c.id === activeConversationId) || userConversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend.trim() : inputText.trim();
    if (!text || !activeConv) return;

    // 1. Send current user's message
    sendMessage(activeConv.id, text, currentUser?.id);
    setInputText('');

    // 2. Trigger smart contextual reply from the other person
    setIsTyping(true);
    setTimeout(() => {
      const reply = getContextualReply(
        text,
        activeConv.otherUser?.name,
        activeConv.itemTitle,
        language
      );
      sendMessage(activeConv.id, reply, activeConv.otherUser?.id);
      setIsTyping(false);
      playMessageChime();
    }, 1400);
  };

  const handleSendLocation = () => {
    const locText = language === 'uz'
      ? '📍 Toshkent Metro Bekati (Xavfsiz uchrashuv nuqtasi)'
      : language === 'ru'
      ? '📍 Станция метро Ташкент (Безопасная точка передачи)'
      : '📍 Tashkent Metro Station (Recommended safe meetup point)';
    handleSend(locText);
  };

  const quickPrompts = language === 'uz'
    ? [
        'Assalomu alaykum! Buyum sizdami?',
        'Qayerda va soat nechada uchrashamiz?',
        'Metro xizmat ko\'rsatish bekatidan olsam bo\'ladimi?',
        'Katta rahmat! Qayerga kelay?',
        'Telefon raqamingizni bera olasizmi?',
      ]
    : language === 'ru'
    ? [
        'Здравствуйте! Вещь у вас?',
        'Где и во сколько можем встретиться?',
        'Могу ли забрать сегодня на стойке охраны?',
        'Спасибо большое! Куда подъехать?',
        'Можете дать ваш номер телефона?',
      ]
    : [
        'Hello! Do you have the item with you?',
        'Where and what time is best to meet?',
        'Can I pick it up at the security desk today?',
        'Thank you so much! Where should I come?',
        'Could you share your phone number?',
      ];

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto my-12 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          {t('nav.messages')}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'uz'
            ? "Xabarlarni o'qish va muloqot qilish uchun tizimga kiring."
            : language === 'ru'
            ? 'Войдите в систему для просмотра сообщений.'
            : 'Please sign in to access your private messages.'}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          {t('nav.login')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Demo Safe Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
          <span>
            <strong className="font-bold">FindIt AI Xavfsiz Xabarlar & SMSlashish:</strong>{' '}
            Barcha suhbatlar shifrlangan va xavfsiz vositachilikda olib boriladi.
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Jonli SMS rejim faol
          </span>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden h-[680px] grid grid-cols-1 md:grid-cols-12">
        {/* Left: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/70 bg-white">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Suhbatlar ({userConversations.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Topuvchilar va buyum egalari bilan SMSlashish
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {userConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'uz' ? "Hozircha xabarlar yo'q." : "No active conversations yet."}
              </div>
            ) : (
              userConversations.map((conv) => {
                const isActive = conv.id === activeConv?.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                      isActive ? 'bg-white shadow-2xs border-l-4 border-l-blue-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.otherUser.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastTime}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 truncate">
                        Re: {conv.itemTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200/70 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConv.otherUser.avatar}
                  alt={activeConv.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {activeConv.otherUser.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeConv.otherUser.role || 'Community Member'} • Online
                  </span>
                </div>
              </div>

              {/* Actions Header (Phone / Direct SMS and Linked Item) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold cursor-pointer transition-colors"
                  title="Telefon yoki SMS orqali bog'lanish"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Telefon / SMS</span>
                </button>

                {/* Linked Item Pill */}
                <div
                  onClick={() => navigate(`/item/${activeConv.itemId}`)}
                  className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer shrink-0"
                >
                  <img
                    src={activeConv.itemImage}
                    alt="Item"
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Buyum
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[130px]">
                      {activeConv.itemTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {/* Meetup Safety Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Tavsiya etilgan xavfsiz joy:</strong> Toshkent Metro Bekatlari, YPX / IIB postlari yoki Aholi xizmat ko'rsatish markazlari.
                  </span>
                </div>
              </div>

              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                      {msg.time}
                      {isMe && <span className="text-blue-500 font-bold">✓✓</span>}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {activeConv.otherUser.name.split(' ')[0]} yozmoqda...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Tezkor:
              </span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
              <button
                type="button"
                onClick={handleSendLocation}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                title="Xavfsiz joylashuvni yuborish"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="SMS yoki xabaringizni yozing..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-8 text-slate-400 text-xs">
            Chap tomondan suhbatni tanlang.
          </div>
        )}
      </div>

      {/* Direct Phone & SMS Action Modal */}
      {isPhoneModalOpen && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Aloqa va SMS
              </span>
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={activeConv.otherUser.avatar}
              alt={activeConv.otherUser.name}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-emerald-100"
            />

            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {activeConv.otherUser.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeConv.otherUser.role || 'Topuvchi'}
              </p>
              <div className="mt-2 py-1.5 px-3 bg-slate-100 rounded-xl font-mono text-sm font-bold text-slate-800 inline-block">
                +998 90 123 45 67
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="tel:+998901234567"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Qo'ng'iroq qilish</span>
              </a>

              <a
                href="sms:+998901234567?body=Assalomu%20alaykum!%20FindIt%20AI%20orqali%20yozmoqdaman."
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Telefon SMS ilovasida ochish</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsPhoneModalOpen(false);
                  addToast('SMS yetkazildi! Javob qabul qilinmoqda...', 'success');
                  handleSend('Assalomu alaykum! Telefoningizga SMS yubordim, uchrashuv joyini kelishib olsak bo\'ladimi?');
                }}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tezkor SMS yozishma simulyatsiyasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
