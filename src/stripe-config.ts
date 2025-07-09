export const stripeProducts = [
  {
    priceId: 'price_1RiVkACVwlXJEJ4LUrEYcLDe', // Individual subscription price ID
    name: 'Individual Subscription',
    description: 'Access to AI profile generation and premium features for individual service providers',
    mode: 'subscription' as const,
    price: 50,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1RiVhtCVwlXJEJ4LKPOZPcqh', // Business subscription price ID
    name: 'Business Subscription',
    description: 'Complete business solution with booking management, analytics, and priority support',
    mode: 'subscription' as const,
    price: 100,
    currency: 'ZAR'
  },
  {
    priceId: 'price_service_booking', // You'll need to create this in Stripe
    name: 'Service Booking',
    description: 'One-time payment for booking professional services',
    mode: 'payment' as const,
    price: 20,
    currency: 'ZAR'
  }
];

export type StripeProduct = typeof stripeProducts[number];