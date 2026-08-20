// ========================================
// FitLife — Leaderboard, Messages, Notifications & Reminders
// ========================================

function renderLeaderboard() {
  const user = getCurrentUser() || {};
  const currentName = user.fullName || (getLang() === 'bg' ? 'Ти' : 'You');
  const leaders = [
    { rank: '🥇', name: 'Иван Петров', stat: '24 workouts', value: '24', avatar: '💪' },
    { rank: '🥈', name: 'Мария Иванова', stat: '22 workouts', value: '22', avatar: '🧘' },
    { rank: '🥉', name: 'Георги Тодоров', stat: '20 workouts', value: '20', avatar: '🏆' },
    { rank: '4', name: 'Елена Стоянова', stat: '18 workouts', value: '18', avatar: '🏃' },
    { rank: '5', name: 'Петър Димитров', stat: '16 workouts', value: '16', avatar: '🔥' },
    { rank: '6', name: currentName, stat: '14 workouts', value: '14', avatar: currentName[0].toUpperCase(), isYou: true },
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
  const isBg = getLang() === 'bg';
  const notifSettings = (typeof NotificationService !== 'undefined') ? NotificationService.getSettings() : {};
  const customNotifs = (typeof dbLoad === 'function') ? dbLoad('user_notifications', []) : [];

  const defaultNotifs = [
    { icon: '❤️', text: `<strong>Иван Петров</strong> ${t('notif_liked')}`, time: '2m', unread: true },
    { icon: '💬', text: `<strong>Мария</strong> ${t('notif_commented')}: "💪🔥"`, time: '15m', unread: true },
    { icon: '👤', text: `<strong>Георги Тодоров</strong> ${t('notif_followed')}`, time: '1h', unread: true },
    { icon: '🎯', text: `<strong>Елена</strong> ${t('notif_challenge')}`, time: '3h', unread: false },
    { icon: '💬', text: `<strong>Coach Георги</strong> ${t('notif_coach')}`, time: '5h', unread: false },
    { icon: '❤️', text: `<strong>Петър, Димитър</strong> +5 ${t('notif_liked')}`, time: '1d', unread: false },
    { icon: '🏆', text: `<strong>${getLang()==='bg'?'Ти спечели':'You won'}</strong> 5K ${t('challenges_running_race')}! +60 BGN`, time: '2d', unread: false },
  ];

  const notifs = customNotifs.length > 0 ? [
    ...customNotifs.map(n => ({ icon: n.icon || '🔔', text: `<strong>${n.title}</strong>: ${n.body}`, time: 'just now', unread: !n.is_read })),
    ...defaultNotifs
  ] : defaultNotifs;

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('social')">←</button>
          <h1>${t('notif_title')}</h1>
        </div>
        <span class="tag tag-primary">${notifs.filter(n => n.unread).length} new</span>
      </div>

      <!-- Smart Reminders & Push Notification Control Card -->
      <div class="card card-glow" style="margin-bottom: var(--space-lg); background: linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,210,255,0.1)); border: 1px solid var(--accent); border-radius: var(--radius-lg); padding: var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-sm);">
          <div style="display:flex; align-items:center; gap:var(--space-sm);">
            <span style="font-size:1.6rem;">🔔</span>
            <div>
              <div style="font-weight:900; font-size:var(--fs-md);">${isBg ? 'Смарт напомняния & Нотификации' : 'Smart Daily Reminders'}</div>
              <div class="text-xs text-muted">${isBg ? 'Автоматични известия за тренировка и вода' : 'Personalized workout & hydration alerts'}</div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="testPushNotification()" style="font-size:11px; padding:4px 10px;">
            🔔 ${isBg ? 'Проба' : 'Preview'}
          </button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--space-xs); margin-top:var(--space-sm); font-size:var(--fs-xs);">
          <div style="background:rgba(255,255,255,0.05); padding:8px 10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
            <span>🏋️ ${isBg ? 'Час за тренировка:' : 'Workout Time:'}</span>
            <input type="time" value="${notifSettings.workoutTime || '18:00'}" onchange="updateWorkoutReminderTime(this.value)" style="width:auto; padding:2px 4px; font-size:11px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:#fff;">
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:8px 10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
            <span>💧 ${isBg ? 'Вода (интервал):' : 'Hydration:'}</span>
            <span class="tag tag-accent" style="font-size:10px;">${notifSettings.waterIntervalHours || 2}h</span>
          </div>
        </div>
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

async function testPushNotification() {
  const isBg = getLang() === 'bg';
  if (typeof NotificationService !== 'undefined') {
    await NotificationService.requestPermission();
    NotificationService.notify(
      isBg ? '🔥 FitLife Bulgaria: Време е за действие!' : '🔥 FitLife Bulgaria: Time to Crush It!',
      isBg ? 'Днешната ти тренировка те очаква. Твоят 12-дневен Streak е активен!' : 'Your daily workout is ready. Keep your 12-day streak alive!',
      { type: 'workout', icon: '🏋️' }
    );
  }
}

function updateWorkoutReminderTime(time) {
  if (typeof NotificationService !== 'undefined') {
    NotificationService.saveSettings({ workoutTime: time });
  }
}
