// ========================================
// FitLife Bulgaria — Realtime Chat & Messages Service
// ========================================

const ChatService = {
  async getMessages(conversationId) {
    return await dbFetch('messages', q => q.eq('conversation_id', conversationId).order('created_at', { ascending: true }), []);
  },

  async sendMessage(conversationId, content, isAi = false) {
    const user = getCurrentUser();
    if (!user && !isAi) return { error: 'Not logged in' };

    return await dbInsert('messages', {
      conversation_id: conversationId,
      sender_id: user ? user.id : null,
      content: content.trim(),
      is_ai: isAi
    });
  },

  subscribeToConversation(conversationId, onNewMessage) {
    if (!isSupabaseConnected()) return null;
    return supabaseClient
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, payload => {
        if (typeof onNewMessage === 'function') onNewMessage(payload.new);
      })
      .subscribe();
  }
};
