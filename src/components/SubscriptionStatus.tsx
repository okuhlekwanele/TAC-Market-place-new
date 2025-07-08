import React, { useState, useEffect } from 'react';
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, Loader2, Settings, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';

export function SubscriptionStatus() {
  const { user } = useAuth();
  const { 
    subscription, 
    loading, 
    error, 
    createPortalSession, 
    cancelSubscription, 
    formatAmount,
    isSubscriptionActive,
    isSubscriptionCanceling
  } = useStripe();
  const [actionLoading, setActionLoading] = useState(false);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading subscription...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started' || !isSubscriptionActive()) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">No Active Subscription</h3>
            <p className="text-sm text-gray-600">Upgrade to access premium features</p>
          </div>
        </div>
      </div>
    );
  }

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      await createPortalSession();
    } catch (err) {
      console.error('Failed to open portal:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      setActionLoading(true);
      try {
        await cancelSubscription();
      } catch (err) {
        console.error('Failed to cancel subscription:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'trialing':
        return 'text-blue-600 bg-blue-100';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100';
      case 'canceled':
      case 'unpaid':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'trialing':
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPlanName = (priceId: string | null) => {
    if (!priceId) return 'Unknown Plan';
    const product = stripeProducts.find(p => p.priceId === priceId);
    return product?.name || 'Custom Plan';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {getPlanName(subscription.price_id)}
            </h3>
            <p className="text-sm text-gray-600">Current subscription</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.subscription_status)}`}>
          {getStatusIcon(subscription.subscription_status)}
          <span className="capitalize">{subscription.subscription_status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {subscription.current_period_start && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Current period</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </p>
            </div>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Payment method</p>
              <p className="text-sm font-medium text-gray-900">
                {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
              </p>
            </div>
          </div>
        )}
      </div>

      {isSubscriptionCanceling() && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Your subscription will cancel at the end of the current period ({formatDate(subscription.current_period_end)})
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleManageSubscription}
          disabled={actionLoading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Settings className="w-4 h-4" />
          <span>{actionLoading ? 'Loading...' : 'Manage Subscription'}</span>
        </button>
        
        {!isSubscriptionCanceling() && (
          <button
            onClick={handleCancelSubscription}
            disabled={actionLoading}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Cancel Subscription</span>
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>
          Billing managed securely by Stripe. Changes take effect immediately.
        </p>
      </div>
    </div>
  );
}