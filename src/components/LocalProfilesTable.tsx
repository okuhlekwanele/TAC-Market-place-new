// LocalProfilesTable.tsx

import React, { useState } from 'react';
import {
  Search, Filter, Eye, Edit3, Trash2, User, Phone, MapPin, Clock,
  Award, RefreshCw, ExternalLink, Upload, Settings
} from 'lucide-react';
import { useLocalProfiles, LocalProfile } from '../hooks/useLocalProfiles';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { GoogleSheetsStatus } from './GoogleSheetsStatus';

export function LocalProfilesTable() {
  const { profiles, updateProfile, deleteProfile, regenerateAIContent, loading } = useLocalProfiles();
  const { batchSyncLocalProfiles, setupAllSheets, signIn, isSignedIn, loading: sheetsLoading, error: sheetsError } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProfile, setSelectedProfile] = useState<LocalProfile | null>(null);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || profile.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    'Pending Bio': 'bg-yellow-100 text-yellow-800',
    'Ready': 'bg-green-100 text-green-800',
    'Published': 'bg-blue-100 text-blue-800',
    'AI Generation Failed': 'bg-red-100 text-red-800'
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Local Profiles</h2>
            <p className="text-gray-600 mt-1">{profiles.length} total submissions</p>
          </div>

          <div className="flex items-center space-x-4">
            {!isSignedIn && (
              <button onClick={signIn} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{sheetsLoading ? 'Signing in...' : 'Sign in to Google'}</span>
              </button>
            )}

            <button onClick={handleSetupSheets} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Setup Sheets</span>
            </button>

            <button onClick={handleBatchSync} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Sync to Sheets</span>
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search profiles..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg"
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
        <GoogleSheetsStatus />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Profile</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Skill</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Contact</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Bio</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Price</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProfiles.map(profile => (
                <tr key={profile.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10">
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt="" className="rounded-full w-10 h-10 object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">{profile.fullName}</div>
                        <div className="text-sm text-gray-500 flex items-start">
                          <Clock className="w-3 h-3 mt-1 mr-2" />
                          <div className="flex flex-col space-y-1">
                            {Array.isArray(profile.availability) && profile.availability.length > 0 ? (
                              profile.availability.map((slot, i) => (
                                <div key={i}>
                                  {slot.date}: {slot.startTime}–{slot.endTime} ({slot.available ? '✅' : '❌'})
                                </div>
                              ))
                            ) : (
                              <span className="italic text-gray-400">No availability</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{profile.skill}</div>
                    <div className="text-gray-500 text-xs flex items-center">
                      <Award className="w-3 h-3 mr-1" /> {profile.yearsExperience} yrs
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-3 h-3 mr-1" /> {profile.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-3 h-3 mr-1" /> {profile.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 max-w-xs truncate" title={profile.bioAI || 'Not generated'}>
                    {profile.bioAI || <span className="text-gray-400 italic">Not generated</span>}
                  </td>
                  <td className="px-6 py-4">
                    {profile.suggestedPriceZAR ? `R${profile.suggestedPriceZAR}` : (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button onClick={() => setSelectedProfile(profile)} className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {(profile.status === 'Pending Bio' || profile.status === 'AI Generation Failed') && (
                        <button
                          onClick={() => handleRegenerateAI(profile.id)}
                          className="text-green-600 hover:text-green-900"
                          disabled={loading}
                          title="Regenerate"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                      <button onClick={() => deleteProfile(profile.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500 italic">
            No profiles match your search or filters.
          </div>
        )}
      </div>

      {/* Modal (you can paste your working version here) */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Details</h3>
                <button onClick={() => setSelectedProfile(null)} className="text-gray-500 text-xl">×</button>
              </div>
              <div className="space-y-4">
                <div className="text-lg font-semibold">{selectedProfile.fullName}</div>
                <div className="text-sm text-gray-500">{selectedProfile.skill} – {selectedProfile.yearsExperience} yrs</div>
                <div className="text-sm text-gray-500">📍 {selectedProfile.location}</div>
                <div className="text-sm text-gray-500">📞 {selectedProfile.contact}</div>
                <div className="text-sm text-gray-500">
                  <strong>Availability:</strong>
                  <div className="mt-1 space-y-1">
                    {Array.isArray(selectedProfile.availability) && selectedProfile.availability.length > 0 ? (
                      selectedProfile.availability.map((slot, idx) => (
                        <div key={idx}>
                          {slot.date}: {slot.startTime}–{slot.endTime} ({slot.available ? '✅' : '❌'})
                        </div>
                      ))
                    ) : (
                      <span className="italic text-gray-400">No availability</span>
                    )}
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleRegenerateAI(selectedProfile.id);
                      setSelectedProfile(null);
                    }}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {loading ? 'Generating...' : 'Generate AI Bio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
