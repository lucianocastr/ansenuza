import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// CONFIGURACIÓN — reemplazá con tus credenciales
// Dashboard Supabase → Settings → API
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://qjvbqpjqhqrxfreqthve.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_weZWKK1i1s4GAw5KpdHw7Q_XXvxHR0t';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
