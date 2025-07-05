import { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setLoadError('Google Maps API key not found');
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        setLoadError('Failed to load Google Maps');
        console.error('Google Maps loading error:', error);
      });
  }, []);

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    if (!isLoaded || !window.google) return null;

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const calculateDistance = (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): number => {
    if (!isLoaded || !window.google) return 0;

    const service = new window.google.maps.DistanceMatrixService();
    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
    const destLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);
    
    return window.google.maps.geometry.spherical.computeDistanceBetween(originLatLng, destLatLng) / 1000; // km
  };

  return {
    isLoaded,
    loadError,
    geocodeAddress,
    calculateDistance
  };
}

declare global {
  interface Window {
    google: any;
  }
}