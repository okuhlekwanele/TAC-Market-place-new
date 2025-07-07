import React, { useState } from 'react';
import { Search, Filter, Eye, Edit3, Trash2, User, Phone, MapPin, Clock, Award, RefreshCw, ExternalLink, Upload, Settings, AlertCircle } from 'lucide-react';
import { useLocalProfiles, LocalProfile } from '../hooks/useLocalProfiles';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

export function LocalProfilesTable() {
  const { profiles, updateProfile, deleteProfile, regenerateAIContent, loading } = useLocalProfiles();
  const { batchSyncLocalProfiles, setupAllSheets, signIn, isSignedIn, loading: sheetsLoading, error: sheetsError } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProfile, setSelectedProfile] = useState<LocalProfile | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Local Profiles</h2>
            <p className="text-gray-600 mt-1">{profiles.length} total submissions</p>
            {isSignedIn && (
              <p className="text-green-600 text-sm mt-1">✓ Connected to Google Sheets</p>
            )}
            {sheetsError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 text-sm font-medium">Google Sheets Error</p>
                    <p className="text-red-700 text-sm mt-1">
                      {sheetsError.length > 100 && !showErrorDetails 
                        ? `${sheetsError.substring(0, 100)}...` 
                        : sheetsError
                      }
                    </p>
                    {sheetsError.length > 100 && (
                      <button
                        onClick={() => setShowErrorDetails(!showErrorDetails)}
                        className="text-red-600 text-sm underline mt-1 hover:text-red-800"
                      >
                        {showErrorDetails ? 'Show less' : 'Show more details'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
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
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                        <div className="text-sm font-medium text-gray-900">
                          {profile.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {profile.availability}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{profile.skill}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {profile.yearsExperience} years
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.location}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {profile.contact}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={profile.status}
                      onChange={(e) => handleStatusUpdate(profile.id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${statusColors[profile.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}
                    >
                      <option value="Pending Bio">Pending Bio</option>
                      <option value="Ready">Ready</option>
                      <option value="Published">Published</option>
                      <option value="AI Generation Failed">AI Failed</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {profile.bioAI ? (
                        <div className="truncate" title={profile.bioAI}>
                          {profile.bioAI}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not generated yet</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {profile.suggestedPriceZAR > 0 ? (
                        `R${profile.suggestedPriceZAR}`
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {(profile.status === 'Pending Bio' || profile.status === 'AI Generation Failed') && (
                        <button
                          onClick={() => handleRegenerateAI(profile.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded disabled:opacity-50"
                          title="Generate AI Content"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete"
                      >
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
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Details</h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedProfile.profileImage ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={selectedProfile.profileImage}
                      alt={selectedProfile.fullName}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedProfile.fullName}</h4>
                    <p className="text-gray-600">{selectedProfile.skill}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-gray-900">{selectedProfile.yearsExperience} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className="text-gray-900">{selectedProfile.availability}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{selectedProfile.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{selectedProfile.contact}</p>
                      <a
                        href={`https://wa.me/${selectedProfile.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                        title="Contact via WhatsApp"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${statusColors[selectedProfile.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedProfile.status}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">AI Generated Bio</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedProfile.bioAI || 'Not generated yet'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Suggested Price</label>
                  <p className="text-gray-900 text-lg font-semibold">
                    {selectedProfile.suggestedPriceZAR > 0 ? `R${selectedProfile.suggestedPriceZAR}` : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">{selectedProfile.createdAt.toLocaleDateString()}</p>
                </div>

                {(selectedProfile.status === 'Pending Bio' || selectedProfile.status === 'AI Generation Failed') && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        handleRegenerateAI(selectedProfile.id);
                        setSelectedProfile(null);
                      }}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating AI Content...</span>
                        </div>
                      ) : (
                        'Generate AI Content'
                      )}
                    </button>
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