import React from 'react';
import { PlusCircle, Users, BarChart, Search, Database, Share2, Shield, Settings, CreditCard, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing' | 'engagement';
  onTabChange: (tab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing' | 'engagement') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, isAdmin, isProvider } = useAuth();

  const baseTabs = [
    { id: 'find', label: 'Find Services', icon: Search },
    { id: 'create', label: 'Create Profile', icon: PlusCircle },
    { id: 'manage', label: 'Manage Profiles', icon: Users },
    { id: 'local', label: 'Local Profiles', icon: Database },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp },
    { id: 'pricing', label: 'Pricing', icon: CreditCard }
  ];

  const adminTabs = [
    { id: 'admin', label: 'Admin Dashboard', icon: Shield }
  ];

  const providerTabs = [
    { id: 'provider', label: 'My Profile', icon: Settings }
  ];

  let tabs = [...baseTabs];
  
  if (isAdmin) {
    tabs = [...tabs, ...adminTabs];
  }
  
  if (isProvider) {
    tabs = [...tabs, ...providerTabs];
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-3 font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? tab.id === 'admin' 
                    ? 'border-red-600 text-red-700 bg-red-50'
                    : tab.id === 'provider'
                    ? 'border-blue-600 text-blue-700 bg-blue-50'
                    : tab.id === 'pricing'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                    : 'border-slate-600 text-slate-700 bg-slate-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-400'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.id === 'admin' && isAdmin && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
              {tab.id === 'provider' && isProvider && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Provider
                </span>
              )}
              {tab.id === 'pricing' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  New
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}