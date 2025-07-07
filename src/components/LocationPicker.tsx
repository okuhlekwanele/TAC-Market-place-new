import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Target } from 'lucide-react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  initialLocation?: string;
  placeholder?: string;
}

export function LocationPicker({ onLocationSelect, initialLocation = '', placeholder = 'Enter your location...' }: LocationPickerProps) {
  const [address, setAddress] = useState(initialLocation);
  const [showMap, setShowMap] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const { isLoaded, geocodeAddress } = useGoogleMaps();

  useEffect(() => {
    if (showMap && isLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [showMap, isLoaded]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    // Default to Cape Town center
    const defaultCenter = { lat: -33.9249, lng: 18.4241 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: selectedCoords || defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add click listener to map
    mapInstanceRef.current.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedCoords({ lat, lng });
      updateMarker({ lat, lng });
      reverseGeocode({ lat, lng });
    });

    // Add marker if coordinates exist
    if (selectedCoords) {
      updateMarker(selectedCoords);
    }
  };

  const updateMarker = (coords: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position: coords,
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Your Location'
    });

    // Add drag listener to marker
    markerRef.current.addListener('dragend', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedCoords({ lat, lng });
      reverseGeocode({ lat, lng });
    });

    // Center map on marker
    mapInstanceRef.current.setCenter(coords);
  };

  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);
      }
    });
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) return;

    const coords = await geocodeAddress(address);
    if (coords) {
      setSelectedCoords(coords);
      if (mapInstanceRef.current) {
        updateMarker(coords);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedCoords(coords);
          reverseGeocode(coords);
          if (mapInstanceRef.current) {
            updateMarker(coords);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter your address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleConfirmLocation = () => {
    if (selectedCoords && address) {
      onLocationSelect({
        address,
        coordinates: selectedCoords
      });
      setShowMap(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>{showMap ? 'Hide Map' : 'Pin on Map'}</span>
        </button>
        
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Target className="w-4 h-4" />
          <span>Use Current Location</span>
        </button>
        
        <button
          type="button"
          onClick={handleAddressSearch}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Map Container */}
      {showMap && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          {isLoaded ? (
            <div>
              <div ref={mapRef} className="w-full h-64" />
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedCoords ? (
                      <span>📍 Location selected: {address || 'Custom location'}</span>
                    ) : (
                      <span>Click on the map to select your location</span>
                    )}
                  </div>
                  {selectedCoords && (
                    <button
                      type="button"
                      onClick={handleConfirmLocation}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Confirm Location
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}