import React from 'react';
import { PlusCircle, Users, BarChart, Search, Database, Share2, Shield, Settings, CreditCard, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing' | 'engagement';
  onTabChange: (tab: 'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social' | 'admin' | 'provider' | 'pricing' | 'engagement') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, isAdmin, isProvider } = useAuth();

  const baseTabs = [
    { id: 'find', label: 'Find Services', icon: Search, color: 'from-blue-500 to-cyan-500', description: 'Discover local providers' },
    { id: 'create', label: 'Create Profile', icon: PlusCircle, color: 'from-emerald-500 to-teal-500', description: 'Build your presence' },
    { id: 'manage', label: 'Manage Profiles', icon: Users, color: 'from-purple-500 to-pink-500', description: 'Control your listings' },
    { id: 'local', label: 'Local Profiles', icon: Database, color: 'from-orange-500 to-red-500', description: 'Community members' },
    { id: 'social', label: 'Social Media', icon: Share2, color: 'from-pink-500 to-rose-500', description: 'Content creation' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, color: 'from-indigo-500 to-purple-500', description: 'Performance insights' },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp, color: 'from-violet-500 to-purple-500', description: 'User interactions' },
    { id: 'pricing', label: 'Pricing', icon: CreditCard, color: 'from-green-500 to-emerald-500', description: 'Plans & billing' }
  ];

  const adminTabs = [
    { id: 'admin', label: 'Admin Dashboard', icon: Shield, color: 'from-red-500 to-pink-500', description: 'System management' }
  ];

  const providerTabs = [
    { id: 'provider', label: 'My Profile', icon: Settings, color: 'from-blue-500 to-indigo-500', description: 'Provider settings' }
  ];

  let tabs = [...baseTabs];
  
  if (isAdmin) {
    tabs = [...tabs, ...adminTabs];
  }
  
  if (isProvider) {
    tabs = [...tabs, ...providerTabs];
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`group relative flex items-center space-x-3 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap min-w-fit ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              {/* Icon with special effects for active tab */}
              <div className={`relative ${activeTab === tab.id ? 'animate-pulse' : ''}`}>
                <tab.icon className="w-5 h-5" />
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                )}
              </div>
              
              {/* Label and description */}
              <div className="flex flex-col items-start">
                <span className="font-semibold">{tab.label}</span>
                <span className={`text-xs ${
                  activeTab === tab.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {tab.description}
                </span>
              </div>

              {/* Special badges */}
              {tab.id === 'admin' && isAdmin && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold border border-red-200">
                  ADMIN
                </span>
              )}
              {tab.id === 'provider' && isProvider && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold border border-blue-200">
                  PRO
                </span>
              )}
              {tab.id === 'pricing' && (
                <div className="relative">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                    NEW
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
              {tab.id === 'engagement' && (
                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
              )}

              {/* Hover effect background */}
              {activeTab !== tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </nav>
  );
}