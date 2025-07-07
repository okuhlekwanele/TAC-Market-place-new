import React from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

export function GoogleSheetsStatus() {
  const { isSignedIn, isGoogleSheetsConfigured, setupAllSheets, signIn, loading, error } = useGoogleSheets();

  const handleSetupSheets = async () => {
    try {
      const success = await setupAllSheets();
      if (success) {
        alert('Google Sheets have been set up successfully!');
      }
    } catch (error: any) {
      alert(`Setup failed: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  if (!isGoogleSheetsConfigured()) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-800">Google Sheets Not Configured</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Google Sheets integration is not configured. Your data will be saved locally.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className={`border rounded-xl p-4 ${
        isSignedIn 
          ? 'bg-green-50 border-green-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start space-x-3">
          {isSignedIn ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className={`text-sm font-medium ${
              isSignedIn ? 'text-green-800' : 'text-blue-800'
            }`}>
              {isSignedIn ? 'Connected to Google Sheets' : 'Google Sheets Available'}
            </h4>
            <p className={`text-sm mt-1 ${
              isSignedIn ? 'text-green-700' : 'text-blue-700'
            }`}>
              {isSignedIn 
                ? 'Your data will be automatically synced to Google Sheets'
                : 'Sign in to enable automatic data synchronization'
              }
            </p>
            <div className="flex items-center space-x-3 mt-3">
              {!isSignedIn && (
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In to Google'}
                </button>
              )}
              <button
                onClick={handleSetupSheets}
                disabled={loading}
                className="flex items-center space-x-1 text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Settings className="w-3 h-3" />
                <span>{loading ? 'Setting up...' : 'Setup Sheets'}</span>
              </button>
              <a
                href="https://docs.google.com/spreadsheets/d/1paLi0tiSOHucsR4Ma_yrZgeoxVVKvluxjBH-ScDNjUc/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Spreadsheet</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Google Sheets Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}