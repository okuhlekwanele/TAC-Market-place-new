import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useEmailService } from './useEmailService';
import { useGoogleSheets } from './useGoogleSheets';
import { AuthUser, LoginCredentials, RegisterData } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sendWelcomeEmail } = useEmailService();
  const { syncUserToSheets } = useGoogleSheets();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const sessionUser = data?.user;
      if (sessionUser) {
        fetchUserProfile(sessionUser.id);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      const authUser: AuthUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        providerId: data.provider_id,
        createdAt: new Date(data.created_at),
        lastLogin: new Date(data.last_login),
        isActive: data.is_active
      };
      setUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login failed' };
    }

    await fetchUserProfile(data.user.id);
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (error || !authData.user) {
      return { success: false, error: error?.message || 'Registration failed' };
    }

    const { id } = authData.user;
    const profile = {
      id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_active: true,
      provider_id: null
    };

    await supabase.from('users').insert(profile);

    // Send email + sync
    sendWelcomeEmail(data.email, data.name).catch(console.warn);
    syncUserToSheets(profile).catch(console.warn);

    await fetchUserProfile(id);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ ...updates, last_login: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      syncUserToSheets(updatedUser).catch(console.warn);
    }
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return error ? { success: false, error: error.message } : { success: true };
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    requestPasswordReset,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isProvider: user?.role === 'provider'
  };
}
