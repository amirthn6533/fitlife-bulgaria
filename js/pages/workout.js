// ========================================
// FitLife Bulgaria — Workout Page
// ========================================

function renderWorkout() {
  const workoutPlan = [
    { muscle: 'workout_muscle_chest', icon: '🏋️', exercises: [
      { name: 'Bench Press', sets: 4, reps: 10, kg: 60 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, kg: 22 },
      { name: 'Cable Flyes', sets: 3, reps: 15, kg: 15 },
      { name: 'Chest Dips', sets: 3, reps: 12, kg: 0 },
    ]},
    { muscle: 'workout_muscle_back', icon: '🔙', exercises: [
      { name: 'Deadlift', sets: 4, reps: 8, kg: 100 },
      { name: 'Pull-Ups', sets: 4, reps: 10, kg: 0 },
      { name: 'Barbell Row', sets: 3, reps: 12, kg: 60 },
      { name: 'Lat Pulldown', sets: 3, reps: 12, kg: 50 },
    ]},
    { muscle: 'workout_muscle_legs', icon: '🦵', exercises: [
      { name: 'Squat', sets: 4, reps: 10, kg: 80 },
      { name: 'Leg Press', sets: 3, reps: 12, kg: 120 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, kg: 60 },
      { name: 'Leg Curl', sets: 3, reps: 15, kg: 35 },
    ]},
    { muscle: 'workout_muscle_shoulders', icon: '🏔️', exercises: [
      { name: 'Overhead Press', sets: 4, reps: 10, kg: 40 },
      { name: 'Lateral Raises', sets: 4, reps: 15, kg: 10 },
      { name: 'Face Pulls', sets: 3, reps: 15, kg: 20 },
    ]},
  ];

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('workout_title')}</h1>
        <button class="btn btn-sm btn-secondary" onclick="navigate('running')">
          ${t('workout_running')}
        </button>
      </div>

      <button class="btn btn-primary btn-full" style="margin-bottom: var(--space-lg)" onclick="alert('🤖 AI generating new plan...')">
        ✨ ${t('workout_generate')}
      </button>

      ${workoutPlan.map((group, gi) => `
        <div class="workout-plan-card" style="animation: slideUp 0.4s ease-out both; animation-delay: ${gi * 0.1}s">
          <div class="workout-header-row">
            <div>
              <span style="font-size:1.2rem">${group.icon}</span>
              <span class="muscle-group-tag">${t(group.muscle)}</span>
            </div>
            <span class="text-sm text-muted">${group.exercises.length} exercises</span>
          </div>
          <div class="exercise-list">
            ${group.exercises.map(ex => `
              <div class="exercise-item">
                <div class="exercise-info">
                  <div class="exercise-name">${ex.name}</div>
                  <div class="exercise-detail">${ex.sets} ${t('workout_sets')} × ${ex.reps} ${t('workout_reps')}${ex.kg ? ' • ' + ex.kg + t('workout_kg') : ''}</div>
                </div>
                <div class="exercise-check" role="button"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
