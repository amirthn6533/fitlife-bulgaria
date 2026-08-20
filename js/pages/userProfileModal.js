// ========================================
// FitLife Bulgaria — Athlete Public Profile Studio
// ========================================

const ATHLETE_PROFILES = {
  'Иван Петров': {
    id: 'user_ivan',
    name: 'Иван Петров',
    avatar: '💪',
    verified: true,
    gym: 'Flais Manastirski Livadi, Sofia',
    bio: 'Powerlifter & Strength Enthusiast. Lifting heavy & living clean. 🏋️‍♂️ Bulgarians do it best!',
    followers: 1240,
    following: 310,
    workoutsCount: 184,
    streakDays: 45,
    isFollowing: false,
    pr: {
      bench: '140 kg',
      squat: '185 kg',
      deadlift: '230 kg'
    },
    posts: [
      { title: '140kg Deadlift PR', text: 'Great session at Flais today! 4 sets of 100kg squat and max deadlift.', likes: 48, time: '2h ago', icon: '🏋️' },
      { title: 'Chest Day Destruction', text: 'Incline bench press 38kg dumbbells × 10 reps.', likes: 64, time: '2d ago', icon: '💪' },
      { title: 'Post-Workout Fuel', text: '60g whey protein shake + 3 bananas.', likes: 32, time: '4d ago', icon: '🥩' }
    ]
  },
  'Мария Иванова': {
    id: 'user_maria',
    name: 'Мария Иванова',
    avatar: '🧘',
    verified: true,
    gym: 'Pulse Fitness & South Park, Sofia',
    bio: 'Yoga Instructor & Mobility Coach ☀️ Helping athletes stay flexible and pain-free.',
    followers: 2890,
    following: 420,
    workoutsCount: 312,
    streakDays: 88,
    isFollowing: true,
    pr: {
      bench: '65 kg',
      squat: '95 kg',
      deadlift: '115 kg'
    },
    posts: [
      { title: 'Morning Mobility Flow', text: '15-min hip openers before running in South Park.', likes: 90, time: '4h ago', icon: '🧘' },
      { title: 'Leg Day Volume', text: 'Romanian deadlifts with dumbbells + Bulgarian split squats.', likes: 112, time: '3d ago', icon: '🦵' }
    ]
  },
  'FitCoach Георги': {
    id: 'user_georgi',
    name: 'FitCoach Георги',
    avatar: '🏆',
    verified: true,
    gym: 'Pulse Fitness Lozenets, Sofia',
    bio: 'Certified Master Trainer (NASM & ISSA). 10+ years coaching champion physiques.',
    followers: 6400,
    following: 180,
    workoutsCount: 850,
    streakDays: 140,
    isFollowing: false,
    pr: {
      bench: '165 kg',
      squat: '220 kg',
      deadlift: '260 kg'
    },
    posts: [
      { title: 'Warm-up Science 💡', text: '10 min dynamic mobility cuts injury risk by 50%!', likes: 135, time: '6h ago', icon: '💡' },
      { title: 'Client Transformation', text: 'Proud of Alex dropping 8kg in 6 weeks!', likes: 240, time: '5d ago', icon: '🔥' }
    ]
  },
  'Елена Стоянова': {
    id: 'user_elena',
    name: 'Елена Стоянова',
    avatar: '🏃',
    verified: false,
    gym: 'Borisova Gradina & Flais Sofia',
    bio: 'Marathon runner & Half-marathon Finisher (1h 42m). Chasing endorphins daily! 🏃‍♀️💨',
    followers: 950,
    following: 260,
    workoutsCount: 145,
    streakDays: 32,
    isFollowing: false,
    pr: {
      bench: '50 kg',
      squat: '80 kg',
      deadlift: '100 kg'
    },
    posts: [
      { title: 'Sunrise 10K Run', text: 'Paced 4:45 min/km around Borisova Gradina lake.', likes: 68, time: '8h ago', icon: '🏃' }
    ]
  }
};

function openUserProfileModal(userName) {
  const isBg = getLang() === 'bg';
  const profile = ATHLETE_PROFILES[userName] || {
    id: 'user_custom',
    name: userName || 'FitLife Athlete',
    avatar: '👤',
    verified: false,
    gym: 'Sofia Fitness Community',
    bio: 'FitLife Bulgaria Athlete on the journey to peak physical fitness.',
    followers: 320,
    following: 140,
    workoutsCount: 65,
    streakDays: 14,
    isFollowing: false,
    pr: { bench: '100 kg', squat: '130 kg', deadlift: '160 kg' },
    posts: [{ title: 'Workout Log', text: 'Crushed daily routine with high energy!', likes: 24, time: '1d ago', icon: '⚡' }]
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
        <span style="font-weight:800;font-size:var(--fs-sm);color:var(--text-muted);">@${profile.name.toLowerCase().replace(/\s+/g, '')}</span>
        <button onclick="closeUserProfileModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Scrollable Profile Content -->
      <div style="flex:1;overflow-y:auto;padding:18px;">
        
        <!-- Main Info Row -->
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <div style="width:68px;height:68px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:2.2rem;box-shadow:0 0 20px rgba(108,92,231,0.5);border:3px solid #fff;">
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
        <div style="display:flex;gap:10px;margin-bottom:20px;">
          <button id="profile-follow-btn" onclick="toggleFollowAthlete('${profile.name}')" class="btn ${profile.isFollowing ? 'btn-secondary' : 'btn-primary'} btn-full" style="border-radius:var(--radius-full);font-size:12px;font-weight:800;">
            ${profile.isFollowing ? (isBg ? '✓ Следван' : '✓ Following') : (isBg ? '➕ Последвай' : '➕ Follow')}
          </button>
          <button onclick="openDirectChatWith('${profile.name}')" class="btn btn-secondary" style="border-radius:var(--radius-full);font-size:12px;padding:0 20px;">
            💬 ${isBg ? 'Съобщение' : 'Message'}
          </button>
        </div>

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
        <h3 style="font-size:var(--fs-sm);font-weight:800;color:#fff;margin-bottom:10px;">📝 ${isBg ? 'Последни публикации' : 'Recent Workouts'}</h3>
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
  const profile = ATHLETE_PROFILES[name];
  if (!profile) return;

  profile.isFollowing = !profile.isFollowing;
  profile.followers += profile.isFollowing ? 1 : -1;

  const btn = document.getElementById('profile-follow-btn');
  const countEl = document.getElementById('profile-follower-count');
  const isBg = getLang() === 'bg';

  if (btn) {
    btn.className = `btn ${profile.isFollowing ? 'btn-secondary' : 'btn-primary'} btn-full`;
    btn.innerText = profile.isFollowing ? (isBg ? '✓ Следван' : '✓ Following') : (isBg ? '➕ Последвай' : '➕ Follow');
  }
  if (countEl) {
    countEl.innerText = profile.followers;
  }

  if (typeof HapticService !== 'undefined') HapticService.success();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      profile.isFollowing ? (isBg ? 'Последван!' : 'Following!') : (isBg ? 'Отследван' : 'Unfollowed'),
      profile.isFollowing ? (isBg ? `Вече следвате ${name}.` : `You are now following ${name}.`) : '',
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
