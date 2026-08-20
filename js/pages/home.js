// ========================================
// FitLife Bulgaria — Home Page
// ========================================

function renderHome() {
  const days = ['day_mon','day_tue','day_wed','day_thu','day_fri','day_sat','day_sun'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;
  const dateNums = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - adjustedToday + i);
    dateNums.push(d.getDate());
  }
  const workoutDays = [0, 1, 3, 4]; // Mon, Tue, Thu, Fri

  const user = getCurrentUser();
  const username = user?.fullName || (getLang() === 'bg' ? 'Спортист' : 'Athlete');
  return `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="home-greeting">
            <h2>${t('home_greeting')} 👋</h2>
            <h1 class="text-gradient">${username}</h1>
          </div>
        </div>
        <div class="lang-switch">
          <button class="lang-btn ${getLang()==='bg'?'active':''}" data-lang="bg" onclick="setLang('bg');document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang==='bg'));renderPage();">🇧🇬 BG</button>
          <button class="lang-btn ${getLang()==='en'?'active':''}" data-lang="en" onclick="setLang('en');document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang==='en'));renderPage();">🇬🇧 EN</button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-value">🔥 12</div>
          <div class="stat-label">${t('home_streak')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">48</div>
          <div class="stat-label">${t('home_workouts')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">78kg</div>
          <div class="stat-label">${t('home_weight')}</div>
        </div>
      </div>

      <!-- Week Strip -->
      <div class="week-strip">
        ${days.map((d, i) => `
          <div class="week-day ${i === adjustedToday ? 'active' : ''} ${workoutDays.includes(i) ? 'has-workout' : ''}">
            <span class="week-day-label">${t(d)}</span>
            <span class="week-day-num">${dateNums[i]}</span>
          </div>
        `).join('')}
      </div>

      <!-- Today's Plan -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('home_today')}</h3>
          <span class="tag tag-success">💪 ${t('workout_muscle_chest')} & ${t('workout_muscle_arms')}</span>
        </div>
        <div class="today-plan">
          <div class="exercise-list">
            <div class="exercise-item stagger-1" style="animation: slideUp 0.4s ease-out both">
              <div class="exercise-icon">🏋️</div>
              <div class="exercise-info">
                <div class="exercise-name">Bench Press</div>
                <div class="exercise-detail">4 ${t('workout_sets')} × 10 ${t('workout_reps')} • 60${t('workout_kg')}</div>
              </div>
              <div class="exercise-check" role="button"></div>
            </div>
            <div class="exercise-item stagger-2" style="animation: slideUp 0.4s ease-out both; animation-delay: 0.1s">
              <div class="exercise-icon">💪</div>
              <div class="exercise-info">
                <div class="exercise-name">Incline Dumbbell Press</div>
                <div class="exercise-detail">3 ${t('workout_sets')} × 12 ${t('workout_reps')} • 22${t('workout_kg')}</div>
              </div>
              <div class="exercise-check" role="button"></div>
            </div>
            <div class="exercise-item stagger-3" style="animation: slideUp 0.4s ease-out both; animation-delay: 0.15s">
              <div class="exercise-icon">🔄</div>
              <div class="exercise-info">
                <div class="exercise-name">Cable Flyes</div>
                <div class="exercise-detail">3 ${t('workout_sets')} × 15 ${t('workout_reps')} • 15${t('workout_kg')}</div>
              </div>
              <div class="exercise-check" role="button"></div>
            </div>
            <div class="exercise-item stagger-4" style="animation: slideUp 0.4s ease-out both; animation-delay: 0.2s">
              <div class="exercise-icon">💪</div>
              <div class="exercise-info">
                <div class="exercise-name">Barbell Curl</div>
                <div class="exercise-detail">4 ${t('workout_sets')} × 10 ${t('workout_reps')} • 30${t('workout_kg')}</div>
              </div>
              <div class="exercise-check" role="button"></div>
            </div>
            <div class="exercise-item stagger-5" style="animation: slideUp 0.4s ease-out both; animation-delay: 0.25s">
              <div class="exercise-icon">🔥</div>
              <div class="exercise-info">
                <div class="exercise-name">Tricep Dips</div>
                <div class="exercise-detail">3 ${t('workout_sets')} × 12 ${t('workout_reps')}</div>
              </div>
              <div class="exercise-check" role="button"></div>
            </div>
          </div>
          <button class="btn btn-primary btn-full" style="margin-top: var(--space-base)" onclick="navigate('workout')">
            ${t('home_start_workout')} →
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('home_upcoming')}</h3>
        </div>
        <div class="grid-2">
          <div class="card card-hover" onclick="navigate('nutrition')" style="cursor:pointer">
            <div style="font-size:1.8rem;margin-bottom:8px">🥗</div>
            <h4 style="font-size:var(--fs-base);margin-bottom:4px">${t('home_nutrition_plan')}</h4>
            <p class="text-sm text-muted">1850 ${t('nutrition_calories')}</p>
          </div>
          <div class="card card-hover" onclick="navigate('running')" style="cursor:pointer">
            <div style="font-size:1.8rem;margin-bottom:8px">🏃</div>
            <h4 style="font-size:var(--fs-base);margin-bottom:4px">${t('workout_running')}</h4>
            <p class="text-sm text-muted">5K Plan</p>
          </div>
          <div class="card card-hover" onclick="navigate('challenges')" style="cursor:pointer">
            <div style="font-size:1.8rem;margin-bottom:8px">🏆</div>
            <h4 style="font-size:var(--fs-base);margin-bottom:4px">${t('challenges_title')}</h4>
            <p class="text-sm text-muted">3 ${t('challenges_active').toLowerCase()}</p>
          </div>
          <div class="card card-hover" onclick="navigate('discover')" style="cursor:pointer">
            <div style="font-size:1.8rem;margin-bottom:8px">📍</div>
            <h4 style="font-size:var(--fs-base);margin-bottom:4px">${t('home_discover_sofia')}</h4>
            <p class="text-sm text-muted">${t('discover_gyms')}, ${t('discover_running')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
