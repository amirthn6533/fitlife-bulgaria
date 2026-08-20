// ========================================
// FitLife Bulgaria — Production Social Feed Engine
// ========================================

let socialActiveTab = 'trending'; // trending, reels, following, nearby, music, coaches

function getSocialFeedPosts() {
  const customPosts = (typeof dbLoad === 'function') ? dbLoad('user_created_posts', []) : [];
  
  // If user has created posts, show them first
  if (customPosts && customPosts.length > 0) {
    return customPosts;
  }

  // Official verified welcome announcement for new communities
  const officialWelcomePost = [
    {
      id: 'official_post_1',
      user: 'FitLife Bulgaria Official',
      avatar: '⚡',
      verified: true,
      time: 'Just now',
      location: 'Sofia, Bulgaria',
      type: 'text',
      category: 'trending',
      isFollowing: true,
      isNearby: true,
      isCoach: true,
      text: getLang() === 'bg' 
        ? '🇧🇬 Добре дошли в официалната фитнес общност на FitLife Bulgaria! Тук можете да споделяте вашите тренировки, да отбелязвате лични рекорди (PR) и да се свързвате с други спортисти в София. Споделете първата си тренировка днес! 🚀💪'
        : '🇧🇬 Welcome to the official FitLife Bulgaria Community! Share your workouts, celebrate new Personal Records (PRs), and connect with athletes across Sofia. Be the first to share your workout today! 🚀💪',
      likes: 12,
      comments: 0,
      liked: false,
      bookmarked: false
    }
  ];

  return officialWelcomePost;
}

function saveSocialFeedPosts(posts) {
  if (typeof dbSave === 'function') {
    dbSave('user_created_posts', posts);
  }
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

  const user = getCurrentUser() || {};
  const userName = user.fullName || 'You';

  const stories = [
    { id: 'st_mine', name: isBg ? 'Твоята история' : 'Your Story', emoji: myStory ? myStory.emoji : '➕', isMine: true, hasActive: !!myStory }
  ];

  if (myStory) {
    stories.push({
      id: 'st_active_mine',
      name: userName.split(' ')[0],
      emoji: myStory.emoji || '🔥',
      isMine: false,
      seen: false,
      customStory: myStory
    });
  }

  const allPosts = getSocialFeedPosts();

  // Reels Workout Guides
  const reelsList = [
    { id: 'reel_1', author: 'FitLife Team', title: isBg ? 'Правилна техника за мъртва тяга 🔥' : 'Deadlift Form Guide & Checklist 🔥', views: '1.2k', likes: '140', tag: 'Technique', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', emoji: '🏋️' },
    { id: 'reel_2', author: 'FitLife Team', title: isBg ? '3 грешки при клек, които да избягвате 🚫' : '3 Common Squat Mistakes to Avoid 🚫', views: '2.4k', likes: '280', tag: 'Mobility', bg: 'linear-gradient(135deg, #701a75, #4a044e)', emoji: '🏆' },
    { id: 'reel_3', author: 'FitLife Team', title: isBg ? '30-секунден протеинов шейк след тренировка 🥩' : '30-Sec Post-Workout Protein Smoothie 🥩', views: '3.1k', likes: '312', tag: 'Nutrition', bg: 'linear-gradient(135deg, #064e3b, #022c22)', emoji: '🥗' },
  ];

  // Filter posts
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
          <button class="btn-icon" onclick="navigate('notifications')">🔔<span class="nav-badge" style="position:absolute;top:-2px;right:-2px">1</span></button>
          <button class="btn-icon" onclick="navigate('messages')">💬</button>
        </div>
      </div>

      <!-- Interactive Stories Bar -->
      <div class="stories-bar" style="margin-bottom: var(--space-md)">
        ${stories.map((s, idx) => `
          <div class="story-item" onclick="${s.isMine && !s.hasActive ? 'openCreateStoryModal()' : `openStoryViewer(${idx})`}" style="cursor:pointer;">
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
        <div class="avatar avatar-sm" style="background:var(--gradient-primary);color:#fff;font-weight:900;">${user.fullName ? user.fullName[0].toUpperCase() : 'A'}</div>
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
            <div class="reels-card" onclick="alert('▶️ FitLife Video Guide: ${r.title}')" style="background:${r.bg};">
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

      <!-- FEED POSTS WITH DOUBLE-TAP TO LIKE -->
      ${socialActiveTab !== 'reels' ? (filteredPosts.length === 0 ? `
        <div class="card" style="text-align:center; padding: var(--space-2xl); color: var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:8px;">👥</div>
          <div>${isBg ? 'Няма публикации в тази категория. Бъдете първият, който ще публикува!' : 'No posts in this feed tab yet. Be the first to share!'}</div>
          <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="openCreatePostModal('workout')">➕ ${isBg ? 'Създай публикация' : 'Create Post'}</button>
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
