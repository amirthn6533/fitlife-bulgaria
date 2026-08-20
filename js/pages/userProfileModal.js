// ========================================
// FitLife Bulgaria — Athlete Public Profile Studio
// ========================================

function openUserProfileModal(userName) {
  const isBg = getLang() === 'bg';
  const currentUser = getCurrentUser() || {};
  const isMe = (currentUser.fullName === userName);

  const customPosts = (typeof dbLoad === 'function') ? dbLoad('user_created_posts', []) : [];
  const userPosts = customPosts.filter(p => p.user === userName);

  const profile = {
    id: isMe ? currentUser.id : `user_${encodeURIComponent(userName || 'athlete')}`,
    name: userName || (isBg ? 'FitLife Спортист' : 'FitLife Athlete'),
    avatar: (userName && userName.length > 0) ? userName[0].toUpperCase() : '👤',
    verified: (userName === 'FitLife Bulgaria Official' || (isMe && currentUser.is_premium)),
    gym: (userName === 'FitLife Bulgaria Official') ? 'Sofia HQ, Bulgaria' : 'Sofia, Bulgaria',
    bio: (userName === 'FitLife Bulgaria Official') 
      ? (isBg ? 'Официална общност за спорт, бягане и здраве в България 🇧🇬' : 'Official sports & fitness community in Bulgaria 🇧🇬')
      : (isBg ? 'FitLife Спортист • Трениращ за здраве и сила' : 'FitLife Athlete on the journey to peak physical fitness.'),
    followers: isMe ? 12 : 8,
    following: isMe ? 8 : 14,
    workoutsCount: isMe ? 14 : userPosts.length,
    streakDays: isMe ? 14 : 7,
    isFollowing: false,
    pr: { 
      bench: isMe ? '100 kg' : '90 kg', 
      squat: isMe ? '130 kg' : '120 kg', 
      deadlift: isMe ? '160 kg' : '150 kg' 
    },
    posts: userPosts.length > 0 ? userPosts.map(p => ({
      title: p.type === 'workout' ? (isBg ? 'Тренировка' : 'Workout') : (isBg ? 'Публикация' : 'Post'),
      text: p.text || '',
      likes: p.likes || 0,
      time: p.time || 'recent',
      icon: p.type === 'workout' ? '🏋️' : '📝'
    })) : [
      { title: isBg ? 'Фитнес статус' : 'Fitness Status', text: isBg ? 'Активен член на FitLife общността.' : 'Active FitLife community member.', likes: 5, time: '1d ago', icon: '⚡' }
    ]
  };

  const existing = document.getElementById('fitlife-user-profile-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'fitlife-user-profile-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.92);display:flex;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(16px);animation:fadeIn 0.2s ease-out;';

  modal.innerHTML = `
    <div class="card card-glow" style="width:100%;max-width:440px;height:85vh;max-height:680px;background:var(--bg-card);border-radius:24px 24px 0 0;display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,255,255,0.14);padding:0;overflow:hidden;">
      
      <!-- Top Header & Close -->
      <div style="padding:14px 18px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-weight:800;font-size:var(--fs-sm);color:var(--text-muted);">@${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'athlete'}</span>
        <button onclick="closeUserProfileModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Scrollable Profile Content -->
      <div style="flex:1;overflow-y:auto;padding:18px;">
        
        <!-- Main Info Row -->
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <div style="width:68px;height:68px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:#fff;box-shadow:0 0 20px rgba(108,92,231,0.5);border:3px solid #fff;">
            ${profile.avatar}
          </div>
          <div style="flex:1;display:flex;justify-content:space-around;text-align:center;">
            <div>
              <div style="font-weight:900;font-size:var(--fs-lg);color:#fff;">${profile.workoutsCount}</div>
              <div class="text-xs text-muted">${isBg ? 'Тренировки' : 'Workouts'}</div>
            </div>
            <div>
              <div id="profile-follower-count" style="font-weight:900;font-size:var(--fs-lg);color:#fff;">${profile.followers}</div>
              <div class="text-xs text-muted">${isBg ? 'Последователи' : 'Followers'}</div>
            </div>
            <div>
              <div style="font-weight:900;font-size:var(--fs-lg);color:var(--warning);">🔥 ${profile.streakDays}d</div>
              <div class="text-xs text-muted">${isBg ? 'Серия' : 'Streak'}</div>
            </div>
          </div>
        </div>

        <!-- Name, Gym & Bio -->
        <div style="margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <h2 style="font-size:var(--fs-lg);font-weight:900;color:#fff;margin:0;">${profile.name}</h2>
            ${profile.verified ? '<span class="verified-badge">✓</span>' : ''}
          </div>
          <div class="text-xs" style="color:var(--accent);margin-top:2px;font-weight:600;">📍 ${profile.gym}</div>
          <p class="text-xs text-muted" style="margin-top:6px;line-height:1.4;">${profile.bio}</p>
        </div>

        <!-- Follow & Message CTA Buttons -->
        ${!isMe ? `
          <div style="display:flex;gap:10px;margin-bottom:20px;">
            <button id="profile-follow-btn" onclick="toggleFollowAthlete('${profile.name}')" class="btn btn-primary btn-full" style="border-radius:var(--radius-full);font-size:12px;font-weight:800;">
              ${isBg ? '➕ Последвай' : '➕ Follow'}
            </button>
            <button onclick="openDirectChatWith('${profile.name}')" class="btn btn-secondary" style="border-radius:var(--radius-full);font-size:12px;padding:0 20px;">
              💬 ${isBg ? 'Съобщение' : 'Message'}
            </button>
          </div>
        ` : ''}

        <!-- Big 3 Personal Records Trophy Card -->
        <div class="card" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,214,0,0.3);border-radius:var(--radius-lg);padding:14px;margin-bottom:20px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="font-weight:900;font-size:12px;color:var(--warning);">🏆 ${isBg ? 'Лични Рекорди (PR Showcase)' : 'Personal Records (PR)'}</span>
            <span class="tag tag-warning" style="font-size:9px;">Verified 1RM</span>
          </div>
          <div class="grid-3" style="text-align:center;">
            <div style="background:rgba(0,210,255,0.08);padding:8px;border-radius:var(--radius-md);border:1px solid rgba(0,210,255,0.2);">
              <div style="font-weight:900;font-size:14px;color:#00D2FF;">${profile.pr.bench}</div>
              <div class="text-xs text-muted" style="font-size:10px;">Bench Press</div>
            </div>
            <div style="background:rgba(255,214,0,0.08);padding:8px;border-radius:var(--radius-md);border:1px solid rgba(255,214,0,0.2);">
              <div style="font-weight:900;font-size:14px;color:#FFD600;">${profile.pr.squat}</div>
              <div class="text-xs text-muted" style="font-size:10px;">Squat</div>
            </div>
            <div style="background:rgba(255,82,82,0.08);padding:8px;border-radius:var(--radius-md);border:1px solid rgba(255,82,82,0.2);">
              <div style="font-weight:900;font-size:14px;color:#FF5252;">${profile.pr.deadlift}</div>
              <div class="text-xs text-muted" style="font-size:10px;">Deadlift</div>
            </div>
          </div>
        </div>

        <!-- Recent Posts List -->
        <h3 style="font-size:var(--fs-sm);font-weight:800;color:#fff;margin-bottom:10px;">📝 ${isBg ? 'Публикации & Тренировки' : 'Workouts & Posts'}</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${profile.posts.map(p => `
            <div style="background:rgba(255,255,255,0.04);border-radius:var(--radius-md);padding:12px;border:1px solid rgba(255,255,255,0.06);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="font-weight:700;font-size:12px;color:#fff;">${p.icon} ${p.title}</span>
                <span class="text-xs text-muted" style="font-size:10px;">${p.time}</span>
              </div>
              <div class="text-xs text-muted" style="line-height:1.4;margin-bottom:6px;">${p.text}</div>
              <div style="font-size:10px;color:var(--accent);font-weight:600;">❤️ ${p.likes} likes</div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeUserProfileModal() {
  const modal = document.getElementById('fitlife-user-profile-modal');
  if (modal) modal.remove();
}

function toggleFollowAthlete(name) {
  const isBg = getLang() === 'bg';
  const btn = document.getElementById('profile-follow-btn');
  const countEl = document.getElementById('profile-follower-count');

  const isFollowing = btn && btn.classList.contains('btn-secondary');
  const newStatus = !isFollowing;

  if (btn) {
    btn.className = `btn ${newStatus ? 'btn-secondary' : 'btn-primary'} btn-full`;
    btn.innerText = newStatus ? (isBg ? '✓ Следван' : '✓ Following') : (isBg ? '➕ Последвай' : '➕ Follow');
  }
  if (countEl) {
    const current = parseInt(countEl.innerText) || 8;
    countEl.innerText = current + (newStatus ? 1 : -1);
  }

  if (typeof HapticService !== 'undefined') HapticService.success();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      newStatus ? (isBg ? 'Последван!' : 'Following!') : (isBg ? 'Отследван' : 'Unfollowed'),
      newStatus ? (isBg ? `Вече следвате ${name}.` : `You are now following ${name}.`) : '',
      '👥'
    );
  }
}

function openDirectChatWith(name) {
  closeUserProfileModal();
  navigate('messages');
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner('Direct Chat', `Opened conversation with ${name}`, '💬');
  }
}
