// ========================================
// FitLife Bulgaria — Subscriptions & VIP Membership Service
// ========================================

const SubscriptionService = {
  PREMIUM_STORAGE_KEY: 'fitlife-premium',
  PLAN_STORAGE_KEY: 'fitlife-subscription-plan',

  plans: {
    monthly: {
      id: 'plan_monthly',
      type: 'monthly',
      nameEn: 'FitLife PRO Monthly',
      nameBg: 'FitLife PRO Месечен',
      price: 9.90,
      period: '/ month',
      periodBg: '/ месец',
      badge: null,
      savings: null
    },
    yearly: {
      id: 'plan_yearly',
      type: 'yearly',
      nameEn: 'FitLife PRO Yearly',
      nameBg: 'FitLife PRO Годишен',
      price: 79.90,
      period: '/ year (6.65 BGN/mo)',
      periodBg: '/ година (6.65 лв/мес)',
      badge: '33% OFF',
      savings: 'Save 38.90 BGN'
    }
  },

  isPremium() {
    return localStorage.getItem(this.PREMIUM_STORAGE_KEY) === 'true';
  },

  getSubscription() {
    try {
      const plan = JSON.parse(localStorage.getItem(this.PLAN_STORAGE_KEY));
      return plan || (this.isPremium() ? { type: 'monthly', price: 9.90, active: true } : null);
    } catch (e) {
      return null;
    }
  },

  async activateSubscription(planType = 'yearly', paymentMethod = 'apple_pay') {
    const isBg = getLang() === 'bg';
    const plan = this.plans[planType] || this.plans.yearly;
    const user = getCurrentUser();

    // 1. Save locally
    localStorage.setItem(this.PREMIUM_STORAGE_KEY, 'true');
    const subRecord = {
      planType: plan.type,
      price: plan.price,
      currency: 'BGN',
      paymentMethod: paymentMethod,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (plan.type === 'yearly' ? 365 : 30) * 24 * 3600 * 1000).toISOString(),
      status: 'active'
    };
    localStorage.setItem(this.PLAN_STORAGE_KEY, JSON.stringify(subRecord));

    // 2. Update user profile in local and Supabase
    if (user) {
      user.premium = true;
      user.is_premium = true;
      if (typeof updateUser === 'function') updateUser(user);

      if (isSupabaseConnected()) {
        await supabaseClient.from('profiles').update({ is_premium: true }).eq('id', user.id);
        await supabaseClient.from('subscriptions').insert({
          user_id: user.id,
          plan_type: plan.type,
          price: plan.price,
          currency: 'BGN',
          status: 'active',
          current_period_start: subRecord.activatedAt,
          current_period_end: subRecord.expiresAt
        });
        await supabaseClient.from('wallet_transactions').insert({
          user_id: user.id,
          type: 'purchase',
          amount: plan.price,
          currency: 'BGN',
          status: 'completed',
          description: `FitLife PRO Subscription (${plan.type})`
        });
      }
    }

    // 3. Trigger celebratory VIP notification
    if (typeof NotificationService !== 'undefined') {
      NotificationService.notify(
        isBg ? '👑 Добре дошъл във FitLife PRO VIP!' : '👑 Welcome to FitLife PRO VIP!',
        isBg ? 'Всички премиум AI функции, планове и неограничени сканирания са отключени.' : 'All premium AI tools, diet plans, and unlimited scans are now unlocked!',
        { type: 'workout', icon: '👑' }
      );
    }

    return { success: true, subscription: subRecord };
  },

  async cancelSubscription() {
    localStorage.setItem(this.PREMIUM_STORAGE_KEY, 'false');
    localStorage.removeItem(this.PLAN_STORAGE_KEY);
    const user = getCurrentUser();
    if (user) {
      user.premium = false;
      user.is_premium = false;
      if (typeof updateUser === 'function') updateUser(user);
      if (isSupabaseConnected()) {
        await supabaseClient.from('profiles').update({ is_premium: false }).eq('id', user.id);
      }
    }
    return { success: true };
  }
};
