// ========================================
// FitLife Bulgaria — AI Coach Studio & Modal UI
// ========================================

let aiCoachActiveTab = 'generator'; // generator, chat, diet
let aiChatMessages = [];

function openAICoachModal(initialTab = 'generator') {
  aiCoachActiveTab = initialTab;
  if (aiChatMessages.length === 0) {
    const isBg = getLang() === 'bg';
    aiChatMessages = [
      {
        sender: 'ai',
        text: isBg
          ? '👋 Здравей! Аз съм твоят личен **AI Фитнес Коуч**. Как мога да ти помогна днес? Можеш да ме попиташ за съвет за тренировка, хранене или да генерираме персонализиран план!'
          : '👋 Hello! I am your personal **AI Fitness Coach**. How can I help you today? Ask me anything about training, nutrition, or let us generate your custom routine!'
      }
    ];
  }

  const existing = document.getElementById('ai-coach-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'ai-coach-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(12px);animation:fadeIn 0.25s ease-out;';
  
  const isGeminiActive = (typeof GeminiAIService !== 'undefined' && GeminiAIService.hasApiKey());

  modal.innerHTML = `
    <div class="card card-glow" style="width:94%;max-width:440px;height:88vh;max-height:680px;background:var(--bg-glass);border-radius:var(--radius-xl);display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s ease-out;border:1px solid rgba(255,255,255,0.12);padding:0;overflow:hidden;">
      
      <!-- Modal Header -->
      <div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);">
        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          <div style="font-size:1.8rem;filter:drop-shadow(0 0 10px var(--accent-glow));">🤖</div>
          <div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:900;font-size:var(--fs-md);background:linear-gradient(135deg,#fff,#00D2FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">FitLife AI Coach</span>
              <span class="tag ${isGeminiActive ? 'tag-success' : 'tag-accent'}" style="font-size:9px;cursor:pointer;" onclick="promptGeminiApiKey()" title="Click to configure Google Gemini API Key">
                ${isGeminiActive ? 'Gemini Live 🟢' : 'Gemini AI ⚡'}
              </span>
            </div>
            <div class="text-xs text-muted">Powered by Sports Science & Deep Learning</div>
          </div>
        </div>
        <button onclick="closeAICoachModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Navigation Tabs inside AI Modal -->
      <div class="tabs" style="padding:var(--space-xs) var(--space-md);background:rgba(0,0,0,0.2);">
        <button class="tab ${aiCoachActiveTab === 'generator' ? 'active' : ''}" onclick="switchAICoachTab('generator')">
          ⚡ ${getLang() === 'bg' ? 'Генератор на План' : 'Plan Generator'}
        </button>
        <button class="tab ${aiCoachActiveTab === 'chat' ? 'active' : ''}" onclick="switchAICoachTab('chat')">
          💬 ${getLang() === 'bg' ? 'AI Чат Коуч' : 'AI Chat'}
        </button>
        <button class="tab ${aiCoachActiveTab === 'diet' ? 'active' : ''}" onclick="switchAICoachTab('diet')">
          🥗 ${getLang() === 'bg' ? 'AI Диета' : 'Macro Diet'}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="ai-modal-body" style="flex:1;overflow-y:auto;padding:var(--space-md);display:flex;flex-direction:column;">
        ${renderAICoachTabContent()}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function promptGeminiApiKey() {
  const isBg = getLang() === 'bg';
  const current = (typeof GeminiAIService !== 'undefined') ? GeminiAIService.getApiKey() : '';
  const key = prompt(
    isBg ? 'Въведете вашия безплатен Google Gemini API Key (от aistudio.google.com):' : 'Enter your free Google Gemini API Key (from aistudio.google.com):',
    current
  );
  if (key !== null && typeof GeminiAIService !== 'undefined') {
    GeminiAIService.setApiKey(key);
    alert(key ? '✅ Google Gemini Live AI Connected!' : 'Switched to offline Sports Science Engine.');
    openAICoachModal(aiCoachActiveTab);
  }
}

function closeAICoachModal() {
  const modal = document.getElementById('ai-coach-modal');
  if (modal) modal.remove();
}

function switchAICoachTab(tab) {
  aiCoachActiveTab = tab;
  const modalBody = document.getElementById('ai-modal-body');
  if (modalBody) {
    modalBody.innerHTML = renderAICoachTabContent();
    document.querySelectorAll('#ai-coach-modal .tabs .tab').forEach((t, i) => {
      t.classList.toggle('active', (i === 0 && tab === 'generator') || (i === 1 && tab === 'chat') || (i === 2 && tab === 'diet'));
    });
  }
}

function renderAICoachTabContent() {
  const isBg = getLang() === 'bg';
  const user = getCurrentUser() || {};

  if (aiCoachActiveTab === 'chat') {
    return `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;height:100%;">
        <div id="ai-chat-history" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:var(--space-sm);padding-bottom:var(--space-md);">
          ${aiChatMessages.map(m => `
            <div style="display:flex;justify-content:${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
              <div style="max-width:85%;padding:var(--space-sm) var(--space-md);border-radius:${m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};background:${m.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.08)'};color:#fff;font-size:var(--fs-sm);line-height:1.45;border:${m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'}">
                ${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Prompt Chips -->
        <div style="display:flex;gap:6px;overflow-x:auto;padding:6px 0;margin-bottom:var(--space-xs);" class="scroll-h">
          <button class="tag" style="cursor:pointer;white-space:nowrap;" onclick="sendAIChatQuick('${isBg ? 'Колко протеин ми трябва?' : 'How much protein do I need?'}')">🥩 ${isBg ? 'Протеин' : 'Protein'}</button>
          <button class="tag" style="cursor:pointer;white-space:nowrap;" onclick="sendAIChatQuick('${isBg ? 'Как да вдигам повече на лег?' : 'How to bench more?'}')">🏋️ ${isBg ? 'Лежанка' : 'Bench Press'}</button>
          <button class="tag" style="cursor:pointer;white-space:nowrap;" onclick="sendAIChatQuick('${isBg ? 'Какво да ям преди тренировка?' : 'Pre-workout meal?'}')">⚡ ${isBg ? 'Преди зала' : 'Pre-workout'}</button>
          <button class="tag" style="cursor:pointer;white-space:nowrap;" onclick="sendAIChatQuick('${isBg ? 'Как се приема креатин?' : 'How to take creatine?'}')">💊 ${isBg ? 'Креатин' : 'Creatine'}</button>
        </div>

        <!-- Chat Input Form -->
        <form onsubmit="handleSendAIChat(event)" style="display:flex;gap:var(--space-xs);">
          <input type="text" id="ai-chat-input" placeholder="${isBg ? 'Попитай AI Коуча...' : 'Ask your AI Coach...'}" style="flex:1;border-radius:var(--radius-full);padding:var(--space-sm) var(--space-md);font-size:var(--fs-sm);" required autocomplete="off">
          <button type="submit" class="btn btn-primary" style="border-radius:var(--radius-full);padding:var(--space-sm) var(--space-md);display:flex;align-items:center;justify-content:center;">
            ➤
          </button>
        </form>
      </div>
    `;
  }

  if (aiCoachActiveTab === 'diet') {
    const macros = AICoachService.calculateNutrition(user.profile || {});
    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        <div class="card card-glow" style="background:rgba(255,255,255,0.04);border-radius:var(--radius-lg);padding:var(--space-md);text-align:center;">
          <div class="text-xs text-muted">${isBg ? 'Дневна Калорийна Цел (TDEE)' : 'Daily Target Energy (TDEE)'}</div>
          <div style="font-size:2.2rem;font-weight:900;margin:6px 0;color:var(--accent);">${macros.calories} <span style="font-size:var(--fs-sm);color:var(--text-muted);">kcal</span></div>
          <div class="text-xs text-muted">${isBg ? 'Хидратация:' : 'Hydration:'} 💧 ${macros.waterLiters}L / ${isBg ? 'ден' : 'day'}</div>
        </div>

        <div class="grid-3" style="gap:var(--space-xs);">
          <div class="stat-card" style="padding:var(--space-sm);border-left:3px solid var(--danger);">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--danger);">${macros.protein}g</div>
            <div class="stat-label">${isBg ? 'Протеин' : 'Protein'}</div>
          </div>
          <div class="stat-card" style="padding:var(--space-sm);border-left:3px solid var(--accent);">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--accent);">${macros.carbs}g</div>
            <div class="stat-label">${isBg ? 'Въглехидрати' : 'Carbs'}</div>
          </div>
          <div class="stat-card" style="padding:var(--space-sm);border-left:3px solid var(--warning);">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--warning);">${macros.fats}g</div>
            <div class="stat-label">${isBg ? 'Мазнини' : 'Fats'}</div>
          </div>
        </div>

        <button class="btn btn-primary btn-full" onclick="applyAIMacros(${JSON.stringify(macros).replace(/"/g, '&quot;')})">
          💾 ${isBg ? 'Запази в моите хранителни цели' : 'Save as Active Nutrition Goal'}
        </button>
      </div>
    `;
  }

  // Default: Generator Tab
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-md);">
      <div class="form-group">
        <label class="form-label">${isBg ? '🎯 Основна Цел' : '🎯 Primary Fitness Goal'}</label>
        <div class="select-group" id="ai-goal-group">
          <button type="button" class="select-option active" data-val="hypertrophy">💪 ${isBg ? 'Мускулна маса' : 'Muscle Build'}</button>
          <button type="button" class="select-option" data-val="fatloss">🔥 ${isBg ? 'Изчистване / Релеф' : 'Fat Loss / Cut'}</button>
          <button type="button" class="select-option" data-val="strength">⚡ ${isBg ? 'Сила (Power)' : 'Strength'}</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${isBg ? '📅 Дни за тренировка в седмицата' : '📅 Training Days per Week'}</label>
        <div class="select-group" id="ai-days-group">
          <button type="button" class="select-option" data-val="3">3 ${isBg ? 'дни' : 'days'}</button>
          <button type="button" class="select-option active" data-val="4">4 ${isBg ? 'дни' : 'days'}</button>
          <button type="button" class="select-option" data-val="5">5 ${isBg ? 'дни' : 'days'}</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${isBg ? '🏋️ Оборудване' : '🏋️ Equipment Available'}</label>
        <div class="select-group" id="ai-equip-group">
          <button type="button" class="select-option active" data-val="full_gym">🏛️ ${isBg ? 'Фитнес Зала' : 'Full Gym'}</button>
          <button type="button" class="select-option" data-val="dumbbells">🔩 ${isBg ? 'Дъмбели' : 'Dumbbells'}</button>
          <button type="button" class="select-option" data-val="bodyweight">🤸 ${isBg ? 'Собствено тегло' : 'Bodyweight'}</button>
        </div>
      </div>

      <div id="ai-generator-result" style="display:none;margin-top:var(--space-sm);"></div>

      <button id="ai-gen-btn" class="btn btn-primary btn-full" style="box-shadow:0 0 20px var(--accent-glow);" onclick="handleRunAIGenerator()">
        ✨ ${isBg ? 'Генерирай Персонализиран AI План' : 'Generate Custom AI Plan'}
      </button>
    </div>
  `;
}

function handleRunAIGenerator() {
  const btn = document.getElementById('ai-gen-btn');
  const resultContainer = document.getElementById('ai-generator-result');
  const isBg = getLang() === 'bg';

  if (!btn || !resultContainer) return;

  btn.disabled = true;
  btn.innerHTML = `<span style="animation:spin 1s linear infinite;display:inline-block">⏳</span> ${isBg ? 'AI Анализира мускулните групи...' : 'AI Analyzing Anatomy & Biomechanics...'}`;

  const goal = document.querySelector('#ai-goal-group .select-option.active')?.dataset.val || 'hypertrophy';
  const days = document.querySelector('#ai-days-group .select-option.active')?.dataset.val || '4';
  const equip = document.querySelector('#ai-equip-group .select-option.active')?.dataset.val || 'full_gym';

  setTimeout(() => {
    const generatedPlan = AICoachService.generateWorkoutPlan({ goal, days, equipment: equip });
    
    // Save to user's local active routine
    localStorage.setItem('fitlife-ai-custom-routine', JSON.stringify(generatedPlan));

    btn.disabled = false;
    btn.innerHTML = `✨ ${isBg ? 'Генерирай нов план' : 'Regenerate Plan'}`;

    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
      <div class="card card-glow" style="background:rgba(0,210,255,0.06);border:1px solid var(--accent);border-radius:var(--radius-md);padding:var(--space-md);margin-bottom:var(--space-md);">
        <div style="font-weight:900;color:var(--accent);margin-bottom:var(--space-xs);">
          🎉 ${isBg ? 'AI Планът е готов!' : 'Your Custom Routine is Ready!'}
        </div>
        <div class="text-xs text-muted" style="margin-bottom:var(--space-sm);">
          ${generatedPlan.length} ${isBg ? 'тренировъчни дни с оптимизиран обем и почивки.' : 'structured training days with progressive periodization.'}
        </div>
        <button class="btn btn-success btn-full btn-sm" onclick="applyGeneratedPlanAndClose()">
          🚀 ${isBg ? 'Зареди в страница Тренировка' : 'Load into Workout Tab'}
        </button>
      </div>
    `;
  }, 900);
}

function applyGeneratedPlanAndClose() {
  closeAICoachModal();
  navigate('workout');
}

async function handleSendAIChat(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  if (!input || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  aiChatMessages.push({ sender: 'user', text: query });
  switchAICoachTab('chat');

  // Show thinking indicator
  aiChatMessages.push({ sender: 'ai', text: '💭 AI Analyzing...' });
  switchAICoachTab('chat');

  let response = '';
  if (typeof GeminiAIService !== 'undefined' && GeminiAIService.hasApiKey()) {
    response = await GeminiAIService.askLiveGemini(query, aiChatMessages);
  } else if (typeof AICoachService !== 'undefined') {
    response = AICoachService.askCoach(query);
  }

  aiChatMessages.pop(); // remove thinking indicator
  aiChatMessages.push({ sender: 'ai', text: response });
  switchAICoachTab('chat');

  const history = document.getElementById('ai-chat-history');
  if (history) history.scrollTop = history.scrollHeight;
}

function sendAIChatQuick(text) {
  const input = document.getElementById('ai-chat-input');
  if (input) input.value = text;
  handleSendAIChat(new Event('submit'));
}

async function applyAIMacros(macros) {
  const isBg = getLang() === 'bg';
  const user = getCurrentUser();
  if (user) {
    if (isSupabaseConnected()) {
      await supabaseClient.from('nutrition_goals').upsert({
        user_id: user.id,
        daily_calories_target: macros.calories,
        protein_target_g: macros.protein,
        carbs_target_g: macros.carbs,
        fats_target_g: macros.fats
      });
    }
  }
  localStorage.setItem('fitlife-custom-macros', JSON.stringify(macros));
  alert(isBg ? '✅ Хранителните цели бяха обновени успешно!' : '✅ Nutrition targets updated successfully!');
  closeAICoachModal();
  navigate('nutrition');
}
