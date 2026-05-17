// ========================================
// FitLife Bulgaria — Wallet Page
// ========================================

function renderWallet() {
  const transactions = [
    { icon: '🏆', desc: getLang()==='bg'?'Спечелено: 5K Бягане':'Won: 5K Running Race', amount: '+60 BGN', type: 'win', time: '2h' },
    { icon: '💰', desc: getLang()==='bg'?'Залог: 100кг Клек':'Stake: 100kg Squat Club', amount: '-0.05 SOL', type: 'stake', time: '1d' },
    { icon: '📋', desc: getLang()==='bg'?'Купен план: Мускулен':'Bought: Muscle Plan', amount: '-35 BGN', type: 'purchase', time: '3d' },
    { icon: '💳', desc: getLang()==='bg'?'Депозит':'Deposit', amount: '+100 BGN', type: 'deposit', time: '5d' },
    { icon: '🏆', desc: getLang()==='bg'?'Спечелено: Серия 30 дни':'Won: 30-Day Streak', amount: '+0.2 SOL', type: 'win', time: '1w' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <div class="page-title-row">
          <button class="btn-icon" onclick="navigate('challenges')">←</button>
          <h1>${t('wallet_title')}</h1>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="wallet-balance-card">
        <div class="wallet-label">${t('wallet_balance')}</div>
        <div class="wallet-amount">245.00 BGN</div>
        <div class="wallet-actions">
          <button class="wallet-action-btn">↓ ${t('wallet_deposit')}</button>
          <button class="wallet-action-btn">↑ ${t('wallet_withdraw')}</button>
        </div>
      </div>

      <!-- Win Stats -->
      <div class="grid-3" style="margin-bottom: var(--space-xl)">
        <div class="stat-card">
          <div class="stat-value" style="color:var(--success)">420</div>
          <div class="stat-label">${t('wallet_won')} (BGN)</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:var(--warning)">280</div>
          <div class="stat-label">${t('wallet_wagered')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:var(--accent)">67%</div>
          <div class="stat-label">${t('wallet_win_rate')}</div>
        </div>
      </div>

      <!-- Crypto Balances -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('wallet_crypto')}</h3>
        </div>
        <div class="crypto-balances">
          <div class="crypto-row">
            <div class="crypto-icon" style="background:linear-gradient(135deg,#9945FF,#14F195)">◎</div>
            <div class="crypto-name">Solana <span class="text-xs text-muted">SOL</span></div>
            <div class="crypto-value">
              <div class="crypto-amount">0.85 SOL</div>
              <div class="crypto-usd">≈ 142 BGN</div>
            </div>
          </div>
          <div class="crypto-row">
            <div class="crypto-icon" style="background:linear-gradient(135deg,#26A17B,#1BA27A)">₮</div>
            <div class="crypto-name">Tether <span class="text-xs text-muted">USDT</span></div>
            <div class="crypto-value">
              <div class="crypto-amount">45.00 USDT</div>
              <div class="crypto-usd">≈ 82 BGN</div>
            </div>
          </div>
          <div class="crypto-row">
            <div class="crypto-icon" style="background:linear-gradient(135deg,#627EEA,#3C5BD6)">Ξ</div>
            <div class="crypto-name">Ethereum <span class="text-xs text-muted">ETH</span></div>
            <div class="crypto-value">
              <div class="crypto-amount">0.012 ETH</div>
              <div class="crypto-usd">≈ 55 BGN</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">${t('wallet_history')}</h3>
        </div>
        ${transactions.map((tx, i) => `
          <div class="notification-item" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.05}s">
            <div class="notification-icon-wrap" style="background:var(--bg-glass)">${tx.icon}</div>
            <div class="notification-text">
              <div style="font-weight:500">${tx.desc}</div>
              <div class="text-xs text-muted">${tx.time}</div>
            </div>
            <div style="font-weight:700;color:${tx.amount.startsWith('+') ? 'var(--success)' : 'var(--danger)'}">${tx.amount}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
