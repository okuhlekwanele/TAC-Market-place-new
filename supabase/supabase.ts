import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: '12345678'
});

if (error) {
  console.error('Signup error:', error.message);
} else {
  console.log('Signup success:', data);
}
});
