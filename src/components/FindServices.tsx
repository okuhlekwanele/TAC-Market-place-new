import React, { useState } from 'react';
import { Search, MapPin, Filter, Calendar, Star, Phone, Mail, MessageCircle, Bot } from 'lucide-react';
import { ServiceProvider } from '../types';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapView } from './MapView';
import { BookingModal } from './BookingModal';
import { useAuth } from '../hooks/useAuth';

export function FindServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [bookingProvider, setBookingProvider] = useState<ServiceProvider | null>(null);

  const { providers, findNearbyProviders } = useServiceProviders();
  const { geocodeAddress } = useGoogleMaps();
  const { user } = useAuth(); // ✅ Fix: define user

  const services = [
    'Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'Gardening',
    'Cleaning', 'Tutoring', 'Catering', 'Photography', 'Web Development',
    'Graphic Design', 'Music Lessons', 'Fitness Training', 'Hair Styling',
    'Mechanic', 'Tailoring', 'Other'
  ];

  const handleLocationSearch = async (location: string) => {
    const coords = await geocodeAddress(location);
    if (coords) {
      setUserLocation(coords);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = !selectedService || provider.service === selectedService;

    return matchesSearch && matchesService && provider.status === 'Published';
  });

  const nearbyProviders = userLocation
    ? findNearbyProviders(userLocation, 15)
    : filteredProviders;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Find Services</h2>
            <p className="text-gray-600 mt-2 text-lg">Discover local service providers on TAC Market Place</p>
            <div className="flex items-center space-x-2 mt-3">
              <Bot className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-blue-600">Need help finding services? Try our AI assistant in the bottom right!</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-medium ${
                showMap
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search providers or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full pl-12 pr-8 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none bg-gray-50 focus:bg-white"
            >
              <option value="">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter your location..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLocationSearch(e.currentTarget.value);
