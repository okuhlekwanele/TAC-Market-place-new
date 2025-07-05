import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ProfileForm } from './components/ProfileForm';
import { ManageProfiles } from './components/ManageProfiles';
import { Analytics } from './components/Analytics';
import { FindServices } from './components/FindServices';
import { LocalProfilesTable } from './components/LocalProfilesTable';
import { SocialMediaGenerator } from './components/SocialMediaGenerator';
import { useServiceProviders } from './hooks/useServiceProviders';
import { useAuth } from './hooks/useAuth';
import { FormData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'analytics' | 'find' | 'local' | 'social'>('find');
  const { providers, loading, updateProvider, deleteProvider, generateProfile } = useServiceProviders();
  const { isLoading: authLoading } = useAuth();

  const handleFormSubmit = async (formData: FormData) => {
    await generateProfile(formData);
    setActiveTab('manage');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'find':
        return <FindServices />;
      case 'create':
        return <ProfileForm onSubmit={handleFormSubmit} loading={loading} />;
      case 'manage':
        return (
          <ManageProfiles
            providers={providers}
            onUpdate={updateProvider}
            onDelete={deleteProvider}
          />
        );
      case 'local':
        return <LocalProfilesTable />;
      case 'social':
        return <SocialMediaGenerator />;
      case 'analytics':
        return <Analytics providers={providers} />;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading TAC Market Place...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;