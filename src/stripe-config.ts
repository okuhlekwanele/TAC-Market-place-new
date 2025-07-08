export const stripeProducts = [
  {
    priceId: 'price_1RiVoGCVwlXJEJ4LQFb1WBjy',
    name: 'Nail appointment',
    description: 'Professional nail appointment service',
    mode: 'payment' as const,
    price: 100,
    currency: 'ZAR'
  },
  {
    priceId: 'price_1RiVkACVwlXJEJ4LUrEYcLDe',
    name: 'Subscription',
    description: 'For the businesses to continue to use our AI services.',
    mode: 'subscription' as const,
    price: null, // Price will be fetched from Stripe
    currency: 'USD'
  },
  {
    priceId: 'price_1RiVhtCVwlXJEJ4LKPOZPcqh',
    name: 'Business subscription',
    description: 'To have your business hosted on the platform and to make bookings.',
    mode: 'payment' as const,
    price: 6,
    currency: 'USD'
  }
];

export type StripeProduct = typeof stripeProducts[number];