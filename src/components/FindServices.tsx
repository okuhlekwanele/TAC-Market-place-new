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
  const { user } = useAuth();

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
                }
              }}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <MapView
            providers={nearbyProviders}
            center={userLocation || undefined}
            onProviderSelect={setSelectedProvider}
          />
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyProviders.map(provider => (
          <div key={provider.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {provider.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {provider.isBusinessOwner && provider.businessInfo
                        ? provider.businessInfo.businessName
                        : provider.fullName}
                    </h3>
                    <p className="text-sm text-teal-600 font-medium">{provider.service}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>{provider.location}</span>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  From R{provider.suggestedPrice}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                {provider.generatedBio}
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBookingProvider(provider)}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                  disabled={!user}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{user ? 'Book Now' : 'Sign In to Book'}</span>
                </button>

                <div className="flex space-x-2">
                  {provider.contactDetails?.phone && (
                    <a
                      href={`tel:${provider.contactDetails.phone}`}
                      className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  {provider.contactDetails?.whatsapp && (
                    <a
                      href={`https://wa.me/${provider.contactDetails.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}

                  {provider.contactDetails?.email && (
                    <a
                      href={`mailto:${provider.contactDetails.email}`}
                      className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {nearbyProviders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-teal-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No services found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or location</p>
        </div>
      )}

      {/* Booking Modal */}
      {bookingProvider && (
        <BookingModal
          isOpen={!!bookingProvider}
          onClose={() => setBookingProvider(null)}
          provider={bookingProvider}
        />
      )}
    </div>
  );
}
