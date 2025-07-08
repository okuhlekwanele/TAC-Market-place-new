import React from 'react';
import { Receipt, Calendar, CreditCard, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';
import { useAuth } from '../hooks/useAuth';

export function OrderHistory() {
  const { user } = useAuth();
  const { orders, loading, formatAmount } = useStripe();

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
        <p className="text-gray-600">Please sign in to view your order history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order History</h3>
          <p className="text-gray-600">View your past purchases and transactions</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Your order history will appear here after you make a purchase</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.order_status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Order #{order.order_id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.order_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatAmount(order.amount_total, order.currency)}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <p className="font-medium text-gray-900 capitalize">{order.payment_status}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Session ID</p>
                    <p className="font-mono text-xs text-gray-900 truncate">
                      {order.checkout_session_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        Subtotal: {formatAmount(order.amount_subtotal, order.currency)}
                      </p>
                      <p className="font-medium text-gray-900">
                        Total: {formatAmount(order.amount_total, order.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.payment_intent_id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Payment Intent: <span className="font-mono">{order.payment_intent_id}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}