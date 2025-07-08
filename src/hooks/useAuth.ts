// hooks/useAuth.ts
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
;

export function useAuth() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, error: error.message };

    setUser(data.user);
    return { success: true };
  };

  const register = async ({ email, password, name, phone, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role }
      }
    });

    if (error) return { success: false, error: error.message };

    // Save to `users` table
    await supabase.from('users').insert({
      id: data.user?.id,
      email,
      name,
      phone,
      role
    });

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return { user, login, register, logout, requestPasswordReset };
}
