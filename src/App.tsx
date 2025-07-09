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
  const { user, isLoading: authLoading, isAdmin, isProvider } = useAuth();  // <-- get user here
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
        return <FindServices user={user} />;  // <-- pass user prop here
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
        return isAdmin ? <AdminDashboard /> : <FindServices user={user} />;
      case 'provider':
        return isProvider ? <ProviderDashboard /> : <FindServices user={user} />;
      case 'pricing':
        return <PricingPage />;
      case 'engagement':
        return <EngagementDashboard />;
      default:
        return <FindServices user={user} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-gray-600 text-lg">Loading TAC Market Place...</p>
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
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50">
            <Header />
            <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="py-8 px-4 sm:px-6 lg:px-8">{renderContent()}</main>
            <Chatbot />
          </div>
        }
      />
    </Routes>
  );
}

export default App;