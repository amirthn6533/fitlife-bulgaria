// ========================================
// FitLife Bulgaria — Challenges Page
// ========================================

let challengeFilter = 'all';

function setChallengeFilter(filter) {
  challengeFilter = filter;
  renderPage();
}

function renderChallenges() {
  const challenges = [
    { emoji: '🏃', title: getLang()==='bg'?'Бягай 5км най-бързо':'Fastest 5K Run', desc: getLang()==='bg'?'Кой ще пробяга 5 км най-бързо тази седмица?':'Who can run 5km the fastest this week?', participants: 18, daysLeft: 5, wagered: true, stake: '20 BGN', pool: '360 BGN', type: 'running' },
    { emoji: '🏋️', title: getLang()==='bg'?'100кг Клек Клуб':'100kg Squat Club', desc: getLang()==='bg'?'Вдигни 100кг клек до края на месеца':'Hit a 100kg squat by end of month', participants: 34, daysLeft: 14, wagered: true, stake: '0.05 SOL', pool: '1.7 SOL', type: 'lifting' },
    { emoji: '🔥', title: getLang()==='bg'?'30-дневна серия':'30-Day Streak War', desc: getLang()==='bg'?'Не пропускай тренировка 30 дни подред':'Don\'t miss a workout for 30 consecutive days', participants: 56, daysLeft: 22, wagered: false, type: 'streak' },
    { emoji: '💪', title: getLang()==='bg'?'100 лицеви опори на ден':'100 Pushups Daily', desc: getLang()==='bg'?'100 лицеви опори всеки ден цял месец':'100 pushups every single day for a month', participants: 41, daysLeft: 18, wagered: false, type: 'strength' },
    { emoji: '🏃', title: getLang()==='bg'?'Маратон за месец':'Marathon in a Month', desc: getLang()==='bg'?'Пробягай 42км общо за един месец':'Run a total of 42km in one month', participants: 27, daysLeft: 25, wagered: true, stake: '10 USDT', pool: '270 USDT', type: 'running' },
  ];

  let filteredChallenges = challenges;
  if (challengeFilter === 'wagered') {
    filteredChallenges = challenges.filter(c => c.wagered);
  } else if (challengeFilter === 'free') {
    filteredChallenges = challenges.filter(c => !c.wagered);
  } else if (challengeFilter === 'completed') {
    filteredChallenges = challenges.filter(c => c.status === 'completed');
  }

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('challenges_title')}</h1>
        <button class="btn btn-sm btn-primary" onclick="alert('🎯 Create challenge!')">+ ${t('challenges_create')}</button>
      </div>

      <!-- Tabs -->
      <div class="tabs" style="margin-bottom: var(--space-lg)">
        <button class="tab ${challengeFilter === 'all' ? 'active' : ''}" onclick="setChallengeFilter('all')">${t('challenges_active')}</button>
        <button class="tab ${challengeFilter === 'wagered' ? 'active' : ''}" onclick="setChallengeFilter('wagered')">💰 ${t('challenges_wagered')}</button>
        <button class="tab ${challengeFilter === 'free' ? 'active' : ''}" onclick="setChallengeFilter('free')">${t('challenges_free')}</button>
        <button class="tab ${challengeFilter === 'completed' ? 'active' : ''}" onclick="setChallengeFilter('completed')">${t('challenges_completed')}</button>
      </div>

      <!-- Leaderboard & Wallet links -->
      <div class="grid-2" style="margin-bottom: var(--space-lg)">
        <div class="card card-hover card-glow" onclick="navigate('leaderboard')" style="cursor:pointer;text-align:center">
          <div style="font-size:1.5rem">🏆</div>
          <div style="font-weight:700;font-size:var(--fs-sm)">${t('leaderboard_title')}</div>
        </div>
        <div class="card card-hover" onclick="navigate('wallet')" style="cursor:pointer;text-align:center;border-color:rgba(0,230,118,0.2)">
          <div style="font-size:1.5rem">💳</div>
          <div style="font-weight:700;font-size:var(--fs-sm)">${t('wallet_title')}</div>
        </div>
      </div>

      <!-- Challenges List -->
      ${filteredChallenges.length > 0 ? filteredChallenges.map((c, i) => `
        <div class="challenge-card ${c.wagered ? 'wagered' : ''}" style="animation-delay: ${i * 0.08}s">
          <div class="challenge-header">
            <span class="challenge-emoji">${c.emoji}</span>
            <span class="challenge-title">${c.title}</span>
            ${c.wagered ? `<span class="challenge-wager-badge">💰 ${c.stake}</span>` : '<span class="tag tag-success">🆓</span>'}
          </div>
          <div class="challenge-desc">${c.desc}</div>

          ${c.wagered ? `
            <div class="wager-pool" style="margin-bottom:var(--space-md)">
              <div class="wager-pool-label">${t('challenges_prize_pool')}</div>
              <div class="wager-pool-amount">${c.pool}</div>
              <div class="wager-participants" style="margin-top:8px">
                <div class="wager-avatars">
                  <div class="avatar avatar-sm" style="background:var(--gradient-warm)">И</div>
                  <div class="avatar avatar-sm" style="background:var(--gradient-success)">М</div>
                  <div class="avatar avatar-sm" style="background:var(--gradient-fire)">Г</div>
                  <div class="avatar avatar-sm" style="background:var(--gradient-primary)">+${c.participants - 3}</div>
                </div>
              </div>
            </div>
          ` : `
            <div class="progress-bar" style="margin-bottom:var(--space-md)">
              <div class="progress-fill" style="width:${Math.round((1 - c.daysLeft/30) * 100)}%"></div>
            </div>
          `}

          <div class="challenge-footer">
            <div class="challenge-meta">
              <span>👥 ${c.participants} ${t('challenges_participants')}</span>
              <span>⏳ ${c.daysLeft} ${t('challenges_days_left')}</span>
            </div>
            <button class="btn btn-sm ${c.wagered ? 'btn-success' : 'btn-primary'}">
              ${c.wagered ? t('challenges_join_wager') : t('challenges_join')}
            </button>
          </div>
        </div>
      `).join('') : '<div style="text-align:center;padding:2rem;color:var(--text-secondary)">No challenges found</div>'}
    </div>
  `;
}
