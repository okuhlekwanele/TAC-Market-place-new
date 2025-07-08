import React, { useState } from 'react';
import { Shield, Users, CheckCircle, XCircle, Trash2, Eye, AlertTriangle, Search, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useLocalProfiles } from '../hooks/useLocalProfiles';
import { ServiceProvider } from '../types';
import { LocalProfile } from '../hooks/useLocalProfiles';

export function AdminDashboard() {
  const { user, getAllUsers, updateUserStatus } = useAuth();
  const { providers, updateProvider, deleteProvider } = useServiceProviders();
  const { profiles: localProfiles, updateProfile: updateLocalProfile, deleteProfile: deleteLocalProfile } = useLocalProfiles();
  
  const [activeTab, setActiveTab] = useState<'providers' | 'profiles' | 'users'>('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ServiceProvider | LocalProfile | null>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const allUsers = getAllUsers();
  const pendingProviders = providers.filter(p => p.status === 'Pending');
  const pendingProfiles = localProfiles.filter(p => p.status === 'Pending Bio');

  const handleApproveProvider = (id: string) => {
    updateProvider(id, { status: 'Published' });
  };

  const handleRejectProvider = (id: string) => {
    updateProvider(id, { status: 'Pending' });
  };

  const handleDeleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
      deleteProvider(id);
    }
  };

  const handleApproveProfile = (id: string) => {
    updateLocalProfile(id, { status: 'Published' });
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      deleteLocalProfile(id);
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUserStatus(userId, !currentStatus);
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || provider.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProfiles = localProfiles.filter(profile => {
    const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || profile.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Full JSX content here remains unchanged until modal */}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> All user registrations are automatically synced to Google Sheets when configured. 
                    Welcome emails are sent to new users upon successful registration.
                  </p>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Profile Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedItem.fullName}</h4>
                  <p className="text-gray-600">
                    {'service' in selectedItem ? selectedItem.service : selectedItem.skill}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-gray-900">{selectedItem.yearsExperience} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="text-gray-900">{user.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{selectedItem.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Suggested Price</label>
                    <p className="text-gray-900">
                      R{'suggestedPrice' in selectedItem ? selectedItem.suggestedPrice : selectedItem.suggestedPriceZAR}
                    </p>
                  </div>
                </div>

                {allUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users registered yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}