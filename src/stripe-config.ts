export const stripeProducts = [
  {
    priceId: 'price_1RiVoGCVwlXJEJ4LQFb1WBjy', // Replace with your actual price ID
    name: 'Service Booking',
    description: 'Book professional services with verified providers',
    mode: 'payment' as const,
    price: 50,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1RiVkACVwlXJEJ4LUrEYcLDe', // Replace with your actual price ID
    name: 'Pro Subscription',
    description: 'Access to AI profile generation and premium features',
    mode: 'subscription' as const,
    price: 299,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1RiVhtCVwlXJEJ4LKPOZPcqh', // Replace with your actual price ID
    name: 'Business Plan',
    description: 'Complete business solution with booking management and analytics',
    mode: 'subscription' as const,
    price: 599,
    currency: 'ZAR'
  }
];

export type StripeProduct = typeof stripeProducts[number];