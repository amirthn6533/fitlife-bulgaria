// ========================================
// FitLife Bulgaria — Workout Page & Gym Rest Timer
// ========================================

const WORKOUT_DONE_KEY = 'fitlife-workout-done';
let workoutRestRemaining = 0;
let workoutRestInterval = null;

function getWorkoutDone() {
  try {
    return JSON.parse(localStorage.getItem(WORKOUT_DONE_KEY)) || [];
  } catch(e) { return []; }
}

function toggleWorkoutDone(exerciseId) {
  const done = getWorkoutDone();
  const idx = done.indexOf(exerciseId);
  const isCompleting = (idx < 0);

  if (idx >= 0) {
    done.splice(idx, 1);
  } else {
    done.push(exerciseId);
    // Auto-start 60s rest timer on completing a set!
    startRestTimer(60);
  }
  localStorage.setItem(WORKOUT_DONE_KEY, JSON.stringify(done));
  
  if (typeof HapticService !== 'undefined') {
    if (isCompleting) HapticService.success();
    else HapticService.selection();
  }
  if (typeof renderPage === 'function') renderPage();
}

function startRestTimer(seconds = 60) {
  if (workoutRestInterval) clearInterval(workoutRestInterval);
  workoutRestRemaining = seconds;

  workoutRestInterval = setInterval(() => {
    workoutRestRemaining--;
    const timerEl = document.getElementById('workout-rest-counter');
    if (timerEl) {
      timerEl.innerText = `${workoutRestRemaining}s`;
    }

    if (workoutRestRemaining <= 0) {
      clearInterval(workoutRestInterval);
      workoutRestInterval = null;
      if (typeof NotificationService !== 'undefined') {
        NotificationService.playChime('workout');
        NotificationService.showInAppBanner(
          getLang() === 'bg' ? '⏱️ Почивката свърши!' : '⏱️ Rest Over!',
          getLang() === 'bg' ? 'Време е за следващия сет! Давай мощно!' : 'Time for your next set! Let\'s crush it!',
          '⚡'
        );
      }
      if (typeof HapticService !== 'undefined') HapticService.success();
      if (typeof renderPage === 'function') renderPage();
    }
  }, 1000);

  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (typeof renderPage === 'function') renderPage();
}

function stopRestTimer() {
  if (workoutRestInterval) clearInterval(workoutRestInterval);
  workoutRestInterval = null;
  workoutRestRemaining = 0;
  if (typeof renderPage === 'function') renderPage();
}

function resetWorkoutToDefault() {
  localStorage.removeItem('fitlife-ai-custom-routine');
  localStorage.removeItem(WORKOUT_DONE_KEY);
  renderPage();
}

function renderWorkout() {
  const isBg = getLang() === 'bg';
  const customAiPlan = localStorage.getItem('fitlife-ai-custom-routine');
  let workoutPlan = null;
  let isAiPlan = false;

  if (customAiPlan) {
    try {
      workoutPlan = JSON.parse(customAiPlan);
      isAiPlan = true;
    } catch(e) {}
  }

  if (!workoutPlan) {
    workoutPlan = [
      { title: isBg ? 'Гърди' : 'Chest', muscle: 'workout_muscle_chest', icon: '🏋️', exercises: [
        { name: 'Bench Press', sets: 4, reps: '10', kg: 60 },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '12', kg: 22 },
        { name: 'Cable Flyes', sets: 3, reps: '15', kg: 15 },
        { name: 'Chest Dips', sets: 3, reps: '12', kg: 0 },
      ]},
      { title: isBg ? 'Гръб' : 'Back', muscle: 'workout_muscle_back', icon: '🔙', exercises: [
        { name: 'Deadlift', sets: 4, reps: '8', kg: 100 },
        { name: 'Pull-Ups', sets: 4, reps: '10', kg: 0 },
        { name: 'Barbell Row', sets: 3, reps: '12', kg: 60 },
        { name: 'Lat Pulldown', sets: 3, reps: '12', kg: 50 },
      ]},
      { title: isBg ? 'Крака' : 'Legs', muscle: 'workout_muscle_legs', icon: '🦵', exercises: [
        { name: 'Squat', sets: 4, reps: '10', kg: 80 },
        { name: 'Leg Press', sets: 3, reps: '12', kg: 120 },
        { name: 'Romanian Deadlift', sets: 3, reps: '10', kg: 60 },
        { name: 'Leg Curl', sets: 3, reps: '15', kg: 35 },
      ]},
      { title: isBg ? 'Рамене' : 'Shoulders', muscle: 'workout_muscle_shoulders', icon: '🏔️', exercises: [
        { name: 'Overhead Press', sets: 4, reps: '10', kg: 40 },
        { name: 'Lateral Raises', sets: 4, reps: '15', kg: 10 },
        { name: 'Face Pulls', sets: 3, reps: '15', kg: 20 },
      ]},
    ];
  }

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('workout_title')}</h1>
        <button class="btn btn-sm btn-secondary" onclick="navigate('running')">
          ${t('workout_running')}
        </button>
      </div>

      <!-- Gym Rest Timer Card -->
      <div class="card card-glow" style="background: rgba(255,255,255,0.04); border: 1px solid ${workoutRestRemaining > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}; margin-bottom: var(--space-md); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-lg);">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.3rem;">⏱️</span>
          <div>
            <div style="font-weight:800; font-size:var(--fs-xs); color:#fff;">
              ${isBg ? 'Таймер за почивка между сериите' : 'Between-Sets Rest Timer'}
            </div>
            ${workoutRestRemaining > 0 ? `
              <div style="font-size:11px; color:var(--accent); font-weight:bold;">
                ⏳ <span id="workout-rest-counter">${workoutRestRemaining}s</span> ${isBg ? 'остават...' : 'remaining...'}
              </div>
            ` : `
              <div class="text-xs text-muted" style="font-size:10px;">
                ${isBg ? 'Автоматично отброяване при изпълнено упражнение' : 'Auto-triggers upon checking a set'}
              </div>
            `}
          </div>
        </div>
        <div style="display:flex; gap:4px;">
          ${workoutRestRemaining > 0 ? `
            <button class="btn btn-sm btn-danger" onclick="stopRestTimer()" style="padding:4px 8px; font-size:10px;">⏹️ Stop</button>
          ` : `
            <button class="tag" style="cursor:pointer; font-size:10px; padding:4px 8px;" onclick="startRestTimer(45)">45s</button>
            <button class="tag tag-primary" style="cursor:pointer; font-size:10px; padding:4px 8px;" onclick="startRestTimer(60)">60s</button>
            <button class="tag" style="cursor:pointer; font-size:10px; padding:4px 8px;" onclick="startRestTimer(90)">90s</button>
          `}
        </div>
      </div>

      <!-- AI Coach Generator Banner -->
      <div class="card card-glow" style="background: linear-gradient(135deg, rgba(108,92,231,0.25), rgba(0,210,255,0.15)); border: 1px solid var(--accent); margin-bottom: var(--space-lg); padding: var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-xs);">
          <div style="display:flex; align-items:center; gap:var(--space-sm);">
            <span style="font-size:1.6rem;">🤖</span>
            <div>
              <div style="font-weight:900; font-size:var(--fs-md);">${isAiPlan ? (isBg ? 'Персонализиран AI План' : 'Active AI Custom Plan') : (isBg ? 'Генератор на тренировки' : 'AI Routine Generator')}</div>
              <div class="text-xs text-muted">${isAiPlan ? (isBg ? 'Оптимизиран специално за теб' : 'Tailored to your body & goals') : (isBg ? 'Създай нова програма за секунди' : 'Build a new science-based plan')}</div>
            </div>
          </div>
          ${isAiPlan ? `<span class="tag tag-accent" style="font-size:10px;">AI Active</span>` : ''}
        </div>
        <div style="display:flex; gap:var(--space-sm); margin-top:var(--space-sm);">
          <button class="btn btn-primary btn-full" onclick="openAICoachModal('generator')">
            ✨ ${isAiPlan ? (isBg ? 'Генерирай нов AI План' : 'Regenerate AI Plan') : t('workout_generate')}
          </button>
          ${isAiPlan ? `<button class="btn btn-ghost btn-sm" onclick="resetWorkoutToDefault()" title="Reset">${isBg ? 'По подразбиране' : 'Reset'}</button>` : ''}
        </div>
      </div>

      ${workoutPlan.map((group, gi) => `
        <div class="workout-plan-card" style="animation: slideUp 0.4s ease-out both; animation-delay: ${gi * 0.1}s">
          <div class="workout-header-row">
            <div>
              <span style="font-size:1.2rem">${group.icon || '💪'}</span>
              <span class="muscle-group-tag">${group.title || t(group.muscle)}</span>
            </div>
            <span class="text-sm text-muted">${group.exercises.length} ${isBg ? 'упражнения' : 'exercises'}</span>
          </div>
          <div class="exercise-list">
            ${group.exercises.map((ex, ei) => {
              const id = `ex-${gi}-${ei}`;
              const doneList = getWorkoutDone();
              const isDone = doneList.includes(id);
              return `
              <div class="exercise-item ${isDone ? 'done' : ''}">
                <div class="exercise-info">
                  <div class="exercise-name" style="${isDone ? 'text-decoration: line-through; opacity: 0.7' : ''}">${isBg ? (ex.nameBg || ex.name) : ex.name}</div>
                  <div class="exercise-detail">${ex.sets} ${t('workout_sets')} × ${ex.reps} ${t('workout_reps')}${ex.kg ? ' • ' + ex.kg + t('workout_kg') : ''}${ex.rest ? ' • ⏱️ ' + ex.rest : ''}</div>
                </div>
                <div class="exercise-check" role="button" onclick="toggleWorkoutDone('${id}')" style="${isDone ? 'background: var(--primary); border-color: var(--primary)' : ''}">
                  ${isDone ? '<span style="color:white">✓</span>' : ''}
                </div>
              </div>
            `}).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
