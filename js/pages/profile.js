// ========================================
// FitLife Bulgaria — Profile Page
// ========================================

function renderProfile() {
  const settings = [
    { icon: '🌐', label: 'profile_language', value: getLang() === 'bg' ? 'Български' : 'English', action: 'lang' },
    { icon: '🔔', label: 'profile_notifications', value: '', action: 'toggle' },
    { icon: '🏋️', label: 'profile_coach_mode', value: '', action: 'toggle' },
    { icon: '🌙', label: 'profile_dark_mode', value: '', action: 'toggle-on' },
    { icon: '💳', label: 'wallet_title', value: '245 BGN', action: 'nav-wallet' },
    { icon: '🔖', label: 'profile_saved', value: '12', action: '' },
    { icon: '📋', label: 'profile_plans', value: '3', action: '' },
  ];

  return `
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
          <div class="avatar avatar-xl">A</div>
          <button class="profile-edit-btn">✏️</button>
        </div>
        <div class="profile-name">Alex Nikolov</div>
        
        <div style="margin-bottom: 8px;">
          ${localStorage.getItem('fitlife-premium') === 'true' ? `
            <span class="tag" style="background: linear-gradient(135deg, var(--accent) 0%, #ff4b2b 100%); color:#fff; border: none; font-size: var(--fs-xs); padding: 4px 12px; box-shadow: 0 4px 10px rgba(108,92,231,0.4)">👑 FitLife PRO Member</span>
          ` : `
            <button class="btn btn-sm btn-primary" onclick="showPremiumModal()" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); color: var(--accent); padding: 4px 12px; font-size: var(--fs-xs); border-radius: var(--radius-sm); cursor: pointer;">${getLang()==='bg'?'👑 Стани PRO':'👑 Get FitLife PRO'}</button>
          `}
        </div>

        <div class="profile-bio">${getLang()==='bg' ? '💪 Фитнес ентусиаст | 🏃 Бегач | София' : '💪 Fitness enthusiast | 🏃 Runner | Sofia'}</div>
        <div class="profile-follow-stats">
          <div class="profile-follow-stat">
            <div class="profile-follow-num">248</div>
            <div class="profile-follow-label">${t('profile_followers')}</div>
          </div>
          <div class="profile-follow-stat">
            <div class="profile-follow-num">186</div>
            <div class="profile-follow-label">${t('profile_following')}</div>
          </div>
          <div class="profile-follow-stat">
            <div class="profile-follow-num">34</div>
            <div class="profile-follow-label">${t('profile_posts')}</div>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary btn-full" style="margin-bottom: var(--space-xl)">${t('profile_edit')}</button>

      <!-- Stats -->
      <div class="grid-4" style="margin-bottom: var(--space-xl)">
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

      <!-- Settings -->
      <div class="section">
        <h3 class="section-title" style="margin-bottom: var(--space-md)">${t('profile_settings')}</h3>
        <div class="settings-list">
          ${settings.map(s => `
            <div class="settings-item" ${s.action === 'nav-wallet' ? 'onclick="navigate(\'wallet\')"' : ''}>
              <div class="settings-icon">${s.icon}</div>
              <div class="settings-label">${t(s.label)}</div>
              ${s.action === 'toggle' ? `
                <label class="toggle"><input type="checkbox"><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              ` : s.action === 'toggle-on' ? `
                <label class="toggle"><input type="checkbox" checked><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              ` : `
                <span class="settings-value">${s.value}</span>
                <span class="settings-arrow">›</span>
              `}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Logout -->
      <button class="btn btn-danger btn-full" style="margin-top: var(--space-lg);opacity:0.8">
        ${t('profile_logout')}
      </button>
    </div>
  `;
}
