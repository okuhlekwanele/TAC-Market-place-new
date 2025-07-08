# TAC Market Place

A professional service marketplace platform with AI-powered profile generation and Stripe payment integration.

## Features

- 🤖 AI-powered profile generation using Gemini AI
- 💳 Secure payments with Stripe integration
- 📍 Location-based service discovery with Google Maps
- 📊 Analytics and reporting
- 👥 User management with role-based access
- 📱 Responsive design with Tailwind CSS
- 🔐 Authentication with Supabase

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google APIs (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SHEETS_ID=your_google_sheets_id

# AI Services (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe dashboard
3. Create products and prices in Stripe
4. Update the price IDs in `src/stripe-config.ts`
5. Set up webhooks pointing to your Supabase edge functions

## Supabase Setup

1. Create a Supabase project
2. Run the database migrations in `supabase/migrations/`
3. Deploy the edge functions in `supabase/functions/`
4. Set environment variables in Supabase dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Payment Flow

1. User selects a plan on the pricing page
2. Stripe Checkout session is created via edge function
3. User completes payment on Stripe
4. Webhook updates subscription/order status in database
5. User is redirected to success page

## Admin Features

- User management
- Service provider approval
- Analytics dashboard
- Order and subscription management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe
- **AI**: Google Gemini
- **Maps**: Google Maps API
- **Build Tool**: Vite
