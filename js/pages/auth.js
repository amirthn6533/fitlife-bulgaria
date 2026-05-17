// ========================================
// FitLife Bulgaria — Authentication Screen
// ========================================

let isRegisterMode = false;

function renderLogin() {
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      
      <!-- Premium App Logo & Header -->
      <div style="text-align: center; margin-bottom: var(--space-xl); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.5rem; margin-bottom: var(--space-sm); filter: drop-shadow(0 0 20px var(--accent-glow));">⚡</div>
        <h1 class="text-gradient" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin: 0;">FitLife Bulgaria</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${t('home_greeting') === 'Good morning' ? 'Your Ultimate Fitness & Social Hub' : 'Твоят фитнес и социален център'}</p>
      </div>

      <!-- Glassmorphic Auth Form -->
      <div class="card card-glow stager-1" style="width: 90%; max-width: 380px; padding: var(--space-xl); background: var(--bg-glass); border-radius: var(--radius-lg); animation: slideUp 0.6s ease-out both; animation-delay: 0.1s;">
        <h3 id="auth-title" style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg);">${isRegisterMode ? (getLang()==='bg'?'Регистрация':'Sign Up') : (getLang()==='bg'?'Вход':'Sign In')}</h3>
        
        <form id="auth-form" onsubmit="event.preventDefault();">
          ${isRegisterMode ? `
            <div class="form-group">
              <label class="form-label">${getLang()==='bg'?'Име':'Full Name'}</label>
              <input type="text" id="auth-name" placeholder="Alex Nikolov" required>
            </div>
          ` : ''}
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="auth-email" placeholder="alex@fitlife.bg" required>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">${getLang()==='bg'?'Парола':'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full" id="auth-submit-btn" style="margin-bottom: var(--space-md);">
            ${isRegisterMode ? (getLang()==='bg'?'Създай акаунт':'Create Account') : (getLang()==='bg'?'Влез в акаунта':'Sign In')}
          </button>
        </form>

        <!-- Social logins -->
        <div style="display: flex; flex-direction: column; gap: var(--space-sm); margin-top: var(--space-md); border-top: 1px solid var(--border-subtle); padding-top: var(--space-md);">
          <button class="btn btn-secondary btn-full" style="background: #fff; color: #000; font-weight: 600;" onclick="handleMockLogin('Google User')">
            <span style="margin-right: 8px;">🌐</span> ${getLang()==='bg'?'Вход с Google':'Sign in with Google'}
          </button>
          <button class="btn btn-secondary btn-full" style="background: #000; color: #fff; border: 1px solid var(--border-subtle);" onclick="handleMockLogin('Apple User')">
            <span style="margin-right: 8px;"></span> ${getLang()==='bg'?'Вход с Apple':'Sign in with Apple'}
          </button>
        </div>

        <!-- Toggle link -->
        <div style="text-align: center; margin-top: var(--space-lg); font-size: var(--fs-sm);">
          <span class="text-muted">${isRegisterMode ? (getLang()==='bg'?'Вече имаш акаунт?':'Already have an account?') : (getLang()==='bg'?'Нямаш акаунт?':'Don\'t have an account?')}</span>
          <a href="#" id="auth-toggle-link" style="color: var(--accent); font-weight: 600; text-decoration: none; margin-left: 4px;">
            ${isRegisterMode ? (getLang()==='bg'?'Вход':'Sign In') : (getLang()==='bg'?'Регистрация':'Sign Up')}
          </a>
        </div>
      </div>
    </div>
  `;
}

function bindLoginEvents() {
  const toggleLink = document.getElementById('auth-toggle-link');
  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isRegisterMode = !isRegisterMode;
      renderPage();
    });
  }

  const form = document.getElementById('auth-form');
  if (form) {
    form.addEventListener('submit', () => {
      const nameInput = document.getElementById('auth-name');
      const email = document.getElementById('auth-email').value;
      const name = nameInput ? nameInput.value : email.split('@')[0];
      handleMockLogin(name);
    });
  }
}

function handleMockLogin(username) {
  isLoggedIn = true;
  localStorage.setItem('fitlife-logged-in', 'true');
  localStorage.setItem('fitlife-username', username);
  navigate('home');
}

let activePremiumPlan = 'monthly';

function showPremiumModal() {
  const modal = document.createElement('div');
  modal.id = 'premium-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.95);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(10px);animation:fadeIn 0.3s ease-out;';
  
  modal.innerHTML = `
    <div class="card card-glow" style="width:90%;max-width:380px;background:var(--bg-glass);border-radius:var(--radius-lg);padding:var(--space-xl);text-align:center;position:relative;animation:slideUp 0.3s ease-out;border:1px solid rgba(255,255,255,0.1)">
      <button onclick="closePremiumModal()" style="position:absolute;top:15px;right:15px;background:transparent;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;outline:none;">&times;</button>
      
      <div style="font-size:3.5rem;margin-bottom:var(--space-sm);filter:drop-shadow(0 0 15px var(--accent-glow));">👑</div>
      <h2 class="text-gradient" style="font-size:1.8rem;font-weight:900;letter-spacing:-1px;margin:0;">FitLife PRO</h2>
      <p class="text-xs text-muted" style="margin-top:4px;margin-bottom:var(--space-lg);">${getLang()==='bg'?'Отключи своя пълноценен потенциал':'Unlock Your Ultimate Fitness Potential'}</p>
      
      <!-- Features list -->
      <div style="text-align:left;margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-sm);font-size:var(--fs-sm);border-bottom:1px solid var(--border-subtle);padding-bottom:var(--space-md);">
        <div>✨ <strong>${getLang()==='bg'?'Хранителен Режим (Диета)':'Regime & Custom Meal Plans'}</strong></div>
        <div>🤖 <strong>${getLang()==='bg'?'Интелигентен AI Фитнес Коуч':'Personal AI Training Programs'}</strong></div>
        <div>📸 <strong>${getLang()==='bg'?'Неограничен Анализ на Храната':'Unlimited Food Photo Scan'}</strong></div>
        <div>💸 <strong>${getLang()==='bg'?'VIP Предизвикателства с Награди':'VIP Challenges & Escrow Pools'}</strong></div>
      </div>

      <!-- Pricing Cards -->
      <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg);">
        <div onclick="selectPremiumPlan('monthly')" id="plan-monthly" style="flex:1;background:var(--bg-glass);border:2px solid var(--accent);border-radius:var(--radius-md);padding:var(--space-md);cursor:pointer;transition:0.3s;">
          <div style="font-weight:700;font-size:var(--fs-md)">${getLang()==='bg'?'Месечен':'Monthly'}</div>
          <div style="font-size:1.2rem;font-weight:900;margin-top:4px;color:var(--accent)">9.90 BGN</div>
          <div class="text-xs text-muted">/ ${getLang()==='bg'?'месец':'month'}</div>
        </div>
        <div onclick="selectPremiumPlan('yearly')" id="plan-yearly" style="flex:1;background:var(--bg-glass);border:2px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md);cursor:pointer;transition:0.3s;">
          <div style="font-weight:700;font-size:var(--fs-md)">${getLang()==='bg'?'Годишен':'Yearly'}</div>
          <div style="font-size:1.2rem;font-weight:900;margin-top:4px;color:var(--success)">79.90 BGN</div>
          <div class="text-xs text-muted">/ ${getLang()==='bg'?'година':'year'}</div>
        </div>
      </div>

      <button onclick="subscribeToPremium()" class="btn btn-primary btn-full" style="box-shadow:0 0 20px var(--accent-glow)">
        ${getLang()==='bg'?'Абонирай се сега':'Subscribe Now'}
      </button>
      <div class="text-xs text-muted" style="margin-top:10px;">${getLang()==='bg'?'Отказване по всяко време.':'Cancel subscription anytime.'}</div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closePremiumModal() {
  const m = document.getElementById('premium-modal');
  if (m) m.remove();
}

function selectPremiumPlan(plan) {
  activePremiumPlan = plan;
  const pMonthly = document.getElementById('plan-monthly');
  const pYearly = document.getElementById('plan-yearly');
  
  if (plan === 'monthly') {
    pMonthly.style.borderColor = 'var(--accent)';
    pYearly.style.borderColor = 'var(--border-subtle)';
  } else {
    pMonthly.style.borderColor = 'var(--border-subtle)';
    pYearly.style.borderColor = 'var(--success)';
  }
}

function subscribeToPremium() {
  localStorage.setItem('fitlife-premium', 'true');
  alert(getLang()==='bg' ? '🎉 Честито! Успешно се абонирахте за FitLife PRO!' : '🎉 Congratulations! You successfully subscribed to FitLife PRO!');
  closePremiumModal();
  renderPage();
}
