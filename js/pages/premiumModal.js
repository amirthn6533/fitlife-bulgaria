// ========================================
// FitLife Bulgaria — FitLife PRO Paywall & VIP Modal UI
// ========================================

let selectedPremiumPlan = 'yearly';
let selectedPaymentMethod = 'apple_pay';

function showPremiumModal() {
  const isBg = getLang() === 'bg';
  const isCurrentlyPro = SubscriptionService.isPremium();
  const currentSub = SubscriptionService.getSubscription();

  const existing = document.getElementById('fitlife-premium-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'fitlife-premium-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(14px);animation:fadeIn 0.25s ease-out;';

  modal.innerHTML = `
    <div class="card card-glow" style="width:94%;max-width:440px;max-height:92vh;background:linear-gradient(180deg, rgba(30,22,60,0.95) 0%, rgba(10,14,26,0.98) 100%);border-radius:var(--radius-xl);display:flex;flex-direction:column;position:relative;animation:slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,215,0,0.3);box-shadow:0 0 40px rgba(108,92,231,0.4);padding:0;overflow:hidden;">
      
      <!-- Top Glow Banner -->
      <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(90deg, #FF4B2B, #FFD700, #00D2FF);"></div>

      <!-- Close Button -->
      <button onclick="closePremiumModal()" style="position:absolute;top:14px;right:16px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:30px;height:30px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;">&times;</button>

      <!-- Scrollable Content -->
      <div style="flex:1;overflow-y:auto;padding:var(--space-xl) var(--space-lg);display:flex;flex-direction:column;align-items:center;text-align:center;">
        
        <div style="font-size:3.2rem;margin-bottom:var(--space-xs);filter:drop-shadow(0 0 20px rgba(255,215,0,0.6));">👑</div>
        <h2 style="font-size:1.8rem;font-weight:900;margin:0;background:linear-gradient(135deg, #FFF, #FFD700, #FF7675);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          FitLife PRO VIP
        </h2>
        <p class="text-xs text-muted" style="margin-top:4px;margin-bottom:var(--space-lg);">
          ${isBg ? 'Отключи пълния потенциал на твоето тяло и здраве' : 'Unlock your full physical potential with AI & VIP Perks'}
        </p>

        <!-- Features List -->
        <div style="width:100%;background:rgba(255,255,255,0.03);border-radius:var(--radius-lg);padding:var(--space-md);margin-bottom:var(--space-lg);border:1px solid rgba(255,255,255,0.06);text-align:left;display:flex;flex-direction:column;gap:10px;font-size:var(--fs-xs);">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#51CF66;font-weight:bold;font-size:1.1rem;">✓</span>
            <span><strong>${isBg ? 'Неограничени AI Тренировъчни планове' : 'Unlimited Custom AI Training Plans'}</strong></span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#51CF66;font-weight:bold;font-size:1.1rem;">✓</span>
            <span><strong>${isBg ? 'AI Персонализиран Хранителен Режим' : 'Personal AI Nutrition & Regime Planner'}</strong></span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#51CF66;font-weight:bold;font-size:1.1rem;">✓</span>
            <span><strong>${isBg ? 'Неограничен скенер на храна с камера' : 'Unlimited Neural AI Food Scanner'}</strong></span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#51CF66;font-weight:bold;font-size:1.1rem;">✓</span>
            <span><strong>${isBg ? 'VIP Награден фонд в предизвикателства' : 'VIP Wager Pools & 2x Coin Rewards'}</strong></span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#51CF66;font-weight:bold;font-size:1.1rem;">✓</span>
            <span><strong>${isBg ? 'Без реклами & Приоритетен чат с треньори' : 'Zero Ads & Priority Coach Direct Chat'}</strong></span>
          </div>
        </div>

        ${isCurrentlyPro ? `
          <!-- Active VIP State -->
          <div class="card" style="width:100%;background:rgba(81,207,102,0.1);border:1px solid #51CF66;padding:var(--space-md);border-radius:var(--radius-lg);margin-bottom:var(--space-md);">
            <div style="font-weight:900;color:#51CF66;margin-bottom:4px;">✨ ${isBg ? 'Твоят абонамент е АКТИВЕН' : 'You are an Active VIP Member'}</div>
            <div class="text-xs text-muted">${isBg ? 'План:' : 'Plan:'} ${currentSub?.planType === 'yearly' ? 'Годишен (Yearly)' : 'Месечен (Monthly)'}</div>
          </div>
          <button class="btn btn-ghost btn-full btn-sm" onclick="handleCancelVIP()" style="color:var(--danger);">
            ${isBg ? 'Прекрати абонамента' : 'Cancel Subscription'}
          </button>
        ` : `
          <!-- Pricing Selector -->
          <div style="width:100%;display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-lg);">
            
            <!-- Yearly Plan Card (Selected by Default) -->
            <div id="plan-card-yearly" onclick="selectPlan('yearly')" style="position:relative;background:${selectedPremiumPlan === 'yearly' ? 'rgba(108,92,231,0.25)' : 'rgba(255,255,255,0.03)'};border:2px solid ${selectedPremiumPlan === 'yearly' ? '#FFD700' : 'rgba(255,255,255,0.08)'};border-radius:var(--radius-lg);padding:var(--space-md);cursor:pointer;transition:0.2s;">
              <span class="tag" style="position:absolute;top:-10px;right:10px;background:linear-gradient(135deg,#FF4B2B,#FFD700);color:#000;font-weight:900;font-size:9px;border:none;">33% OFF</span>
              <div style="font-weight:800;font-size:var(--fs-xs);margin-bottom:4px;">${isBg ? 'Годишен' : 'Yearly'}</div>
              <div style="font-size:1.4rem;font-weight:900;color:#FFD700;">79.90 <span style="font-size:11px;color:#fff;">BGN</span></div>
              <div class="text-xs text-muted" style="margin-top:2px;">6.65 лв / мес</div>
            </div>

            <!-- Monthly Plan Card -->
            <div id="plan-card-monthly" onclick="selectPlan('monthly')" style="background:${selectedPremiumPlan === 'monthly' ? 'rgba(108,92,231,0.25)' : 'rgba(255,255,255,0.03)'};border:2px solid ${selectedPremiumPlan === 'monthly' ? '#FFD700' : 'rgba(255,255,255,0.08)'};border-radius:var(--radius-lg);padding:var(--space-md);cursor:pointer;transition:0.2s;">
              <div style="font-weight:800;font-size:var(--fs-xs);margin-bottom:4px;">${isBg ? 'Месечен' : 'Monthly'}</div>
              <div style="font-size:1.4rem;font-weight:900;color:#fff;">9.90 <span style="font-size:11px;color:#fff;">BGN</span></div>
              <div class="text-xs text-muted" style="margin-top:2px;">${isBg ? 'месечно' : 'per month'}</div>
            </div>
          </div>

          <!-- Payment Methods Selector -->
          <div style="width:100%;margin-bottom:var(--space-lg);text-align:left;">
            <div class="text-xs text-muted" style="margin-bottom:6px;font-weight:600;">
              ${isBg ? 'Метод на плащане:' : 'Payment Method:'}
            </div>
            <div style="display:flex;gap:var(--space-xs);">
              <button class="tag ${selectedPaymentMethod === 'apple_pay' ? 'tag-primary' : ''}" style="cursor:pointer;flex:1;padding:8px;justify-content:center;" onclick="selectPaymentMethod('apple_pay')">
                🍎 Apple Pay
              </button>
              <button class="tag ${selectedPaymentMethod === 'card' ? 'tag-primary' : ''}" style="cursor:pointer;flex:1;padding:8px;justify-content:center;" onclick="selectPaymentMethod('card')">
                💳 Card
              </button>
              <button class="tag ${selectedPaymentMethod === 'crypto' ? 'tag-primary' : ''}" style="cursor:pointer;flex:1;padding:8px;justify-content:center;" onclick="selectPaymentMethod('crypto')">
                🪙 Solana Pay
              </button>
            </div>
          </div>

          <!-- Checkout CTA Button -->
          <button id="checkout-btn" class="btn btn-primary btn-full" style="background:linear-gradient(135deg, #6C5CE7, #FFD700);color:#000;font-weight:900;font-size:var(--fs-md);padding:14px;box-shadow:0 0 25px rgba(255,215,0,0.5);border:none;margin-bottom:var(--space-xs);" onclick="handleProcessSubscription()">
            👑 ${isBg ? 'Активирай FitLife PRO' : 'Unlock FitLife PRO Now'}
          </button>
          <div class="text-xs text-muted" style="font-size:10px;">
            ${isBg ? 'Отмяна по всяко време с 1 клик • 14 дни гаранция' : 'Cancel anytime with 1-click • 14-day money-back guarantee'}
          </div>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closePremiumModal() {
  const modal = document.getElementById('fitlife-premium-modal');
  if (modal) modal.remove();
}

function selectPlan(planType) {
  selectedPremiumPlan = planType;
  showPremiumModal();
}

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  showPremiumModal();
}

async function handleProcessSubscription() {
  const btn = document.getElementById('checkout-btn');
  const isBg = getLang() === 'bg';
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = `<span style="animation:spin 1s linear infinite;display:inline-block">⏳</span> ${selectedPaymentMethod === 'apple_pay' ? 'Connecting to Apple Pay...' : 'Processing Payment...'}`;

  setTimeout(async () => {
    await SubscriptionService.activateSubscription(selectedPremiumPlan, selectedPaymentMethod);
    closePremiumModal();
    alert(isBg ? '🎉 Честито! Твоят FitLife PRO VIP статус беше успешно активиран!' : '🎉 Congratulations! Your FitLife PRO VIP membership is now ACTIVE!');
    renderPage();
  }, 1000);
}

async function handleCancelVIP() {
  const isBg = getLang() === 'bg';
  if (confirm(isBg ? 'Сигурни ли сте, че искате да прекратите PRO абонамента?' : 'Are you sure you want to cancel your PRO subscription?')) {
    await SubscriptionService.cancelSubscription();
    closePremiumModal();
    alert(isBg ? 'Абонаментът беше прекратен.' : 'Subscription cancelled.');
    renderPage();
  }
}
