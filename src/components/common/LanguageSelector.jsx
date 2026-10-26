import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useApp();
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span>{currentLang.short}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-1 overflow-hidden animate-in fade-in duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition-colors ${
                language === lang.code
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
