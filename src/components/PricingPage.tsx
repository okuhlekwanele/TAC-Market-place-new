import React, { useState } from 'react';
import { Check, Zap, Crown, CreditCard, Shield, Users, Sparkles } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { StripeCheckout } from './StripeCheckout';
import { SubscriptionStatus } from './SubscriptionStatus';
import { OrderHistory } from './OrderHistory';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

export function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(stripeProducts[0]);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription' | 'orders'>('plans');
  const { user } = useAuth();
  const { isSubscriptionActive } = useStripe();

  const handleSelectPlan = (product: typeof stripeProducts[0]) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const getProductIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'subscription':
        return <Zap className="w-6 h-6" />;
      case 'business subscription':
        return <Crown className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getProductColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'subscription':
        return 'from-blue-500 to-purple-500';
      case 'business subscription':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatPrice = (product: typeof stripeProducts[0]) => {
    if (product.price === null || product.price === 0) {
      return 'Free';
    }
    const symbol = product.currency === 'ZAR' ? 'R' : '$';
    return `${symbol}${product.price}`;
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'individual subscription':
        return [
          'AI-powered profile generation',
          'Unlimited bio updates',
          'Priority customer support',
          'Advanced analytics',
          'Monthly feature updates'
        ];
      case 'business subscription':
        return [
          'Business profile hosting',
          'Online booking system',
          'Customer management',
          'Payment processing',
          'Marketing tools',
          'Analytics dashboard'
        ];
      default:
        return ['Standard features included'];
    }
  };

  const getCtaLabel = (product: typeof stripeProducts[0]) => {
    if (product.price === null || product.price === 0) return 'Free';
    return 'Paid Subscription';
  };

  const visibleProducts = stripeProducts.filter(
    (product) =>
      product.name.toLowerCase() === 'subscription' ||
      product.name.toLowerCase() === 'business subscription'
  );

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
        <StripeCheckout
          selectedProduct={selectedProduct}
          onSuccess={() => setShowCheckout(false)}
          onCancel={() => setShowCheckout(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TAC Marketplace
              </h1>
              <p className="text-gray-600">Professional Service Platform</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'plans', label: 'Plans & Pricing', icon: CreditCard },
                  { id: 'subscription', label: 'My Subscription', icon: Crown },
                  { id: 'orders', label: 'Order History', icon: Zap }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        {(!user || activeTab === 'plans') && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select the perfect plan for your needs. Upgrade or downgrade at any time.
              </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.priceId}
                  className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    product.name.toLowerCase() === 'subscription'
                      ? 'ring-2 ring-blue-500 ring-opacity-50 relative'
                      : ''
                  }`}
                >
                  {/* Badge */}
                  {product.name.toLowerCase() === 'subscription' && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${getProductColor(product.name)} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <div className="text-white">{getProductIcon(product.name)}</div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(product)}
                        </span>
                        {product.mode === 'subscription' && product.price !== 0 && (
                          <span className="text-gray-600 ml-2">/month</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {getFeatures(product.name).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(product)}
                      disabled={!user || (isSubscriptionActive() && product.mode === 'subscription')}
                      className={`w-full py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        product.name.toLowerCase() === 'subscription'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {!user
                        ? 'Sign in to purchase'
                        : isSubscriptionActive() && product.mode === 'subscription'
                        ? 'Already subscribed'
                        : getCtaLabel(product)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {user && activeTab === 'subscription' && (
          <div className="max-w-2xl mx-auto">
            <SubscriptionStatus />
          </div>
        )}

        {/* Orders Tab */}
        {user && activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <OrderHistory />
          </div>
        )}
      </div>
    </div>
  );
}
