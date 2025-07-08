export const stripeProducts = [

  {
    priceId: 'price_1RiVkACVwlXJEJ4LUrEYcLDe',
    name: 'Individual subscription',
    description: 'For individuals to continue to use our AI services.',
    mode: 'subscription' as const,
    price: From R50, // Price will be fetched from Stripe
    currency: 'ZAR'
  },
  {
    priceId: 'price_1RiVhtCVwlXJEJ4LKPOZPcqh',
    name: 'Business subscription',
    description: 'To have your business hosted on the platform and to make bookings.',
    mode: 'payment' as const,
    price: From 100,
    currency: 'ZAR'
  }
];

export type StripeProduct = typeof stripeProducts[number];