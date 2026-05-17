// ========================================
// FitLife Bulgaria — Social Feed Page
// ========================================

function renderSocial() {
  const stories = [
    { name: t('social_your_story'), emoji: '➕', isMine: true },
    { name: 'Иван', emoji: '🏋️', seen: false },
    { name: 'Мария', emoji: '🧘', seen: false },
    { name: 'Георги', emoji: '🏃', seen: true },
    { name: 'Елена', emoji: '💪', seen: false },
    { name: 'Димитър', emoji: '🥗', seen: true },
    { name: 'Петя', emoji: '🏆', seen: false },
  ];

  const posts = [
    {
      user: 'Иван Петров', avatar: '💪', verified: true, time: '2h', location: 'Pulse Fitness, Sofia',
      type: 'workout',
      text: getLang()==='bg' ? 'Страхотна тренировка днес! 🔥 Нов PR на мъртва тяга!' : 'Amazing workout today! 🔥 New deadlift PR!',
      workout: { exercises: ['Deadlift 140kg × 3', 'Squat 100kg × 8', 'Leg Press 180kg × 10'], volume: '12,400 kg' },
      likes: 47, comments: 12, liked: false
    },
    {
      user: 'Мария Иванова', avatar: '🧘', verified: false, time: '4h', location: 'South Park',
      type: 'pr',
      text: '',
      pr: { exercise: 'Bench Press', value: '65 kg', emoji: '🏆' },
      likes: 89, comments: 23, liked: true
    },
    {
      user: 'FitCoach Георги', avatar: '🏆', verified: true, time: '6h', location: null,
      type: 'text',
      text: getLang()==='bg' ? '💡 Съвет на деня: Не пропускайте загрявката! 10 минути динамично разтягане преди всяка тренировка намалява риска от контузии с 50%. Кой загрява днес? 🙋‍♂️' : '💡 Tip of the day: Never skip warm-up! 10 min dynamic stretching before every workout reduces injury risk by 50%. Who\'s warming up today? 🙋‍♂️',
      likes: 134, comments: 31, liked: false
    },
    {
      user: 'Елена Тодорова', avatar: '🏃', verified: false, time: '8h', location: 'Borisova Gradina',
      type: 'challenge',
      text: getLang()==='bg' ? '🎯 Присъединете се към моето предизвикателство! 100 клека на ден за 30 дни. Кой е с мен? 💪' : '🎯 Join my challenge! 100 squats a day for 30 days. Who\'s in? 💪',
      challenge: { name: '100 Squats Challenge', participants: 23, daysLeft: 28 },
      likes: 67, comments: 18, liked: false
    },
    {
      user: 'Кирил Георгиев', avatar: '🎧', verified: false, time: '10h', location: 'Pulse Fitness, Sofia',
      type: 'music',
      text: getLang()==='bg' ? 'Моят нов плейлист за брутални тренировки! 🏋️🔥 Пълен с хаус и хардкор рок.' : 'My new playlist for brutal workouts! 🏋️🔥 Full of energetic house and hardcore rock.',
      music: { title: 'Phonk Gym Beats 2026', artist: 'Kiril G.', tracks: '32 tracks', duration: '1h 45m' },
      likes: 112, comments: 28, liked: false
    },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('social_title')}</h1>
        <div style="display:flex;gap:var(--space-sm)">
          <button class="btn-icon" onclick="navigate('notifications')">🔔<span class="nav-badge" style="position:absolute;top:-2px;right:-2px">3</span></button>
          <button class="btn-icon" onclick="navigate('messages')">💬</button>
        </div>
      </div>

      <!-- Stories -->
      <div class="stories-bar" style="margin-bottom: var(--space-lg)">
        ${stories.map(s => `
          <div class="story-item">
            <div class="story-ring ${s.isMine ? '' : (s.seen ? 'seen' : '')}">
              <div class="story-avatar ${s.isMine ? 'story-add' : ''}">
                ${s.isMine ? '<span class="story-add-icon">➕</span>' : s.emoji}
              </div>
            </div>
            <span class="story-name">${s.name}</span>
          </div>
        `).join('')}
      </div>

      <!-- Feed Tabs -->
      <div class="tabs" style="margin-bottom: var(--space-lg)">
        <button class="tab active">${t('social_trending')}</button>
        <button class="tab">${t('social_following')}</button>
        <button class="tab">${t('social_nearby')}</button>
        <button class="tab">🎵 Music</button>
        <button class="tab">${t('social_coaches')}</button>
      </div>

      <!-- Posts -->
      ${posts.map((p, i) => `
        <div class="post-card" style="animation-delay: ${i * 0.08}s">
          <div class="post-header">
            <div class="avatar">${p.avatar}</div>
            <div class="post-user-info">
              <div class="post-username">${p.user} ${p.verified ? '<span class="verified-badge">✓</span>' : ''}</div>
              <div class="post-meta">${p.time}${p.location ? ' • 📍 ' + p.location : ''}</div>
            </div>
            <button class="btn-icon" style="width:32px;height:32px;font-size:14px">⋯</button>
          </div>
          <div class="post-body">
            ${p.text ? `<div class="post-text">${p.text}</div>` : ''}
            ${p.type === 'workout' ? `
              <div class="workout-summary">
                <div class="workout-summary-header">🏋️ ${t('social_workout_done')}</div>
                <div class="workout-exercises">
                  ${p.workout.exercises.map(e => `
                    <div class="workout-exercise">
                      <span>${e.split(' ')[0]}</span>
                      <span class="workout-exercise-sets">${e.split(' ').slice(1).join(' ')}</span>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:8px;font-size:var(--fs-xs);color:var(--text-muted)">Total volume: ${p.workout.volume}</div>
              </div>
            ` : ''}
            ${p.type === 'pr' ? `
              <div class="pr-card">
                <div class="pr-emoji">${p.pr.emoji}</div>
                <div class="pr-title">${t('social_new_pr')}</div>
                <div class="pr-value">${p.pr.exercise} — ${p.pr.value}</div>
              </div>
            ` : ''}
            ${p.type === 'challenge' ? `
              <div class="challenge-card" style="margin:0;border:none;padding:0;background:transparent">
                <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md)">
                  <div style="font-weight:700;margin-bottom:4px">🎯 ${p.challenge.name}</div>
                  <div class="flex-between" style="font-size:var(--fs-xs);color:var(--text-muted)">
                    <span>👥 ${p.challenge.participants} ${t('challenges_participants')}</span>
                    <span>⏳ ${p.challenge.daysLeft} ${t('challenges_days_left')}</span>
                  </div>
                  <button class="btn btn-sm btn-success" style="margin-top:8px;width:100%">${t('challenges_join')}</button>
                </div>
              </div>
            ` : ''}
            ${p.type === 'music' ? `
              <div class="music-track-card" style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md);display:flex;align-items:center;gap:var(--space-md);margin-top:var(--space-sm)">
                <div class="music-cover-art" style="font-size:1.8rem;background:var(--gradient-fire);width:55px;height:55px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(255,75,43,0.3)">
                  🎵
                </div>
                <div style="flex-grow:1">
                  <div class="music-title" style="font-weight:var(--fw-bold);font-size:var(--fs-md);color:#fff">${p.music.title}</div>
                  <div class="music-artist" style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:2px">${p.music.artist} • ${p.music.tracks} (${p.music.duration})</div>
                  <div class="music-progress" style="margin-top:8px;background:rgba(255,255,255,0.1);height:4px;border-radius:2px;position:relative">
                    <div style="background:var(--accent);width:45%;height:100%;border-radius:2px"></div>
                  </div>
                </div>
                <button class="btn-icon" style="width:40px;height:40px;background:var(--accent);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(108,92,231,0.4)" onclick="alert('🎶 Playing playlist: ${p.music.title}')">
                  ▶
                </button>
              </div>
            ` : ''}
          </div>
          <div class="post-actions">
            <button class="post-action post-action-like ${p.liked ? 'liked' : ''}">
              <span class="post-action-icon">${p.liked ? '❤️' : '🤍'}</span>
              <span class="like-count">${p.likes}</span>
            </button>
            <button class="post-action">
              <span class="post-action-icon">💬</span>
              <span>${p.comments}</span>
            </button>
            <button class="post-action">
              <span class="post-action-icon">↗️</span>
            </button>
            <span class="post-action-spacer"></span>
            <button class="post-action">
              <span class="post-action-icon">🔖</span>
            </button>
          </div>
        </div>
      `).join('')}

      <!-- FAB -->
      <button class="fab-create" onclick="alert('✏️ Create post coming soon!')">✏️</button>
    </div>
  `;
}
