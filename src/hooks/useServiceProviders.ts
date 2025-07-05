import { useState, useEffect } from 'react';
import { ServiceProvider, FormData } from '../types';
import { useGoogleMaps } from './useGoogleMaps';
import { useGoogleSheets } from './useGoogleSheets';

export function useServiceProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const { geocodeAddress } = useGoogleMaps();
  const { syncServiceProviderToSheets } = useGoogleSheets();

  useEffect(() => {
    // Load initial data from localStorage
    const savedProviders = localStorage.getItem('serviceProviders');
    if (savedProviders) {
      const parsedProviders = JSON.parse(savedProviders).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
      setProviders(parsedProviders);
    }
  }, []);

  const saveProviders = (newProviders: ServiceProvider[]) => {
    setProviders(newProviders);
    localStorage.setItem('serviceProviders', JSON.stringify(newProviders));
  };

  const addProvider = async (provider: ServiceProvider) => {
    const newProviders = [...providers, provider];
    saveProviders(newProviders);
    
    // Sync to Google Sheets
    await syncServiceProviderToSheets(provider);
  };

  const updateProvider = async (id: string, updates: Partial<ServiceProvider>) => {
    const newProviders = providers.map(p => {
      if (p.id === id) {
        const updatedProvider = { ...p, ...updates };
        // Sync to Google Sheets when provider is updated
        syncServiceProviderToSheets(updatedProvider).catch(console.error);
        return updatedProvider;
      }
      return p;
    });
    saveProviders(newProviders);
  };

  const deleteProvider = (id: string) => {
    const newProviders = providers.filter(p => p.id !== id);
    saveProviders(newProviders);
  };

  const generateProfile = async (formData: FormData): Promise<ServiceProvider> => {
    setLoading(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get coordinates for the location
    const coordinates = await geocodeAddress(formData.location);
    
    const generatedBio = generateBio(formData);
    const suggestedPrice = generatePrice(formData);
    
    const newProvider: ServiceProvider = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      service: formData.service,
      yearsExperience: formData.yearsExperience,
      location: formData.location,
      coordinates,
      contactDetails: formData.contactDetails,
      generatedBio,
      suggestedPrice,
      status: 'Ready',
      createdAt: new Date(),
      isBusinessOwner: formData.isBusinessOwner,
      businessInfo: formData.businessInfo,
      availability: generateDefaultAvailability()
    };
    
    await addProvider(newProvider);
    setLoading(false);
    
    return newProvider;
  };

  const findNearbyProviders = (userLocation: { lat: number; lng: number }, radiusKm: number = 10) => {
    return providers.filter(provider => {
      if (!provider.coordinates) return false;
      
      const distance = calculateDistance(userLocation, provider.coordinates);
      return distance <= radiusKm;
    });
  };

  return {
    providers,
    loading,
    addProvider,
    updateProvider,
    deleteProvider,
    generateProfile,
    findNearbyProviders
  };
}

function generateBio(formData: FormData): string {
  const { fullName, service, yearsExperience, location, isBusinessOwner, businessInfo } = formData;
  
  if (isBusinessOwner && businessInfo) {
    return `${businessInfo.businessName} is a ${businessInfo.businessType.toLowerCase()} specializing in ${service.toLowerCase()} with ${yearsExperience} years of experience in ${location}. ${businessInfo.description}`;
  }
  
  const templates = [
    `${fullName} is a skilled ${service.toLowerCase()} with ${yearsExperience} years of experience serving clients in ${location}. Known for delivering high-quality work and exceptional customer service.`,
    `With ${yearsExperience} years of hands-on experience, ${fullName} specializes in ${service.toLowerCase()} and has built a reputation for reliability and expertise in ${location}.`,
    `${fullName} brings ${yearsExperience} years of professional ${service.toLowerCase()} experience to every project. Based in ${location}, they are committed to exceeding client expectations.`,
    `An experienced ${service.toLowerCase()} professional with ${yearsExperience} years in the field, ${fullName} serves the ${location} community with dedication and skill.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generatePrice(formData: FormData): number {
  const { service, yearsExperience } = formData;
  
  const basePrices: { [key: string]: number } = {
    'Plumbing': 300,
    'Electrical Work': 350,
    'Carpentry': 280,
    'Painting': 200,
    'Gardening': 150,
    'Cleaning': 120,
    'Tutoring': 180,
    'Catering': 250,
    'Photography': 400,
    'Web Development': 500,
    'Graphic Design': 300,
    'Music Lessons': 200,
    'Fitness Training': 250,
    'Hair Styling': 150,
    'Mechanic': 320,
    'Tailoring': 180
  };
  
  const basePrice = basePrices[service] || 200;
  const experienceMultiplier = 1 + (yearsExperience * 0.1);
  
  return Math.round(basePrice * experienceMultiplier);
}

function generateDefaultAvailability() {
  const slots = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Generate morning and afternoon slots
    slots.push({
      date: date.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '12:00',
      available: Math.random() > 0.3
    });
    
    slots.push({
      date: date.toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '17:00',
      available: Math.random() > 0.3
    });
  }
  
  return slots;
}

function calculateDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (destination.lat - origin.lat) * Math.PI / 180;
  const dLon = (destination.lng - origin.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}