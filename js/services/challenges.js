// ========================================
// FitLife Bulgaria — Challenges & Escrow Service
// ========================================

const ChallengeService = {
  async getChallenges(filter = 'all') {
    return await dbFetch('challenges', q => {
      let query = q.order('created_at', { ascending: false });
      if (filter === 'wagered') query = query.eq('is_wagered', true);
      if (filter === 'free') query = query.eq('is_wagered', false);
      if (filter === 'completed') query = query.eq('status', 'completed');
      if (filter === 'active') query = query.eq('status', 'active');
      return query;
    }, []);
  },

  async joinChallenge(challengeId, stakeAmount = 0, currency = 'BGN') {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };

    return await dbInsert('challenge_participants', {
      challenge_id: challengeId,
      user_id: user.id,
      stake_paid: stakeAmount > 0,
      current_progress: 0,
      is_completed: false
    });
  }
};
