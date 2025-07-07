import { useState, useEffect } from 'react';
import { useGeminiAI } from './useGeminiAI';
import { useGoogleSheets } from './useGoogleSheets';
import { mockLocalProfiles } from '../data/mockProfiles';

export interface LocalProfile {
  id: string;
  fullName: string;
  skill: string;
  yearsExperience: number;
  location: string;
  contact: string;
  availability: string;
  profileImage?: string;
  status: string;
  bioAI: string;
  suggestedPriceZAR: number;
  createdAt: Date;
  flexibleHours?: FlexibleHour[];
  portfolioImages?: string[];
  customerReviews?: Review[];
}

interface FlexibleHour {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

interface LocalFormData {
  fullName: string;
  skill: string;
  yearsExperience: number;
  location: string;
  contact: string;
  availability: string;
  profileImage?: File;
  portfolioImages?: File[];
  customerReviews?: Review[];
  flexibleHours?: FlexibleHour[];
}

export function useLocalProfiles() {
  const [profiles, setProfiles] = useState<LocalProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { generateProfileContent } = useGeminiAI();
  const { syncLocalProfileToSheets, signIn, isSignedIn, isGoogleSheetsConfigured } = useGoogleSheets();

  useEffect(() => {
    // Load profiles from localStorage
    const savedProfiles = localStorage.getItem('localProfiles');
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
      setProfiles(parsedProfiles);
    } else {
      // Initialize with mock data if no saved data exists
      setProfiles(mockLocalProfiles);
      localStorage.setItem('localProfiles', JSON.stringify(mockLocalProfiles));
    }
  }, []);

  const saveProfiles = (newProfiles: LocalProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('localProfiles', JSON.stringify(newProfiles));
  };

  const submitProfile = async (formData: LocalFormData): Promise<void> => {
    setLoading(true);
    
    try {
      // Convert image to base64 if provided
      let profileImageBase64 = '';
      if (formData.profileImage) {
        profileImageBase64 = await convertFileToBase64(formData.profileImage);
      }

      // Convert portfolio images to base64
      const portfolioImageBase64: string[] = [];
      if (formData.portfolioImages) {
        for (const file of formData.portfolioImages) {
          const base64 = await convertFileToBase64(file);
          portfolioImageBase64.push(base64);
        }
      }
      
      const newProfile: LocalProfile = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        skill: formData.skill,
        yearsExperience: formData.yearsExperience,
        location: formData.location,
        contact: formData.contact,
        availability: formData.availability,
        profileImage: profileImageBase64,
        status: 'Pending Bio',
        bioAI: '',
        suggestedPriceZAR: 0,
        createdAt: new Date(),
        flexibleHours: formData.flexibleHours || [],
        portfolioImages: portfolioImageBase64,
        customerReviews: formData.customerReviews || []
      };
      
      // Save profile first
      const updatedProfiles = [...profiles, newProfile];
      saveProfiles(updatedProfiles);
      
      // Try to sync to Google Sheets (gracefully handle auth failures)
      try {
        if (isSignedIn) {
          await syncLocalProfileToSheets(newProfile);
        } else {
          console.log('User not signed in to Google, skipping Sheets sync');
        }
      } catch (sheetsError) {
        console.warn('Google Sheets sync failed, but profile was saved locally:', sheetsError);
        // Don't throw error - profile is still saved locally
      }
      
      // Generate AI content in background
      generateAIContent(newProfile.id, formData);
      
    } catch (error) {
      console.error('Error submitting profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async (profileId: string, formData: LocalFormData) => {
    try {
      const aiResponse = await generateProfileContent(
        formData.fullName,
        formData.skill,
        formData.yearsExperience,
        formData.location
      );

      if (aiResponse) {
        const updatedProfile = {
          bioAI: aiResponse.bio,
          suggestedPriceZAR: aiResponse.price,
          status: 'Ready'
        };

        updateProfile(profileId, updatedProfile);

        // Try to sync updated profile to Google Sheets
        const profile = profiles.find(p => p.id === profileId);
        if (profile && isSignedIn) {
          try {
            await syncLocalProfileToSheets({
              ...profile,
              ...updatedProfile
            });
          } catch (sheetsError) {
            console.warn('Google Sheets sync failed for updated profile:', sheetsError);
          }
        }
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      // Update status to indicate AI generation failed
      updateProfile(profileId, { status: 'AI Generation Failed' });
    }
  };

  const updateProfile = (id: string, updates: Partial<LocalProfile>) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === id) {
        const updatedProfile = { ...profile, ...updates };
        // Try to sync to Google Sheets when profile is updated (if signed in)
        if (isSignedIn) {
          syncLocalProfileToSheets(updatedProfile).catch(error => {
            console.warn('Google Sheets sync failed for profile update:', error);
          });
        }
        return updatedProfile;
      }
      return profile;
    });
    saveProfiles(updatedProfiles);
  };

  const deleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    saveProfiles(updatedProfiles);
  };

  const regenerateAIContent = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    setLoading(true);
    try {
      const aiResponse = await generateProfileContent(
        profile.fullName,
        profile.skill,
        profile.yearsExperience,
        profile.location
      );

      if (aiResponse) {
        const updates = {
          bioAI: aiResponse.bio,
          suggestedPriceZAR: aiResponse.price,
          status: 'Ready'
        };
        updateProfile(profileId, updates);
      }
    } catch (error) {
      console.error('Error regenerating AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToGoogleSheets = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Failed to connect to Google Sheets:', error);
      throw error;
    }
  };

  return {
    profiles,
    loading,
    submitProfile,
    updateProfile,
    deleteProfile,
    regenerateAIContent,
    connectToGoogleSheets,
    isSignedIn,
    isGoogleSheetsAvailable: isGoogleSheetsConfigured()
  };
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}