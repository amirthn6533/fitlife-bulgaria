// ========================================
// FitLife Bulgaria — Advanced Social Feed & Instagram Reels Engine
// ========================================

let socialActiveTab = 'trending'; // trending, reels, following, nearby, music, coaches

function getSocialFeedPosts() {
  const customPosts = (typeof dbLoad === 'function') ? dbLoad('user_created_posts', []) : [];
  
  const savedDefaults = localStorage.getItem('fitlife-social-posts-state');
  if (savedDefaults) {
    try {
      const parsed = JSON.parse(savedDefaults);
      return [...customPosts, ...parsed];
    } catch(e) {}
  }

  const defaultPosts = [
    {
      id: 'p_1',
      user: 'Иван Петров', avatar: '💪', verified: true, time: '2h', location: 'Flais Manastirski Livadi, Sofia',
      type: 'workout', category: 'trending', isFollowing: true, isNearby: true, isCoach: false,
      text: getLang()==='bg' ? 'Страхотна тренировка днес във Flais! 🔥 Нов PR на мъртва тяга!' : 'Amazing workout today at Flais! 🔥 New deadlift PR!',
      workout: { exercises: ['Deadlift 140kg × 3', 'Squat 100kg × 8', 'Leg Press 180kg × 10'], volume: '12,400 kg' },
      likes: 48, comments: 12, liked: false, bookmarked: false
    },
    {
      id: 'p_2',
      user: 'Мария Иванова', avatar: '🧘', verified: false, time: '4h', location: 'South Park, Sofia',
      type: 'pr', category: 'following', isFollowing: true, isNearby: true, isCoach: false,
      text: getLang()==='bg' ? 'Сутрешна йога и нов личен рекорд на лежанка!' : 'Morning yoga & new bench press PR!',
      pr: { exercise: 'Bench Press', value: '65 kg', emoji: '🏆' },
      likes: 90, comments: 23, liked: true, bookmarked: true
    },
    {
      id: 'p_3',
      user: 'FitCoach Георги', avatar: '🏆', verified: true, time: '6h', location: 'Pulse Fitness, Sofia',
      type: 'text', category: 'coaches', isFollowing: false, isNearby: true, isCoach: true,
      text: getLang()==='bg' ? '💡 Съвет на треньора: Не пропускайте загрявката! 10 минути динамично разтягане преди всяка тренировка намалява риска от контузии с 50%. Кой загрява днес? 🙋‍♂️' : '💡 Coach Tip: Never skip warm-up! 10 min dynamic stretching before every workout reduces injury risk by 50%. Who\'s warming up today? 🙋‍♂️',
      likes: 135, comments: 31, liked: false, bookmarked: false
    },
    {
      id: 'p_4',
      user: 'Елена Тодорова', avatar: '🏃', verified: false, time: '8h', location: 'Borisova Gradina, Sofia',
      type: 'challenge', category: 'following', isFollowing: true, isNearby: true, isCoach: false,
      text: getLang()==='bg' ? '🎯 Присъединете се към моето предизвикателство! 100 клека на ден за 30 дни. Кой е с мен? 💪' : '🎯 Join my challenge! 100 squats a day for 30 days. Who\'s in? 💪',
      challenge: { name: '100 Squats Challenge', participants: 24, daysLeft: 28 },
      likes: 68, comments: 18, liked: false, bookmarked: false
    },
    {
      id: 'p_5',
      user: 'Кирил DJ Beats', avatar: '🎧', verified: false, time: '10h', location: 'Pulse Fitness, Sofia',
      type: 'music', category: 'music', isFollowing: false, isNearby: false, isCoach: false,
      text: getLang()==='bg' ? 'Моят нов плейлист за брутални тренировки! 🏋️🔥 Пълен с хаус и хардкор рок.' : 'My new playlist for brutal workouts! 🏋️🔥 Full of energetic house and hardcore rock.',
      music: { title: 'Phonk Gym Beats 2026', artist: 'Kiril G.', tracks: '32 tracks', duration: '1h 45m' },
      likes: 112, comments: 28, liked: false, bookmarked: false
    },
  ];

  return [...customPosts, ...defaultPosts];
}

function saveSocialFeedPosts(posts) {
  const customPosts = posts.filter(p => p.id && p.id.startsWith('user_post_'));
  const defaultPosts = posts.filter(p => !p.id || !p.id.startsWith('user_post_'));
  
  if (typeof dbSave === 'function') {
    dbSave('user_created_posts', customPosts);
  }
  localStorage.setItem('fitlife-social-posts-state', JSON.stringify(defaultPosts));
}

function togglePostLike(postIndex) {
  const posts = getSocialFeedPosts();
  const post = posts[postIndex];
  if (!post) return;

  post.liked = !post.liked;
  post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
  saveSocialFeedPosts(posts);

  if (typeof HapticService !== 'undefined') {
    if (post.liked) HapticService.heart();
    else HapticService.selection();
  }

  if (typeof NotificationService !== 'undefined' && post.liked) {
    NotificationService.playChime('general');
  }

  renderPage();
}

function filterSocialTab(tab) {
  socialActiveTab = tab;
  if (typeof HapticService !== 'undefined') HapticService.selection();
  renderPage();
}

function renderSocial() {
  const isBg = getLang() === 'bg';
  const myStory = (() => {
    try {
      return JSON.parse(localStorage.getItem('fitlife-my-active-story'));
    } catch(e) { return null; }
  })();

  const seenStories = (() => {
    try { return JSON.parse(localStorage.getItem('fitlife-seen-stories') || '[]'); } catch(e) { return []; }
  })();

  const stories = [
    { id: 'st_mine', name: t('social_your_story'), emoji: myStory ? myStory.emoji : '➕', isMine: true, hasActive: !!myStory },
    { id: 'st_1', name: 'Иван', emoji: '🏋️', seen: seenStories.includes('st_1'), index: 0 },
    { id: 'st_2', name: 'Мария', emoji: '🧘', seen: seenStories.includes('st_2'), index: 1 },
    { id: 'st_3', name: 'Георги', emoji: '🏃', seen: seenStories.includes('st_3'), index: 2 },
    { id: 'st_4', name: 'Елена', emoji: '💪', seen: seenStories.includes('st_4'), index: 3 },
    { id: 'st_5', name: 'Димитър', emoji: '🥗', seen: seenStories.includes('st_5'), index: 4 },
    { id: 'st_6', name: 'Петя', emoji: '🏆', seen: seenStories.includes('st_6'), index: 5 },
  ];

  const allPosts = getSocialFeedPosts();

  // Reels Workout Clips Data
  const reelsList = [
    { id: 'reel_1', author: 'Иван Петров', title: '140kg Deadlift PR Form Check 🔥', views: '12.4k', likes: '840', tag: 'Pulse Fitness', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', emoji: '🏋️' },
    { id: 'reel_2', author: 'FitCoach Георги', title: '3 Squat Mistakes to Avoid 🚫', views: '19.2k', likes: '1.2k', tag: 'Coaching', bg: 'linear-gradient(135deg, #701a75, #4a044e)', emoji: '🏆' },
    { id: 'reel_3', author: 'Мария Иванова', title: '5-Min Morning Mobility Routine 🧘', views: '8.1k', likes: '512', tag: 'South Park', bg: 'linear-gradient(135deg, #064e3b, #022c22)', emoji: '🧘' },
    { id: 'reel_4', author: 'Димитър Колев', title: '30-Sec High Protein Meal Prep 🥩', views: '15.7k', likes: '980', tag: 'Nutrition', bg: 'linear-gradient(135deg, #7c2d12, #451a03)', emoji: '🥗' },
  ];

  // Filter posts according to active tab
  let filteredPosts = allPosts;
  if (socialActiveTab === 'trending') {
    filteredPosts = [...allPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (socialActiveTab === 'following') {
    filteredPosts = allPosts.filter(p => p.isFollowing || p.id?.startsWith('user_post_'));
  } else if (socialActiveTab === 'nearby') {
    filteredPosts = allPosts.filter(p => p.location || p.isNearby);
  } else if (socialActiveTab === 'music') {
    filteredPosts = allPosts.filter(p => p.type === 'music');
  } else if (socialActiveTab === 'coaches') {
    filteredPosts = allPosts.filter(p => p.isCoach || p.verified);
  }

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('social_title')}</h1>
        <div style="display:flex;gap:var(--space-sm)">
          <button class="btn-icon" onclick="navigate('notifications')">🔔<span class="nav-badge" style="position:absolute;top:-2px;right:-2px">3</span></button>
          <button class="btn-icon" onclick="navigate('messages')">💬</button>
        </div>
      </div>

      <!-- Interactive 24h Stories Bar with Instagram Gradient Glow -->
      <div class="stories-bar" style="margin-bottom: var(--space-md)">
        ${stories.map((s, idx) => `
          <div class="story-item" onclick="${s.isMine && !s.hasActive ? 'openCreateStoryModal()' : `openStoryViewer(${s.index !== undefined ? s.index : 0})`}" style="cursor:pointer;">
            <div class="story-ring ${s.isMine && !s.hasActive ? '' : (s.seen ? 'seen' : '')}">
              <div class="story-avatar ${s.isMine && !s.hasActive ? 'story-add' : ''}">
                ${s.isMine && !s.hasActive ? '<span class="story-add-icon">➕</span>' : s.emoji}
              </div>
            </div>
            <span class="story-name">${s.name}</span>
          </div>
        `).join('')}
      </div>

      <!-- Create Post Composer Bar -->
      <div class="card card-glow" onclick="openCreatePostModal('workout')" style="margin-bottom: var(--space-lg); cursor:pointer; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-lg); padding:var(--space-sm) var(--space-md); display:flex; align-items:center; gap:var(--space-sm);">
        <div class="avatar avatar-sm" style="background:var(--gradient-primary);color:#fff;font-weight:900;">A</div>
        <div style="flex:1; background:rgba(255,255,255,0.05); border-radius:var(--radius-full); padding:8px 14px; font-size:var(--fs-xs); color:var(--text-muted);">
          ${isBg ? 'Сподели тренировка, PR или съвет...' : 'Share your workout, new PR or motivation...'}
        </div>
        <button class="btn btn-primary btn-sm" style="border-radius:var(--radius-full); padding:6px 12px; font-weight:800;" onclick="event.stopPropagation(); openCreatePostModal('workout');">
          ➕ ${isBg ? 'Пост' : 'Post'}
        </button>
      </div>

      <!-- Active Feed Category Filter Tabs -->
      <div class="tabs" style="margin-bottom: var(--space-lg); overflow-x:auto;" class="scroll-h">
        <button class="tab ${socialActiveTab === 'trending' ? 'active' : ''}" onclick="filterSocialTab('trending')">🔥 ${t('social_trending')}</button>
        <button class="tab ${socialActiveTab === 'reels' ? 'active' : ''}" onclick="filterSocialTab('reels')">🎥 Reels</button>
        <button class="tab ${socialActiveTab === 'following' ? 'active' : ''}" onclick="filterSocialTab('following')">👥 ${t('social_following')}</button>
        <button class="tab ${socialActiveTab === 'nearby' ? 'active' : ''}" onclick="filterSocialTab('nearby')">📍 ${t('social_nearby')}</button>
        <button class="tab ${socialActiveTab === 'music' ? 'active' : ''}" onclick="filterSocialTab('music')">🎵 Music</button>
        <button class="tab ${socialActiveTab === 'coaches' ? 'active' : ''}" onclick="filterSocialTab('coaches')">🏆 ${t('social_coaches')}</button>
      </div>

      <!-- REELS TAB CONTENT -->
      ${socialActiveTab === 'reels' ? `
        <div class="grid-2" style="gap:12px; margin-bottom:var(--space-xl);">
          ${reelsList.map(r => `
            <div class="reels-card" onclick="alert('▶️ Playing Reel: ${r.title}')" style="background:${r.bg};">
              <div class="reels-play-badge">👁️ ${r.views}</div>
              <div class="reels-overlay-gradient"></div>
              <div class="reels-content">
                <div style="font-size:2.4rem; margin-bottom:6px; text-shadow:0 0 20px rgba(255,255,255,0.4);">${r.emoji}</div>
                <div style="font-weight:800; font-size:12px; color:#fff; line-height:1.3; margin-bottom:4px;">${r.title}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:rgba(255,255,255,0.7);">
                  <span>${r.author}</span>
                  <span>❤️ ${r.likes}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- STANDARD FEED POSTS WITH DOUBLE-TAP TO LIKE -->
      ${socialActiveTab !== 'reels' ? (filteredPosts.length === 0 ? `
        <div class="card" style="text-align:center; padding: var(--space-2xl); color: var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:8px;">👥</div>
          <div>${isBg ? 'Няма публикации в тази категория.' : 'No posts found in this feed tab.'}</div>
        </div>
      ` : filteredPosts.map((p, i) => `
        <div class="post-card" ondblclick="triggerDoubleTapLike(event, ${i})" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.05}s; cursor:pointer;" title="${isBg ? 'Двойно кликване за харесване ❤️' : 'Double-click to like ❤️'}">
          <div class="post-header" onclick="event.stopPropagation(); openUserProfileModal('${p.user}')" style="cursor:pointer;">
            <div class="avatar">${p.avatar || '👤'}</div>
            <div class="post-user-info">
              <div class="post-username">${p.user} ${p.verified ? '<span class="verified-badge">✓</span>' : ''}</div>
              <div class="post-meta">${p.time}${p.location ? ' • 📍 ' + p.location : ''}</div>
            </div>
            <button class="btn-icon" onclick="event.stopPropagation(); openPostOptionsMenu(${i})" style="width:32px;height:32px;font-size:14px;cursor:pointer;">⋯</button>
          </div>
          <div class="post-body">
            ${p.text ? `<div class="post-text">${p.text}</div>` : ''}
            ${p.type === 'workout' && p.workout ? `
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
            ${p.type === 'pr' && p.pr ? `
              <div class="pr-card">
                <div class="pr-emoji">${p.pr.emoji || '🏆'}</div>
                <div class="pr-title">${t('social_new_pr')}</div>
                <div class="pr-value">${p.pr.exercise} — ${p.pr.value}</div>
              </div>
            ` : ''}
            ${p.type === 'challenge' && p.challenge ? `
              <div class="challenge-post-card">
                <div style="font-size:1.8rem">🎯</div>
                <div>
                  <div style="font-weight:var(--fw-bold);font-size:var(--fs-sm)">${p.challenge.name}</div>
                  <div class="text-xs text-muted">${p.challenge.participants} ${t('challenges_participants')} • ${p.challenge.daysLeft} ${t('challenges_days_left')}</div>
                </div>
                <button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="event.stopPropagation(); navigate('challenges')">${t('challenges_join')}</button>
              </div>
            ` : ''}
            ${p.type === 'music' && p.music ? `
              <div class="music-track-card">
                <div class="music-cover-art">🎧</div>
                <div class="music-info">
                  <div class="music-title">${p.music.title}</div>
                  <div class="music-artist">${p.music.artist} • ${p.music.tracks} (${p.music.duration})</div>
                  <div class="music-progress">
                    <div class="music-progress-fill" style="width: 55%;"></div>
                  </div>
                </div>
                <button class="music-play-btn" onclick="event.stopPropagation(); alert('▶️ Playing gym beat: ${p.music.title}')">▶</button>
              </div>
            ` : ''}
          </div>
          
          <!-- 100% Functional Interactive Action Buttons -->
          <div class="post-actions" onclick="event.stopPropagation();">
            <button class="post-action-btn ${p.liked ? 'active' : ''}" onclick="togglePostLike(${i})">
              <span>${p.liked ? '❤️' : '🤍'}</span>
              <span>${p.likes || 0}</span>
            </button>
            <button class="post-action-btn" onclick="openCommentsModal(${i})">
              <span>💬</span>
              <span>${p.comments || (p.commentsList ? p.commentsList.length : 0)}</span>
            </button>
            <button class="post-action-btn" onclick="sharePost(${i})" title="Share">
              <span>↗️</span>
            </button>
            <button class="post-action-btn ${p.bookmarked ? 'active' : ''}" onclick="toggleBookmarkPost(${i})" style="margin-left:auto" title="Bookmark">
              <span>${p.bookmarked ? '🔖' : '📑'}</span>
            </button>
          </div>
        </div>
      `).join('')) : ''}
    </div>
  `;
}
