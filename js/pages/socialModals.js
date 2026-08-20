// ========================================
// FitLife Bulgaria — Advanced Social Modals, Stories & Instagram FX
// ========================================

// ── 1. Comments Drawer Modal ──
function openCommentsModal(postIndex) {
  const posts = getSocialFeedPosts();
  const post = posts[postIndex];
  if (!post) return;

  const isBg = getLang() === 'bg';
  const postComments = post.commentsList || [
    { user: 'Мария Иванова', avatar: '🧘', text: isBg ? 'Браво! Страхотен прогрес! 🔥💪' : 'Crushing it! Amazing progress! 🔥💪', time: '1h' },
    { user: 'FitCoach Георги', avatar: '🏆', text: isBg ? 'Перфектна форма на клека! Продължавай така!' : 'Flawless squat form! Keep it up!', time: '30m' }
  ];

  const existing = document.getElementById('fitlife-comments-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'fitlife-comments-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.92);display:flex;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(14px);animation:fadeIn 0.2s ease-out;';

  modal.innerHTML = `
    <div class="card card-glow" style="width:100%;max-width:440px;height:70vh;max-height:550px;background:var(--bg-card);border-radius:24px 24px 0 0;display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,255,255,0.12);padding:0;overflow:hidden;">
      
      <!-- Drawer Handle & Header -->
      <div style="padding:14px 18px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.3rem;">💬</span>
          <span style="font-weight:800;font-size:var(--fs-md);color:#fff;">${isBg ? 'Коментари' : 'Comments'} (${postComments.length})</span>
        </div>
        <button onclick="closeCommentsModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Comments List -->
      <div id="comments-list-container" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;">
        ${postComments.map(c => `
          <div style="display:flex;gap:10px;align-items:flex-start;">
            <div class="avatar avatar-sm">${c.avatar || '👤'}</div>
            <div style="flex:1;background:rgba(255,255,255,0.04);border-radius:var(--radius-md);padding:8px 12px;border:1px solid rgba(255,255,255,0.06);">
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span style="font-weight:700;font-size:11px;color:var(--accent);">${c.user}</span>
                <span style="font-size:9px;color:var(--text-muted);">${c.time}</span>
              </div>
              <div style="font-size:12px;color:#fff;line-height:1.4;">${c.text}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Comment Input Form -->
      <form onsubmit="handleAddCommentSubmit(event, ${postIndex})" style="padding:12px 16px;background:rgba(0,0,0,0.3);border-top:1px solid var(--border-subtle);display:flex;gap:8px;">
        <input type="text" id="comment-input-field" placeholder="${isBg ? 'Добави коментар...' : 'Add a comment...'}" style="flex:1;border-radius:var(--radius-full);padding:10px 14px;font-size:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;" required autocomplete="off">
        <button type="submit" class="btn btn-primary" style="border-radius:var(--radius-full);padding:8px 16px;font-weight:800;font-size:12px;">
          ${isBg ? 'Публикувай' : 'Post'}
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeCommentsModal() {
  const modal = document.getElementById('fitlife-comments-modal');
  if (modal) modal.remove();
}

function handleAddCommentSubmit(e, postIndex) {
  e.preventDefault();
  const input = document.getElementById('comment-input-field');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const user = getCurrentUser() || {};
  const isBg = getLang() === 'bg';
  const currentName = user.fullName || (isBg ? 'Спортист' : 'Athlete');
  const posts = getSocialFeedPosts();
  const post = posts[postIndex];

  if (post) {
    if (!post.commentsList) {
      post.commentsList = [];
    }
    post.commentsList.push({
      user: currentName,
      avatar: currentName[0].toUpperCase(),
      text: text,
      time: 'just now'
    });
    post.comments = (post.comments || 0) + 1;

    saveSocialFeedPosts(posts);

    if (typeof HapticService !== 'undefined') HapticService.selection();
    closeCommentsModal();
    openCommentsModal(postIndex);
    renderPage();
  }
}

// ── 2. Full-Screen Auto-Advancing Story Engine ──
const FITLIFE_STORIES_DATA = [
  { id: 'st_1', name: 'Иван Петров', emoji: '🏋️', gym: 'Flais Manastirski Livadi', caption: 'Heavy leg day session! 140kg squats completed 🔥', bg: 'linear-gradient(135deg, #1E1B4B, #4338CA)', time: '2h ago' },
  { id: 'st_2', name: 'Мария Иванова', emoji: '🧘', gym: 'South Park, Sofia', caption: 'Morning yoga & mobility flow ☀️ Feeling refreshed and energized!', bg: 'linear-gradient(135deg, #064E3B, #059669)', time: '3h ago' },
  { id: 'st_3', name: 'Георги Тодоров', emoji: '🏃', gym: 'Borisova Gradina', caption: '10K Morning Run under 48 minutes around the lake 🏃💨', bg: 'linear-gradient(135deg, #7C2D12, #EA580C)', time: '4h ago' },
  { id: 'st_4', name: 'Елена Стоянова', emoji: '💪', gym: 'Pulse Fitness Lozenets', caption: 'Post-workout protein smoothie & sauna session 🥤✨', bg: 'linear-gradient(135deg, #581C87, #9333EA)', time: '5h ago' },
  { id: 'st_5', name: 'Димитър Колев', emoji: '🥗', gym: 'Meal Prep Studio', caption: 'Healthy meal prep for the week: 200g protein daily! 🥩🥑', bg: 'linear-gradient(135deg, #134E4A, #0D9488)', time: '6h ago' },
  { id: 'st_6', name: 'Петя Димитрова', emoji: '🏆', gym: 'Walltopia Climbing', caption: 'Conquered a new 6B+ climbing route today! 🧗🎉', bg: 'linear-gradient(135deg, #831843, #DB2777)', time: '7h ago' }
];

let activeStoryIndex = 0;
let storyTimer = null;
let isStoryPaused = false;
const STORY_DURATION_MS = 4500;

function openStoryViewer(storyIndex = 0) {
  activeStoryIndex = Math.max(0, Math.min(storyIndex, FITLIFE_STORIES_DATA.length - 1));
  renderActiveStory(activeStoryIndex);
}

function renderActiveStory(index) {
  if (storyTimer) clearTimeout(storyTimer);
  isStoryPaused = false;

  if (index >= FITLIFE_STORIES_DATA.length || index < 0) {
    closeStoryViewer();
    return;
  }

  activeStoryIndex = index;
  const story = FITLIFE_STORIES_DATA[index];
  const isBg = getLang() === 'bg';

  markStoryAsSeen(story.id);

  let viewer = document.getElementById('fitlife-story-viewer');
  if (!viewer) {
    viewer = document.createElement('div');
    viewer.id = 'fitlife-story-viewer';
    viewer.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:10000;animation:fadeIn 0.2s ease-out;';
    document.body.appendChild(viewer);
  }

  viewer.innerHTML = `
    <div id="story-modal-card" style="width:100%;max-width:440px;height:100%;background:${story.bg};display:flex;flex-direction:column;position:relative;padding:16px;box-sizing:border-box;user-select:none;">
      
      <!-- Multi-Segmented Progress Bars (Instagram Style) -->
      <div style="display:flex;gap:4px;width:100%;height:3px;margin-bottom:14px;z-index:10;">
        ${FITLIFE_STORIES_DATA.map((_, i) => `
          <div style="flex:1;height:100%;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;">
            <div id="segment-bar-${i}" style="width:${i < activeStoryIndex ? '100%' : '0%'};height:100%;background:#fff;${i === activeStoryIndex ? `transition:width ${STORY_DURATION_MS}ms linear;` : ''}"></div>
          </div>
        `).join('')}
      </div>

      <!-- Top User Info Bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:auto;z-index:10;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="font-size:1.8rem;background:rgba(255,255,255,0.2);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 15px rgba(255,255,255,0.3);">${story.emoji}</div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#fff;">${story.name}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.75);">📍 ${story.gym} • ${story.time}</div>
          </div>
        </div>
        <button onclick="closeStoryViewer()" style="background:rgba(0,0,0,0.35);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);">&times;</button>
      </div>

      <!-- Center Tap & Hold Area (Press and Hold to Pause) -->
      <div id="story-tap-zone" onmousedown="pauseStory()" onmouseup="resumeStory()" ontouchstart="pauseStory()" ontouchend="resumeStory()" style="position:absolute;top:60px;bottom:70px;left:0;right:0;display:flex;z-index:5;">
        <div onclick="goToPrevStory()" style="width:35%;height:100%;cursor:pointer;" title="Previous Story"></div>
        <div onclick="goToNextStory()" style="width:65%;height:100%;cursor:pointer;" title="Next Story"></div>
      </div>

      <!-- Center Story Visual Content -->
      <div style="text-align:center;padding:30px 16px;z-index:6;pointer-events:none;">
        <div style="font-size:7rem;margin-bottom:20px;filter:drop-shadow(0 0 35px rgba(255,255,255,0.45));animation:scaleIn 0.3s ease-out;">${story.emoji}</div>
        <div style="font-size:1.35rem;font-weight:900;color:#fff;line-height:1.4;background:rgba(0,0,0,0.45);border-radius:var(--radius-lg);padding:18px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.18);box-shadow:0 10px 30px rgba(0,0,0,0.3);">
          ${story.caption}
        </div>
      </div>

      <!-- Bottom Quick Reactions Bar -->
      <div style="margin-top:auto;display:flex;gap:8px;align-items:center;background:rgba(0,0,0,0.45);border-radius:var(--radius-full);padding:6px 12px;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.18);z-index:10;">
        <input type="text" placeholder="${isBg ? 'Изпрати съобщение...' : 'Send reply...'}" style="flex:1;background:transparent;border:none;color:#fff;font-size:12px;padding:6px 8px;outline:none;">
        <button onclick="sendStoryReaction('🔥')" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">🔥</button>
        <button onclick="sendStoryReaction('💪')" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">💪</button>
        <button onclick="sendStoryReaction('❤️')" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">❤️</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const activeBar = document.getElementById(`segment-bar-${activeStoryIndex}`);
    if (activeBar) activeBar.style.width = '100%';
  }, 40);

  storyTimer = setTimeout(() => {
    goToNextStory();
  }, STORY_DURATION_MS);
}

function pauseStory() {
  if (isStoryPaused) return;
  isStoryPaused = true;
  if (storyTimer) clearTimeout(storyTimer);
  const activeBar = document.getElementById(`segment-bar-${activeStoryIndex}`);
  if (activeBar) {
    const computed = window.getComputedStyle(activeBar).width;
    activeBar.style.transition = 'none';
    activeBar.style.width = computed;
  }
}

function resumeStory() {
  if (!isStoryPaused) return;
  isStoryPaused = false;
  const activeBar = document.getElementById(`segment-bar-${activeStoryIndex}`);
  if (activeBar) {
    activeBar.style.transition = 'width 2500ms linear';
    activeBar.style.width = '100%';
  }
  storyTimer = setTimeout(() => {
    goToNextStory();
  }, 2500);
}

function goToNextStory() {
  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (activeStoryIndex + 1 < FITLIFE_STORIES_DATA.length) {
    renderActiveStory(activeStoryIndex + 1);
  } else {
    closeStoryViewer();
  }
}

function goToPrevStory() {
  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (activeStoryIndex > 0) {
    renderActiveStory(activeStoryIndex - 1);
  } else {
    renderActiveStory(0);
  }
}

function closeStoryViewer() {
  if (storyTimer) clearTimeout(storyTimer);
  const viewer = document.getElementById('fitlife-story-viewer');
  if (viewer) viewer.remove();
  if (typeof renderPage === 'function') renderPage();
}

function sendStoryReaction(emoji) {
  triggerFlyingEmojis(emoji);
  if (typeof HapticService !== 'undefined') HapticService.heart();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      getLang() === 'bg' ? 'Изпратена реакция' : 'Reaction Sent',
      getLang() === 'bg' ? `Реагирахте с ${emoji} на историята.` : `You reacted with ${emoji} to the story.`,
      emoji
    );
  }
  setTimeout(() => goToNextStory(), 700);
}

function triggerFlyingEmojis(emoji) {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'flying-emoji-particle';
      p.innerText = emoji;
      p.style.left = `${40 + Math.random() * 30}%`;
      p.style.bottom = `${80 + Math.random() * 40}px`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }, i * 120);
  }
}

function markStoryAsSeen(storyId) {
  try {
    const seen = JSON.parse(localStorage.getItem('fitlife-seen-stories') || '[]');
    if (!seen.includes(storyId)) {
      seen.push(storyId);
      localStorage.setItem('fitlife-seen-stories', JSON.stringify(seen));
    }
  } catch(e) {}
}

// ── 3. Instagram Double-Tap on Post to Like ──
let lastTapTime = 0;

function handlePostCardClick(e, postIndex) {
  const now = Date.now();
  if (now - lastTapTime < 300) {
    // Double tap detected!
    triggerDoubleTapLike(e, postIndex);
  }
  lastTapTime = now;
}

function triggerDoubleTapLike(e, postIndex) {
  const posts = getSocialFeedPosts();
  const post = posts[postIndex];
  if (!post) return;

  if (!post.liked) {
    post.liked = true;
    post.likes = (post.likes || 0) + 1;
    saveSocialFeedPosts(posts);
  }

  // Create big pop heart animation at click position
  const targetCard = e.currentTarget || document.querySelectorAll('.post-card')[postIndex];
  if (targetCard) {
    const heart = document.createElement('div');
    heart.className = 'double-tap-heart-anim';
    heart.innerText = '❤️';
    targetCard.style.position = 'relative';
    targetCard.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }

  if (typeof HapticService !== 'undefined') HapticService.heart();
  if (typeof NotificationService !== 'undefined') NotificationService.playChime('general');

  setTimeout(() => renderPage(), 450);
}

// ── 4. Instagram Direct Message Share Sheet ──
function sharePost(postIndex) {
  const isBg = getLang() === 'bg';
  const friends = [
    { name: 'Иван Петров', avatar: '💪' },
    { name: 'Мария Иванова', avatar: '🧘' },
    { name: 'Георги Тодоров', avatar: '🏃' },
    { name: 'Елена Стоянова', avatar: '💪' }
  ];

  const existing = document.getElementById('fitlife-share-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'fitlife-share-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.9);display:flex;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(12px);';

  modal.innerHTML = `
    <div class="card card-glow" style="width:100%;max-width:440px;background:var(--bg-card);border-radius:24px 24px 0 0;padding:20px;animation:slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,255,255,0.12);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <span style="font-weight:800;font-size:var(--fs-md);color:#fff;">↗️ ${isBg ? 'Сподели с приятели' : 'Share to Friends'}</span>
        <button onclick="document.getElementById('fitlife-share-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>

      <!-- Friends 1-Tap DM Grid -->
      <div style="display:flex;gap:14px;overflow-x:auto;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid var(--border-subtle);">
        ${friends.map(f => `
          <div onclick="sendDirectMessageShare('${f.name}')" style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;flex-shrink:0;">
            <div style="width:52px;height:52px;border-radius:50%;background:var(--bg-glass-strong);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.6rem;box-shadow:0 0 10px rgba(0,210,255,0.3);">${f.avatar}</div>
            <span style="font-size:10px;color:#fff;font-weight:600;">${f.name.split(' ')[0]}</span>
          </div>
        `).join('')}
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;gap:10px;">
        <button class="btn btn-secondary btn-full" onclick="copyPostLink()" style="font-size:12px;border-radius:var(--radius-full);">📋 ${isBg ? 'Копирай линк' : 'Copy Link'}</button>
        <button class="btn btn-primary btn-full" onclick="nativeSharePost()" style="font-size:12px;border-radius:var(--radius-full);">📱 ${isBg ? 'Още приложения' : 'More Apps'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function sendDirectMessageShare(name) {
  const isBg = getLang() === 'bg';
  const modal = document.getElementById('fitlife-share-modal');
  if (modal) modal.remove();

  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      isBg ? 'Изпратено!' : 'Sent!',
      isBg ? `Публикацията беше изпратена до ${name} в чата.` : `Post shared with ${name} in Direct Messages.`,
      '✈️'
    );
  }
}

function copyPostLink() {
  const isBg = getLang() === 'bg';
  navigator.clipboard?.writeText(window.location.href);
  const modal = document.getElementById('fitlife-share-modal');
  if (modal) modal.remove();

  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      isBg ? '🔗 Линкът е копиран!' : '🔗 Link Copied!',
      isBg ? 'Линкът беше успешно копиран в клипборда.' : 'Post link copied to clipboard.',
      '📋'
    );
  }
}

function nativeSharePost() {
  const modal = document.getElementById('fitlife-share-modal');
  if (modal) modal.remove();
  if (navigator.share) {
    navigator.share({
      title: 'FitLife Bulgaria Workout',
      text: 'Check out this workout on FitLife Bulgaria!',
      url: window.location.href
    }).catch(() => {});
  }
}

function toggleBookmarkPost(postIndex) {
  const isBg = getLang() === 'bg';
  const posts = getSocialFeedPosts();
  const post = posts[postIndex];
  if (!post) return;

  post.bookmarked = !post.bookmarked;
  saveSocialFeedPosts(posts);

  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      post.bookmarked ? (isBg ? '🔖 Запазено!' : '🔖 Post Saved!') : (isBg ? 'Премахнато' : 'Removed'),
      post.bookmarked ? (isBg ? 'Публикацията е добавена в твоя профил.' : 'Saved to your profile bookmarks.') : '',
      '🔖'
    );
  }
  renderPage();
}

function openPostOptionsMenu(postIndex) {
  const isBg = getLang() === 'bg';
  const action = prompt(
    isBg 
      ? 'Опции:\n1 - Копирай текста\n2 - Докладвай публикация\n3 - Изтрий (ако е твоя)'
      : 'Options:\n1 - Copy text\n2 - Report post\n3 - Delete post',
    '1'
  );

  const posts = getSocialFeedPosts();
  const post = posts[postIndex];
  if (!post) return;

  if (action === '1') {
    navigator.clipboard?.writeText(post.text || '');
    alert(isBg ? 'Текстът е копиран!' : 'Text copied!');
  } else if (action === '2') {
    alert(isBg ? 'Благодарим! Публикацията беше докладвана за преглед.' : 'Thank you! Post reported for moderation.');
  } else if (action === '3') {
    posts.splice(postIndex, 1);
    saveSocialFeedPosts(posts);
    renderPage();
  }
}
