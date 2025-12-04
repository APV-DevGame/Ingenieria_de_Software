// Exponer el cliente en window para que los módulos puedan accederlo
window.supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);