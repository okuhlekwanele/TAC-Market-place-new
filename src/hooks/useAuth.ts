import { useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, RegisterData } from '../types/auth';

// Default admin credentials
const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: 'admin@tacmarketplace.com',
  password: 'TACAdmin2024!', // In production, this should be hashed
  name: 'TAC Admin',
  role: 'admin' as const,
  createdAt: new Date(),
  lastLogin: new Date(),
  isActive: true
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default admin if not exists
    const users = getStoredUsers();
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
      const updatedUsers = [...users, DEFAULT_ADMIN];
      localStorage.setItem('tacUsers', JSON.stringify(updatedUsers));
    }

    // Load current user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt),
        lastLogin: new Date(parsedUser.lastLogin)
      });
    }
    setIsLoading(false);
  }, []);

  const getStoredUsers = (): any[] => {
    const stored = localStorage.getItem('tacUsers');
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem('tacUsers', JSON.stringify(users));
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === credentials.email.toLowerCase() && 
      u.password === credentials.password &&
      u.isActive
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    foundUser.lastLogin = new Date();
    const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
    saveUsers(updatedUsers);

    const authUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
      role: foundUser.role,
      providerId: foundUser.providerId,
      createdAt: new Date(foundUser.createdAt),
      lastLogin: new Date(foundUser.lastLogin),
      isActive: foundUser.isActive
    };

    setUser(authUser);
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
      isActive: newUser.isActive
    };

    setUser(authUser);
    localStorage.setItem('currentUser', JSON.stringify(authUser));

    return { success: true, user: authUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users storage
    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updates } : u);
    saveUsers(updatedUsers);
  };

  const linkProviderAccount = (providerId: string) => {
    updateUser({ providerId, role: 'provider' });
  };

  const getAllUsers = (): AuthUser[] => {
    if (user?.role !== 'admin') return [];
    
    return getStoredUsers().map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      providerId: u.providerId,
      createdAt: new Date(u.createdAt),
      lastLogin: new Date(u.lastLogin),
      isActive: u.isActive
    }));
  };

  const updateUserStatus = (userId: string, isActive: boolean) => {
    if (user?.role !== 'admin') return;

    const users = getStoredUsers();
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive } : u
    );
    saveUsers(updatedUsers);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    linkProviderAccount,
    getAllUsers,
    updateUserStatus,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isProvider: user?.role === 'provider'
  };
}