// ========================================
// FitLife Bulgaria — Create Post & Story Studio UI
// ========================================

let createPostType = 'workout'; // workout, text, pr, photo
let createPostMediaUrl = null;

function openCreatePostModal(initialType = 'workout') {
  createPostType = initialType;
  createPostMediaUrl = null;
  const isBg = getLang() === 'bg';
  const user = getCurrentUser() || {};

  const existing = document.getElementById('create-post-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'create-post-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(14px);animation:fadeIn 0.25s ease-out;';

  modal.innerHTML = `
    <div class="card card-glow" style="width:94%;max-width:440px;max-height:90vh;background:var(--bg-glass);border-radius:var(--radius-xl);display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s ease-out;border:1px solid rgba(255,255,255,0.12);padding:0;overflow:hidden;">
      
      <!-- Header -->
      <div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);">
        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          <div style="font-size:1.6rem;">✨</div>
          <div>
            <div style="font-weight:900;font-size:var(--fs-md);color:#fff;">${isBg ? 'Създай публикация' : 'Create New Post'}</div>
            <div class="text-xs text-muted">${isBg ? 'Сподели напредъка си с FitLife общността' : 'Share your fitness journey & PRs'}</div>
          </div>
        </div>
        <button onclick="closeCreatePostModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Type Selector Chips -->
      <div style="display:flex;gap:6px;padding:var(--space-sm) var(--space-md);background:rgba(0,0,0,0.2);overflow-x:auto;" class="scroll-h">
        <button class="tag ${createPostType === 'workout' ? 'tag-primary' : ''}" style="cursor:pointer;white-space:nowrap;" onclick="setPostType('workout')">
          🏋️ ${isBg ? 'Тренировка' : 'Workout'}
        </button>
        <button class="tag ${createPostType === 'pr' ? 'tag-primary' : ''}" style="cursor:pointer;white-space:nowrap;" onclick="setPostType('pr')">
          🏆 ${isBg ? 'Личен Рекорд (PR)' : 'Personal Record'}
        </button>
        <button class="tag ${createPostType === 'photo' ? 'tag-primary' : ''}" style="cursor:pointer;white-space:nowrap;" onclick="setPostType('photo')">
          📸 ${isBg ? 'Снимка / Форма' : 'Photo / Physique'}
        </button>
        <button class="tag ${createPostType === 'text' ? 'tag-primary' : ''}" style="cursor:pointer;white-space:nowrap;" onclick="setPostType('text')">
          💡 ${isBg ? 'Съвет / Мотивация' : 'Motivation'}
        </button>
      </div>

      <!-- Form Body -->
      <form id="create-post-form" onsubmit="handlePublishPost(event)" style="flex:1;overflow-y:auto;padding:var(--space-md);display:flex;flex-direction:column;gap:var(--space-md);">
        
        <!-- User Info Bar -->
        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          <div class="avatar avatar-sm">${user.fullName ? user.fullName[0].toUpperCase() : 'A'}</div>
          <div>
            <div style="font-weight:700;font-size:var(--fs-sm);">${user.fullName || 'Alex Nikolov'}</div>
            <div class="text-xs text-muted">Sofia, Bulgaria 🇧🇬</div>
          </div>
        </div>

        <!-- Post Content Textarea -->
        <textarea id="post-content-input" placeholder="${isBg ? 'Как мина днешната тренировка? Сподели своите постижения...' : 'How was your workout today? Share your reps, volume & energy...'}" style="width:100%;height:90px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius-md);color:#fff;padding:10px;font-size:var(--fs-sm);resize:none;outline:none;" required></textarea>

        <!-- Dynamic Post Type Fields -->
        <div id="post-type-specific-fields">
          ${renderPostTypeFields()}
        </div>

        <!-- Location Selector -->
        <div class="form-group">
          <label class="form-label" style="font-size:11px;">📍 ${isBg ? 'Локация (по избор)' : 'Location (Optional)'}</label>
          <select id="post-location-input" style="font-size:var(--fs-xs);">
            <option value="Flais Fitness (Флайс), Sofia">Flais Fitness (Флайс), Sofia</option>
            <option value="Pulse Fitness, Sofia">Pulse Fitness Lozenets, Sofia</option>
            <option value="Next Level Gym, Sofia">Next Level Gym Vitosha, Sofia</option>
            <option value="Borisova Gradina Park, Sofia">Borisova Gradina Park, Sofia</option>
            <option value="South Park, Sofia">South Park, Sofia</option>
            <option value="Home Gym">Home Gym / Calisthenics</option>
          </select>
        </div>

        <!-- Submit CTA -->
        <button type="submit" id="publish-post-btn" class="btn btn-primary btn-full" style="box-shadow:0 0 20px var(--accent-glow);font-weight:900;">
          🚀 ${isBg ? 'Публикувай във FitLife Feed' : 'Share to Community Feed'}
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeCreatePostModal() {
  const modal = document.getElementById('create-post-modal');
  if (modal) modal.remove();
}

function setPostType(type) {
  createPostType = type;
  openCreatePostModal(type);
}

function renderPostTypeFields() {
  const isBg = getLang() === 'bg';

  if (createPostType === 'workout') {
    return `
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-md);padding:10px;display:flex;flex-direction:column;gap:8px;">
        <div style="font-size:11px;font-weight:700;color:var(--accent);">🏋️ ${isBg ? 'ДАННИ ЗА ТРЕНИРОВКАТА' : 'WORKOUT STATS'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <input type="text" id="post-workout-vol" placeholder="${isBg ? 'Обем: напр. 8,400 kg' : 'Volume: e.g. 8,400 kg'}" value="8,400 kg" style="font-size:11px;">
          <input type="text" id="post-workout-duration" placeholder="${isBg ? 'Време: напр. 55 мин' : 'Duration: e.g. 55 min'}" value="55 min" style="font-size:11px;">
        </div>
      </div>
    `;
  }

  if (createPostType === 'pr') {
    return `
      <div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.3);border-radius:var(--radius-md);padding:10px;display:flex;flex-direction:column;gap:8px;">
        <div style="font-size:11px;font-weight:700;color:#FFD700;">🏆 ${isBg ? 'НОВ ЛИЧЕН РЕКОРД (PR)' : 'NEW PERSONAL RECORD (PR)'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <input type="text" id="post-pr-exercise" placeholder="${isBg ? 'Упражнение (напр. Bench Press)' : 'Exercise (e.g. Bench Press)'}" value="Bench Press" style="font-size:11px;" required>
          <input type="text" id="post-pr-value" placeholder="${isBg ? 'Тежест (напр. 105 kg)' : 'Weight (e.g. 105 kg)'}" value="105 kg" style="font-size:11px;" required>
        </div>
      </div>
    `;
  }

  if (createPostType === 'photo') {
    return `
      <div style="border:2px dashed rgba(255,255,255,0.15);border-radius:var(--radius-md);padding:14px;text-align:center;cursor:pointer;" onclick="document.getElementById('post-photo-file').click()">
        <input type="file" id="post-photo-file" accept="image/*" style="display:none;" onchange="handlePostPhotoSelected(event)">
        <div style="font-size:1.8rem;margin-bottom:4px;">📸</div>
        <div style="font-size:11px;color:var(--text-muted);" id="post-photo-status">
          ${isBg ? 'Кликни за качване на снимка от тренировката' : 'Tap to upload a workout photo'}
        </div>
      </div>
    `;
  }

  return '';
}

function handlePostPhotoSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    createPostMediaUrl = evt.target.result;
    const status = document.getElementById('post-photo-status');
    if (status) status.innerHTML = `<span style="color:#51CF66">✓ Photo attached (${file.name})</span>`;
  };
  reader.readAsDataURL(file);
}

async function handlePublishPost(e) {
  e.preventDefault();
  const content = document.getElementById('post-content-input').value.trim();
  const location = document.getElementById('post-location-input').value;
  const user = getCurrentUser() || {};
  const isBg = getLang() === 'bg';
  const currentName = user.fullName || (isBg ? 'Спортист' : 'Athlete');

  const newPost = {
    id: `user_post_${Date.now()}`,
    user: currentName,
    avatar: currentName[0].toUpperCase(),
    verified: user.is_premium || false,
    time: 'just now',
    location: location,
    type: createPostType,
    text: content,
    likes: 1,
    comments: 0,
    liked: true
  };

  if (createPostType === 'workout') {
    newPost.workout = {
      exercises: ['Bench Press 80kg × 8', 'Incline DB Press 24kg × 10', 'Dips × 12'],
      volume: document.getElementById('post-workout-vol')?.value || '8,400 kg'
    };
  } else if (createPostType === 'pr') {
    newPost.pr = {
      exercise: document.getElementById('post-pr-exercise')?.value || 'Bench Press',
      value: document.getElementById('post-pr-value')?.value || '100 kg',
      emoji: '🏆'
    };
  }

  // Save to local cache
  const localPosts = dbLoad('user_created_posts', []);
  localPosts.unshift(newPost);
  dbSave('user_created_posts', localPosts);

  // Save to Supabase if connected
  if (isSupabaseConnected()) {
    SocialService.createPost({
      postType: createPostType,
      content: content,
      location: location,
      workout: newPost.workout || null,
      pr: newPost.pr || null
    }).then(() => {});
  }

  // Celebratory sound and toast
  if (typeof NotificationService !== 'undefined') {
    NotificationService.notify(
      isBg ? '🚀 Публикацията е на живо!' : '🚀 Post Published!',
      isBg ? 'Твоята публикация беше споделена успешно в общността на FitLife.' : 'Your fitness update was shared with the FitLife community.',
      { type: 'success', icon: '🔥' }
    );
  }

  closeCreatePostModal();
  navigate('social');
}

// ── Story Publisher ──
function openCreateStoryModal() {
  const isBg = getLang() === 'bg';
  const emoji = prompt(isBg ? 'Въведете емоджи за вашето стори (напр. 🔥, 🏋️, 🥗, 🏆):' : 'Enter an emoji for your story (e.g. 🔥, 🏋️, 🥗, 🏆):', '🔥');
  if (!emoji) return;

  const myStory = { name: isBg ? 'Моето стори' : 'My Story', emoji: emoji.trim(), seen: false, isMine: true };
  localStorage.setItem('fitlife-my-active-story', JSON.stringify(myStory));
  
  if (typeof NotificationService !== 'undefined') {
    NotificationService.notify(
      isBg ? '✨ Стори добавено!' : '✨ Story Added!',
      isBg ? 'Твоето 24-часово стори е активно.' : 'Your 24h story is now live.',
      { type: 'success', icon: emoji }
    );
  }
  navigate('social');
}
