import { sampleReports, sampleNotifications, sampleConversations, currentUser } from '../data/initialData';

const STORAGE_KEYS = {
  REPORTS: 'findit_reports_v1',
  NOTIFICATIONS: 'findit_notifications_v1',
  CONVERSATIONS: 'findit_conversations_v1',
  USER: 'findit_user_v1',
  LANGUAGE: 'findit_lang_v1',
};

export const storageService = {
  // Initialize storage with pre-seeded data if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(sampleReports));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(sampleNotifications));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sampleConversations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en');
    }
  },

  getReports() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      const parsed = data ? JSON.parse(data) : sampleReports;
      // Merge localized strings if missing
      return parsed.map((item) => {
        const sample = sampleReports.find((s) => s.id === item.id);
        if (sample) {
          return {
            ...item,
            titleUz: item.titleUz || sample.titleUz,
            titleRu: item.titleRu || sample.titleRu,
            descriptionUz: item.descriptionUz || sample.descriptionUz,
            descriptionRu: item.descriptionRu || sample.descriptionRu,
          };
        }
        return item;
      });
    } catch {
      return sampleReports;
    }
  },

  saveReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to cache reports locally:', e);
    }
  },

  getReportById(id) {
    const reports = this.getReports();
    return reports.find((r) => r.id === id) || null;
  },

  addReport(reportData) {
    const reports = this.getReports();
    const newReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      viewsCount: 1,
    };
    const updated = [newReport, ...reports];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));

    // Also create a notification
    this.addNotification({
      type: 'system',
      title: 'Report Published',
      message: `Your report "${newReport.title}" is now active and visible.`,
      itemId: newReport.id,
      timestamp: 'Just now',
      read: false,
      icon: 'CheckCircle',
    });

    return newReport;
  },

  updateReport(id, patch) {
    const reports = this.getReports();
    const updated = reports.map((r) => (r.id === id ? { ...r, ...patch } : r));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated.find((r) => r.id === id);
  },

  deleteReport(id) {
    const reports = this.getReports();
    const filtered = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
    return true;
  },

  getNotifications() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : sampleNotifications;
    } catch {
      return sampleNotifications;
    }
  },

  addNotification(notif) {
    const notifications = this.getNotifications();
    const newNotif = {
      ...notif,
      id: `notif-${Date.now()}`,
    };
    const updated = [newNotif, ...notifications];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return newNotif;
  },

  markNotificationRead(id) {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsRead() {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  getConversations() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : sampleConversations;
    } catch {
      return sampleConversations;
    }
  },

  sendMessage(conversationId, text, senderId = 'user-azizbek') {
    const conversations = this.getConversations();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId,
      text,
      time: timeStr,
      isSafeNotice: false,
    };

    const updated = conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastTime: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    return newMsg;
  },

  createConversation({ itemId, itemTitle, itemImage, otherUser, initialMessage }) {
    const conversations = this.getConversations();
    // Check if conversation already exists
    const existing = conversations.find(
      (c) => c.itemId === itemId && c.otherUser.id === otherUser.id
    );

    if (existing) {
      if (initialMessage) {
        this.sendMessage(existing.id, initialMessage);
      }
      return existing;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newConv = {
      id: `conv-${Date.now()}`,
      itemId,
      itemTitle,
      itemImage,
      otherUser,
      lastMessage: initialMessage || 'Started conversation',
      lastTime: 'Just now',
      unread: 0,
      messages: initialMessage
        ? [
            {
              id: `m-${Date.now()}`,
              senderId: 'user-azizbek',
              text: initialMessage,
              time: timeStr,
              isSafeNotice: false,
            },
          ]
        : [],
    };

    const updated = [newConv, ...conversations];
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    return newConv;
  },

  getCurrentUser() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : currentUser;
    } catch {
      return currentUser;
    }
  },

  updateCurrentUser(patch) {
    const user = this.getCurrentUser();
    const updated = { ...user, ...patch };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  getLanguage() {
    this.init();
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  },

  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(sampleReports));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(sampleNotifications));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sampleConversations));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en');
    return {
      reports: sampleReports,
      notifications: sampleNotifications,
      conversations: sampleConversations,
      user: currentUser,
    };
  },
};
