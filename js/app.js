// ========================================
// FitLife Bulgaria — Main App Router
// ========================================

let currentPage = 'home';
let isLoggedIn = localStorage.getItem('fitlife-logged-in') === 'true';

// ── Navigation ──
function navigate(page) {
  currentPage = page;
  renderPage();
  updateNav();
  window.scrollTo(0, 0);
}

function updateNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === currentPage);
  });
}

function renderPage() {
  const app = document.getElementById('page-content');
  const bottomNav = document.getElementById('bottom-nav');

  if (!isLoggedIn) {
    if (bottomNav) bottomNav.style.display = 'none';
    app.innerHTML = renderLogin();
    bindLoginEvents();
    return;
  }

  if (bottomNav) bottomNav.style.display = 'flex';
  switch(currentPage) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'workout': app.innerHTML = renderWorkout(); break;
    case 'running': app.innerHTML = renderRunning(); break;
    case 'nutrition': app.innerHTML = renderNutrition(); break;
    case 'social': app.innerHTML = renderSocial(); break;
    case 'challenges': app.innerHTML = renderChallenges(); break;
    case 'leaderboard': app.innerHTML = renderLeaderboard(); break;
    case 'messages': app.innerHTML = renderMessages(); break;
    case 'notifications': app.innerHTML = renderNotifications(); break;
    case 'marketplace': app.innerHTML = renderMarketplace(); break;
    case 'wallet': app.innerHTML = renderWallet(); break;
    case 'discover': app.innerHTML = renderDiscover(); break;
    case 'profile': app.innerHTML = renderProfile(); break;
    default: app.innerHTML = renderHome();
  }
  bindPageEvents();
  if (currentPage === 'discover') {
    setTimeout(initDiscoverMap, 100);
  }
  if (currentPage === 'running' && runningActiveTab === 'live') {
    setTimeout(initLiveRunMap, 100);
  }
}

function bindPageEvents() {
  // Exercise check toggles
  document.querySelectorAll('.exercise-check').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('done');
      el.textContent = el.classList.contains('done') ? '✓' : '';
    });
  });
  // Select options
  document.querySelectorAll('.select-group').forEach(group => {
    group.querySelectorAll('.select-option').forEach(opt => {
      opt.addEventListener('click', () => {
        group.querySelectorAll('.select-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });
  });
  // Tabs
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });
  // Post like
  document.querySelectorAll('.post-action-like').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('liked');
      const count = el.querySelector('.like-count');
      if (count) {
        let n = parseInt(count.textContent);
        count.textContent = el.classList.contains('liked') ? n + 1 : n - 1;
      }
    });
  });
  // Category pills
  document.querySelectorAll('.category-pills').forEach(group => {
    group.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  });
}

// ── Language Toggle ──
function toggleLang() {
  const newLang = getLang() === 'en' ? 'bg' : 'en';
  setLang(newLang);
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === newLang);
  });
  renderPage();
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });
  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === getLang());
    b.addEventListener('click', () => {
      setLang(b.dataset.lang);
      document.querySelectorAll('.lang-btn').forEach(x => x.classList.toggle('active', x.dataset.lang === b.dataset.lang));
      renderPage();
    });
  });
  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  renderPage();
});
