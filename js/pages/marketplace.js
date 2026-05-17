// ========================================
// FitLife Bulgaria — Marketplace Page
// ========================================

function renderMarketplace() {
  const categories = [
    { key: 'market_all', icon: '🔥' },
    { key: 'market_trainer', icon: '🏋️' },
    { key: 'market_nutritionist', icon: '🥗' },
    { key: 'market_yoga', icon: '🧘' },
    { key: 'market_strength', icon: '💪' },
    { key: 'market_running', icon: '🏃' },
    { key: 'market_climbing', icon: '🧗' },
  ];

  const coaches = [
    { name: 'Георги Димитров', emoji: '🏆', specialty: getLang()==='bg'?'Персонален треньор':'Personal Trainer', tags: [t('market_strength'), t('market_trainer')], rating: 4.9, reviews: 127, clients: 48, price: '60 BGN', featured: true, verified: true },
    { name: 'Светлана Петкова', emoji: '🥗', specialty: getLang()==='bg'?'Сертифициран диетолог':'Certified Nutritionist', tags: [t('market_nutritionist')], rating: 4.8, reviews: 89, clients: 35, price: '50 BGN', featured: false, verified: true },
    { name: 'Мартин Тодоров', emoji: '🏃', specialty: getLang()==='bg'?'Маратонец & Треньор':'Marathoner & Coach', tags: [t('market_running')], rating: 4.7, reviews: 64, clients: 22, price: '45 BGN', featured: false, verified: true },
    { name: 'Ана Стоянова', emoji: '🧘', specialty: getLang()==='bg'?'Йога инструктор':'Yoga Instructor', tags: [t('market_yoga')], rating: 4.9, reviews: 156, clients: 63, price: '40 BGN', featured: true, verified: false },
    { name: 'Петър Иванов', emoji: '🧗', specialty: getLang()==='bg'?'Треньор по катерене':'Climbing Coach', tags: [t('market_climbing')], rating: 4.6, reviews: 31, clients: 15, price: '55 BGN', featured: false, verified: true },
  ];

  const plans = [
    { title: getLang()==='bg'?'12-Седмичен Мускулен план':'12-Week Muscle Builder', coach: 'Георги Д.', rating: 4.9, price: '35 BGN', icon: '💪' },
    { title: getLang()==='bg'?'Кето хранителен план':'Keto Meal Plan', coach: 'Светлана П.', rating: 4.8, price: '25 BGN', icon: '🥑' },
    { title: getLang()==='bg'?'Маратон за начинаещи':'Beginner Marathon Plan', coach: 'Мартин Т.', rating: 4.7, price: '30 BGN', icon: '🏃' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('market_title')}</h1>
      </div>

      <!-- Search -->
      <div style="margin-bottom: var(--space-md)">
        <input type="text" placeholder="${t('market_search')}" style="padding-left:36px;background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%2364748B%22 viewBox=%220 0 24 24%22><circle cx=%2211%22 cy=%2211%22 r=%228%22 stroke=%22%2364748B%22 stroke-width=%222%22 fill=%22none%22/><line x1=%2216.65%22 y1=%2216.65%22 x2=%2221%22 y2=%2221%22 stroke=%22%2364748B%22 stroke-width=%222%22/></svg>');background-repeat:no-repeat;background-position:10px center">
      </div>

      <!-- Category Pills -->
      <div class="category-pills" style="margin-bottom: var(--space-lg)">
        ${categories.map((c, i) => `
          <button class="category-pill ${i === 0 ? 'active' : ''}">${c.icon} ${t(c.key)}</button>
        `).join('')}
      </div>

      <!-- AI Coach Card -->
      <div class="ai-coach-card" style="margin-bottom: var(--space-xl)">
        <div class="ai-coach-icon">🤖</div>
        <div class="ai-coach-title">${t('market_ai_coach')}</div>
        <div class="ai-coach-subtitle">${t('market_ai_desc')}</div>
        <button class="btn btn-sm btn-primary" style="margin-top:var(--space-md);position:relative;z-index:1">✨ ${t('market_try_ai')}</button>
      </div>

      <!-- Featured Coaches -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('market_featured')}</h3>
        </div>
        ${coaches.filter(c => c.featured).map((c, i) => `
          <div class="coach-card coach-card-featured" style="margin-bottom:var(--space-md);animation: slideUp 0.4s ease-out both; animation-delay: ${i * 0.1}s">
            <div class="coach-avatar-wrap">
              <div class="avatar avatar-lg">${c.emoji}</div>
              ${c.verified ? '<div class="coach-verified">✓</div>' : ''}
            </div>
            <div class="coach-info">
              <div class="coach-name">${c.name}</div>
              <div class="coach-specialty">${c.specialty}</div>
              <div class="coach-tags">${c.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}</div>
              <div class="coach-stats">
                <span class="coach-rating">⭐ ${c.rating}</span>
                <span>${c.reviews} ${t('market_reviews')}</span>
                <span>${c.clients} ${t('market_clients')}</span>
                <span class="coach-price">${c.price}${t('market_per_session')}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- All Coaches -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('market_all_coaches')}</h3>
        </div>
        ${coaches.filter(c => !c.featured).map((c, i) => `
          <div class="coach-card" style="margin-bottom:var(--space-sm);animation: slideUp 0.3s ease-out both; animation-delay: ${(i + 2) * 0.08}s">
            <div class="coach-avatar-wrap">
              <div class="avatar">${c.emoji}</div>
              ${c.verified ? '<div class="coach-verified">✓</div>' : ''}
            </div>
            <div class="coach-info">
              <div class="coach-name">${c.name}</div>
              <div class="coach-specialty">${c.specialty}</div>
              <div class="coach-stats">
                <span class="coach-rating">⭐ ${c.rating}</span>
                <span>${c.clients} ${t('market_clients')}</span>
                <span class="coach-price">${c.price}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Plans Store -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('market_plans')}</h3>
          <button class="section-link">${t('common_see_all')}</button>
        </div>
        <div class="scroll-h">
          ${plans.map(p => `
            <div class="plan-card" style="width:200px">
              <div class="plan-card-image">${p.icon}</div>
              <div class="plan-card-body">
                <div class="plan-card-title">${p.title}</div>
                <div class="plan-card-coach">${p.coach}</div>
                <div class="plan-card-footer">
                  <span class="plan-card-price">${p.price}</span>
                  <span class="plan-card-rating">⭐ ${p.rating}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
