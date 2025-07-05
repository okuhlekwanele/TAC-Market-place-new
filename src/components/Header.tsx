import React, { useState } from 'react';
import { Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginModal } from './LoginModal';

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

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
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-all text-sm font-semibold backdrop-blur-sm border border-white/20"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}