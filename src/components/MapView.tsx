import React, { useEffect, useRef } from 'react';
import { ServiceProvider } from '../types';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface MapViewProps {
  providers: ServiceProvider[];
  center?: { lat: number; lng: number };
  onProviderSelect?: (provider: ServiceProvider) => void;
}

export function MapView({ providers, center, onProviderSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    const defaultCenter = center || { lat: -26.2041, lng: 28.0473 }; // Johannesburg

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add markers for providers
    providers.forEach(provider => {
      if (provider.coordinates) {
        const marker = new window.google.maps.Marker({
          position: provider.coordinates,
          map: mapInstanceRef.current,
          title: provider.fullName,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-gray-900">${provider.fullName}</h3>
              <p class="text-sm text-gray-600">${provider.service}</p>
              <p class="text-sm text-gray-600">${provider.location}</p>
              <p class="text-sm font-medium text-blue-600 mt-2">R${provider.suggestedPrice}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          if (onProviderSelect) {
            onProviderSelect(provider);
          }
        });
      }
    });

  }, [isLoaded, providers, center, onProviderSelect]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />;
}