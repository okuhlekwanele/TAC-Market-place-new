export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'provider' | 'client';
  providerId?: string; // Links to ServiceProvider if role is 'provider'
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'provider' | 'client';
}

export interface AdminAction {
  id: string;
  adminId: string;
  targetId: string;
  targetType: 'provider' | 'profile';
  action: 'approve' | 'reject' | 'suspend' | 'delete' | 'activate';
  reason?: string;
  timestamp: Date;
}