import React, { useState } from 'react';
import { User, Briefcase, Calendar, MapPin, Sparkles, Phone, Mail, MessageCircle, Globe, Building, Camera, Star, Plus, X, Clock } from 'lucide-react';
import { FormData } from '../types';
import { LocalProfileForm } from './LocalProfileForm';
import { LocationPicker } from './LocationPicker';
import { NavigationButtons } from './NavigationButtons';

interface ProfileFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

interface ProfileImage {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface CustomTimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export function ProfileForm({ onSubmit, loading }: ProfileFormProps) {
  const [profileType, setProfileType] = useState<'local' | 'advanced'>('local');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    service: '',
    yearsExperience: 0,
    location: '',
    contactDetails: {
      phone: '',
      email: '',
      whatsapp: '',
      website: ''
    },
    isBusinessOwner: false,
    businessInfo: {
      businessName: '',
      businessType: 'Individual',
      description: '',
      services: [],
      operatingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '13:00', closed: false },
        sunday: { open: '09:00', close: '13:00', closed: true }
      }
    }
  });

  // New state for images, reviews, and custom availability
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [customerReviews, setCustomerReviews] = useState<Review[]>([]);
  const [customTimeSlots, setCustomTimeSlots] = useState<CustomTimeSlot[]>([]);
  const [newReview, setNewReview] = useState({
    clientName: '',
    rating: 5,
    comment: '',
    service: '',
    date: new Date().toISOString().split('T')[0]
  });

  const services = [
    'Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'Gardening',
    'Cleaning', 'Tutoring', 'Catering', 'Photography', 'Web Development',
    'Graphic Design', 'Music Lessons', 'Fitness Training', 'Hair Styling',
    'Mechanic', 'Tailoring'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include images, reviews, and custom availability in the form data
    const enhancedFormData = {
      ...formData,
      profileImages: profileImages.map(img => ({
        preview: img.preview,
        caption: img.caption
      })),
      customerReviews,
      customAvailability: customTimeSlots
    };
    
    onSubmit(enhancedFormData);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, [field]: value }
    }));
  };

  const handleBusinessChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessInfo: { ...prev.businessInfo!, [field]: value }
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo!,
        operatingHours: {
          ...prev.businessInfo!.operatingHours,
          [day]: {
            ...prev.businessInfo!.operatingHours[day],
            [field]: value
          }
        }
      }
    }));
  };

  const handleLocationSelect = (locationData: { address: string; coordinates: { lat: number; lng: number } }) => {
    setFormData(prev => ({
      ...prev,
      location: locationData.address,
      coordinates: locationData.coordinates
    }));
  };

  // Custom time slot functions
  const addCustomTimeSlot = () => {
    const newSlot: CustomTimeSlot = {
      id: Date.now().toString(),
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      available: true
    };
    setCustomTimeSlots(prev => [...prev, newSlot]);
  };

  const updateCustomTimeSlot = (id: string, field: string, value: any) => {
    setCustomTimeSlots(prev => prev.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const removeCustomTimeSlot = (id: string) => {
    setCustomTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  // Image handling functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage: ProfileImage = {
            id: Date.now().toString() + Math.random(),
            file,
            preview: event.target?.result as string,
            caption: ''
          };
          setProfileImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId: string) => {
    setProfileImages(prev => prev.filter(img => img.id !== imageId));
  };

  const updateImageCaption = (imageId: string, caption: string) => {
    setProfileImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, caption } : img
    ));
  };

  // Review handling functions
  const addReview = () => {
    if (newReview.clientName && newReview.comment) {
      const review: Review = {
        id: Date.now().toString(),
        ...newReview
      };
      setCustomerReviews(prev => [...prev, review]);
      setNewReview({
        clientName: '',
        rating: 5,
        comment: '',
        service: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const removeReview = (reviewId: string) => {
    setCustomerReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <NavigationButtons />
      
      {/* Profile Type Selector */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Profile Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setProfileType('local')}
            className={`p-8 rounded-2xl border-2 transition-all text-left group hover:shadow-lg ${
              profileType === 'local'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                profileType === 'local' 
                  ? 'bg-blue-500 shadow-lg' 
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <User className={`w-7 h-7 ${profileType === 'local' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Local Service Provider</h3>
                <p className="text-sm text-gray-600">Quick and simple form</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Perfect for individual service providers in local communities. Simple form with essential fields only.
            </p>
          </button>

          <button
            onClick={() => setProfileType('advanced')}
            className={`p-8 rounded-2xl border-2 transition-all text-left group hover:shadow-lg ${
              profileType === 'advanced'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                profileType === 'advanced' 
                  ? 'bg-purple-500 shadow-lg' 
                  : 'bg-purple-100 group-hover:bg-purple-200'
              }`}>
                <Building className={`w-7 h-7 ${profileType === 'advanced' ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Advanced Profile</h3>
                <p className="text-sm text-gray-600">Full business features</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive form with business information, portfolio images, customer reviews, custom availability, and advanced features.
            </p>
          </button>
        </div>
      </div>

      {/* Render Selected Form */}
      {profileType === 'local' ? (
        <LocalProfileForm />
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-8 py-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create Advanced Profile</h2>
                <p className="text-gray-600 text-lg">Let AI generate a professional bio and pricing</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Basic Information */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Service/Skill
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value))}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Location
                  </label>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={formData.location}
                    placeholder="e.g., Johannesburg, Gauteng"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactDetails.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactDetails.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contactDetails.whatsapp}
                    onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.contactDetails.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-lg"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Images Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Portfolio Images (Optional)</h3>
              </div>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="portfolio-upload"
                  />
                  <label htmlFor="portfolio-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Portfolio Images</h4>
                    <p className="text-gray-600">Showcase your best work to attract more clients</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                  </label>
                </div>

                {profileImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileImages.map(image => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                          <img
                            src={image.preview}
                            alt="Portfolio"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Add a caption..."
                            value={image.caption}
                            onChange={(e) => updateImageCaption(image.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-100">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews (Optional)</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Customer Review</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Customer name"
                      value={newReview.clientName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, clientName: e.target.value }))}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Service provided"
                      value={newReview.service}
                      onChange={(e) => setNewReview(prev => ({ ...prev, service: e.target.value }))}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                  <textarea
                    placeholder="Customer feedback..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-4"
                  />
                  <button
                    type="button"
                    onClick={addReview}
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                </div>

                {customerReviews.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Added Reviews</h4>
                    {customerReviews.map(review => (
                      <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{review.clientName}</h5>
                            <p className="text-sm text-gray-600">{review.service}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReview(review.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mb-3">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <input
                  type="checkbox"
                  id="isBusinessOwner"
                  checked={formData.isBusinessOwner}
                  onChange={(e) => handleInputChange('isBusinessOwner', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isBusinessOwner" className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>I am registering a business</span>
                </label>
              </div>

              {formData.isBusinessOwner && (
                <div className="space-y-8 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        required={formData.isBusinessOwner}
                        value={formData.businessInfo?.businessName || ''}
                        onChange={(e) => handleBusinessChange('businessName', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-lg"
                        placeholder="Your Business Name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Type
                      </label>
                      <select
                        value={formData.businessInfo?.businessType || 'Individual'}
                        onChange={(e) => handleBusinessChange('businessType', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-lg"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Small Business">Small Business</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.businessInfo?.description || ''}
                      onChange={(e) => handleBusinessChange('description', e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-lg"
                      placeholder="Describe your business and what makes it unique..."
                    />
                  </div>

                  {/* Operating Hours */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-bold text-gray-900">Operating Hours</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {daysOfWeek.map(day => (
                        <div key={day} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                          <div className="w-24">
                            <label className="text-sm font-medium text-gray-700">{day}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!formData.businessInfo?.operatingHours[day.toLowerCase()]?.closed}
                              onChange={(e) => handleOperatingHoursChange(day.toLowerCase(), 'closed', !e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Open</span>
                          </div>
                          {!formData.businessInfo?.operatingHours[day.toLowerCase()]?.closed && (
                            <>
                              <input
                                type="time"
                                value={formData.businessInfo?.operatingHours[day.toLowerCase()]?.open || '09:00'}
                                onChange={(e) => handleOperatingHoursChange(day.toLowerCase(), 'open', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={formData.businessInfo?.operatingHours[day.toLowerCase()]?.close || '17:00'}
                                onChange={(e) => handleOperatingHoursChange(day.toLowerCase(), 'close', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Availability */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-bold text-gray-900">Custom Availability</h4>
                      </div>
                      <button
                        type="button"
                        onClick={addCustomTimeSlot}
                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Time Slot</span>
                      </button>
                    </div>
                    
                    {customTimeSlots.length > 0 && (
                      <div className="space-y-4">
                        {customTimeSlots.map(slot => (
                          <div key={slot.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                            <select
                              value={slot.day}
                              onChange={(e) => updateCustomTimeSlot(slot.id, 'day', e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              {daysOfWeek.map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateCustomTimeSlot(slot.id, 'startTime', e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateCustomTimeSlot(slot.id, 'endTime', e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={slot.available}
                                onChange={(e) => updateCustomTimeSlot(slot.id, 'available', e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-600">Available</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCustomTimeSlot(slot.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Generate AI Profile</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}