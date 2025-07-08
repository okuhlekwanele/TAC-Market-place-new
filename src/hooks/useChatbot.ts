import { useState } from 'react';
import { ServiceProvider } from '../types';
import { LocalProfile } from './useLocalProfiles';

interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  businessCards?: BusinessCard[];
}

interface BusinessCard {
  id: string;
  name: string;
  service: string;
  location: string;
  price: string;
  contact?: string;
  rating?: number;
  type: 'service' | 'local';
}

export function useChatbot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    userMessage: string,
    providers: ServiceProvider[],
    profiles: LocalProfile[]
  ): Promise<ChatbotResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Analyze user intent and generate appropriate response
      const response = await analyzeUserIntent(userMessage, providers, profiles);
      return response;
    } catch (err) {
      console.error('Chatbot error:', err);
      setError('Failed to generate response');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateResponse,
    loading,
    error
  };
}

async function analyzeUserIntent(
  message: string,
  providers: ServiceProvider[],
  profiles: LocalProfile[]
): Promise<ChatbotResponse> {
  const lowerMessage = message.toLowerCase();
  
  // Service search patterns
  const servicePatterns = [
    'find', 'looking for', 'need', 'want', 'search', 'show me', 'get me'
  ];
  
  const locationPatterns = [
    'near me', 'in', 'around', 'close to', 'nearby'
  ];

  // Check if user is asking for specific services
  if (servicePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return handleServiceSearch(message, providers, profiles);
  }

  // Check if user is asking about pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return handlePricingQuery(message, providers, profiles);
  }

  // Check if user is asking about locations
  if (locationPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return handleLocationQuery(message, providers, profiles);
  }

  // Check if user is asking about booking
  if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return handleBookingQuery(message);
  }

  // Check if user is asking about the platform
  if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('platform')) {
    return handlePlatformQuery(message);
  }

  // Default response with general help
  return {
    message: "I can help you find service providers, check prices, learn about locations, or answer questions about our platform. What specifically would you like to know?",
    suggestions: [
      "Find plumbers near me",
      "Show me hair stylists",
      "What are your prices?",
      "How do I book an appointment?",
      "What services are available?"
    ]
  };
}

function handleServiceSearch(
  message: string,
  providers: ServiceProvider[],
  profiles: LocalProfile[]
): ChatbotResponse {
  const lowerMessage = message.toLowerCase();
  
  // Extract service type from message
  const services = [
    'plumbing', 'plumber', 'electrical', 'electrician', 'carpentry', 'carpenter',
    'painting', 'painter', 'gardening', 'gardener', 'cleaning', 'cleaner',
    'tutoring', 'tutor', 'catering', 'caterer', 'photography', 'photographer',
    'hair', 'hairdressing', 'hairdresser', 'makeup', 'sewing', 'mechanic'
  ];

  const foundServices = services.filter(service => lowerMessage.includes(service));
  
  if (foundServices.length > 0) {
    const serviceType = foundServices[0];
    const matchingProviders = providers.filter(p => 
      p.service.toLowerCase().includes(serviceType) && p.status === 'Published'
    );
    const matchingProfiles = profiles.filter(p => 
      p.skill.toLowerCase().includes(serviceType) && p.status === 'Published'
    );

    const businessCards: BusinessCard[] = [
      ...matchingProviders.slice(0, 3).map(p => ({
        id: p.id,
        name: p.isBusinessOwner && p.businessInfo ? p.businessInfo.businessName : p.fullName,
        service: p.service,
        location: p.location,
        price: `From R${p.suggestedPrice}`,
        contact: p.contactDetails.phone,
        type: 'service' as const
      })),
      ...matchingProfiles.slice(0, 2).map(p => ({
        id: p.id,
        name: p.fullName,
        service: p.skill,
        location: p.location,
        price: `From R${p.suggestedPriceZAR}`,
        contact: p.contact,
        type: 'local' as const
      }))
    ];

    if (businessCards.length > 0) {
      return {
        message: `I found ${businessCards.length} ${serviceType} service providers for you! Here are some top options:`,
        businessCards,
        suggestions: [
          "Show me more options",
          "Find providers near me",
          "Compare prices",
          "How do I book?"
        ]
      };
    } else {
      return {
        message: `I couldn't find any ${serviceType} services right now, but we have many other great service providers available!`,
        suggestions: [
          "Show all services",
          "Find other providers",
          "Browse by location",
          "Contact support"
        ]
      };
    }
  }

  // General service search
  const allBusinessCards: BusinessCard[] = [
    ...providers.filter(p => p.status === 'Published').slice(0, 3).map(p => ({
      id: p.id,
      name: p.isBusinessOwner && p.businessInfo ? p.businessInfo.businessName : p.fullName,
      service: p.service,
      location: p.location,
      price: `From R${p.suggestedPrice}`,
      contact: p.contactDetails.phone,
      type: 'service' as const
    })),
    ...profiles.filter(p => p.status === 'Published').slice(0, 2).map(p => ({
      id: p.id,
      name: p.fullName,
      service: p.skill,
      location: p.location,
      price: `From R${p.suggestedPriceZAR}`,
      contact: p.contact,
      type: 'local' as const
    }))
  ];

  return {
    message: "Here are some of our featured service providers across different categories:",
    businessCards: allBusinessCards,
    suggestions: [
      "Find specific service",
      "Browse by location",
      "Compare prices",
      "View all services"
    ]
  };
}

function handlePricingQuery(
  message: string,
  providers: ServiceProvider[],
  profiles: LocalProfile[]
): ChatbotResponse {
  const publishedProviders = providers.filter(p => p.status === 'Published');
  const publishedProfiles = profiles.filter(p => p.status === 'Published');

  if (publishedProviders.length === 0 && publishedProfiles.length === 0) {
    return {
      message: "We don't have pricing information available right now, but our service providers offer competitive rates. Contact them directly for quotes!",
      suggestions: [
        "Find service providers",
        "Browse services",
        "Contact support"
      ]
    };
  }

  const avgProviderPrice = publishedProviders.length > 0 
    ? Math.round(publishedProviders.reduce((sum, p) => sum + p.suggestedPrice, 0) / publishedProviders.length)
    : 0;

  const avgProfilePrice = publishedProfiles.length > 0
    ? Math.round(publishedProfiles.reduce((sum, p) => sum + p.suggestedPriceZAR, 0) / publishedProfiles.length)
    : 0;

  let priceInfo = "Here's what you can expect for pricing:\n\n";
  
  if (avgProviderPrice > 0) {
    priceInfo += `🏢 Professional Services: Average R${avgProviderPrice}\n`;
  }
  
  if (avgProfilePrice > 0) {
    priceInfo += `👥 Local Providers: Average R${avgProfilePrice}\n`;
  }

  priceInfo += "\nPrices vary based on experience, location, and service complexity. Contact providers directly for accurate quotes!";

  return {
    message: priceInfo,
    suggestions: [
      "Find specific service",
      "Compare providers",
      "Get quotes",
      "Browse by price range"
    ]
  };
}

function handleLocationQuery(
  message: string,
  providers: ServiceProvider[],
  profiles: LocalProfile[]
): ChatbotResponse {
  const locations = new Set([
    ...providers.filter(p => p.status === 'Published').map(p => p.location),
    ...profiles.filter(p => p.status === 'Published').map(p => p.location)
  ]);

  const locationList = Array.from(locations).slice(0, 8);

  return {
    message: `We have service providers in these areas:\n\n${locationList.map(loc => `📍 ${loc}`).join('\n')}\n\nWould you like to see providers in a specific area?`,
    suggestions: [
      "Find providers near me",
      "Browse all locations",
      "Search by area",
      "Show popular areas"
    ]
  };
}

function handleBookingQuery(message: string): ChatbotResponse {
  return {
    message: "Booking an appointment is easy! Here's how:\n\n1️⃣ Browse or search for service providers\n2️⃣ View their profiles and availability\n3️⃣ Click 'Book Now' on their profile\n4️⃣ Fill in your details and preferred time\n5️⃣ Submit your booking request\n\nThe provider will contact you to confirm the appointment!",
    suggestions: [
      "Find service providers",
      "Browse services",
      "View availability",
      "Contact support"
    ]
  };
}

function handlePlatformQuery(message: string): ChatbotResponse {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return {
      message: "TAC Marketplace connects you with local service providers! We use AI to help create professional profiles, making it easy to find trusted services in your area. Browse providers, compare prices, read reviews, and book appointments all in one place.",
      suggestions: [
        "Find services",
        "How to book",
        "View providers",
        "Learn about pricing"
      ]
    };
  }

  if (lowerMessage.includes('what') && (lowerMessage.includes('service') || lowerMessage.includes('available'))) {
    return {
      message: "We offer a wide range of services including:\n\n🔧 Home Services: Plumbing, Electrical, Carpentry, Painting\n🏠 Household: Cleaning, Gardening, Maintenance\n👨‍🏫 Personal: Tutoring, Fitness Training, Hair Styling\n🎨 Creative: Photography, Graphic Design, Sewing\n🍽️ Events: Catering, Entertainment\n\nAnd many more!",
      suggestions: [
        "Find specific service",
        "Browse all services",
        "View providers",
        "Check availability"
      ]
    };
  }

  return {
    message: "TAC Marketplace is your go-to platform for finding local service providers. We connect you with skilled professionals and community members offering various services. Our AI helps create detailed profiles so you can make informed decisions.",
    suggestions: [
      "How does it work?",
      "What services are available?",
      "Find providers",
      "Learn about booking"
    ]
  };
}