// ========================================
// FitLife Bulgaria — Nutrition Page
// ========================================

function renderNutrition() {
  const meals = [
    { type: 'nutrition_breakfast', time: '07:30', icon: '🌅', name: 'Oatmeal with berries & protein shake', protein: 35, carbs: 55, fats: 12, cal: 420 },
    { type: 'nutrition_snack', time: '10:00', icon: '🍎', name: 'Greek yogurt with almonds', protein: 18, carbs: 15, fats: 10, cal: 220 },
    { type: 'nutrition_lunch', time: '13:00', icon: '☀️', name: 'Grilled chicken, rice & vegetables', protein: 45, carbs: 60, fats: 15, cal: 550 },
    { type: 'nutrition_snack', time: '16:00', icon: '🥤', name: 'Protein bar & banana', protein: 22, carbs: 35, fats: 8, cal: 300 },
    { type: 'nutrition_dinner', time: '19:30', icon: '🌙', name: 'Salmon with sweet potato & salad', protein: 40, carbs: 45, fats: 18, cal: 490 },
  ];

  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const totalP = meals.reduce((s, m) => s + m.protein, 0);
  const totalC = meals.reduce((s, m) => s + m.carbs, 0);
  const totalF = meals.reduce((s, m) => s + m.fats, 0);

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('nutrition_title')}</h1>
        <span class="tag tag-success">${totalCal} ${t('nutrition_calories')}</span>
      </div>

      <!-- Macros Summary -->
      <div class="card" style="margin-bottom: var(--space-lg)">
        <div class="grid-3" style="text-align:center">
          <div>
            <div style="font-size:var(--fs-xl);font-weight:900;color:var(--accent)">${totalP}g</div>
            <div class="text-xs text-muted">${t('nutrition_protein')}</div>
            <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${Math.min(totalP/180*100,100)}%;background:var(--accent)"></div></div>
          </div>
          <div>
            <div style="font-size:var(--fs-xl);font-weight:900;color:var(--warning)">${totalC}g</div>
            <div class="text-xs text-muted">${t('nutrition_carbs')}</div>
            <div class="progress-bar" style="margin-top:6px"><div class="progress-fill progress-fill-warning" style="width:${Math.min(totalC/250*100,100)}%"></div></div>
          </div>
          <div>
            <div style="font-size:var(--fs-xl);font-weight:900;color:var(--danger)">${totalF}g</div>
            <div class="text-xs text-muted">${t('nutrition_fats')}</div>
            <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${Math.min(totalF/80*100,100)}%;background:var(--danger)"></div></div>
          </div>
        </div>
      </div>

      <!-- Scan Food Button -->
      <button class="scan-food-btn" style="margin-bottom: var(--space-lg)" onclick="alert('📸 Camera opening... AI will analyze your food!')">
        <div class="scan-food-icon">📸</div>
        <div style="font-weight:var(--fw-bold);font-size:var(--fs-md)">${t('nutrition_scan')}</div>
        <div class="text-sm text-muted">${t('nutrition_scan_desc')}</div>
      </button>

      <!-- Premium Regime plan banner -->
      <div class="card card-glow" style="margin-bottom: var(--space-lg); background: linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(255,75,43,0.1) 100%); border: 1px solid rgba(108,92,231,0.3); border-radius: var(--radius-lg); position: relative; overflow: hidden; padding: var(--space-lg);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🥗</div>
        <h3 style="margin-bottom: 4px; font-size: var(--fs-lg);">${getLang()==='bg'?'Индивидуален Хранителен Режим (Диета)':'Custom AI Nutrition & Regime Plan'}</h3>
        <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">${getLang()==='bg'?'Генерирай интелигентен дневен хранителен план спрямо твоите цели, килограми и алергии.':'Generate an intelligent daily meal schedule tailored to your fitness goals, weight, and allergies.'}</p>
        
        ${localStorage.getItem('fitlife-premium') === 'true' ? `
          <button class="btn btn-primary" onclick="alert('🍏 AI Nutritionist: Generating your customized diet plan... Success!')" style="width: 100%; box-shadow: 0 4px 12px rgba(108,92,231,0.3);">${getLang()==='bg'?'Генерирай с AI':'Generate with AI'}</button>
        ` : `
          <button class="btn btn-primary" onclick="showPremiumModal()" style="width: 100%; background: linear-gradient(135deg, var(--accent) 0%, #ff4b2b 100%); border: none; box-shadow: 0 4px 12px rgba(108,92,231,0.3);">${getLang()==='bg'?'👑 Отключи с FitLife PRO':'👑 Unlock with FitLife PRO'}</button>
        `}
      </div>

      <!-- Meals -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('nutrition_weekly')}</h3>
        </div>
        ${meals.map((m, i) => `
          <div class="meal-card" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.06}s">
            <div class="meal-header">
              <span style="font-size:1.2rem">${m.icon}</span>
              <span class="meal-type">${t(m.type)}</span>
              <span class="meal-time">${m.time}</span>
            </div>
            <div class="meal-name">${m.name}</div>
            <div class="macros-row">
              <div class="macro macro-protein"><span class="macro-dot"></span>${m.protein}g ${t('nutrition_protein')}</div>
              <div class="macro macro-carbs"><span class="macro-dot"></span>${m.carbs}g ${t('nutrition_carbs')}</div>
              <div class="macro macro-fats"><span class="macro-dot"></span>${m.fats}g ${t('nutrition_fats')}</div>
              <div class="macro" style="margin-left:auto;font-weight:600">${m.cal} ${t('nutrition_calories')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
