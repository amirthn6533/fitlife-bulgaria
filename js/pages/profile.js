// ========================================
// FitLife Bulgaria — Profile Page
// ========================================

function renderProfile() {
  const user = getCurrentUser() || {};
  const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'A';
  const settings = [
    { icon: '🌐', label: 'profile_language', value: getLang() === 'bg' ? 'Български' : 'English', action: 'lang' },
    { icon: '🔔', label: 'profile_notifications', value: '', action: 'toggle', id: 'toggle-notifications' },
    { icon: '🏋️', label: 'profile_coach_mode', value: '', action: 'toggle', id: 'toggle-coach' },
    { icon: '🌙', label: 'profile_dark_mode', value: '', action: 'toggle-on', id: 'toggle-darkmode' },
    { icon: '⚡', label: 'common_database', value: isSupabaseConnected() ? 'Supabase 🟢' : 'Local 🟡', action: 'supabase-modal' },
    { icon: '💳', label: 'wallet_title', value: '245 BGN', action: 'nav-wallet' },
    { icon: '🔖', label: 'profile_saved', value: '12', action: '' },
    { icon: '📋', label: 'profile_plans', value: '3', action: '' },
  ];

  const html = `
    <div class="page">
      <div class="page-header">
        <h1>${t('profile_title')}</h1>
        <div class="lang-switch">
          <button class="lang-btn ${getLang()==='bg'?'active':''}" data-lang="bg" onclick="setLang('bg');document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang==='bg'));renderPage();">🇧🇬</button>
          <button class="lang-btn ${getLang()==='en'?'active':''}" data-lang="en" onclick="setLang('en');document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang==='en'));renderPage();">🇬🇧</button>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar-wrap">
          <div class="avatar avatar-xl">${initials}</div>
          <button class="profile-edit-btn" onclick="authScreen='onboarding'; renderPage();">✏️</button>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
          <div class="profile-name">${user.fullName || (getLang() === 'bg' ? 'Спортист' : 'Athlete')}</div>
          ${localStorage.getItem('fitlife-premium') === 'true' ? '<span class="tag" style="background:linear-gradient(135deg,#FFD700,#FF7675);color:#000;font-weight:900;font-size:10px;border:none;box-shadow:0 0 10px rgba(255,215,0,0.5);">👑 VIP PRO</span>' : ''}
        </div>
        <div style="margin: var(--space-sm) 0; display:flex; gap: var(--space-sm); flex-wrap: wrap;">
          <span class="tag ${user.emailVerified ? 'tag-success' : 'tag-warning'}" style="border:none;">${user.emailVerified ? (getLang()==='bg' ? 'Имейл потвърден' : 'Email Verified') : (getLang()==='bg' ? 'Имейл непотвърден' : 'Email Pending')}</span>
          <span class="tag ${user.phoneVerified ? 'tag-success' : 'tag-warning'}" style="border:none;">${user.phoneVerified ? (getLang()==='bg' ? 'Телефон потвърден' : 'Phone Verified') : (getLang()==='bg' ? 'Телефон непотвърден' : 'Phone Pending')}</span>
        </div>
        <div class="profile-bio">${user.profile?.bio || (getLang()==='bg' ? '💪 Фитнес ентусиаст | 🏃 Бегач | София' : '💪 Fitness enthusiast | 🏃 Runner | Sofia')}</div>
        <div class="profile-follow-stats">
          <div class="profile-follow-stat">
            <div class="profile-follow-num">12</div>
            <div class="profile-follow-label">${t('profile_followers')}</div>
          </div>
          <div class="profile-follow-stat">
            <div class="profile-follow-num">8</div>
            <div class="profile-follow-label">${t('profile_following')}</div>
          </div>
          <div class="profile-follow-stat">
            <div class="profile-follow-num">${(typeof dbLoad === 'function' ? dbLoad('user_created_posts', []) : []).length}</div>
            <div class="profile-follow-label">${t('profile_posts')}</div>
          </div>
        </div>
      </div>

      <!-- FitLife PRO Upgrade / VIP Membership Banner -->
      <div class="card card-glow" onclick="showPremiumModal()" style="margin-bottom: var(--space-md); cursor:pointer; background: ${localStorage.getItem('fitlife-premium') === 'true' ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(108,92,231,0.2))' : 'linear-gradient(135deg, rgba(108,92,231,0.25), rgba(255,75,43,0.2))'}; border: 1px solid ${localStorage.getItem('fitlife-premium') === 'true' ? '#FFD700' : 'var(--accent)'}; border-radius: var(--radius-lg); padding: var(--space-md); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:var(--space-sm);">
          <span style="font-size:1.8rem; filter:drop-shadow(0 0 10px rgba(255,215,0,0.5));">👑</span>
          <div>
            <div style="font-weight:900; font-size:var(--fs-md); color:#fff;">${localStorage.getItem('fitlife-premium') === 'true' ? (getLang()==='bg'?'FitLife PRO Членство':'FitLife PRO VIP Member') : (getLang()==='bg'?'Отключи FitLife PRO':'Upgrade to FitLife PRO')}</div>
            <div class="text-xs text-muted">${localStorage.getItem('fitlife-premium') === 'true' ? (getLang()==='bg'?'Управление на абонамента':'Manage your VIP subscription') : (getLang()==='bg'?'Неограничен AI, скенер & VIP пулове':'Unlimited AI, Scans & VIP Pools')}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-primary" style="background:linear-gradient(135deg,#FFD700,#FF7675);color:#000;font-weight:900;border:none;">
          ${localStorage.getItem('fitlife-premium') === 'true' ? (getLang()==='bg'?'VIP План':'VIP Plan') : (getLang()==='bg'?'👑 Отключи':'👑 Upgrade')}
        </button>
      </div>

      <button class="btn btn-secondary btn-full" style="margin-bottom: var(--space-xl)" onclick="authScreen='onboarding'; renderPage();">${t('profile_edit')}</button>

      <!-- Stats -->
      <div class="grid-4" style="margin-bottom: var(--space-md)">
        <div class="stat-card">
          <div style="font-size:1.2rem">🔥</div>
          <div class="stat-value" style="font-size:var(--fs-lg)">12</div>
          <div class="stat-label">${t('home_streak')}</div>
        </div>
        <div class="stat-card">
          <div style="font-size:1.2rem">🏋️</div>
          <div class="stat-value" style="font-size:var(--fs-lg)">48</div>
          <div class="stat-label">${t('home_workouts')}</div>
        </div>
        <div class="stat-card">
          <div style="font-size:1.2rem">🏆</div>
          <div class="stat-value" style="font-size:var(--fs-lg)">7</div>
          <div class="stat-label">PRs</div>
        </div>
        <div class="stat-card">
          <div style="font-size:1.2rem">🎯</div>
          <div class="stat-value" style="font-size:var(--fs-lg)">3</div>
          <div class="stat-label">${t('challenges_title')}</div>
        </div>
      </div>

      <!-- Analytics & Progress Link Card -->
      <div class="card card-glow" onclick="navigate('analytics')" style="margin-bottom: var(--space-xl); cursor:pointer; background:linear-gradient(135deg, rgba(0,210,255,0.12), rgba(108,92,231,0.18)); border:1px solid var(--accent); border-radius:var(--radius-lg); padding:var(--space-md); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:var(--space-sm);">
          <span style="font-size:1.8rem; filter:drop-shadow(0 0 10px var(--accent));">📊</span>
          <div>
            <div style="font-weight:900; font-size:var(--fs-md); color:#fff;">${getLang()==='bg'?'Анализ & Графики на Прогреса':'Analytics & Body Progress'}</div>
            <div class="text-xs text-muted">${getLang()==='bg'?'Тегло, Big 3 рекорди и калориен баланс':'Weight trend, 1RM strength & calories'}</div>
          </div>
        </div>
        <span style="font-size:1.4rem; color:var(--accent); font-weight:bold;">›</span>
      </div>

      <!-- Settings -->
      <div class="section">
        <h3 class="section-title" style="margin-bottom: var(--space-md)">${t('profile_settings')}</h3>
        <div class="settings-list">
          ${settings.map(s => `
            <div class="settings-item" ${s.action === 'nav-wallet' ? 'onclick="navigate(\'wallet\')"' : ''} ${s.action === 'lang' ? 'data-action="lang"' : ''} ${s.action === 'supabase-modal' ? 'onclick="showSupabaseConfigModal()"' : ''} style="cursor: pointer">
              <div class="settings-icon">${s.icon}</div>
              <div class="settings-label">${t(s.label)}</div>
              ${s.action === 'toggle' ? `
                <label class="toggle"><input type="checkbox" ${s.id ? `id="${s.id}"` : ''}><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              ` : s.action === 'toggle-on' ? `
                <label class="toggle"><input type="checkbox" ${s.id ? `id="${s.id}"` : ''} checked><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              ` : `
                <span class="settings-value">${s.value}</span>
                <span class="settings-arrow">›</span>
              `}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Logout -->
      <button class="btn btn-danger btn-full" style="margin-top: var(--space-lg);opacity:0.8" onclick="logout()">
        ${t('profile_logout')}
      </button>
    </div>
  `;

  setTimeout(() => bindProfileSettings(), 50);
  return html;
}

function bindProfileSettings() {
  // Language toggle
  const langSetting = document.querySelector('.settings-item[data-action="lang"]');
  if (langSetting) {
    langSetting.style.cursor = 'pointer';
    langSetting.addEventListener('click', () => {
      const newLang = getLang() === 'en' ? 'bg' : 'en';
      setLang(newLang);
      renderPage();
    });
  }

  // Notification toggle
  const notifToggle = document.getElementById('toggle-notifications');
  if (notifToggle) {
    notifToggle.checked = localStorage.getItem('fitlife-notifications') !== 'false';
    notifToggle.addEventListener('change', () => {
      localStorage.setItem('fitlife-notifications', notifToggle.checked);
    });
  }

  // Coach mode toggle
  const coachToggle = document.getElementById('toggle-coach');
  if (coachToggle) {
    coachToggle.checked = localStorage.getItem('fitlife-coach-mode') === 'true';
    coachToggle.addEventListener('change', () => {
      localStorage.setItem('fitlife-coach-mode', coachToggle.checked);
    });
  }

  // Dark mode toggle
  const darkToggle = document.getElementById('toggle-darkmode');
  if (darkToggle) {
    const isDark = localStorage.getItem('fitlife-darkmode') !== 'false';
    darkToggle.checked = isDark;
    darkToggle.addEventListener('change', () => {
      localStorage.setItem('fitlife-darkmode', darkToggle.checked ? 'true' : 'false');
      document.body.classList.toggle('light-mode', !darkToggle.checked);
      if (typeof HapticService !== 'undefined') HapticService.selection();
    });
  }
}

function showSupabaseConfigModal() {
  const config = getSupabaseConfig();
  const modal = document.createElement('div');
  modal.id = 'supabase-config-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.95);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(10px);animation:fadeIn 0.3s ease-out;';
  
  modal.innerHTML = `
    <div class="card card-glow" style="width:92%;max-width:420px;background:var(--bg-glass);border-radius:var(--radius-lg);padding:var(--space-xl);position:relative;animation:slideUp 0.3s ease-out;border:1px solid rgba(255,255,255,0.1)">
      <button onclick="closeSupabaseModal()" style="position:absolute;top:15px;right:15px;background:transparent;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;outline:none;">&times;</button>
      <div style="font-size:2.5rem;margin-bottom:var(--space-xs);text-align:center;">⚡</div>
      <h2 class="text-gradient" style="font-size:1.5rem;font-weight:900;text-align:center;margin:0 0 var(--space-xs) 0;">Supabase Backend</h2>
      <p class="text-xs text-muted" style="text-align:center;margin-bottom:var(--space-lg);">
        Status: <span class="tag ${isSupabaseConnected() ? 'tag-success' : 'tag-warning'}">${isSupabaseConnected() ? 'Connected 🟢' : 'Local Storage Mode 🟡'}</span>
      </p>

      <form onsubmit="handleSaveSupabaseConfig(event)">
        <div class="form-group" style="margin-bottom: var(--space-md);">
          <label class="form-label">Project URL</label>
          <input type="url" id="sb-url-input" value="${config.url || ''}" placeholder="https://xyz.supabase.co" required style="font-size: var(--fs-xs);">
        </div>
        <div class="form-group" style="margin-bottom: var(--space-lg);">
          <label class="form-label">Anon / Public API Key</label>
          <textarea id="sb-key-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required style="font-size: var(--fs-xs); height: 80px; resize: none;">${config.key || ''}</textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-full" style="margin-bottom: var(--space-sm);">
          💾 Save & Connect
        </button>
        <button type="button" class="btn btn-ghost btn-full" onclick="closeSupabaseModal()">
          Close
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeSupabaseModal() {
  const modal = document.getElementById('supabase-config-modal');
  if (modal) modal.remove();
}

function handleSaveSupabaseConfig(e) {
  e.preventDefault();
  const url = document.getElementById('sb-url-input').value.trim();
  const key = document.getElementById('sb-key-input').value.trim();
  setSupabaseConfig(url, key);
  closeSupabaseModal();
  alert(isSupabaseConnected() ? '✅ Connected to Supabase successfully!' : '⚠️ Settings saved. Client ready.');
  renderPage();
}

