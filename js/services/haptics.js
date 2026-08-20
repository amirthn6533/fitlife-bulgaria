// ========================================
// FitLife Bulgaria — iOS Taptic Engine & Haptic Feedback Service
// ========================================

const HAPTIC_STORAGE_KEY = 'fitlife-haptics-enabled';

const HapticService = {
  isEnabled() {
    return localStorage.getItem(HAPTIC_STORAGE_KEY) !== 'false';
  },

  setEnabled(val) {
    localStorage.setItem(HAPTIC_STORAGE_KEY, val ? 'true' : 'false');
  },

  // ── Tactile Acoustic Micro-Click (Sub-bass synthesizer for desktop & mobile) ──
  playAcousticTick(freq = 110, duration = 0.04) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  // ── 1. Selection / Light Tap (Buttons, Tabs) ──
  selection() {
    if (!this.isEnabled()) return;
    this.playAcousticTick(140, 0.02);

    // Native Capacitor iOS Haptics
    if (window.Capacitor?.Plugins?.Haptics?.selectionChanged) {
      window.Capacitor.Plugins.Haptics.selectionChanged();
      return;
    }

    // W3C Vibration API fallback
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch (e) {}
    }
  },

  // ── 2. Heart / Like Double Pulse (Liking posts & stories) ──
  heart() {
    if (!this.isEnabled()) return;
    this.playAcousticTick(180, 0.03);
    setTimeout(() => this.playAcousticTick(240, 0.04), 60);

    if (window.Capacitor?.Plugins?.Haptics?.impact) {
      window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
      setTimeout(() => window.Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' }), 70);
      return;
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate([15, 40, 25]); } catch (e) {}
    }
  },

  // ── 3. Success / Complete (Workout set check, Run finish, Meal log) ──
  success() {
    if (!this.isEnabled()) return;
    this.playAcousticTick(200, 0.03);
    setTimeout(() => this.playAcousticTick(350, 0.05), 80);

    if (window.Capacitor?.Plugins?.Haptics?.notification) {
      window.Capacitor.Plugins.Haptics.notification({ type: 'SUCCESS' });
      return;
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate([15, 60, 20, 60, 35]); } catch (e) {}
    }
  },

  // ── 4. VIP Celebration Burst (Purchasing FitLife PRO, Breaking PRs) ──
  celebration() {
    if (!this.isEnabled()) return;
    this.playAcousticTick(300, 0.04);
    setTimeout(() => this.playAcousticTick(450, 0.05), 70);
    setTimeout(() => this.playAcousticTick(600, 0.08), 150);

    if (window.Capacitor?.Plugins?.Haptics?.notification) {
      window.Capacitor.Plugins.Haptics.notification({ type: 'SUCCESS' });
      setTimeout(() => window.Capacitor.Plugins.Haptics.impact({ style: 'HEAVY' }), 120);
      return;
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate([20, 50, 25, 50, 40, 60, 50]); } catch (e) {}
    }
  },

  // ── 5. Warning / Error ──
  warning() {
    if (!this.isEnabled()) return;
    this.playAcousticTick(90, 0.06);

    if (window.Capacitor?.Plugins?.Haptics?.notification) {
      window.Capacitor.Plugins.Haptics.notification({ type: 'WARNING' });
      return;
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate([40, 60, 40]); } catch (e) {}
    }
  }
};
