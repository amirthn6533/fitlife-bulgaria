// ========================================
// FitLife Bulgaria — Interactive Analytics & Progress Page
// ========================================

let activeAnalyticsTimeframe = '30d'; // 7d, 30d, 90d
let activeStrengthFilter = 'all'; // all, bench, squat, deadlift

function renderAnalytics() {
  const isBg = getLang() === 'bg';
  const weightLogs = AnalyticsService.getWeightLogs();
  const strengthData = AnalyticsService.getDefaultStrengthData();
  const calorieData = AnalyticsService.getDefaultCalorieBalanceData();

  const currentWeight = weightLogs[weightLogs.length - 1]?.weight || 77.8;
  const startWeight = weightLogs[0]?.weight || 81.5;
  const weightDiff = (currentWeight - startWeight).toFixed(1);

  return `
    <div class="page" style="padding-bottom: 90px;">
      <!-- Header -->
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('profile')">←</button>
          <h1>${isBg ? '📊 Анализ & Прогрес' : '📊 Analytics & Progress'}</h1>
        </div>
      </div>

      <!-- Timeframe Filter -->
      <div class="tabs" style="margin-bottom: var(--space-md);">
        <button class="tab ${activeAnalyticsTimeframe === '7d' ? 'active' : ''}" onclick="setAnalyticsTimeframe('7d')">7 ${isBg ? 'Дни' : 'Days'}</button>
        <button class="tab ${activeAnalyticsTimeframe === '30d' ? 'active' : ''}" onclick="setAnalyticsTimeframe('30d')">30 ${isBg ? 'Дни' : 'Days'}</button>
        <button class="tab ${activeAnalyticsTimeframe === '90d' ? 'active' : ''}" onclick="setAnalyticsTimeframe('90d')">90 ${isBg ? 'Дни' : 'Days'}</button>
      </div>

      <!-- Overview Stats Grid -->
      <div class="grid-3" style="margin-bottom: var(--space-lg); gap: var(--space-xs);">
        <div class="stat-card" style="padding: var(--space-sm); border-left: 3px solid var(--accent);">
          <div class="stat-value" style="font-size: 1.3rem; color: var(--accent);">${weightDiff} kg</div>
          <div class="stat-label">${isBg ? 'Промяна в тегло' : 'Weight Change'}</div>
        </div>
        <div class="stat-card" style="padding: var(--space-sm); border-left: 3px solid var(--warning);">
          <div class="stat-value" style="font-size: 1.3rem; color: var(--warning);">+47.5 kg</div>
          <div class="stat-label">${isBg ? 'Силов ръст' : 'Strength Gain'}</div>
        </div>
        <div class="stat-card" style="padding: var(--space-sm); border-left: 3px solid var(--success);">
          <div class="stat-value" style="font-size: 1.3rem; color: var(--success);">96%</div>
          <div class="stat-label">${isBg ? 'Постоянство' : 'Consistency'}</div>
        </div>
      </div>

      <!-- 1. Body Weight Trend Chart Card -->
      <div class="card card-glow" style="margin-bottom: var(--space-lg); background: var(--bg-glass); border: 1px solid rgba(0,210,255,0.2); border-radius: var(--radius-xl); padding: var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-xs);">
          <div>
            <div style="font-weight:900; font-size:var(--fs-md); color:#fff;">
              📉 ${isBg ? 'Тенденция на теглото' : 'Body Weight Trend'}
            </div>
            <div class="text-xs text-muted">
              ${isBg ? 'Текущо:' : 'Current:'} <strong style="color:var(--accent);">${currentWeight} kg</strong> (${weightDiff > 0 ? '+' : ''}${weightDiff} kg ${isBg ? 'за 30 дни' : 'in 30 days'})
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="handleAddNewWeightLog()" style="padding:4px 10px; font-size:11px;">
            ➕ ${isBg ? 'Запиши тегло' : 'Log Weight'}
          </button>
        </div>

        <div style="width:100%; margin: var(--space-sm) 0;">
          ${AnalyticsService.renderWeightSVG(weightLogs)}
        </div>
      </div>

      <!-- 2. Big 3 Strength Progression Chart Card -->
      <div class="card card-glow" style="margin-bottom: var(--space-lg); background: var(--bg-glass); border: 1px solid rgba(255,215,0,0.2); border-radius: var(--radius-xl); padding: var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-xs);">
          <div>
            <div style="font-weight:900; font-size:var(--fs-md); color:#fff;">
              🏋️‍♂️ ${isBg ? 'Силов Напредък (Big 3)' : 'Strength Progression (Big 3)'}
            </div>
            <div class="text-xs text-muted">
              ${isBg ? '1RM Прогнозен максимум в kg' : 'Estimated 1-Rep Max in kg'}
            </div>
          </div>
        </div>

        <!-- Lift Chips -->
        <div style="display:flex; gap:6px; margin-bottom: var(--space-sm); overflow-x:auto;" class="scroll-h">
          <button class="tag ${activeStrengthFilter === 'all' ? 'tag-primary' : ''}" style="cursor:pointer; font-size:10px;" onclick="setStrengthFilter('all')">
            ${isBg ? 'Всички' : 'All Lifts'}
          </button>
          <button class="tag ${activeStrengthFilter === 'bench' ? 'tag-primary' : ''}" style="cursor:pointer; font-size:10px; color:#00D2FF;" onclick="setStrengthFilter('bench')">
            ● Bench (90kg)
          </button>
          <button class="tag ${activeStrengthFilter === 'squat' ? 'tag-primary' : ''}" style="cursor:pointer; font-size:10px; color:#FFD700;" onclick="setStrengthFilter('squat')">
            ● Squat (120kg)
          </button>
          <button class="tag ${activeStrengthFilter === 'deadlift' ? 'tag-primary' : ''}" style="cursor:pointer; font-size:10px; color:#FF4B2B;" onclick="setStrengthFilter('deadlift')">
            ● Deadlift (150kg)
          </button>
        </div>

        <div style="width:100%; margin: var(--space-sm) 0;">
          ${AnalyticsService.renderStrengthSVG(strengthData, activeStrengthFilter)}
        </div>
      </div>

      <!-- 3. Caloric Intake vs Expenditure Balance Card -->
      <div class="card card-glow" style="margin-bottom: var(--space-lg); background: var(--bg-glass); border: 1px solid rgba(85,239,196,0.2); border-radius: var(--radius-xl); padding: var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-xs);">
          <div>
            <div style="font-weight:900; font-size:var(--fs-md); color:#fff;">
              📊 ${isBg ? 'Енергиен Баланс (Калории)' : 'Calorie Balance & Expenditure'}
            </div>
            <div class="text-xs text-muted">
              ${isBg ? 'Среден дневен дефицит:' : 'Average Daily Deficit:'} <strong style="color:var(--success);">-310 kcal</strong>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div style="display:flex; gap:12px; margin-bottom: var(--space-sm); font-size:10px;">
          <span style="display:flex; align-items:center; gap:4px; color:#FF7675;">
            <span style="width:8px; height:8px; background:#FF7675; border-radius:2px; display:inline-block;"></span>
            ${isBg ? 'Приети (Храна)' : 'Intake (Food)'}
          </span>
          <span style="display:flex; align-items:center; gap:4px; color:#55EFC4;">
            <span style="width:8px; height:8px; background:#55EFC4; border-radius:2px; display:inline-block;"></span>
            ${isBg ? 'Изгорени (Тренировка + BMR)' : 'Burned (Active + BMR)'}
          </span>
        </div>

        <div style="width:100%; margin: var(--space-sm) 0;">
          ${AnalyticsService.renderCalorieBalanceSVG(calorieData)}
        </div>
      </div>
    </div>
  `;
}

function setAnalyticsTimeframe(tf) {
  activeAnalyticsTimeframe = tf;
  renderPage();
}

function setStrengthFilter(filter) {
  activeStrengthFilter = filter;
  renderPage();
}

function handleAddNewWeightLog() {
  const isBg = getLang() === 'bg';
  const val = prompt(isBg ? 'Въведете вашето тегло за днес (kg):' : 'Enter your weight for today (kg):', '77.5');
  if (val && !isNaN(parseFloat(val))) {
    AnalyticsService.logWeight(parseFloat(val));
    if (typeof NotificationService !== 'undefined') {
      NotificationService.notify(
        isBg ? '📉 Теглото е записано!' : '📉 Weight Logged!',
        isBg ? `Ново тегло: ${val} kg. Браво за последователността!` : `New weight: ${val} kg. Consistency is key!`,
        { type: 'success', icon: '⚖️' }
      );
    }
    renderPage();
  }
}
