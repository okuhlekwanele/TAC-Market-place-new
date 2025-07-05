import React, { useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { ServiceProvider } from '../types';
import { Search, Filter, Download, Upload } from 'lucide-react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

interface ManageProfilesProps {
  providers: ServiceProvider[];
  onUpdate: (id: string, updates: Partial<ServiceProvider>) => void;
  onDelete: (id: string) => void;
}

export function ManageProfiles({ providers, onUpdate, onDelete }: ManageProfilesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { batchSyncServiceProviders, loading: sheetsLoading } = useGoogleSheets();

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || provider.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csvContent = [
      ['Full Name', 'Service', 'Experience', 'Location', 'Bio', 'Price', 'Status'],
      ...filteredProviders.map(p => [
        p.fullName,
        p.service,
        p.yearsExperience.toString(),
        p.location,
        p.generatedBio,
        p.suggestedPrice.toString(),
        p.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-providers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchSync = async () => {
    const successCount = await batchSyncServiceProviders(providers);
    alert(`Successfully synced ${successCount} out of ${providers.length} providers to Google Sheets`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Profiles</h2>
            <p className="text-gray-600 mt-1">{providers.length} total profiles</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBatchSync}
              disabled={sheetsLoading || providers.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{sheetsLoading ? 'Syncing...' : 'Sync to Sheets'}</span>
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Ready">Ready</option>
                <option value="Published">Published</option>
              </select>
            </div>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <ProfileCard
              key={provider.id}
              provider={provider}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}