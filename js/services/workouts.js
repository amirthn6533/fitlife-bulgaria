// ========================================
// FitLife Bulgaria — Workout & Exercises Service
// ========================================

const WorkoutService = {
  async getExercises(muscleGroup = null) {
    return await dbFetch('exercises', query => {
      let q = query.order('name', { ascending: true });
      if (muscleGroup) q = q.eq('muscle_group', muscleGroup);
      return q;
    }, []);
  },

  async logWorkoutSession(sessionData) {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };
    
    return await dbInsert('user_workout_logs', {
      user_id: user.id,
      title: sessionData.title || 'Workout Session',
      started_at: sessionData.startedAt || new Date().toISOString(),
      completed_at: new Date().toISOString(),
      total_volume_kg: sessionData.totalVolume || 0,
      duration_seconds: sessionData.durationSeconds || 0,
      notes: sessionData.notes || ''
    });
  },

  async getUserStats() {
    const user = getCurrentUser();
    if (!user) return null;
    const stats = await dbFetch('user_stats', q => q.eq('user_id', user.id).single(), {
      current_streak: 12,
      total_workouts: 48,
      latest_weight_kg: 78
    });
    return stats;
  }
};
