import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ProfileForm } from './components/ProfileForm';
import { ManageProfiles } from './components/ManageProfiles';
import { Analytics } from './components/Analytics';
import { FindServices } from './components/FindServices';
import { LocalProfilesTable } from './components/LocalProfilesTable';
import { SocialMediaGenerator } from './components/SocialMediaGenerator';
import { AdminDashboard } from './components/AdminDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { PricingPage } from './components/PricingPage';
import { EngagementDashboard } from './components/EngagementDashboard';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { CheckoutCancel } from './pages/CheckoutCancel';
import { Chatbot } from './components/Chatbot';
import { useServiceProviders } from './hooks/useServiceProviders';
import { useAuth } from './hooks/useAuth';
import { FormData } from './types';

type Tab =
  | 'create'
  | 'manage'
  | 'analytics'
  | 'find'
  | 'local'
  | 'social'
  | 'admin'
  | 'provider'
  | 'pricing'
  | 'engagement';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('find');
  const { providers, loading, updateProvider, deleteProvider, generateProfile } = useServiceProviders();
  const { user, isLoading: authLoading, isAdmin, isProvider, authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/pricing') {
      setActiveTab('pricing');
    } else if (path === '/create') {
      setActiveTab('create');
    } else {
      setActiveTab('find');
    }
  }, [location.pathname]);

  const handleFormSubmit = async (formData: FormData) => {
    await generateProfile(formData);
    setActiveTab('manage');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'pricing':
        navigate('/pricing');
        break;
      case 'create':
        navigate('/create');
        break;
      default:
        navigate('/');
        break;
    }
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
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <FindServices />;
      case 'provider':
        return isProvider ? <ProviderDashboard /> : <FindServices />;
      case 'pricing':
        return <PricingPage />;
      case 'engagement':
        return <EngagementDashboard />;
      default:
        return <FindServices />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Loading TAC Market Place
          </h2>
          <p className="text-gray-600 text-lg">Connecting you to amazing services...</p>
        </div>
      </div>
    );
  }

  // Show auth error if there's an issue
  if (authError && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <Header />
            <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="relative">
              {renderContent()}
            </main>
            <Chatbot />
          </div>
        }
      />
    </Routes>
  );
}

export default App;