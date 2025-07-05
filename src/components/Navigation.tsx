import React from 'react';
import { PlusCircle, Users, BarChart, Search, Database, Share2 } from 'lucide-react';

interface NavigationProps {
  activeTab: 'create' | 'manage' | 'analytics' | 'find' | 'township' | 'social';
  onTabChange: (tab: 'create' | 'manage' | 'analytics' | 'find' | 'township' | 'social') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'find', label: 'Find Services', icon: Search },
    { id: 'create', label: 'Create Profile', icon: PlusCircle },
    { id: 'manage', label: 'Manage Profiles', icon: Users },
    { id: 'township', label: 'Township Profiles', icon: Database },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart }
  ];

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
                  ? 'border-teal-500 text-teal-600 bg-teal-50/50'
                  : 'border-transparent text-gray-500 hover:text-teal-600 hover:border-teal-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}