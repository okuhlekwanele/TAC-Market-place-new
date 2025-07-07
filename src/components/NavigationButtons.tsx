import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onHome?: () => void;
  showBack?: boolean;
  showHome?: boolean;
}

export function NavigationButtons({ 
  onBack, 
  onHome, 
  showBack = true, 
  showHome = true 
}: NavigationButtonsProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center space-x-3 mb-6">
      {showBack && (
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}
      
      {showHome && (
        <button
          onClick={handleHome}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
      )}
    </div>
  );
}