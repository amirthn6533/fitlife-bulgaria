// ========================================
// FitLife Bulgaria — Certified Coaches & Programs Marketplace
// ========================================

let marketplaceFilter = 'all';
let marketplaceSearch = '';

function setMarketFilter(filter) {
  marketplaceFilter = filter;
  renderPage();
}

function handleMarketSearch(value) {
  marketplaceSearch = value.toLowerCase();
  renderPage();
}

function renderMarketplace() {
  const isBg = getLang() === 'bg';

  const categories = [
    { key: 'market_all', icon: '🔥' },
    { key: 'market_trainer', icon: '🏋️' },
    { key: 'market_nutritionist', icon: '🥗' },
    { key: 'market_yoga', icon: '🧘' },
    { key: 'market_strength', icon: '💪' },
    { key: 'market_running', icon: '🏃' },
  ];

  const certifiedCoaches = [
    { 
      name: isBg ? 'FitLife AI Главен Треньор' : 'FitLife AI Master Trainer', 
      emoji: '🤖', 
      specialty: isBg ? 'Персонализирани силови и хипертрофия планове' : 'Custom Strength & Hypertrophy Coach', 
      tags: [t('market_strength'), t('market_trainer')], 
      rating: 5.0, 
      reviews: 240, 
      clients: '24/7 AI', 
      price: isBg ? 'Включен в PRO' : 'Included in PRO', 
      featured: true, 
      verified: true,
      action: 'ai_coach'
    },
    { 
      name: isBg ? 'FitLife AI Диетолог & Нутриционист' : 'FitLife AI Nutrition Specialist', 
      emoji: '🥗', 
      specialty: isBg ? 'Калкулатор на макронутриенти и персонализирани менюта' : 'Macro Calculation & Meal Planning', 
      tags: [t('market_nutritionist')], 
      rating: 4.9, 
      reviews: 180, 
      clients: '24/7 AI', 
      price: isBg ? 'Включен в PRO' : 'Included in PRO', 
      featured: true, 
      verified: true,
      action: 'ai_nutrition'
    },
    { 
      name: isBg ? 'FitLife AI Бягане & Кардио Ментор' : 'FitLife AI Running & Pace Coach', 
      emoji: '🏃', 
      specialty: isBg ? 'Подготовка за 5K, 10K и Полумаратон' : '5K, 10K & Marathon Progression Coach', 
      tags: [t('market_running')], 
      rating: 4.9, 
      reviews: 115, 
      clients: '24/7 AI', 
      price: isBg ? 'Включен в PRO' : 'Included in PRO', 
      featured: false, 
      verified: true,
      action: 'ai_running'
    },
    { 
      name: isBg ? 'FitLife AI Мобилност & Йога' : 'FitLife AI Yoga & Mobility Coach', 
      emoji: '🧘', 
      specialty: isBg ? 'Гъвкавост, възстановяване на стави и разтягане' : 'Flexibility, Joint Health & Recovery', 
      tags: [t('market_yoga')], 
      rating: 4.8, 
      reviews: 95, 
      clients: '24/7 AI', 
      price: isBg ? 'Включен в PRO' : 'Included in PRO', 
      featured: false, 
      verified: true,
      action: 'ai_yoga'
    }
  ];

  const officialPlans = [
    { title: isBg ? '12-Седмичен Мускулен план (Hypertrophy)' : '12-Week Hypertrophy Master Plan', coach: 'FitLife Training Lab', rating: 5.0, price: isBg ? 'Безплатно с PRO' : 'Free with PRO', icon: '💪' },
    { title: isBg ? 'Високопротеинов Хранителен Режим' : 'High-Protein Bulgarian Nutrition Guide', coach: 'FitLife Nutrition Lab', rating: 4.9, price: isBg ? 'Безплатно с PRO' : 'Free with PRO', icon: '🥑' },
    { title: isBg ? 'От 0 до 5К Програма за Бягане' : 'Couch to 5K Sofia Running Plan', coach: 'FitLife Endurance Lab', rating: 4.9, price: isBg ? 'Безплатно с PRO' : 'Free with PRO', icon: '🏃' },
  ];

  let filteredCoaches = certifiedCoaches;
  if (marketplaceFilter !== 'all') {
    const expectedTag = t('market_' + marketplaceFilter);
    filteredCoaches = filteredCoaches.filter(c => c.tags.includes(expectedTag));
  }
  if (marketplaceSearch) {
    filteredCoaches = filteredCoaches.filter(c => 
      c.name.toLowerCase().includes(marketplaceSearch) || 
      c.specialty.toLowerCase().includes(marketplaceSearch)
    );
  }

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('market_title')}</h1>
      </div>

      <!-- Search -->
      <div style="margin-bottom: var(--space-md)">
        <input type="text" placeholder="${t('market_search')}" oninput="handleMarketSearch(this.value)" value="${marketplaceSearch}" style="padding-left:36px;background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%2364748B%22 viewBox=%220 0 24 24%22><circle cx=%2211%22 cy=%2211%22 r=%228%22 stroke=%22%2364748B%22 stroke-width=%222%22 fill=%22none%22/><line x1=%2216.65%22 y1=%2216.65%22 x2=%2221%22 y2=%2221%22 stroke=%22%2364748B%22 stroke-width=%222%22/></svg>');background-repeat:no-repeat;background-position:10px center">
      </div>

      <!-- Category Pills -->
      <div class="category-pills" style="margin-bottom: var(--space-lg)">
        ${categories.map(c => {
          let f = c.key.replace('market_', '');
          return `<button class="category-pill ${marketplaceFilter === f ? 'active' : ''}" onclick="setMarketFilter('${f}')">${c.icon} ${t(c.key)}</button>`;
        }).join('')}
      </div>

      <!-- AI Coach Card -->
      <div class="ai-coach-card" style="margin-bottom: var(--space-xl); cursor: pointer;" onclick="openAICoachModal('chat')">
        <div class="ai-coach-icon">🤖</div>
        <div class="ai-coach-title">${t('market_ai_coach')}</div>
        <div class="ai-coach-subtitle">${t('market_ai_desc')}</div>
        <button class="btn btn-sm btn-primary" style="margin-top:var(--space-md);position:relative;z-index:1" onclick="event.stopPropagation(); openAICoachModal('chat');">✨ ${t('market_try_ai')}</button>
      </div>

      <!-- Featured AI Coaches -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${isBg ? 'Сертифицирани FitLife Треньори' : 'Verified FitLife Coaches'}</h3>
        </div>
        ${filteredCoaches.map((c, i) => `
          <div class="coach-card coach-card-featured" onclick="openAICoachModal('chat')" style="margin-bottom:var(--space-md);cursor:pointer;animation: slideUp 0.4s ease-out both; animation-delay: ${i * 0.1}s">
            <div class="coach-avatar-wrap">
               <div class="avatar avatar-lg" style="background:var(--gradient-primary);">${c.emoji}</div>
               ${c.verified ? '<div class="coach-verified">✓</div>' : ''}
            </div>
            <div class="coach-info">
              <div class="coach-name" style="font-weight:900;">${c.name}</div>
              <div class="coach-specialty" style="color:var(--accent);">${c.specialty}</div>
              <div class="coach-tags">${c.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}</div>
              <div class="coach-stats">
                <span class="coach-rating">⭐ ${c.rating}</span>
                <span>${c.reviews} ${t('market_reviews')}</span>
                <span class="coach-price" style="margin-left:auto;color:var(--success);font-weight:800;">${c.price}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Official Training Programs -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('market_plans')}</h3>
        </div>
        <div class="grid-2">
          ${officialPlans.map((p, i) => `
            <div class="plan-card" onclick="openAICoachModal('chat')" style="cursor:pointer;animation: slideUp 0.4s ease-out both; animation-delay: ${i * 0.1}s">
              <div class="plan-icon">${p.icon}</div>
              <div class="plan-title">${p.title}</div>
              <div class="plan-coach">${p.coach}</div>
              <div class="plan-footer">
                <span class="plan-price" style="color:var(--success);">${p.price}</span>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openAICoachModal('chat')">${t('market_buy')}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sofia Coach Application CTA -->
      <div class="card card-glow" style="margin-top:var(--space-xl);background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.2);border-radius:var(--radius-lg);padding:var(--space-lg);text-align:center;">
        <div style="font-size:2.2rem;margin-bottom:6px;">🏋️‍♂️</div>
        <h4 style="font-size:var(--fs-md);font-weight:900;color:#fff;margin-bottom:4px;">${isBg ? 'Вие сте сертифициран треньор в София?' : 'Are you a certified trainer in Sofia?'}</h4>
        <p class="text-xs text-muted" style="margin-bottom:var(--space-md);">${isBg ? 'Присъединете се към партньорската мрежа на FitLife и достигайте до нови клиенти.' : 'Join the official FitLife Coach Network and connect with active athletes.'}</p>
        <button class="btn btn-secondary btn-sm" onclick="alert('${isBg ? 'Благодарим за интереса! Изпратете сертификата си на coaches@fitlife.bg.' : 'Thank you for your interest! Send your certification to coaches@fitlife.bg.'}')" style="border-radius:var(--radius-full);">
          📩 ${isBg ? 'Кандидатствай като треньор' : 'Apply as Coach'}
        </button>
      </div>

    </div>
  `;
}
