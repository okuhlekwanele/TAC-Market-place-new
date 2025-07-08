import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthUser, LoginCredentials, RegisterData } from '../types/auth';
import { useEmailService } from './useEmailService';
import { useGoogleSheets } from './useGoogleSheets';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sendWelcomeEmail } = useEmailService();
  const { syncUserToSheets } = useGoogleSheets();

  // Load authenticated user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(data.created_at),
      lastLogin: new Date(data.last_login),
      providerId: data.provider_id || null,
      isActive: data.is_active
    };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const { email, password, name, phone, role } = data;
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError || !authData.user) {
      return { success: false, error: signUpError?.message };
    }

    // Create user profile
    const { error: insertError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      phone,
      role,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_active: true
    });

    if (insertError) return { success: false, error: insertError.message };

    const profile = await fetchUserProfile(authData.user.id);
    if (profile) {
      setUser(profile);
      sendWelcomeEmail(email, name);
      syncUserToSheets(profile);
    }

    return { success: true };
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login failed' };
    }

    const profile = await fetchUserProfile(data.user.id);
    if (profile) {
      setUser(profile);
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        last_login: new Date().toISOString()
      })
      .eq('id', user.id);

    if (!error) {
      const updated = { ...user, ...updates };
      setUser(updated);
      syncUserToSheets(updated);
    }
  };

  const linkProviderAccount = (providerId: string) => {
    updateUser({ providerId, role: 'provider' });
  };

  const getAllUsers = async (): Promise<AuthUser[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('role', 'admin');

    if (error || !data) return [];

    return data.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      providerId: u.provider_id,
      createdAt: new Date(u.created_at),
      lastLogin: new Date(u.last_login),
      isActive: u.is_active
    }));
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userId);
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isProvider: user?.role === 'provider',
    login,
    register,
    logout,
    updateUser,
    linkProviderAccount,
    getAllUsers,
    updateUserStatus,
    requestPasswordReset
  };
}