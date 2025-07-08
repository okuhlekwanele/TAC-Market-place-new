import React from 'react';
import { XCircle, ArrowLeft, CreditCard, Home } from 'lucide-react';

export function CheckoutCancel() {
  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const tryAgain = () => {
    // Navigate back to checkout or pricing page
    window.location.href = '/pricing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <XCircle className="w-10 h-10 text-white" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 text-lg mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          {/* Reasons */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Common reasons for cancellation:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Changed your mind about the purchase</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Wanted to review the order details</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Payment method issues</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Browser or connection problems</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={tryAgain}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <CreditCard className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={goBack}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>

            <button
              onClick={goHome}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team for assistance with your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}