// ========================================
// FitLife — Leaderboard, Messages, Notifications
// ========================================

function renderLeaderboard() {
  const leaders = [
    { rank: '🥇', name: 'Иван Петров', stat: '24 workouts', value: '24', avatar: '💪' },
    { rank: '🥈', name: 'Мария Иванова', stat: '22 workouts', value: '22', avatar: '🧘' },
    { rank: '🥉', name: 'Георги Тодоров', stat: '20 workouts', value: '20', avatar: '🏆' },
    { rank: '4', name: 'Елена Стоянова', stat: '18 workouts', value: '18', avatar: '🏃' },
    { rank: '5', name: 'Петър Димитров', stat: '16 workouts', value: '16', avatar: '🔥' },
    { rank: '6', name: 'Alex Nikolov', stat: '14 workouts', value: '14', avatar: 'A', isYou: true },
    { rank: '7', name: 'Димитър Колев', stat: '13 workouts', value: '13', avatar: '🏋️' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('challenges')">←</button>
          <h1>${t('leaderboard_title')}</h1>
        </div>
      </div>
      <div class="tabs" style="margin-bottom:var(--space-md)">
        <button class="tab active">${t('leaderboard_weekly')}</button>
        <button class="tab">${t('leaderboard_monthly')}</button>
        <button class="tab">${t('leaderboard_alltime')}</button>
      </div>
      <div class="tabs" style="margin-bottom:var(--space-lg)">
        <button class="tab active">${t('leaderboard_workouts')}</button>
        <button class="tab">${t('leaderboard_lifts')}</button>
        <button class="tab">${t('leaderboard_streaks')}</button>
      </div>
      ${leaders.map((l, i) => `
        <div class="leaderboard-item ${l.isYou ? 'you' : ''}" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i*0.05}s">
          <div class="leaderboard-rank">${l.rank}</div>
          <div class="avatar avatar-sm">${l.avatar}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">${l.name} ${l.isYou ? '<span class="tag tag-primary" style="margin-left:4px">'+t('leaderboard_you')+'</span>' : ''}</div>
            <div class="leaderboard-stat">${l.stat}</div>
          </div>
          <div class="leaderboard-value">${l.value}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMessages() {
  const chats = [
    { name: 'Георги Димитров', preview: getLang()==='bg'?'Страхотна тренировка днес!':'Great workout today!', time: '2m', emoji: '🏆', badge: 2, isCoach: true },
    { name: 'Мария Иванова', preview: getLang()==='bg'?'Ще дойдеш ли утре?':'Coming tomorrow?', time: '1h', emoji: '🧘', badge: 0 },
    { name: 'Иван Петров', preview: getLang()==='bg'?'Провери новия ми план':'Check my new plan', time: '3h', emoji: '💪', badge: 1 },
    { name: '🤖 AI Coach', preview: getLang()==='bg'?'Твоят план е готов!':'Your plan is ready!', time: '5h', emoji: '🤖', badge: 1 },
    { name: 'Елена Тодорова', preview: '🏃 5km in 24:30!', time: '1d', emoji: '🏃', badge: 0 },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('social')">←</button>
          <h1>${t('messages_title')}</h1>
        </div>
      </div>
      <input type="text" placeholder="${t('common_search')}" style="margin-bottom:var(--space-md)">
      <div class="chat-list">
        ${chats.map((c, i) => `
          <div class="chat-item" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i*0.05}s">
            <div class="avatar">${c.emoji}</div>
            <div class="chat-info">
              <div class="chat-name">${c.name} ${c.isCoach ? '<span class="tag tag-primary" style="font-size:9px;padding:1px 5px">Coach</span>' : ''}</div>
              <div class="chat-preview">${c.preview}</div>
            </div>
            <div style="text-align:right">
              <div class="chat-time">${c.time}</div>
              ${c.badge > 0 ? `<div class="badge" style="margin-top:4px">${c.badge}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderNotifications() {
  const notifs = [
    { icon: '❤️', text: `<strong>Иван Петров</strong> ${t('notif_liked')}`, time: '2m', unread: true },
    { icon: '💬', text: `<strong>Мария</strong> ${t('notif_commented')}: "💪🔥"`, time: '15m', unread: true },
    { icon: '👤', text: `<strong>Георги Тодоров</strong> ${t('notif_followed')}`, time: '1h', unread: true },
    { icon: '🎯', text: `<strong>Елена</strong> ${t('notif_challenge')}`, time: '3h', unread: false },
    { icon: '💬', text: `<strong>Coach Георги</strong> ${t('notif_coach')}`, time: '5h', unread: false },
    { icon: '❤️', text: `<strong>Петър, Димитър</strong> +5 ${t('notif_liked')}`, time: '1d', unread: false },
    { icon: '🏆', text: `<strong>${getLang()==='bg'?'Ти спечели':'You won'}</strong> 5K ${t('challenges_running_race')}! +60 BGN`, time: '2d', unread: false },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('social')">←</button>
          <h1>${t('notif_title')}</h1>
        </div>
        <span class="tag tag-primary">3 new</span>
      </div>
      ${notifs.map((n, i) => `
        <div class="notification-item ${n.unread ? 'unread' : ''}" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i*0.04}s">
          <div class="notification-icon-wrap" style="background:var(--bg-glass)">${n.icon}</div>
          <div class="notification-text">${n.text}</div>
          <div class="notification-time">${n.time}</div>
        </div>
      `).join('')}
    </div>
  `;
}
