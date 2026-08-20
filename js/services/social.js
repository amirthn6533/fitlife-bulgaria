// ========================================
// FitLife Bulgaria — Social & Feed Service
// ========================================

const SocialService = {
  async getPosts(filter = 'trending') {
    return await dbFetch('posts', q => q.order('created_at', { ascending: false }).limit(20), []);
  },

  async createPost(postData) {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };
    
    return await dbInsert('posts', {
      user_id: user.id,
      post_type: postData.postType || 'text',
      content: postData.content || '',
      location_name: postData.location || '',
      music_metadata: postData.music || null,
      workout_metadata: postData.workout || null,
      pr_metadata: postData.pr || null,
      likes_count: 0,
      comments_count: 0
    });
  },

  async toggleLike(postId) {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };

    if (isSupabaseConnected()) {
      const { data: existing } = await supabaseClient
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabaseClient.from('post_likes').delete().eq('id', existing.id);
        await supabaseClient.rpc('decrement_post_likes', { p_id: postId });
        return { liked: false };
      } else {
        await supabaseClient.from('post_likes').insert({ post_id: postId, user_id: user.id });
        await supabaseClient.rpc('increment_post_likes', { p_id: postId });
        return { liked: true };
      }
    }

    // Local fallback
    const key = `likes_${postId}_${user.id}`;
    const wasLiked = localStorage.getItem(key) === 'true';
    localStorage.setItem(key, wasLiked ? 'false' : 'true');
    return { liked: !wasLiked };
  },

  async addComment(postId, commentText) {
    const user = getCurrentUser();
    if (!user) return { error: 'Not logged in' };

    return await dbInsert('post_comments', {
      post_id: postId,
      user_id: user.id,
      comment_text: commentText.trim()
    });
  },

  subscribeToNewPosts(callback) {
    if (!isSupabaseConnected()) return null;
    return supabaseClient
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        if (typeof callback === 'function') callback(payload.new);
      })
      .subscribe();
  }
};
