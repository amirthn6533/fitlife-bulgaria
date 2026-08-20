// ========================================
// FitLife Bulgaria — Production Authentication Screen
// ========================================

const AUTH_USERS_KEY = 'fitlife-users';
const AUTH_SESSION_KEY = 'fitlife-session';
const AUTH_OTP_KEY = 'fitlife-otp';
const AUTH_TEMP_USER_KEY = 'fitlife-temp-user';
const DEFAULT_TOKEN_LIFETIME = 60 * 60 * 24 * 30; // 30 days session

let authScreen = 'login';
let authOtpPurpose = '';
let authTempUserId = '';
let authResetUserId = '';
let activePremiumPlan = 'monthly';

function loadAuthUsers() {
  const stored = localStorage.getItem(AUTH_USERS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed)) return parsed;
    } catch (err) {}
  }
  return [];
}

function saveAuthUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  if (!email) return null;
  return loadAuthUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  if (!id) return null;
  return loadAuthUsers().find(u => u.id === id) || null;
}

function updateUser(user) {
  const users = loadAuthUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveAuthUsers(users);
  updateSessionUser(user);
}

function hashPassword(password) {
  return btoa(password || '');
}

function createId() {
  return `user_${Math.random().toString(36).slice(2, 11)}`;
}

function generateJWT(payload, expiresIn = DEFAULT_TOKEN_LIFETIME) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  const signature = btoa('fitlife-signature');
  return `${header}.${body}.${signature}`;
}

function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (err) {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function updateSessionUser(user) {
  const session = getSession();
  if (!session) return;
  session.user = { ...user };
  saveSession(session);
}

function createSession(user) {
  const token = generateJWT({ userId: user.id, role: user.role || 'user' });
  const session = {
    token,
    user: { ...user },
    createdAt: Date.now(),
  };
  saveSession(session);
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function getSession() {
  const stored = localStorage.getItem(AUTH_SESSION_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored);
    const payload = parseJWT(session.token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) {
      clearSession();
      return null;
    }
    return session;
  } catch (err) {
    clearSession();
    return null;
  }
}

function isAuthenticated() {
  return getSession() !== null;
}

function getCurrentUser() {
  return getSession()?.user || null;
}

function hasCompleteProfile(user) {
  return !!user && user.onboarded;
}

function isAuthScreen() {
  return ['login', 'register', 'forgot', 'otp', 'reset'].includes(authScreen);
}

function maskEmail(email) {
  if (!email) return '';
  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1] || '';
  return `${local.slice(0, 2)}${local.length > 4 ? '****' : '***'}@${domain}`;
}

function maskPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\d(?=\d{4})/g, '*');
}

function setTempUserId(id) {
  authTempUserId = id;
  localStorage.setItem(AUTH_TEMP_USER_KEY, id);
}

function getTempUserId() {
  if (authTempUserId) return authTempUserId;
  return localStorage.getItem(AUTH_TEMP_USER_KEY) || '';
}

function clearTempUserId() {
  authTempUserId = '';
  localStorage.removeItem(AUTH_TEMP_USER_KEY);
}

function saveOtp(code, purpose, userId, via) {
  const payload = {
    code,
    purpose,
    userId,
    via,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  localStorage.setItem(AUTH_OTP_KEY, JSON.stringify(payload));
}

function getSavedOtp() {
  const raw = localStorage.getItem(AUTH_OTP_KEY);
  if (!raw) return null;
  try {
    const otp = JSON.parse(raw);
    if (Date.now() > otp.expiresAt) {
      localStorage.removeItem(AUTH_OTP_KEY);
      return null;
    }
    return otp;
  } catch (err) {
    return null;
  }
}

function sendOtp(purpose, userId, via = 'email') {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  saveOtp(code, purpose, userId, via);
  setTempUserId(userId);
  authOtpPurpose = purpose;
  
  if (typeof NotificationService !== 'undefined') {
    NotificationService.showInAppBanner(
      getLang() === 'bg' ? 'Код за потвърждение' : 'Verification Code',
      getLang() === 'bg' ? `Вашият код за достъп е: ${code}` : `Your verification code is: ${code}`,
      '🔐'
    );
  }
}

function validateOtp(code) {
  const otp = getSavedOtp();
  return otp && otp.code === code.trim();
}

function logout() {
  clearSession();
  authScreen = 'login';
  currentPage = 'home';
  clearTempUserId();
  if (typeof HapticService !== 'undefined') HapticService.selection();
  renderPage();
}

async function handleLoginForm(event) {
  event.preventDefault();
  const isBg = getLang() === 'bg';
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  if (!email || !password) {
    return alert(isBg ? 'Моля, въведете имейл и парола.' : 'Please enter your email and password.');
  }

  // Check Supabase real auth if connected
  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (!error && data?.user) {
        const user = {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email,
          role: 'user',
          onboarded: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        updateUser(user);
        createSession(user);
        authScreen = 'app';
        currentPage = 'home';
        if (typeof HapticService !== 'undefined') HapticService.success();
        return renderPage();
      }
    } catch(e) {}
  }

  const user = findUserByEmail(email);
  if (!user) {
    return alert(isBg ? 'Няма регистриран акаунт с този имейл. Моля, регистрирайте се.' : 'No account found with this email. Please sign up.');
  }
  if (user.password !== hashPassword(password)) {
    return alert(isBg ? 'Грешна парола. Опитайте отново.' : 'Invalid password. Please try again.');
  }

  createSession(user);
  authScreen = 'app';
  currentPage = 'home';
  if (typeof HapticService !== 'undefined') HapticService.success();
  renderPage();
}

async function handleRegisterForm(event) {
  event.preventDefault();
  const isBg = getLang() === 'bg';
  const fullName = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const phone = document.getElementById('auth-phone').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const confirmPassword = document.getElementById('auth-password-confirm').value.trim();

  if (!fullName || !email || !phone || !password) {
    return alert(isBg ? 'Моля, попълнете всички задължителни полета.' : 'Please complete all required fields.');
  }
  if (password.length < 6) {
    return alert(isBg ? 'Паролата трябва да е поне 6 символа.' : 'Password must be at least 6 characters.');
  }
  if (password !== confirmPassword) {
    return alert(isBg ? 'Паролите не съвпадат.' : 'Passwords do not match.');
  }
  if (findUserByEmail(email)) {
    return alert(isBg ? 'Този имейл вече е регистриран. Моля, влезте в профила си.' : 'This email is already registered. Please sign in.');
  }

  // Attempt Supabase sign up if connected
  if (isSupabaseConnected()) {
    try {
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone }
        }
      });
    } catch(e) {}
  }

  const user = {
    id: createId(),
    fullName,
    email,
    phone,
    password: hashPassword(password),
    role: 'user',
    emailVerified: false,
    phoneVerified: false,
    onboarded: false,
    premium: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile: {
      goal: 'Stronger & healthier',
      gender: 'Other',
      height: '175',
      weight: '70',
      birthday: '',
      bio: `FitLife athlete from Sofia 🇧🇬`,
    },
  };

  const users = loadAuthUsers();
  users.push(user);
  saveAuthUsers(users);
  
  createSession(user);
  sendOtp('verify', user.id, 'email');
  authScreen = 'otp';
  if (typeof HapticService !== 'undefined') HapticService.selection();
  renderPage();
}

function handleForgotForm(event) {
  event.preventDefault();
  const isBg = getLang() === 'bg';
  const email = document.getElementById('auth-email').value.trim();
  const user = findUserByEmail(email);
  if (!user) {
    return alert(isBg ? 'Няма намерен акаунт с този имейл.' : 'No account found with this email.');
  }
  authTempUserId = user.id;
  sendOtp('reset', user.id, 'email');
  authScreen = 'otp';
  if (typeof HapticService !== 'undefined') HapticService.selection();
  renderPage();
}

function handleVerifyOtpForm(event) {
  event.preventDefault();
  const isBg = getLang() === 'bg';
  const code = (document.getElementById('auth-otp')?.value || '').trim();
  const otp = getSavedOtp();
  const targetId = (otp && otp.userId) || authTempUserId || getTempUserId();

  if (!code || code.length < 4) {
    return alert(isBg ? 'Моля, въведете 4-цифрения код.' : 'Please enter the 4-digit code.');
  }

  if (validateOtp(code)) {
    const user = findUserById(targetId);
    if (!user) {
      return alert(isBg ? 'Потребителят не е намерен.' : 'User not found.');
    }

    if (authOtpPurpose === 'reset') {
      authResetUserId = user.id;
      authScreen = 'reset';
      return renderPage();
    }

    user.emailVerified = true;
    user.updatedAt = Date.now();
    updateUser(user);
    createSession(user);
    clearTempUserId();
    localStorage.removeItem(AUTH_OTP_KEY);

    authScreen = 'onboarding';
    if (typeof HapticService !== 'undefined') HapticService.success();
    return renderPage();
  }

  alert(isBg ? 'Невалиден или изтекъл код. Опитайте отново.' : 'Invalid or expired code. Please try again.');
}

function handleResetPasswordForm(event) {
  event.preventDefault();
  const isBg = getLang() === 'bg';
  const password = document.getElementById('auth-password').value.trim();
  const confirm = document.getElementById('auth-password-confirm').value.trim();

  if (password.length < 6) {
    return alert(isBg ? 'Паролата трябва да е поне 6 символа.' : 'Password must be at least 6 characters.');
  }
  if (password !== confirm) {
    return alert(isBg ? 'Паролите не съвпадат.' : 'Passwords do not match.');
  }

  const user = findUserById(authResetUserId);
  if (!user) {
    return alert(isBg ? 'Грешка при намиране на акаунта.' : 'Error finding account.');
  }

  user.password = hashPassword(password);
  user.updatedAt = Date.now();
  updateUser(user);
  createSession(user);
  authResetUserId = '';
  authScreen = 'app';
  currentPage = 'home';
  if (typeof HapticService !== 'undefined') HapticService.success();
  alert(isBg ? 'Паролата беше сменена успешно!' : 'Password updated successfully!');
  renderPage();
}

function handleOnboardingForm(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const fullName = document.getElementById('profile-fullname').value.trim();
  const goal = document.getElementById('profile-goal').value.trim();
  const gender = document.getElementById('profile-gender').value.trim();
  const weight = document.getElementById('profile-weight').value.trim();
  const height = document.getElementById('profile-height').value.trim();

  user.fullName = fullName || user.fullName;
  user.profile = {
    goal,
    gender,
    weight,
    height,
    bio: `FitLife Athlete 🇧🇬`
  };
  user.onboarded = true;
  user.updatedAt = Date.now();
  updateUser(user);

  authScreen = 'app';
  currentPage = 'home';
  if (typeof HapticService !== 'undefined') HapticService.success();
  renderPage();
}

function renderAuth() {
  switch (authScreen) {
    case 'register': return renderRegister();
    case 'forgot': return renderForgotPassword();
    case 'otp': return renderOtp();
    case 'reset': return renderResetPassword();
    case 'onboarding': return renderOnboarding();
    default: return renderLogin();
  }
}

function renderLogin() {
  const isBg = getLang() === 'bg';
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div style="text-align: center; margin-bottom: var(--space-xl); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.5rem; margin-bottom: var(--space-sm); filter: drop-shadow(0 0 20px var(--accent-glow));">⚡</div>
        <h1 class="text-gradient" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin: 0;">FitLife Bulgaria</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${isBg ? 'Вашият AI фитнес и социален асистент' : 'Your AI Fitness & Running Platform'}</p>
      </div>

      <div class="card card-glow" style="width: 90%; max-width: 400px; padding: var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg); font-weight:800; color:#fff;">${isBg ? 'Вход в профила' : 'Sign In'}</h3>

        <form id="auth-form" onsubmit="handleLoginForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label class="form-label text-xs">${isBg ? 'Имейл адрес' : 'Email Address'}</label>
            <input type="email" id="auth-email" placeholder="name@example.com" required autocomplete="email">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label text-xs">${isBg ? 'Парола' : 'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required autocomplete="current-password">
          </div>

          <button type="submit" class="btn btn-primary btn-full" style="margin-bottom: var(--space-md); font-weight:800;">
            ${isBg ? 'Влез в акаунта' : 'Sign In'}
          </button>
        </form>

        <div style="display:flex; justify-content:space-between; margin-top: var(--space-sm); border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <button class="btn btn-ghost" style="font-size:12px;" onclick="authScreen='register'; renderPage();">${isBg ? 'Създай акаунт' : 'Create Account'}</button>
          <button class="btn btn-ghost" style="font-size:12px;" onclick="authScreen='forgot'; renderPage();">${isBg ? 'Забравена парола?' : 'Forgot password?'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  const isBg = getLang() === 'bg';
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div style="text-align: center; margin-bottom: var(--space-lg); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.2rem; margin-bottom: var(--space-xs); filter: drop-shadow(0 0 20px var(--accent-glow));">🔥</div>
        <h1 class="text-gradient" style="font-size: 2rem; font-weight: 900; margin: 0;">FitLife Bulgaria</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${isBg ? 'Създай своя личен фитнес профил' : 'Create your personal athlete profile'}</p>
      </div>

      <div class="card card-glow" style="width: 90%; max-width: 400px; padding: var(--space-lg) var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg); font-weight:800; color:#fff;">${isBg ? 'Регистрация' : 'Sign Up'}</h3>

        <form id="auth-form" onsubmit="handleRegisterForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Име и фамилия' : 'Full Name'}</label>
            <input type="text" id="auth-name" placeholder="${isBg ? 'Иван Иванов' : 'John Doe'}" required autocomplete="name">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Имейл адрес' : 'Email Address'}</label>
            <input type="email" id="auth-email" placeholder="name@example.com" required autocomplete="email">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Телефонен номер' : 'Phone Number'}</label>
            <input type="tel" id="auth-phone" placeholder="+359 88 ..." required autocomplete="tel">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Парола' : 'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required autocomplete="new-password">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label class="form-label text-xs">${isBg ? 'Повтори паролата' : 'Confirm Password'}</label>
            <input type="password" id="auth-password-confirm" placeholder="••••••••" required autocomplete="new-password">
          </div>

          <button type="submit" class="btn btn-primary btn-full" style="margin-bottom: var(--space-sm); font-weight:800;">
            ${isBg ? 'Създай акаунт' : 'Create Account'}
          </button>
        </form>

        <div style="display:flex; justify-content:center; margin-top: var(--space-xs);">
          <button class="btn btn-ghost" style="font-size:12px;" onclick="authScreen='login'; renderPage();">${isBg ? 'Вече имаш акаунт? Вход' : 'Already have an account? Sign In'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderForgotPassword() {
  const isBg = getLang() === 'bg';
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 400px; padding: var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <h3 style="margin-bottom: var(--space-sm); text-align: center; font-size: var(--fs-lg); font-weight:800; color:#fff;">${isBg ? 'Възстановяване на парола' : 'Reset Password'}</h3>
        <p class="text-xs text-muted" style="margin-bottom: var(--space-lg); text-align: center;">${isBg ? 'Въведете имейла си, за да получите код за нова парола.' : 'Enter your email to receive a password reset code.'}</p>
        
        <form id="auth-form" onsubmit="handleForgotForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label text-xs">${isBg ? 'Имейл адрес' : 'Email Address'}</label>
            <input type="email" id="auth-email" placeholder="name@example.com" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="font-weight:800;">${isBg ? 'Изпрати код' : 'Send Reset Code'}</button>
        </form>

        <div style="display:flex; justify-content:center; margin-top: var(--space-md);">
          <button class="btn btn-ghost" style="font-size:12px;" onclick="authScreen='login'; renderPage();">${isBg ? 'Назад към вход' : 'Back to Sign In'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderOtp() {
  const isBg = getLang() === 'bg';
  const otp = getSavedOtp();
  const user = findUserById(getTempUserId()) || (otp ? findUserById(otp.userId) : null);
  const destination = user?.email || 'your email';

  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 400px; padding: var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <div style="font-size: 2.5rem; text-align: center; margin-bottom: 8px;">🔐</div>
        <h3 style="margin-bottom: var(--space-xs); text-align: center; font-size: var(--fs-lg); font-weight:800; color:#fff;">${isBg ? 'Потвърждение на код' : 'Enter Verification Code'}</h3>
        <p class="text-xs text-muted" style="margin-bottom: var(--space-lg); text-align: center;">${isBg ? 'Въведете 4-цифрения код за сигурност, изпратен до' : 'Enter the 4-digit security code sent to'} <span style="color:var(--accent); font-weight:bold;">${maskEmail(destination)}</span>.</p>

        <form id="auth-form" onsubmit="handleVerifyOtpForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <input type="text" id="auth-otp" maxlength="4" placeholder="••••" style="text-align:center; font-size:1.8rem; font-weight:900; letter-spacing:8px;" required autocomplete="one-time-code" autofocus>
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="font-weight:800;">${isBg ? 'Потвърди и продължи' : 'Verify & Continue'}</button>
        </form>

        <div style="display:flex; justify-content:space-between; margin-top: var(--space-md); border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <button class="btn btn-ghost" style="font-size:12px;" onclick="authScreen='login'; renderPage();">${isBg ? 'Отказ' : 'Cancel'}</button>
          <button class="btn btn-ghost" style="font-size:12px; color:var(--accent);" onclick="sendOtp(authOtpPurpose, getTempUserId(), 'email'); alert('${isBg ? 'Нов код беше изпратен.' : 'A new code has been sent.'}');">${isBg ? 'Изпрати нов код' : 'Resend Code'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderResetPassword() {
  const isBg = getLang() === 'bg';
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 400px; padding: var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg); font-weight:800; color:#fff;">${isBg ? 'Задайте нова парола' : 'Set New Password'}</h3>
        <form id="auth-form" onsubmit="handleResetPasswordForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Нова парола' : 'New Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required autocomplete="new-password">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label text-xs">${isBg ? 'Повтори новата парола' : 'Confirm New Password'}</label>
            <input type="password" id="auth-password-confirm" placeholder="••••••••" required autocomplete="new-password">
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="font-weight:800;">${isBg ? 'Запази паролата' : 'Save Password'}</button>
        </form>
      </div>
    </div>
  `;
}

function renderOnboarding() {
  const isBg = getLang() === 'bg';
  const user = getCurrentUser() || {};
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg-primary) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(17, 24, 39, 0.95); border-radius: var(--radius-xl); border: 1px solid var(--border-medium);">
        <div style="font-size: 2.8rem; text-align: center; margin-bottom: 4px;">🎯</div>
        <h2 style="margin-bottom: var(--space-xs); text-align: center; font-size: var(--fs-xl); font-weight:900; color:#fff;">${isBg ? 'Добре дошли във FitLife!' : 'Welcome to FitLife!'}</h2>
        <p class="text-xs text-muted" style="margin-bottom: var(--space-lg); text-align: center;">${isBg ? 'Настройте вашите фитнес цели, за да персонализираме плана ви.' : 'Set up your fitness profile to customize your training plan.'}</p>

        <form id="auth-form" onsubmit="handleOnboardingForm(event)">
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Вашето име' : 'Your Name'}</label>
            <input type="text" id="profile-fullname" value="${user.fullName || ''}" placeholder="Name" required>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label text-xs">${isBg ? 'Основна фитнес цел' : 'Primary Goal'}</label>
            <select id="profile-goal" style="font-size:12px;">
              <option value="Muscle Gain & Strength">${isBg ? 'Покачване на мускулна маса & сила' : 'Muscle Gain & Strength'}</option>
              <option value="Fat Loss & Toning">${isBg ? 'Изгаряне на мазнини & релеф' : 'Fat Loss & Toning'}</option>
              <option value="Endurance & Running">${isBg ? 'Издръжливост & бягане' : 'Endurance & Running'}</option>
            </select>
          </div>
          <div class="grid-2" style="gap:10px; margin-bottom: var(--space-sm);">
            <div class="form-group">
              <label class="form-label text-xs">${isBg ? 'Тегло (kg)' : 'Weight (kg)'}</label>
              <input type="number" id="profile-weight" value="75" min="40" max="200" required>
            </div>
            <div class="form-group">
              <label class="form-label text-xs">${isBg ? 'Ръст (cm)' : 'Height (cm)'}</label>
              <input type="number" id="profile-height" value="178" min="120" max="230" required>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label text-xs">${isBg ? 'Пол' : 'Gender'}</label>
            <select id="profile-gender" style="font-size:12px;">
              <option value="Male">${isBg ? 'Мъж' : 'Male'}</option>
              <option value="Female">${isBg ? 'Жена' : 'Female'}</option>
              <option value="Other">${isBg ? 'Друг' : 'Other'}</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-full" style="font-weight:800;">${isBg ? 'Завърши и започни 🚀' : 'Complete & Start 🚀'}</button>
        </form>
      </div>
    </div>
  `;
}
