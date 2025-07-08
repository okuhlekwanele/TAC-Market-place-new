import React, { useState } from 'react';
import { Sparkles, User, LogOut, Settings, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, isAuthenticated, isAdmin, isProvider } = useAuth();

  const getRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isProvider) return 'Service Provider';
    return 'Client';
  };

  const getRoleColor = () => {
    if (isAdmin) return 'bg-red-100 text-red-800';
    if (isProvider) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const handlePricingClick = () => {
    window.location.href = '/pricing';
  };

  return (
    <>
      <header className="bg-gradient-to-r from-teal-500 via-blue-500 to-orange-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white/15 rounded-xl p-2 backdrop-blur-sm border border-white/20">
                <img 
                  src="/Flat Vector Logo TAC Market Place.png" 
                  alt="TAC Market Place Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">TAC Market Place</h1>
                <p className="text-sm text-white/90 font-medium">Professional Service Marketplace</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="hidden sm:inline font-medium">Powered by AI</span>
              </div>
              
              {/* Pricing Button */}
              <button
                onClick={handlePricingClick}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all text-sm font-semibold backdrop-blur-sm border border-white/20"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pricing</span>
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      {isAdmin ? (
                        <Shield className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor()}`}>
                        {getRoleDisplay()}
                      </div>
                    </div>
                  </div>
                  
                  {isProvider && (
                    <button
                      onClick={() => {/* Navigate to provider dashboard */}}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Provider Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-all text-sm font-semibold backdrop-blur-sm border border-white/20"
                  >
                    Sign In
                  </button>
                  <div className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                    Admin Login Available
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}