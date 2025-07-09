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
      {/* Dashboard Content */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Admin Dashboard</h3>
          <p className="text-gray-600">Manage users and service providers</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-blue-900">{pendingProviders.length}</div>
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-700">Pending Providers</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-2xl font-bold text-green-900">{pendingProfiles.length}</div>
          <div className="text-sm text-green-700">Pending Profiles</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">{allUsers.length}</div>
          <div className="text-sm text-purple-700">Total Users</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['providers', 'profiles', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Service Providers</h4>
          {filteredProviders.length === 0 ? (
            <p className="text-gray-500">No service providers found</p>
          ) : (
            <div className="space-y-3">
              {filteredProviders.slice(0, 5).map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-semibold text-gray-900">{provider.fullName}</h5>
                    <p className="text-sm text-gray-600">{provider.service} • {provider.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApproveProvider(provider.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Local Profiles</h4>
          {filteredProfiles.length === 0 ? (
            <p className="text-gray-500">No local profiles found</p>
          ) : (
            <div className="space-y-3">
              {filteredProfiles.slice(0, 5).map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-semibold text-gray-900">{profile.fullName}</h5>
                    <p className="text-sm text-gray-600">{profile.skill} • {profile.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApproveProfile(profile.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Registered Users</h4>
          {allUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allUsers.slice(0, 10).map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-semibold text-gray-900">{user.name}</h5>
                    <p className="text-sm text-gray-600">{user.email} • {user.role}</p>
                  </div>
                  <button
                    onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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