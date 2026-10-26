import React, { useState } from 'react';
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
} from 'lucide-react';

export default function MessagesPage() {
  const navigate = useNavigate();
  const { conversations, currentUser, sendMessage } = useApp();
  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Where is the safest place to meet?',
    'Could you describe any unique scratches or serial numbers?',
    'I can pick it up today at the security desk.',
    'Thank you so much for keeping it safe!',
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Demo Safe Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">FindIt AI Safe Messenger (Demo Simulation):</span>{' '}
          All contacts are mediated within this private interface. Do not transfer funds upfront. Always hand off
          property in public, well-lit spaces like Metro Helpdesks or Police Booths.
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden h-[680px] grid grid-cols-1 md:grid-cols-12">
        {/* Left: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/70 bg-white">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Inbox ({conversations.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct discussions with finders and owners
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active conversations yet.
              </div>
            ) : (
              conversations.map((conv) => {
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
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {activeConv.otherUser.role || 'Community Finder'}
                  </span>
                </div>
              </div>

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
                    Related Item
                  </span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                    {activeConv.itemTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {/* Meetup Safety Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>Recommended Safe Meetup Point:</strong> Tashkent Metro Station Helpdesk or Mall Security.
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
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Quick:
              </span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 whitespace-nowrap transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to verify or coordinate return..."
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
            Select a conversation on the left to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
