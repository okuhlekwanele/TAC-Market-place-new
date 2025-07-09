import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function CheckoutSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      fetchOrderDetails(sessionIdParam);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      // Fetch order details from Supabase
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .eq('checkout_session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching order details:', error);
      } else {
        setOrderDetails(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100; // Stripe amounts are in cents
    const symbol = currency.toUpperCase() === 'ZAR' ? 'R' : '$';
    return `${symbol}${value.toFixed(2)}`;
  };

  const goHome = () => {
    navigate('/');
  };

  const viewOrders = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">#{orderDetails.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">
                    {formatAmount(orderDetails.amount_total, orderDetails.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {orderDetails.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(orderDetails.order_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <p className="text-xs text-blue-600 mb-1">Session ID</p>
              <p className="text-sm font-mono text-blue-800 break-all">{sessionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={goHome}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Return to Home</span>
            </button>

            <button
              onClick={viewOrders}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <Receipt className="w-5 h-5" />
              <span>View Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}