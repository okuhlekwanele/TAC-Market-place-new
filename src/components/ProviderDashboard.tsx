import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Phone, Mail, MapPin, Briefcase, Calendar, Banknote } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useLocalProfiles } from '../hooks/useLocalProfiles';
import { ServiceProvider } from '../types';
import { LocalProfile } from '../hooks/useLocalProfiles';

export function ProviderDashboard() {
  const { user, linkProviderAccount } = useAuth();
  const { providers, updateProvider } = useServiceProviders();
  const { profiles, updateProfile } = useLocalProfiles();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [providerProfile, setProviderProfile] = useState<ServiceProvider | LocalProfile | null>(null);

  useEffect(() => {
    if (user?.providerId) {
      // Find linked provider profile
      const linkedProvider = providers.find(p => p.id === user.providerId) || 
                           profiles.find(p => p.id === user.providerId);
      setProviderProfile(linkedProvider || null);
    }
  }, [user, providers, profiles]);

  if (!user || user.role !== 'provider') {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Access Required</h2>
        <p className="text-gray-600">You need to be registered as a service provider to access this page.</p>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Your Provider Profile</h2>
          <p className="text-gray-600 mb-6">
            To access your provider dashboard, you need to link your account to an existing provider profile.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Profiles to Link:</h3>
            
            {/* Service Providers */}
            {providers.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Service Providers</h4>
                <div className="grid gap-3">
                  {providers.map(provider => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-semibold text-gray-900">{provider.fullName}</h5>
                        <p className="text-sm text-gray-600">{provider.service} • {provider.location}</p>
                      </div>
                      <button
                        onClick={() => linkProviderAccount(provider.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Link Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Local Profiles */}
            {profiles.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Local Profiles</h4>
                <div className="grid gap-3">
                  {profiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-semibold text-gray-900">{profile.fullName}</h5>
                        <p className="text-sm text-gray-600">{profile.skill} • {profile.location}</p>
                      </div>
                      <button
                        onClick={() => linkProviderAccount(profile.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Link Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {providers.length === 0 && profiles.length === 0 && (
              <p className="text-gray-500">No provider profiles available to link. Please create a profile first.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...providerProfile });
  };

  const handleSave = () => {
    if ('service' in providerProfile) {
      // Service Provider
      updateProvider(providerProfile.id, editData);
    } else {
      // Local Profile
      updateProfile(providerProfile.id, editData);
    }
    setIsEditing(false);
    setProviderProfile({ ...providerProfile, ...editData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const isServiceProvider = 'service' in providerProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Provider Dashboard
              </h2>
              <p className="text-gray-600 text-lg">Manage your service profile</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            providerProfile.status === 'Published' ? 'bg-green-100 text-green-800' :
            providerProfile.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {providerProfile.status}
          </span>
          <span className="text-sm text-gray-600">
            Profile Type: {isServiceProvider ? 'Advanced Service Provider' : 'Local Profile'}
          </span>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fullName || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{providerProfile.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                {isServiceProvider ? 'Service' : 'Skill'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={isServiceProvider ? editData.service || '' : editData.skill || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    [isServiceProvider ? 'service' : 'skill']: e.target.value 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                  {isServiceProvider ? providerProfile.service : (providerProfile as LocalProfile).skill}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Years of Experience
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editData.yearsExperience || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{providerProfile.yearsExperience} years</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{providerProfile.location}</p>
              )}
            </div>
          </div>

          {/* Contact & Pricing */}
          <div className="space-y-4">
            {isServiceProvider && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.contactDetails?.phone || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        contactDetails: { ...prev.contactDetails, phone: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {(providerProfile as ServiceProvider).contactDetails.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.contactDetails?.email || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        contactDetails: { ...prev.contactDetails, email: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {(providerProfile as ServiceProvider).contactDetails.email}
                    </p>
                  )}
                </div>
              </>
            )}

            {!isServiceProvider && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.contact || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                    {(providerProfile as LocalProfile).contact}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Banknote className="w-4 h-4 inline mr-2" />
                Suggested Price
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={isServiceProvider ? editData.suggestedPrice || '' : editData.suggestedPriceZAR || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    [isServiceProvider ? 'suggestedPrice' : 'suggestedPriceZAR']: parseInt(e.target.value)
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                  R{isServiceProvider ? 
                    (providerProfile as ServiceProvider).suggestedPrice : 
                    (providerProfile as LocalProfile).suggestedPriceZAR
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
          </label>
          {isEditing ? (
            <textarea
              rows={4}
              value={isServiceProvider ? editData.generatedBio || '' : editData.bioAI || ''}
              onChange={(e) => setEditData(prev => ({ 
                ...prev, 
                [isServiceProvider ? 'generatedBio' : 'bioAI']: e.target.value 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg leading-relaxed">
              {isServiceProvider ? 
                (providerProfile as ServiceProvider).generatedBio : 
                (providerProfile as LocalProfile).bioAI
              }
            </p>
          )}
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-900">
              {providerProfile.createdAt.toLocaleDateString()}
            </div>
            <div className="text-sm text-blue-700">Profile Created</div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-900">
              {Math.floor((new Date().getTime() - providerProfile.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-green-700">Days Active</div>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-900">
              {providerProfile.status === 'Published' ? 'Live' : 'Pending'}
            </div>
            <div className="text-sm text-purple-700">Profile Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}