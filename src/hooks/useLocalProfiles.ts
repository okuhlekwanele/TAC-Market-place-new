import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Trash2,
  User,
  Phone,
  MapPin,
  Clock,
  Award,
  ExternalLink,
  Settings,
  Upload
} from 'lucide-react';
import { useLocalProfiles, LocalProfile, FlexibleHour } from '../hooks/useLocalProfiles';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { GoogleSheetsStatus } from './GoogleSheetsStatus';

export function LocalProfilesTable() {
  const { profiles, updateProfile, deleteProfile, regenerateAIContent, loading } = useLocalProfiles();
  const { batchSyncLocalProfiles, setupAllSheets, signIn, isSignedIn, loading: sheetsLoading, error: sheetsError } = useGoogleSheets();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProfile, setSelectedProfile] = useState<LocalProfile | null>(null);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch =
      profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || profile.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    'Pending Bio': 'bg-yellow-100 text-yellow-800',
    'Ready': 'bg-green-100 text-green-800',
    'Published': 'bg-blue-100 text-blue-800',
    'AI Generation Failed': 'bg-red-100 text-red-800',
  };

  // Editable availability handler
  const handleAvailabilityChange = (
    profileId: string,
    index: number,
    field: keyof FlexibleHour,
    value: string | boolean
  ) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    const updatedAvailability = [...profile.availability];
    updatedAvailability[index] = {
      ...updatedAvailability[index],
      [field]: value,
    };

    updateProfile(profileId, { availability: updatedAvailability });
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateProfile(id, { status: newStatus });
  };

  const handleRegenerateAI = async (profileId: string) => {
    await regenerateAIContent(profileId);
  };

  const handleBatchSync = async () => {
    if (!isSignedIn) {
      try {
        await signIn();
      } catch (error: any) {
        alert(`Google Sign-in Error: ${error.message}`);
        return;
      }
    }

    try {
      const successCount = await batchSyncLocalProfiles(profiles);
      alert(`Successfully synced ${successCount} out of ${profiles.length} profiles to Google Sheets`);
    } catch (error: any) {
      alert(`Sync Error: ${error.message}`);
    }
  };

  const handleSetupSheets = async () => {
    if (!isSignedIn) {
      try {
        await signIn();
      } catch (error: any) {
        alert(`Google Sign-in Error: ${error.message}`);
        return;
      }
    }

    try {
      const success = await setupAllSheets();
      if (success) {
        alert('Google Sheets have been set up successfully with all necessary columns!');
      } else {
        alert(`Failed to setup Google Sheets: ${sheetsError || 'Unknown error occurred'}`);
      }
    } catch (error: any) {
      alert(`Setup Error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      alert(`Google Sign-in Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Local Profiles</h2>
            <p className="text-gray-600 mt-1">{profiles.length} total submissions</p>
          </div>

          <div className="flex items-center space-x-4">
            {!isSignedIn && (
              <button
                onClick={handleSignIn}
                disabled={sheetsLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                <span>{sheetsLoading ? 'Signing in...' : 'Sign in to Google'}</span>
              </button>
            )}

            <button
              onClick={handleSetupSheets}
              disabled={sheetsLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="w-4 h-4" />
              <span>{sheetsLoading ? 'Setting up...' : 'Setup Sheets'}</span>
            </button>

            <button
              onClick={handleBatchSync}
              disabled={sheetsLoading || profiles.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{sheetsLoading ? 'Syncing...' : 'Sync to Sheets'}</span>
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search profiles..."
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
                <option value="Pending Bio">Pending Bio</option>
                <option value="Ready">Ready</option>
                <option value="Published">Published</option>
                <option value="AI Generation Failed">AI Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Google Sheets Status */}
        <GoogleSheetsStatus />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{profiles.length}</div>
          <div className="text-sm text-gray-600">Total Profiles</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {profiles.filter(p => p.status === 'Pending Bio').length}
          </div>
          <div className="text-sm text-gray-600">Pending AI</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {profiles.filter(p => p.status === 'Ready').length}
          </div>
          <div className="text-sm text-gray-600">Ready</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {profiles.filter(p => p.status === 'Published').length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill & Experience
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bio (AI)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suggested Price (ZAR)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfiles.map(profile => (
                <tr key={profile.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {profile.profileImage ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={profile.profileImage}
                            alt={profile.fullName}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{profile.fullName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="text-sm font-medium text-gray-900">{profile.skill}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {profile.yearsExperience} years
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.location}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {profile.contact}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    {profile.availability && profile.availability.length > 0 ? (
                      profile.availability.map((slot, idx) => (
                        <div key={slot.id || idx} className="flex items-center space-x-2 mb-1">
                          <input
                            type="text"
                            value={slot.day}
                            onChange={(e) => handleAvailabilityChange(profile.id, idx, 'day', e.target.value)}
                            className="border rounded px-1 py-0.5 w-16"
                            title="Day"
                          />
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleAvailabilityChange(profile.id, idx, 'startTime', e.target.value)}
                            className="border rounded px-1 py-0.5 w-20"
                            title="Start Time"
                          />
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleAvailabilityChange(profile.id, idx, 'endTime', e.target.value)}
                            className="border rounded px-1 py-0.5 w-20"
                            title="End Time"
                          />
                          <input
                            type="checkbox"
                            checked={slot.available}
                            onChange={(e) => handleAvailabilityChange(profile.id, idx, 'available', e.target.checked)}
                            title="Available?"
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No availability</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <select
                      value={profile.status}
                      onChange={(e) => handleStatusUpdate(profile.id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${
                        statusColors[profile.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="Pending Bio">Pending Bio</option>
                      <option value="Ready">Ready</option>
                      <option value="Published">Published</option>
                      <option value="AI Generation Failed">AI Failed</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 max-w-xs align-top">
                    <div className="text-sm text-gray-900 truncate" title={profile.bioAI}>
                      {profile.bioAI || <span className="text-gray-400 italic">Not generated yet</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="text-sm font-medium text-gray-900">
                      {profile.suggestedPriceZAR > 0 ? (
                        `R${profile.suggestedPriceZAR}`
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top space-x-2">
                    <button
                      title="Regenerate AI Bio"
                      onClick={() => handleRegenerateAI(profile.id)}
                      disabled={loading}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                    </button>

                    <button
                      title="Delete Profile"
                      onClick={() => {
                        if (window.confirm(`Delete profile for ${profile.fullName}?`)) {
                          deleteProfile(profile.id);
                        }
                      }}
                      className="p-1 rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 italic">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
