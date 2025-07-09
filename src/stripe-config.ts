export const stripeProducts = [
  {
    priceId: 'price_1QTest1', // Replace with your actual Stripe price ID
    name: 'Service Booking',
    description: 'Book professional services with verified providers',
    mode: 'payment' as const,
    price: 50,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1QTest2', // Replace with your actual Stripe price ID
    name: 'Individual Subscription',
    description: 'Access to AI profile generation and premium features',
    mode: 'subscription' as const,
    price: 99,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1QTest3', // Replace with your actual Stripe price ID
    name: 'Business Subscription',
    description: 'Complete business solution with booking management and analytics',
    mode: 'subscription' as const,
    price: 199,
    currency: 'ZAR'
  }
];

export type StripeProduct = typeof stripeProducts[number];