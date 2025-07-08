import React, { useState } from 'react';
import { Check, Star, Zap, Crown, CreditCard, Shield, Users, Sparkles } from 'lucide-react';
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
      case 'nail appointment':
        return <Star className="w-6 h-6" />;
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
      case 'nail appointment':
        return 'from-pink-500 to-rose-500';
      case 'subscription':
        return 'from-blue-500 to-purple-500';
      case 'business subscription':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatPrice = (product: typeof stripeProducts[0]) => {
    if (product.price === null) {
      return 'Contact for pricing';
    }
    const symbol = product.currency === 'ZAR' ? 'R' : '$';
    return `${symbol}${product.price}`;
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'nail appointment':
        return [
          'Professional nail service',
          'Expert nail technician',
          'Quality products used',
          'Relaxing experience',
          'Flexible scheduling'
        ];
      case 'subscription':
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

        {/* Navigation Tabs */}
        {user && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'plans', label: 'Plans & Pricing', icon: CreditCard },
                  { id: 'subscription', label: 'My Subscription', icon: Crown },
                  { id: 'orders', label: 'Order History', icon: Star }
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

        {/* Plans Tab */}
        {(!user || activeTab === 'plans') && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select the perfect plan for your needs. Upgrade or downgrade at any time.
              </p>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Profiles</h3>
                <p className="text-gray-600">Generate professional bios and pricing with advanced AI technology</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Local Community</h3>
                <p className="text-gray-600">Connect with service providers and clients in your local area</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Trusted</h3>
                <p className="text-gray-600">Safe payments and verified service providers for peace of mind</p>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {stripeProducts.map((product, index) => (
                <div
                  key={product.priceId}
                  className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50 relative' : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {index === 1 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${getProductColor(product.name)} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <div className="text-white">
                        {getProductIcon(product.name)}
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(product)}
                        </span>
                        {product.mode === 'subscription' && product.price && (
                          <span className="text-gray-600 ml-2">/month</span>
                        )}
                        {product.mode === 'payment' && (
                          <span className="text-gray-600 ml-2">one-time</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
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

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(product)}
                      disabled={!user || (isSubscriptionActive() && product.mode === 'subscription')}
                      className={`w-full py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        index === 1
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {!user ? 'Sign in to purchase' : 
                       (isSubscriptionActive() && product.mode === 'subscription') ? 'Already subscribed' :
                       'Select Plan'}
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

        {/* FAQ Section - Only show on plans tab */}
        {(!user || activeTab === 'plans') && (
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards including Visa, Mastercard, and American Express through our secure Stripe payment processor.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  We offer a 14-day free trial for our subscription plans. No credit card required to start your trial.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  How secure are my payments?
                </h3>
                <p className="text-gray-600">
                  All payments are processed securely through Stripe with 256-bit SSL encryption. We never store your payment information on our servers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Subscription Status */}
        {user && (
          <div className="max-w-2xl mx-auto mb-12">
            <SubscriptionStatus />
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stripeProducts.map((product, index) => (
            <div
              key={product.priceId}
              className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${getProductColor(product.name)} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="text-white">
                    {getProductIcon(product.name)}
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product)}
                    </span>
                    {product.mode === 'subscription' && product.price && (
                      <span className="text-gray-600 ml-2">/month</span>
                    )}
                    {product.mode === 'payment' && (
                      <span className="text-gray-600 ml-2">one-time</span>
                    )}
                  </div>
                </div>

                {/* Features */}
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

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(product)}
                  disabled={!user}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    index === 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {!user ? 'Sign in to purchase' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards including Visa, Mastercard, and American Express through our secure Stripe payment processor.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for our subscription plans. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}