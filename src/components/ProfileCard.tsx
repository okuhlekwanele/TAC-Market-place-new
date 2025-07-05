import React from 'react';
import { ServiceProvider } from '../types';
import { User, Briefcase, Calendar, MapPin, DollarSign, Check, Clock, Edit3, Trash2 } from 'lucide-react';

interface ProfileCardProps {
  provider: ServiceProvider;
  onUpdate: (id: string, updates: Partial<ServiceProvider>) => void;
  onDelete: (id: string) => void;
}

export function ProfileCard({ provider, onUpdate, onDelete }: ProfileCardProps) {
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Ready': 'bg-green-100 text-green-800',
    'Published': 'bg-blue-100 text-blue-800'
  };

  const statusIcons = {
    'Pending': Clock,
    'Ready': Check,
    'Published': Check
  };

  const StatusIcon = statusIcons[provider.status];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{provider.fullName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[provider.status]}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {provider.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdate(provider.id, { status: 'Published' })}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(provider.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{provider.service}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{provider.yearsExperience} years</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{provider.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>R{provider.suggestedPrice}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Bio</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{provider.generatedBio}</p>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Created: {provider.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}