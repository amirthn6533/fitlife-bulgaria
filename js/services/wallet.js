// ========================================
// FitLife Bulgaria — Wallet & Payments Service
// ========================================

const WalletService = {
  async getWallet() {
    const user = getCurrentUser();
    if (!user) return null;
    return await dbFetch('user_wallets', q => q.eq('user_id', user.id).single(), {
      fiat_balance_bgn: 245.00,
      sol_balance: 0.85,
      usdt_balance: 45.00,
      eth_balance: 0.012,
      total_won_bgn: 420.00,
      total_wagered_bgn: 280.00
    });
  },

  async getTransactions() {
    const user = getCurrentUser();
    if (!user) return [];
    return await dbFetch('wallet_transactions', q => q.eq('user_id', user.id).order('created_at', { ascending: false }), []);
  },

  async deposit(amount, currency = 'BGN') {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };

    return await dbInsert('wallet_transactions', {
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      currency: currency,
      status: 'completed',
      description: `Deposit ${amount} ${currency}`
    });
  }
};
