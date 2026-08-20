// ========================================
// FitLife Bulgaria — Marketplace & Coaches Service
// ========================================

const MarketplaceService = {
  async getCoaches(category = 'all', searchQuery = '') {
    return await dbFetch('coaches', q => {
      let query = q.order('rating', { ascending: false });
      if (category && category !== 'all') {
        query = query.contains('tags', [category]);
      }
      return query;
    }, []);
  },

  async getPlans() {
    return await dbFetch('marketplace_plans', q => q.order('rating', { ascending: false }), []);
  },

  async bookCoachSession(coachId, scheduledTime, amount) {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };

    return await dbInsert('coach_bookings', {
      coach_id: coachId,
      client_id: user.id,
      scheduled_time: scheduledTime,
      status: 'pending',
      amount: amount
    });
  }
};
