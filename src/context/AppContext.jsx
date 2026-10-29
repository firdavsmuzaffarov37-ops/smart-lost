import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { supabaseService } from '../services/supabaseService';
import { checkSupabaseConnection } from '../services/supabaseClient';
import { translations } from '../data/translations';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguageState] = useState('uz');
  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState({
    checked: false,
    connected: false,
    tableReady: false,
    message: 'Connecting to Supabase...',
  });

  useEffect(() => {
    // 1. Initialize local cache first for instant UI response
    storageService.init();
    setReports(storageService.getReports());
    setNotifications(storageService.getNotifications());
    setConversations(storageService.getConversations());
    setCurrentUser(storageService.getCurrentUser());
    setLanguageState(storageService.getLanguage());

    // 2. Connect to Supabase and sync cloud reports
    async function initSupabase() {
      const conn = await checkSupabaseConnection();
      setSupabaseStatus({
        checked: true,
        connected: conn.connected,
        tableReady: conn.tableReady ?? false,
        message: conn.message || conn.error || '',
      });

      if (conn.connected) {
        const cloudReports = await supabaseService.getReports();
        if (cloudReports && cloudReports.length > 0) {
          setReports(cloudReports);
          storageService.saveReports(cloudReports);
        }
      }
    }

    initSupabase();
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
    storageService.setLanguage(lang);
    addToast(
      lang === 'uz' ? "Til o'zgartirildi: O'zbekcha" : lang === 'ru' ? 'Язык изменен: Русский' : 'Language changed: English',
      'info'
    );
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        let fallback = translations.en;
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  const addReport = (reportData) => {
    const created = storageService.addReport({
      ...reportData,
      userId: currentUser?.id || 'user-azizbek',
      reporterName: currentUser?.name || 'Azizbek Rakhimov',
      reporterAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&h=240&q=80',
    });

    setReports(storageService.getReports());
    setNotifications(storageService.getNotifications());

    // Asynchronously push to Supabase Cloud
    supabaseService.createReport(created).catch((err) => {
      console.warn('Supabase cloud push error (saved locally):', err);
    });

    addToast(
      created.type === 'lost'
        ? (language === 'uz' ? "Yo'qolgan buyum e'loni muvaffaqiyatli chop etildi!" : language === 'ru' ? "Объявление о пропаже опубликовано!" : 'Lost item report published successfully!')
        : (language === 'uz' ? "Topib olingan buyum ro'yxatdan o'tdi va 'Topib olinganlar' sahifasiga chiqdi!" : language === 'ru' ? "Найденная вещь успешно добавлена в список!" : 'Found item registered successfully! Thank you for helping.'),
      'success'
    );

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
    return created;
  };

  const updateReport = (id, patch) => {
    const updated = storageService.updateReport(id, patch);
    setReports(storageService.getReports());

    // Asynchronously update in Supabase
    supabaseService.updateReport(id, patch).catch((err) => {
      console.warn('Supabase update error (saved locally):', err);
    });

    if (!patch.silent) {
      addToast(
        language === 'uz'
          ? "E'lon muvaffaqiyatli yangilandi."
          : language === 'ru'
          ? "Объявление успешно обновлено."
          : 'Report updated successfully.',
        'success'
      );
    }
    return updated;
  };

  const deleteReport = (id) => {
    storageService.deleteReport(id);
    setReports(storageService.getReports());

    // Asynchronously delete in Supabase
    supabaseService.deleteReport(id).catch((err) => {
      console.warn('Supabase delete error (deleted locally):', err);
    });

    addToast('Report deleted.', 'info');
  };

  const markNotificationRead = (id) => {
    const updated = storageService.markNotificationRead(id);
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = storageService.markAllNotificationsRead();
    setNotifications(updated);
    addToast('All notifications marked as read.', 'info');
  };

  const sendMessage = (conversationId, text, customSenderId) => {
    const sender = customSenderId || currentUser?.id;
    const msg = storageService.sendMessage(conversationId, text, sender);
    setConversations(storageService.getConversations());
    return msg;
  };

  const createConversation = (params) => {
    const conv = storageService.createConversation(params);
    setConversations(storageService.getConversations());
    return conv;
  };

  const resetAllData = () => {
    const res = storageService.resetAllData();
    setReports(res.reports);
    setNotifications(res.notifications);
    setConversations(res.conversations);
    setCurrentUser(res.user);
    setLanguageState('en');

    // Attempt to seed back to Supabase
    supabaseService.seedInitialReports().catch(() => {});

    addToast('All demo data has been reset to original state.', 'info');
  };

  const handleSetCurrentUser = (userOrFn) => {
    if (typeof userOrFn === 'function') {
      setCurrentUser((prev) => {
        const next = userOrFn(prev);
        if (next) storageService.saveCurrentUser(next);
        return next;
      });
    } else {
      setCurrentUser(userOrFn);
      if (userOrFn) {
        storageService.saveCurrentUser(userOrFn);
      }
    }
  };

  const updateCurrentUser = (patch) => {
    const updated = storageService.updateCurrentUser(patch);
    setCurrentUser(updated);
    return updated;
  };

  const logout = () => {
    storageService.clearCurrentUser();
    setCurrentUser(null);
    addToast(
      language === 'uz'
        ? "Akkauntdan chiqildi. Shaxsiy ma'lumotlar tozalandi."
        : language === 'ru'
        ? 'Вы вышли из системы. Личные данные очищены.'
        : 'Logged out. Personal session cleared.',
      'info'
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unread || 0), 0);

  return (
    <AppContext.Provider
      value={{
        reports,
        notifications,
        conversations,
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        updateCurrentUser,
        logout,
        language,
        setLanguage,
        t,
        addReport,
        updateReport,
        deleteReport,
        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
        createConversation,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        globalSearch,
        setGlobalSearch,
        unreadNotificationsCount,
        unreadMessagesCount,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        supabaseStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
