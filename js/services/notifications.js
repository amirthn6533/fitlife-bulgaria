// ========================================
// FitLife Bulgaria — Push Notifications & Smart Reminders Engine
// ========================================

const NotificationService = {
  settingsKey: 'fitlife-notification-settings',

  defaultSettings: {
    enabled: true,
    sound: true,
    workoutReminder: true,
    workoutTime: '18:00',
    waterReminder: true,
    waterIntervalHours: 2,
    mealReminder: true,
    streakSaver: true
  },

  getSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.settingsKey));
      return { ...this.defaultSettings, ...(saved || {}) };
    } catch (e) {
      return this.defaultSettings;
    }
  },

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(this.settingsKey, JSON.stringify(merged));
    this.scheduleTimers();
    return merged;
  },

  // ── Request Notification Permissions ──
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  },

  // ── Audio Beep / Chime (Web Audio API Synthesizer) ──
  playChime(type = 'success') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'workout') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      } else if (type === 'water') {
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.12); // C6
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  },

  // ── Dispatch Notification (Native Push + In-App Floating Toast) ──
  async notify(title, body, options = {}) {
    const settings = this.getSettings();
    const isBg = getLang() === 'bg';
    const icon = options.icon || '🔔';

    // 1. Play Sound
    if (settings.sound) {
      this.playChime(options.type || 'info');
    }

    // 2. In-App Floating Toast Banner
    this.showInAppBanner(title, body, icon);

    // 3. System / Browser Push Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: '/assets/icons/icon-192.png',
          badge: '/assets/icons/icon-192.png',
          vibrate: [200, 100, 200]
        });
      } catch (e) {}
    }

    // 4. Save to Notifications log in Supabase & localStorage
    this.saveNotificationToHistory({
      title,
      body,
      icon,
      type: options.type || 'system',
      created_at: new Date().toISOString(),
      is_read: false
    });
  },

  showInAppBanner(title, body, icon) {
    const existing = document.getElementById('fitlife-floating-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'fitlife-floating-banner';
    banner.style = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);width:90%;max-width:380px;background:rgba(18,24,40,0.92);border:1px solid rgba(0,210,255,0.4);box-shadow:0 10px 30px rgba(0,0,0,0.6),0 0 20px rgba(0,210,255,0.25);border-radius:var(--radius-lg);padding:12px 16px;z-index:10000;display:flex;align-items:center;gap:12px;backdrop-filter:blur(16px);animation:slideDown 0.35s cubic-bezier(0.175,0.885,0.32,1.275);cursor:pointer;';

    banner.innerHTML = `
      <div style="font-size:1.8rem;filter:drop-shadow(0 0 8px var(--accent));">${icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:800;font-size:0.88rem;color:#fff;margin-bottom:2px;">${title}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${body}</div>
      </div>
      <button onclick="document.getElementById('fitlife-floating-banner').remove(); event.stopPropagation();" style="background:transparent;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;padding:0 4px;">&times;</button>
    `;

    banner.onclick = () => {
      banner.remove();
      navigate('notifications');
    };

    document.body.appendChild(banner);

    setTimeout(() => {
      if (document.getElementById('fitlife-floating-banner')) {
        banner.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => banner.remove(), 400);
      }
    }, 4500);
  },

  saveNotificationToHistory(notif) {
    const list = dbLoad('user_notifications', []);
    list.unshift({ id: `notif_${Date.now()}`, ...notif });
    dbSave('user_notifications', list.slice(0, 30));

    // Save to Supabase if connected
    const user = getCurrentUser();
    if (user && isSupabaseConnected()) {
      supabaseClient.from('notifications').insert({
        recipient_id: user.id,
        title: notif.title,
        body: notif.body,
        icon: notif.icon,
        type: notif.type,
        is_read: false
      }).then(() => {});
    }
  },

  // ── Scheduler Engine (Runs in background) ──
  timerId: null,

  scheduleTimers() {
    if (this.timerId) clearInterval(this.timerId);
    
    // Check every 60 seconds
    this.timerId = setInterval(() => {
      this.checkAndTriggerScheduledReminders();
    }, 60000);
  },

  checkAndTriggerScheduledReminders() {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isBg = getLang() === 'bg';

    // 1. Workout Reminder
    if (settings.workoutReminder && currentHourMin === settings.workoutTime) {
      this.notify(
        isBg ? '🏋️ Време за тренировка!' : '🏋️ Time to Train!',
        isBg ? 'Твоят дневен тренировъчен план те очаква. Дай 100% от себе си!' : 'Your customized daily routine is waiting. Let\'s crush today\'s workout!',
        { type: 'workout', icon: '🔥' }
      );
    }

    // 2. Water Reminder (every N hours during active daytime 08:00 - 22:00)
    if (settings.waterReminder && now.getHours() >= 8 && now.getHours() <= 22) {
      if (now.getMinutes() === 0 && (now.getHours() % (settings.waterIntervalHours || 2) === 0)) {
        this.notify(
          isBg ? '💧 Време за хидратация' : '💧 Hydration Reminder',
          isBg ? 'Изпий чаша вода (300ml), за да поддържаш метаболизма и енергията си!' : 'Drink a glass of water (300ml) to keep your metabolism & muscles hydrated!',
          { type: 'water', icon: '💧' }
        );
      }
    }
  }
};

// Initialize scheduler on startup
NotificationService.scheduleTimers();
