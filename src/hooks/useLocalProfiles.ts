import { useState, useEffect } from 'react';

export interface FlexibleHour {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface LocalProfile {
  id: string;
  fullName: string;
  skill: string;
  yearsExperience: number;
  location: string;
  contact: string;
  availability: FlexibleHour[];
  status: string;
  bioAI?: string;
  suggestedPriceZAR: number;
  profileImage?: string;
}

export function useLocalProfiles() {
  const [profiles, setProfiles] = useState<LocalProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('localProfiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Error loading profiles from localStorage:', error);
      }
    }
  }, []);

  // Save profiles to localStorage whenever profiles change
  useEffect(() => {
    localStorage.setItem('localProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const updateProfile = async (id: string, updates: Partial<LocalProfile>) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === id ? { ...profile, ...updates } : profile
      )
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  const regenerateAIContent = async (profileId: string) => {
    setLoading(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        const newBio = `Professional ${profile.skill} with ${profile.yearsExperience} years of experience in ${profile.location}. Skilled in delivering high-quality services with attention to detail and customer satisfaction.`;
        
        await updateProfile(profileId, { 
          bioAI: newBio,
          status: 'Ready'
        });
      }
    } catch (error) {
      console.error('Error regenerating AI content:', error);
      await updateProfile(profileId, { status: 'AI Generation Failed' });
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    updateProfile,
    deleteProfile,
    regenerateAIContent,
    loading
  };
}