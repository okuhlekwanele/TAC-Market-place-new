export interface ServiceProvider {
  id: string;
  fullName: string;
  service: string;
  yearsExperience: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contactDetails: ContactDetails;
  generatedBio: string;
  suggestedPrice: number;
  status: 'Pending' | 'Ready' | 'Published';
  createdAt: Date;
  isBusinessOwner?: boolean;
  businessInfo?: BusinessInfo;
  availability?: TimeSlot[];
  profileImages?: ProfileImage[];
  customerReviews?: CustomerReview[];
  customAvailability?: CustomTimeSlot[];
}

export interface ContactDetails {
  phone: string;
  email: string;
  whatsapp?: string;
  website?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: 'Individual' | 'Small Business' | 'Company';
  description: string;
  services: string[];
  operatingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  images?: string[];
}

export interface ProfileImage {
  id: string;
  preview: string;
  caption: string;
}

export interface CustomerReview {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CustomTimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: Date;
}

export interface FormData {
  fullName: string;
  service: string;
  yearsExperience: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contactDetails: ContactDetails;
  isBusinessOwner: boolean;
  businessInfo?: BusinessInfo;
  profileImages?: ProfileImage[];
  customerReviews?: CustomerReview[];
  customAvailability?: CustomTimeSlot[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedProviders: string[];
  bookingHistory: string[];
}