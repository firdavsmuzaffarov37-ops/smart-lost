/**
 * Telegram Bot Notification Service for FindIt AI
 * Supports live bot messaging via Telegram Bot API or interactive demo simulation
 */

const STORAGE_KEY_TG = 'findit_telegram_settings';

export const telegramService = {
  getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      enabled: true,
      botUsername: 'FindItAi_Robot',
      userHandle: '@azizbek_rakhimov',
      chatId: '98451203',
      notifyOnMatch: true,
      notifyOnMessage: true,
      notifyOnReward: true,
    };
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY_TG, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  },

  /**
   * Format a rich markdown message for Telegram
   */
  formatMessage({ type, title, location, reward, matchScore, url, finderName, extra }) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let text = `🤖 <b>FindIt AI — Smart Bildirishnoma</b> [${timestamp}]\n\n`;

    if (type === 'MATCH') {
      text += `🎯 <b>AI YANGI MOSLIK TOPDI! (${matchScore || 95}%)</b>\n`;
      text += `📦 Buyum: <b>${title}</b>\n`;
      text += `📍 Joylashuv: <b>${location || 'Toshkent'}</b>\n`;
      if (reward) text += `💰 Suyunchi mukofoti: <b>${reward}</b>\n`;
      text += `\n🔍 E'lon bilan tanishish: ${url || window.location.origin}\n`;
    } else if (type === 'CLAIM') {
      text += `✨ <b>BUYUMINGIZ TOPILDI!</b>\n`;
      text += `👤 Topuvchi: <b>${finderName || 'Fuqaro'}</b>\n`;
      text += `📦 Buyum: <b>${title}</b>\n`;
      text += `💬 Topuvchi siz bilan bog'lanish uchun xabar qoldirdi.\n`;
    } else if (type === 'REWARD_PAID') {
      text += `💳 <b>SUYUNCHI TO'LOVI MUVAFFAQIYATLI O'TDI!</b>\n`;
      text += `💵 Miqdor: <b>${reward || '150,000 UZS'}</b>\n`;
      text += `📦 Buyum: <b>${title}</b>\n`;
      text += `✅ To'lov tizimi: Payme / Click orqali tasdiqlandi.\n`;
    } else {
      text += `📢 <b>YANGI BILDIRISHNOMA</b>\n`;
      text += `ℹ️ ${extra || title}\n`;
    }

    text += `\n🛡 <i>FindIt AI — O'zbekiston bo'ylab yo'qolgan narsalarni topish platformasi</i>`;
    return text;
  },

  /**
   * Send alert (real API if bot token present, or simulated instant notification)
   */
  async sendAlert(payload) {
    const settings = this.getSettings();
    if (!settings.enabled) return { success: false, reason: 'disabled' };

    const formattedHtml = this.formatMessage(payload);

    // If a custom bot token exists in localStorage, send live HTTP request
    const customToken = localStorage.getItem('findit_tg_custom_token');
    if (customToken && settings.chatId) {
      try {
        const resp = await fetch(`https://api.telegram.org/bot${customToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.chatId,
            text: formattedHtml,
            parse_mode: 'HTML',
          }),
        });
        const data = await resp.json();
        if (data.ok) return { success: true, mode: 'real', text: formattedHtml };
      } catch (err) {
        console.warn('Telegram API call failed, falling back to simulated:', err);
      }
    }

    // Play subtle audio chime for notification if browser allows
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext not allowed or not supported
    }

    // Dispatch custom DOM event so UI can display live Telegram alert badge or popover
    window.dispatchEvent(
      new CustomEvent('findit:telegram_alert', {
        detail: {
          payload,
          formattedHtml,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      })
    );

    return { success: true, mode: 'simulated', text: formattedHtml };
  },
};
