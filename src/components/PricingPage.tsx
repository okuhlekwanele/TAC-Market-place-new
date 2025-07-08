import React, { useState } from 'react';
import { Check, Star, Zap, Crown, CreditCard } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { StripeCheckout } from './StripeCheckout';
import { SubscriptionStatus } from './SubscriptionStatus';
import { useAuth } from '../hooks/useAuth';

export function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(stripeProducts[0]);
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
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