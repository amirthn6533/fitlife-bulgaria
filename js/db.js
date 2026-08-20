// ========================================
// FitLife Bulgaria — Supabase Client & DB Layer
// ========================================

const DEFAULT_SUPABASE_URL = 'https://plhjjefpkcgqedxcaozp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_DbLC1w62TjMyYfYSRDUi2Q_yehWzosj';

// Config persistence in localStorage for easy dynamic connection
const SUPABASE_CONFIG_KEY = 'fitlife-supabase-config';

function getSupabaseConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY));
    if (saved && saved.url && saved.key) return saved;
  } catch (e) {}
  return {
    url: DEFAULT_SUPABASE_URL,
    key: DEFAULT_SUPABASE_ANON_KEY
  };
}

function setSupabaseConfig(url, key) {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
  initSupabaseClient();
}

let supabaseClient = null;

function initSupabaseClient() {
  const config = getSupabaseConfig();
  if (typeof window.supabase !== 'undefined' && config.url && config.key && config.key !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.key);
      console.log('⚡ Supabase Client initialized successfully');
    } catch (err) {
      console.warn('⚠️ Could not initialize Supabase client:', err);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }
}

// Auto init on load
initSupabaseClient();

function isSupabaseConnected() {
  return supabaseClient !== null;
}

// ========================================
// Generic DB API (Works with Supabase & Local Fallback)
// ========================================

const DB_PREFIX = 'fitlife-db-';

async function dbFetch(table, queryBuilder = null, fallbackData = []) {
  if (isSupabaseConnected()) {
    try {
      let query = supabaseClient.from(table).select('*');
      if (typeof queryBuilder === 'function') {
        query = queryBuilder(query);
      }
      const { data, error } = await query;
      if (!error && data) return data;
      console.warn(`Supabase fetch error for ${table}:`, error);
    } catch (err) {
      console.warn(`Supabase request exception for ${table}:`, err);
    }
  }
  // Local fallback
  return dbLoad(table, fallbackData);
}

async function dbInsert(table, record) {
  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabaseClient.from(table).insert(record).select();
      if (!error && data) return { data, error: null };
      return { data: null, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
  // Local fallback
  const list = dbLoad(table, []);
  const newRecord = { id: `local_${Date.now()}`, ...record, created_at: new Date().toISOString() };
  list.unshift(newRecord);
  dbSave(table, list);
  return { data: [newRecord], error: null };
}

async function dbUpdate(table, matchField, matchValue, updates) {
  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabaseClient
        .from(table)
        .update(updates)
        .eq(matchField, matchValue)
        .select();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
  // Local fallback
  const list = dbLoad(table, []);
  const idx = list.findIndex(item => item[matchField] === matchValue);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    dbSave(table, list);
    return { data: [list[idx]], error: null };
  }
  return { data: null, error: 'Not found' };
}

// Local Storage helpers
function dbSave(collection, data) {
  try {
    localStorage.setItem(DB_PREFIX + collection, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('DB save error:', err);
    return false;
  }
}

function dbLoad(collection, fallback = null) {
  try {
    const stored = localStorage.getItem(DB_PREFIX + collection);
    return stored ? JSON.parse(stored) : fallback;
  } catch (err) {
    return fallback;
  }
}

function dbRemove(collection) {
  localStorage.removeItem(DB_PREFIX + collection);
}
