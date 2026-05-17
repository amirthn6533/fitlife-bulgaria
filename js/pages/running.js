// ========================================
// FitLife Bulgaria — Running Plan Page
// ========================================

function renderRunning() {
  const schedule = [
    { day: 'day_mon', type: 'running_easy', detail: '3 km • 6:30/km', dist: '3km' },
    { day: 'day_tue', type: 'running_intervals', detail: '4×400m fast + 400m jog', dist: '4km' },
    { day: 'day_wed', type: 'running_rest', detail: '🧘 Stretch & recover', dist: '—' },
    { day: 'day_thu', type: 'running_tempo', detail: '4 km • 5:45/km', dist: '4km' },
    { day: 'day_fri', type: 'running_easy', detail: '3 km • 6:30/km', dist: '3km' },
    { day: 'day_sat', type: 'running_long', detail: '6 km • 6:15/km', dist: '6km' },
    { day: 'day_sun', type: 'running_rest', detail: '🛌 Full rest', dist: '—' },
  ];

  const routes = [
    { name: 'Борисова градина', nameEn: 'Borisova Gradina', dist: '3.2km loop', icon: '🌳' },
    { name: 'Южен парк', nameEn: 'South Park', dist: '2.8km loop', icon: '🏞️' },
    { name: 'Витоша - Златни мостове', nameEn: 'Vitosha - Golden Bridges', dist: '5km trail', icon: '⛰️' },
    { name: 'НДК - Южен парк', nameEn: 'NDK to South Park', dist: '4km route', icon: '🏛️' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('workout')">←</button>
          <h1>${t('running_title')}</h1>
        </div>
      </div>

      <!-- Setup Form -->
      <div class="card" style="margin-bottom: var(--space-lg)">
        <div class="running-plan-form">
          <div class="form-group">
            <label class="form-label">${t('running_level')}</label>
            <div class="select-group">
              <button class="select-option active">${t('running_beginner')}</button>
              <button class="select-option">${t('running_intermediate')}</button>
              <button class="select-option">${t('running_advanced')}</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('running_goal')}</label>
            <div class="select-group">
              <button class="select-option active">5K</button>
              <button class="select-option">10K</button>
              <button class="select-option">Half</button>
              <button class="select-option">Marathon</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('running_days')}</label>
            <div class="select-group">
              <button class="select-option">3</button>
              <button class="select-option active">4</button>
              <button class="select-option">5</button>
              <button class="select-option">6</button>
            </div>
          </div>
          <button class="btn btn-primary btn-full" onclick="alert('🤖 AI generating running plan...')">
            ✨ ${t('running_generate')}
          </button>
        </div>
      </div>

      <!-- Schedule -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('running_schedule')}</h3>
          <span class="tag tag-accent">Week 1/8</span>
        </div>
        <div class="run-schedule">
          ${schedule.map((s, i) => `
            <div class="run-day-card" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.05}s">
              <div class="run-day-label">${t(s.day)}</div>
              <div class="run-day-info">
                <div class="run-day-type">${t(s.type)}</div>
                <div class="run-day-detail">${s.detail}</div>
              </div>
              <div class="run-day-distance">${s.dist}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sofia Routes -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('running_sofia_routes')}</h3>
          <button class="section-link" onclick="navigate('discover')">${t('common_see_all')}</button>
        </div>
        ${routes.map(r => `
          <div class="location-card" onclick="navigate('discover')">
            <div class="location-icon">${r.icon}</div>
            <div class="location-info">
              <div class="location-name">${getLang() === 'bg' ? r.name : r.nameEn}</div>
              <div class="location-distance">📏 ${r.dist}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
