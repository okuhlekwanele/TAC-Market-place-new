import React from 'react';
import { PlusCircle, Users, BarChart, Search, Database, Share2, Shield, Settings, CreditCard, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing';
  onTabChange: (tab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing') => void;
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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-3 font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? tab.id === 'admin' 
                    ? 'border-red-500 text-red-600 bg-red-50/50'
                    : tab.id === 'provider'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : tab.id === 'pricing'
                    ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                    : 'border-teal-500 text-teal-600 bg-teal-50/50'
                  : 'border-transparent text-gray-500 hover:text-teal-600 hover:border-teal-300'
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
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
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