import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { stripeProducts, StripeProduct } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface StripeCheckoutProps {
  selectedProduct?: StripeProduct;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({ selectedProduct, onSuccess, onCancel }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    selectedProduct?.priceId || stripeProducts[0].priceId
  );
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      setError('Please sign in to continue with checkout');
      return;
    }

    const product = stripeProducts.find(p => p.priceId === selectedProductId);
    if (!product) {
      setError('Selected product not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setError('Authentication required. Please sign in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (product: StripeProduct) => {
    if (product.price === null) {
      return 'Contact for pricing';
    }
    return `${product.currency === 'ZAR' ? 'R' : '$'}${product.price}`;
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            onSuccess?.();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="text-gray-600">Select a product to purchase</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {stripeProducts.map((product) => (
          <div
            key={product.priceId}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              selectedProductId === product.priceId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedProductId(product.priceId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product)}
                  </span>
                  {product.mode === 'subscription' && (
                    <span className="text-sm text-gray-500">/ month</span>
                  )}
                  {product.mode === 'payment' && (
                    <span className="text-sm text-gray-500">one-time</span>
                  )}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedProductId === product.priceId
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedProductId === product.priceId && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={loading || !user}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Proceed to Checkout'
          )}
        </button>

        {!user && (
          <p className="text-sm text-gray-600 text-center">
            Please sign in to continue with checkout
          </p>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}