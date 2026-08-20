// ========================================
// FitLife Bulgaria — Authentication Screen
// ========================================

const AUTH_USERS_KEY = 'fitlife-users';
const AUTH_SESSION_KEY = 'fitlife-session';
const AUTH_OTP_KEY = 'fitlife-otp';
const AUTH_TEMP_USER_KEY = 'fitlife-temp-user';
const DEFAULT_TOKEN_LIFETIME = 60 * 60 * 24; // 24 hours

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
      if (parsed && parsed.length > 0) return parsed;
    } catch (err) {}
  }
  // Default Demo User
  const defaultDemoUser = {
    id: 'user_demo_alex',
    fullName: 'Alex Nikolov',
    email: 'alex@fitlife.bg',
    phone: '+359 88 812 3456',
    password: hashPassword('123456'),
    role: 'user',
    emailVerified: true,
    phoneVerified: true,
    onboarded: true,
    premium: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile: {
      goal: 'Stronger & more toned',
      gender: 'Male',
      height: '182',
      weight: '78',
      birthday: '1996-05-15',
      bio: '💪 Fitness enthusiast | 🏃 Runner | Sofia'
    }
  };
  saveAuthUsers([defaultDemoUser]);
  return [defaultDemoUser];
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
  return !!user && user.onboarded && user.emailVerified && user.phoneVerified;
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
    expiresAt: Date.now() + 5 * 60 * 1000,
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
  console.info(`FitLife OTP [${via}]:`, code);
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
  renderPage();
}

function quickDemoLogin() {
  const users = loadAuthUsers();
  const demoUser = users[0] || {
    id: 'user_demo_alex',
    fullName: 'Alex Nikolov',
    email: 'alex@fitlife.bg',
    phone: '+359 88 812 3456',
    password: hashPassword('123456'),
    role: 'user',
    emailVerified: true,
    phoneVerified: true,
    onboarded: true,
    premium: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile: {
      goal: 'Stronger & more toned',
      gender: 'Male',
      height: '182',
      weight: '78',
      birthday: '1996-05-15',
      bio: '💪 Fitness enthusiast | 🏃 Runner | Sofia'
    }
  };
  createSession(demoUser);
  authScreen = 'app';
  currentPage = 'home';
  renderPage();
}

function handleLoginForm(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const user = findUserByEmail(email);
  if (!user) {
    return alert(getLang() === 'bg' ? 'Няма регистриран акаунт с този имейл.' : 'No account found with that email.');
  }
  if (user.password !== hashPassword(password)) {
    return alert(getLang() === 'bg' ? 'Грешна парола. Опитайте отново.' : 'Invalid password. Please try again.');
  }
  createSession(user);
  authScreen = 'app';
  currentPage = 'home';
  renderPage();
}

function handleRegisterForm(event) {
  event.preventDefault();
  const fullName = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const phone = document.getElementById('auth-phone').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const confirmPassword = document.getElementById('auth-password-confirm').value.trim();

  if (!fullName || !email || !phone || !password) {
    return alert(getLang() === 'bg' ? 'Попълнете всички полета.' : 'Please complete all fields.');
  }
  if (password !== confirmPassword) {
    return alert(getLang() === 'bg' ? 'Паролите не съвпадат.' : 'Passwords do not match.');
  }
  if (findUserByEmail(email)) {
    return alert(getLang() === 'bg' ? 'Този имейл вече е регистриран.' : 'This email is already registered.');
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
      goal: '',
      gender: '',
      height: '',
      weight: '',
      birthday: '',
      bio: '',
    },
  };

  const users = loadAuthUsers();
  users.push(user);
  saveAuthUsers(users);
  sendOtp('verify', user.id, 'email');
  authScreen = 'otp';
  renderPage();
}

function handleForgotForm(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const user = findUserByEmail(email);
  if (!user) {
    return alert(getLang() === 'bg' ? 'Няма акаунт с този имейл.' : 'No account found with that email.');
  }
  authTempUserId = user.id;
  sendOtp('reset', user.id, 'email');
  authScreen = 'otp';
  renderPage();
}

function handleVerifyOtpForm(event) {
  event.preventDefault();
  const code = (document.getElementById('auth-otp')?.value || '').trim();
  const otp = getSavedOtp();
  const targetId = (otp && otp.userId) || authTempUserId || getTempUserId();
  let user = findUserById(targetId);

  if (!user) {
    const users = loadAuthUsers();
    user = users[users.length - 1] || users[0];
  }

  if (!user) {
    return alert(getLang() === 'bg' ? 'Не може да се намери потребител.' : 'Unable to locate user.');
  }

  // Accept 1234 or matching code
  if (code && code !== '1234' && otp && otp.code !== code) {
    return alert(getLang() === 'bg' ? 'Невалиден код. Въведете 1234.' : 'Invalid code. Please enter 1234.');
  }

  const purpose = (otp && otp.purpose) || authOtpPurpose || 'verify';

  if (purpose === 'verify') {
    user.emailVerified = true;
    user.phoneVerified = true;
    updateUser(user);
    createSession(user);
    authScreen = 'onboarding';
    clearTempUserId();
    renderPage();
    return;
  }

  if (purpose === 'reset') {
    authResetUserId = user.id;
    authScreen = 'reset';
    clearTempUserId();
    renderPage();
    return;
  }
}

function skipOtpAndEnter() {
  const users = loadAuthUsers();
  const user = findUserById(authTempUserId) || users[users.length - 1] || users[0];
  if (user) {
    user.emailVerified = true;
    user.phoneVerified = true;
    updateUser(user);
    createSession(user);
  }
  authScreen = 'app';
  currentPage = 'home';
  clearTempUserId();
  renderPage();
}

function handleResetPasswordForm(event) {
  event.preventDefault();
  const password = document.getElementById('auth-password').value.trim();
  const confirmPassword = document.getElementById('auth-password-confirm').value.trim();
  if (!password || password !== confirmPassword) {
    return alert(getLang() === 'bg' ? 'Паролите не съвпадат.' : 'Passwords do not match.');
  }
  const user = findUserById(authResetUserId);
  if (!user) {
    return alert(getLang() === 'bg' ? 'Не може да се намери потребител.' : 'Unable to locate user.');
  }
  user.password = hashPassword(password);
  updateUser(user);
  authScreen = 'login';
  authResetUserId = '';
  alert(getLang() === 'bg' ? 'Паролата беше обновена успешно.' : 'Password updated successfully.');
  renderPage();
}

function handleVerifyContact(type) {
  const user = getCurrentUser();
  if (!user) return;
  authTempUserId = user.id;
  sendOtp('verify', user.id, type);
  authScreen = 'otp';
  renderPage();
}

function handleOnboardingForm(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;
  if (!user.emailVerified || !user.phoneVerified) {
    return alert(getLang() === 'bg' ? 'Моля, потвърдете имейл и телефон.' : 'Please verify your email and phone first.');
  }

  const fullName = document.getElementById('profile-fullname').value.trim();
  const goal = document.getElementById('profile-goal').value.trim();
  const gender = document.getElementById('profile-gender').value.trim();
  const weight = document.getElementById('profile-weight').value.trim();
  const height = document.getElementById('profile-height').value.trim();
  const birthday = document.getElementById('profile-birthday').value.trim();
  const bio = document.getElementById('profile-bio').value.trim();

  user.fullName = fullName || user.fullName;
  user.profile = {
    goal,
    gender,
    weight,
    height,
    birthday,
    bio,
  };
  user.onboarded = true;
  user.updatedAt = Date.now();
  updateUser(user);
  authScreen = 'app';
  currentPage = 'home';
  renderPage();
}

function bindAuthEvents() {
  // Auth screens rely on inline event handlers for simplicity.
}

function renderAuth() {
  switch (authScreen) {
    case 'register': return renderRegister();
    case 'forgot': return renderForgotPassword();
    case 'otp': return renderOtp();
    case 'reset': return renderResetPassword();
    default: return renderLogin();
  }
}

function renderLogin() {
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div style="text-align: center; margin-bottom: var(--space-xl); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.5rem; margin-bottom: var(--space-sm); filter: drop-shadow(0 0 20px var(--accent-glow));">⚡</div>
        <h1 class="text-gradient" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin: 0;">FitLife Bulgaria</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${getLang() === 'bg' ? 'Вашият AI фитнес и социален асистент' : 'Your AI fitness and social coach'}</p>
      </div>

      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg);">${getLang() === 'bg' ? 'Вход' : 'Sign In'}</h3>

        <form id="auth-form" onsubmit="handleLoginForm(event)">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="auth-email" placeholder="alex@fitlife.bg" required>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">${getLang() === 'bg' ? 'Парола' : 'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full" style="margin-bottom: var(--space-sm);">${getLang() === 'bg' ? 'Влез в акаунта' : 'Sign In'}</button>
          
          <button type="button" class="btn btn-secondary btn-full" style="margin-bottom: var(--space-md); border: 1px dashed var(--accent); background: rgba(108, 92, 231, 0.15);" onclick="quickDemoLogin()">
            ⚡ ${getLang() === 'bg' ? 'Вход с демо акаунт (Alex)' : 'Quick Demo Login (Alex)'}
          </button>
        </form>

        <div style="display:flex; justify-content:space-between; margin-bottom: var(--space-xs);">
          <button class="btn btn-ghost" onclick="authScreen='register'; renderPage();">${getLang() === 'bg' ? 'Регистрация' : 'Sign Up'}</button>
          <button class="btn btn-ghost" onclick="authScreen='forgot'; renderPage();">${getLang() === 'bg' ? 'Забравена парола' : 'Forgot password'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div style="text-align: center; margin-bottom: var(--space-xl); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.5rem; margin-bottom: var(--space-sm); filter: drop-shadow(0 0 20px var(--accent-glow));">🔥</div>
        <h1 class="text-gradient" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin: 0;">FitLife Bulgaria</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${getLang() === 'bg' ? 'Създай профил и започни днес' : 'Create your account and get started'}</p>
      </div>

      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg);">${getLang() === 'bg' ? 'Регистрация' : 'Sign Up'}</h3>

        <form id="auth-form" onsubmit="handleRegisterForm(event)">
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Име' : 'Full Name'}</label>
            <input type="text" id="auth-name" placeholder="Alex Nikolov" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="auth-email" placeholder="alex@fitlife.bg" required>
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Телефонен номер' : 'Phone Number'}</label>
            <input type="text" id="auth-phone" placeholder="+359 88 812 3456" required>
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Парола' : 'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">${getLang() === 'bg' ? 'Повтори паролата' : 'Confirm Password'}</label>
            <input type="password" id="auth-password-confirm" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full" style="margin-bottom: var(--space-md);">${getLang() === 'bg' ? 'Създай акаунт' : 'Create Account'}</button>
        </form>

        <div style="display:flex; justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="authScreen='login'; renderPage();">${getLang() === 'bg' ? 'Вече имам акаунт' : 'Already have an account'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderForgotPassword() {
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div style="text-align: center; margin-bottom: var(--space-xl); animation: slideUp 0.6s ease-out both;">
        <div style="font-size: 3.5rem; margin-bottom: var(--space-sm); filter: drop-shadow(0 0 20px var(--accent-glow));">🔐</div>
        <h1 class="text-gradient" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin: 0;">${getLang() === 'bg' ? 'Възстанови парола' : 'Reset Password'}</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">${getLang() === 'bg' ? 'Изпратете код за нулиране до вашия имейл.' : 'Send a reset code to your email.'}</p>
      </div>

      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <form id="auth-form" onsubmit="handleForgotForm(event)">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="auth-email" placeholder="alex@fitlife.bg" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="margin-top: var(--space-md);">${getLang() === 'bg' ? 'Изпрати код' : 'Send Code'}</button>
        </form>

        <div style="display:flex; justify-content:flex-end; margin-top: var(--space-md);">
          <button class="btn btn-ghost" onclick="authScreen='login'; renderPage();">${getLang() === 'bg' ? 'Назад към вход' : 'Back to sign in'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderOtp() {
  const otp = getSavedOtp();
  const user = findUserById(getTempUserId()) || (otp ? findUserById(otp.userId) : null);
  const destination = authOtpPurpose === 'reset' ? (user?.email || '') : authTempUserId ? (user?.email || '') : user?.email || '';
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg);">${getLang() === 'bg' ? 'OTP Проверка' : 'OTP Verification'}</h3>
        <p class="text-sm text-muted" style="margin-bottom: var(--space-lg);">${getLang() === 'bg' ? 'Въведете 4-цифрения код, изпратен до' : 'Enter the 4-digit code sent to'} ${maskEmail(destination) || maskPhone(user?.phone) || 'your email'}.</p>

        <form id="auth-form" onsubmit="handleVerifyOtpForm(event)">
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Код' : 'Code'} <span class="tag tag-accent" style="font-size: 10px; margin-left: 6px;">Test: 1234</span></label>
            <input type="text" id="auth-otp" maxlength="6" value="1234" placeholder="1234" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full">${getLang() === 'bg' ? 'Потвърди' : 'Verify Code'}</button>
          <button type="button" class="btn btn-secondary btn-full" style="margin-top: var(--space-sm); border: 1px dashed var(--success); color: var(--success);" onclick="skipOtpAndEnter()">⚡ ${getLang() === 'bg' ? 'Директен вход (Пропусни)' : 'Direct Enter (Skip OTP)'}</button>
        </form>

        <div style="display:flex; justify-content:space-between; margin-top: var(--space-md);">
          <button class="btn btn-ghost" onclick="authScreen='login'; renderPage();">${getLang() === 'bg' ? 'Назад' : 'Back'}</button>
          <button class="btn btn-secondary" onclick="sendOtp(authOtpPurpose, getTempUserId(), 'email'); alert('${getLang() === 'bg' ? 'Кодът беше изпратен отново.' : 'Code resent successfully.'}');">${getLang() === 'bg' ? 'Изпрати отново' : 'Resend Code'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderResetPassword() {
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 420px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: var(--space-md); text-align: center; font-size: var(--fs-lg);">${getLang() === 'bg' ? 'Нова парола' : 'New Password'}</h3>
        <form id="auth-form" onsubmit="handleResetPasswordForm(event)">
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Парола' : 'Password'}</label>
            <input type="password" id="auth-password" placeholder="••••••••" required>
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">${getLang() === 'bg' ? 'Повтори паролата' : 'Confirm Password'}</label>
            <input type="password" id="auth-password-confirm" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full">${getLang() === 'bg' ? 'Запази паролата' : 'Save Password'}</button>
        </form>
      </div>
    </div>
  `;
}

function renderOnboarding() {
  const user = getCurrentUser() || {};
  return `
    <div class="page" style="padding: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at top, var(--bg-glass) 0%, var(--bg) 100%);">
      <div class="card card-glow" style="width: 90%; max-width: 460px; padding: var(--space-xl); background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-xl);">
        <h2 style="margin-bottom: var(--space-sm); text-align: center; font-size: var(--fs-2xl);">${getLang() === 'bg' ? 'Добре дошли!' : 'Welcome aboard!'}</h2>
        <p class="text-sm text-muted" style="margin-bottom: var(--space-lg); text-align: center;">${getLang() === 'bg' ? 'Завършете профила си и потвърдете контактите си за по-добро изживяване.' : 'Complete your profile and verify your contact details for a better experience.'}</p>

        <div style="display:flex; gap:var(--space-sm); margin-bottom: var(--space-lg);">
          <span class="tag ${user.emailVerified ? 'tag-success' : 'tag-warning'}">${user.emailVerified ? (getLang() === 'bg' ? 'Имейл потвърден' : 'Email Verified') : (getLang() === 'bg' ? 'Потвърдете имейл' : 'Verify Email')}</span>
          <span class="tag ${user.phoneVerified ? 'tag-success' : 'tag-warning'}">${user.phoneVerified ? (getLang() === 'bg' ? 'Телефон потвърден' : 'Phone Verified') : (getLang() === 'bg' ? 'Потвърдете телефон' : 'Verify Phone')}</span>
        </div>

        <div style="display:flex; gap:var(--space-sm); margin-bottom: var(--space-lg);">
          <button class="btn btn-secondary btn-full" type="button" onclick="handleVerifyContact('email')">${user.emailVerified ? (getLang() === 'bg' ? 'Изпрати OTP отново' : 'Resend Email OTP') : (getLang() === 'bg' ? 'Потвърди имейл' : 'Verify Email')}</button>
          <button class="btn btn-secondary btn-full" type="button" onclick="handleVerifyContact('phone')">${user.phoneVerified ? (getLang() === 'bg' ? 'Изпрати OTP отново' : 'Resend SMS OTP') : (getLang() === 'bg' ? 'Потвърди телефон' : 'Verify Phone')}</button>
        </div>

        <form id="auth-form" onsubmit="handleOnboardingForm(event)">
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Пълно име' : 'Full Name'}</label>
            <input type="text" id="profile-fullname" value="${user.fullName || ''}" placeholder="Alex Nikolov" required>
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Цел' : 'Goal'}</label>
            <input type="text" id="profile-goal" value="${user.profile?.goal || ''}" placeholder="${getLang() === 'bg' ? 'Например: По-силен и тонизиран' : 'e.g. Stronger & more toned'}">
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Пол' : 'Gender'}</label>
            <input type="text" id="profile-gender" value="${user.profile?.gender || ''}" placeholder="${getLang() === 'bg' ? 'Мъж / Жена' : 'Male / Female / Other'}">
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Тегло (kg)' : 'Weight (kg)'}</label>
            <input type="text" id="profile-weight" value="${user.profile?.weight || ''}" placeholder="75">
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Височина (cm)' : 'Height (cm)'}</label>
            <input type="text" id="profile-height" value="${user.profile?.height || ''}" placeholder="180">
          </div>
          <div class="form-group">
            <label class="form-label">${getLang() === 'bg' ? 'Рожден ден' : 'Birthday'}</label>
            <input type="date" id="profile-birthday" value="${user.profile?.birthday || ''}">
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">${getLang() === 'bg' ? 'Кратко описание' : 'Short Bio'}</label>
            <textarea id="profile-bio" placeholder="${getLang() === 'bg' ? 'Разкажи ни за целите си...' : 'Tell us your fitness goals...'}">${user.profile?.bio || ''}</textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-full">${getLang() === 'bg' ? 'Запази и продължи' : 'Save and continue'}</button>
        </form>
      </div>
    </div>
  `;
}

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
      <div style="text-align:left;margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-sm);font-size:var(--fs-sm);border-bottom:1px solid var(--border-subtle);padding-bottom:var(--space-md);">
        <div>✨ <strong>${getLang()==='bg'?'Хранителен Режим (Диета)':'Regime & Custom Meal Plans'}</strong></div>
        <div>🤖 <strong>${getLang()==='bg'?'Интелигентен AI Фитнес Коуч':'Personal AI Training Programs'}</strong></div>
        <div>📸 <strong>${getLang()==='bg'?'Неограничен Анализ на Храната':'Unlimited Food Photo Scan'}</strong></div>
        <div>💸 <strong>${getLang()==='bg'?'VIP Предизвикателства с Награди':'VIP Challenges & Escrow Pools'}</strong></div>
      </div>
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
      <button onclick="subscribeToPremium()" class="btn btn-primary btn-full" style="box-shadow:0 0 20px var(--accent-glow)">${getLang()==='bg'?'Абонирай се сега':'Subscribe Now'}</button>
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
  if (pMonthly && pYearly) {
    pMonthly.style.borderColor = plan === 'monthly' ? 'var(--accent)' : 'var(--border-subtle)';
    pYearly.style.borderColor = plan === 'yearly' ? 'var(--success)' : 'var(--border-subtle)';
  }
}

function subscribeToPremium() {
  localStorage.setItem('fitlife-premium', 'true');
  alert(getLang()==='bg' ? '🎉 Честито! Успешно се абонирахте за FitLife PRO!' : '🎉 Congratulations! You successfully subscribed to FitLife PRO!');
  closePremiumModal();
  renderPage();
}
