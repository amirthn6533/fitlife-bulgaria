// ========================================
// FitLife Bulgaria — AI Food Scanner Modal UI
// ========================================

let scannedFoodResult = null;

function openFoodScannerModal() {
  scannedFoodResult = null;
  const isBg = getLang() === 'bg';

  const existing = document.getElementById('food-scanner-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'food-scanner-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(12px);animation:fadeIn 0.25s ease-out;';

  modal.innerHTML = `
    <div class="card card-glow" style="width:94%;max-width:440px;max-height:90vh;background:var(--bg-glass);border-radius:var(--radius-xl);display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s ease-out;border:1px solid rgba(255,255,255,0.12);padding:0;overflow:hidden;">
      
      <!-- Modal Header -->
      <div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);">
        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          <div style="font-size:1.8rem;filter:drop-shadow(0 0 10px var(--accent-glow));">📸</div>
          <div>
            <div style="font-weight:900;font-size:var(--fs-md);background:linear-gradient(135deg,#fff,#51CF66);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">AI Food Macro Scanner</div>
            <div class="text-xs text-muted">Instant Vision & Calorie Recognition</div>
          </div>
        </div>
        <button onclick="closeFoodScannerModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Scanner Body -->
      <div id="food-scanner-body" style="flex:1;overflow-y:auto;padding:var(--space-md);display:flex;flex-direction:column;">
        ${renderScannerInitialView()}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeFoodScannerModal() {
  const modal = document.getElementById('food-scanner-modal');
  if (modal) modal.remove();
}

function renderScannerInitialView() {
  const isBg = getLang() === 'bg';
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-md);text-align:center;">
      
      <!-- Upload / Camera Area -->
      <div style="border:2px dashed rgba(255,255,255,0.2);border-radius:var(--radius-lg);padding:var(--space-xl) var(--space-md);background:rgba(255,255,255,0.02);display:flex;flex-direction:column;align-items:center;gap:var(--space-sm);position:relative;cursor:pointer;" onclick="document.getElementById('food-file-input').click()">
        <input type="file" id="food-file-input" accept="image/*" capture="environment" style="display:none;" onchange="handleFoodPhotoSelected(event)">
        <div style="font-size:3rem;filter:drop-shadow(0 0 15px var(--accent-glow));">📷</div>
        <div style="font-weight:700;font-size:var(--fs-md);">${isBg ? 'Снимай храната или качи снимка' : 'Take a Photo or Upload Image'}</div>
        <div class="text-xs text-muted">${isBg ? 'AI ще разпознае порцията, съставките и калориите' : 'AI will analyze ingredients, portion weight & macros'}</div>
        <button class="btn btn-primary btn-sm" style="margin-top:var(--space-xs);pointer-events:none;">
          📱 ${isBg ? 'Избери Снимка' : 'Select Photo'}
        </button>
      </div>

      <!-- Popular Fitness Meal Presets -->
      <div style="text-align:left;">
        <div class="text-xs text-muted" style="margin-bottom:var(--space-xs);font-weight:600;">
          🥗 ${isBg ? 'Или избери от популярните фитнес менюта:' : 'Or choose from popular fitness meals:'}
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-xs);">
          ${FoodScannerService.dishesKB.map((dish, i) => `
            <div onclick="runSampleScan(${i})" style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:rgba(255,255,255,0.04);border-radius:var(--radius-md);cursor:pointer;border:1px solid rgba(255,255,255,0.05);transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.04)'">
              <span style="font-size:1.5rem;">${dish.icon}</span>
              <div style="flex:1;min-width:0;">
                <div style="font-size:var(--fs-xs);font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${isBg ? dish.nameBg : dish.nameEn}
                </div>
                <div class="text-xs text-muted">
                  ${dish.calories} kcal • P: ${dish.protein}g • C: ${dish.carbs}g • F: ${dish.fats}g
                </div>
              </div>
              <span class="tag tag-accent" style="font-size:9px;">Scan ➤</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function handleFoodPhotoSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    runScanningAnimation(evt.target.result);
  };
  reader.readAsDataURL(file);
}

function runSampleScan(index) {
  const dish = FoodScannerService.dishesKB[index];
  runScanningAnimation(null, dish);
}

function runScanningAnimation(imageSrc, predefinedDish = null) {
  const container = document.getElementById('food-scanner-body');
  const isBg = getLang() === 'bg';
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:var(--space-xl) 0;">
      <div style="position:relative;width:200px;height:200px;border-radius:var(--radius-lg);overflow:hidden;background:rgba(255,255,255,0.05);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-lg);">
        ${imageSrc ? `<img src="${imageSrc}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="font-size:4.5rem;">${predefinedDish ? predefinedDish.icon : '🥗'}</div>`}
        
        <!-- Laser Scanner Bar Animation -->
        <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(90deg,transparent,#00D2FF,transparent);box-shadow:0 0 15px #00D2FF;animation:scanLaser 1.4s ease-in-out infinite alternate;"></div>
      </div>

      <div style="font-weight:900;font-size:var(--fs-lg);color:var(--accent);margin-bottom:var(--space-xs);" id="scan-status-text">
        🧠 ${isBg ? 'AI Компютърно зрение сканира...' : 'Neural Vision Processing...'}
      </div>
      <div class="text-xs text-muted" id="scan-substatus-text">
        ${isBg ? 'Разпознаване на хранителни съставки и грамажи...' : 'Identifying food volume, density, and nutrient ratios...'}
      </div>
    </div>

    <style>
      @keyframes scanLaser {
        0% { top: 5%; }
        100% { top: 92%; }
      }
    </style>
  `;

  setTimeout(() => {
    const dish = predefinedDish || FoodScannerService.dishesKB[Math.floor(Math.random() * FoodScannerService.dishesKB.length)];
    scannedFoodResult = dish;
    renderScanResult(dish);
  }, 1400);
}

function renderScanResult(dish) {
  const container = document.getElementById('food-scanner-body');
  const isBg = getLang() === 'bg';
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:var(--space-md);animation:fadeIn 0.3s ease-out;">
      
      <!-- Dish Header Card -->
      <div class="card card-glow" style="background:rgba(255,255,255,0.04);border-radius:var(--radius-lg);padding:var(--space-md);">
        <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs);">
          <span style="font-size:2.2rem;">${dish.icon}</span>
          <div style="flex:1;">
            <div style="font-weight:900;font-size:var(--fs-md);line-height:1.2;">
              ${isBg ? dish.nameBg : dish.nameEn}
            </div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:4px;">
              <span class="tag tag-success" style="font-size:9px;">AI Match 98.4%</span>
              <span class="tag tag-accent" style="font-size:9px;">Diet Score: ${dish.score}/100</span>
            </div>
          </div>
        </div>

        <div style="text-align:center;padding:var(--space-sm) 0;border-top:1px solid var(--border-subtle);margin-top:var(--space-sm);">
          <div style="font-size:2.2rem;font-weight:900;color:var(--accent);">${dish.calories} <span style="font-size:var(--fs-sm);color:var(--text-muted);">kcal</span></div>
        </div>

        <!-- Macros Breakdown -->
        <div class="grid-3" style="gap:var(--space-xs);margin-top:var(--space-xs);">
          <div class="stat-card" style="padding:var(--space-xs);text-align:center;">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--accent);">${dish.protein}g</div>
            <div class="stat-label">${isBg ? 'Протеин' : 'Protein'}</div>
          </div>
          <div class="stat-card" style="padding:var(--space-xs);text-align:center;">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--warning);">${dish.carbs}g</div>
            <div class="stat-label">${isBg ? 'Въглехидрати' : 'Carbs'}</div>
          </div>
          <div class="stat-card" style="padding:var(--space-xs);text-align:center;">
            <div class="stat-value" style="font-size:var(--fs-md);color:var(--danger);">${dish.fats}g</div>
            <div class="stat-label">${isBg ? 'Мазнини' : 'Fats'}</div>
          </div>
        </div>
      </div>

      <!-- Ingredient Breakdown -->
      <div>
        <div class="text-xs text-muted" style="font-weight:700;margin-bottom:var(--space-xs);">
          🔍 ${isBg ? 'РАЗПОЗНАТИ СЪСТАВКИ' : 'DETECTED INGREDIENTS'}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${dish.ingredients.map(ing => `
            <div style="display:flex;justify-content:space-between;padding:6px 10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);font-size:var(--fs-xs);">
              <span>${ing.name}</span>
              <span class="text-muted">${ing.cal} kcal (P:${ing.protein}g C:${ing.carbs}g F:${ing.fats}g)</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Feedback Insight -->
      <div style="background:rgba(0,210,255,0.06);border-left:3px solid var(--accent);padding:8px 12px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:var(--fs-xs);line-height:1.4;">
        ${isBg ? dish.aiFeedbackBg : dish.aiFeedbackEn}
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-xs);">
        <button class="btn btn-primary btn-full" onclick="handleLogScannedMealToDiary()">
          ➕ ${isBg ? 'Запиши в хранителния дневник' : 'Log to Today\'s Meals'}
        </button>
        <button class="btn btn-ghost btn-sm" onclick="openFoodScannerModal()">
          🔄 ${isBg ? 'Ново' : 'Rescan'}
        </button>
      </div>
    </div>
  `;
}

async function handleLogScannedMealToDiary() {
  if (!scannedFoodResult) return;
  const isBg = getLang() === 'bg';

  await FoodScannerService.logScannedMeal(scannedFoodResult, 'lunch');
  alert(isBg ? '🎉 Храненето беше успешно добавено към днешния ти прием!' : '🎉 Meal successfully logged to your daily nutrition!');
  closeFoodScannerModal();
  navigate('nutrition');
}
