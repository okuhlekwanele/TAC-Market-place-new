import { useState, useEffect } from 'react';
import { ServiceProvider } from '../types';
import { LocalProfile } from './useLocalProfiles';

export interface EngagementMetrics {
  profileViews: ProfileViewMetric[];
  socialEngagement: SocialEngagementMetric[];
  sentimentAnalysis: SentimentAnalysisMetric[];
  topPerformingProfiles: TopProfileMetric[];
  flaggedProfiles: FlaggedProfile[];
  overallStats: OverallStats;
}

export interface ProfileViewMetric {
  profileId: string;
  profileName: string;
  profileType: 'service' | 'local';
  views: number;
  uniqueViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  lastViewed: Date;
  conversionRate: number; // percentage of views that led to bookings
}

export interface SocialEngagementMetric {
  postId: string;
  profileId: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  engagementRate: number;
  sentimentScore: number;
  createdAt: Date;
}

export interface SentimentAnalysisMetric {
  id: string;
  profileId: string;
  contentType: 'bio' | 'social_post';
  content: string;
  sentimentScore: number; // -1 to 1 (-1 very negative, 0 neutral, 1 very positive)
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  analyzedAt: Date;
  needsRewrite: boolean;
}

export interface TopProfileMetric {
  profileId: string;
  profileName: string;
  profileType: 'service' | 'local';
  totalViews: number;
  totalEngagement: number;
  averageSentiment: number;
  bookingConversions: number;
  overallScore: number;
}

export interface FlaggedProfile {
  profileId: string;
  profileName: string;
  profileType: 'service' | 'local';
  flagReason: 'negative_sentiment' | 'low_engagement' | 'poor_conversion' | 'manual_flag';
  sentimentScore: number;
  flaggedAt: Date;
  isResolved: boolean;
  rewriteCount: number;
}

export interface OverallStats {
  totalProfiles: number;
  totalViews: number;
  averageSentiment: number;
  flaggedProfilesCount: number;
  topService: string;
  topLocation: string;
  engagementTrend: 'up' | 'down' | 'stable';
  sentimentTrend: 'improving' | 'declining' | 'stable';
}

export function useEngagementMetrics() {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    setLoading(true);
    try {
      // Load from localStorage or generate mock data
      const savedMetrics = localStorage.getItem('engagementMetrics');
      if (savedMetrics) {
        const parsedMetrics = JSON.parse(savedMetrics);
        // Convert date strings back to Date objects
        parsedMetrics.profileViews = parsedMetrics.profileViews?.map((pv: any) => ({
          ...pv,
          lastViewed: new Date(pv.lastViewed)
        })) || [];
        parsedMetrics.socialEngagement = parsedMetrics.socialEngagement?.map((se: any) => ({
          ...se,
          createdAt: new Date(se.createdAt)
        })) || [];
        parsedMetrics.sentimentAnalysis = parsedMetrics.sentimentAnalysis?.map((sa: any) => ({
          ...sa,
          analyzedAt: new Date(sa.analyzedAt)
        })) || [];
        parsedMetrics.flaggedProfiles = parsedMetrics.flaggedProfiles?.map((fp: any) => ({
          ...fp,
          flaggedAt: new Date(fp.flaggedAt)
        })) || [];
        setMetrics(parsedMetrics);
      } else {
        // Generate initial mock data
        const mockMetrics = generateMockMetrics();
        setMetrics(mockMetrics);
        saveMetrics(mockMetrics);
      }
    } catch (err) {
      setError('Failed to load engagement metrics');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveMetrics = (newMetrics: EngagementMetrics) => {
    localStorage.setItem('engagementMetrics', JSON.stringify(newMetrics));
    setMetrics(newMetrics);
  };

  const analyzeSentiment = async (content: string): Promise<SentimentAnalysisMetric> => {
    // Simple sentiment analysis using keyword matching
    // In production, you'd use a proper sentiment analysis API
    const positiveWords = [
      'excellent', 'amazing', 'great', 'wonderful', 'fantastic', 'outstanding', 
      'professional', 'reliable', 'skilled', 'experienced', 'quality', 'best',
      'friendly', 'helpful', 'efficient', 'creative', 'innovative', 'dedicated'
    ];
    
    const negativeWords = [
      'terrible', 'awful', 'bad', 'poor', 'horrible', 'disappointing',
      'unprofessional', 'unreliable', 'inexperienced', 'slow', 'expensive',
      'rude', 'unhelpful', 'lazy', 'careless', 'sloppy', 'overpriced'
    ];

    const words = content.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    const foundKeywords: string[] = [];

    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positiveCount++;
        foundKeywords.push(word);
      } else if (negativeWords.includes(word)) {
        negativeCount++;
        foundKeywords.push(word);
      }
    });

    const totalSentimentWords = positiveCount + negativeCount;
    let sentimentScore = 0;
    let sentimentLabel: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0.5;

    if (totalSentimentWords > 0) {
      sentimentScore = (positiveCount - negativeCount) / Math.max(totalSentimentWords, 1);
      confidence = Math.min(totalSentimentWords / 10, 1); // Higher confidence with more sentiment words
      
      if (sentimentScore > 0.2) {
        sentimentLabel = 'positive';
      } else if (sentimentScore < -0.2) {
        sentimentLabel = 'negative';
      }
    }

    return {
      id: Date.now().toString(),
      profileId: '',
      contentType: 'bio',
      content,
      sentimentScore,
      sentimentLabel,
      confidence,
      keywords: foundKeywords,
      analyzedAt: new Date(),
      needsRewrite: sentimentLabel === 'negative' && confidence > 0.6
    };
  };

  const flagProfile = (profileId: string, profileName: string, profileType: 'service' | 'local', reason: FlaggedProfile['flagReason'], sentimentScore: number = 0) => {
    if (!metrics) return;

    const newFlag: FlaggedProfile = {
      profileId,
      profileName,
      profileType,
      flagReason: reason,
      sentimentScore,
      flaggedAt: new Date(),
      isResolved: false,
      rewriteCount: 0
    };

    const updatedMetrics = {
      ...metrics,
      flaggedProfiles: [...metrics.flaggedProfiles, newFlag],
      overallStats: {
        ...metrics.overallStats,
        flaggedProfilesCount: metrics.overallStats.flaggedProfilesCount + 1
      }
    };

    saveMetrics(updatedMetrics);
  };

  const resolveFlag = (profileId: string) => {
    if (!metrics) return;

    const updatedMetrics = {
      ...metrics,
      flaggedProfiles: metrics.flaggedProfiles.map(flag =>
        flag.profileId === profileId ? { ...flag, isResolved: true } : flag
      ),
      overallStats: {
        ...metrics.overallStats,
        flaggedProfilesCount: Math.max(0, metrics.overallStats.flaggedProfilesCount - 1)
      }
    };

    saveMetrics(updatedMetrics);
  };

  const incrementRewriteCount = (profileId: string) => {
    if (!metrics) return;

    const updatedMetrics = {
      ...metrics,
      flaggedProfiles: metrics.flaggedProfiles.map(flag =>
        flag.profileId === profileId ? { ...flag, rewriteCount: flag.rewriteCount + 1 } : flag
      )
    };

    saveMetrics(updatedMetrics);
  };

  const trackProfileView = (profileId: string, profileName: string, profileType: 'service' | 'local') => {
    if (!metrics) return;

    const existingView = metrics.profileViews.find(pv => pv.profileId === profileId);
    const now = new Date();

    if (existingView) {
      const updatedView = {
        ...existingView,
        views: existingView.views + 1,
        lastViewed: now,
        viewsToday: isToday(existingView.lastViewed) ? existingView.viewsToday + 1 : 1,
        viewsThisWeek: isThisWeek(existingView.lastViewed) ? existingView.viewsThisWeek + 1 : 1,
        viewsThisMonth: isThisMonth(existingView.lastViewed) ? existingView.viewsThisMonth + 1 : 1
      };

      const updatedMetrics = {
        ...metrics,
        profileViews: metrics.profileViews.map(pv => 
          pv.profileId === profileId ? updatedView : pv
        ),
        overallStats: {
          ...metrics.overallStats,
          totalViews: metrics.overallStats.totalViews + 1
        }
      };

      saveMetrics(updatedMetrics);
    } else {
      const newView: ProfileViewMetric = {
        profileId,
        profileName,
        profileType,
        views: 1,
        uniqueViews: 1,
        viewsToday: 1,
        viewsThisWeek: 1,
        viewsThisMonth: 1,
        lastViewed: now,
        conversionRate: 0
      };

      const updatedMetrics = {
        ...metrics,
        profileViews: [...metrics.profileViews, newView],
        overallStats: {
          ...metrics.overallStats,
          totalViews: metrics.overallStats.totalViews + 1
        }
      };

      saveMetrics(updatedMetrics);
    }
  };

  const analyzeProfileSentiment = async (profileId: string, content: string, contentType: 'bio' | 'social_post') => {
    const analysis = await analyzeSentiment(content);
    analysis.profileId = profileId;
    analysis.contentType = contentType;

    if (!metrics) return analysis;

    const updatedMetrics = {
      ...metrics,
      sentimentAnalysis: [...metrics.sentimentAnalysis.filter(sa => 
        !(sa.profileId === profileId && sa.contentType === contentType)
      ), analysis]
    };

    // Auto-flag if sentiment is very negative
    if (analysis.sentimentLabel === 'negative' && analysis.confidence > 0.7) {
      const existingFlag = metrics.flaggedProfiles.find(fp => fp.profileId === profileId);
      if (!existingFlag) {
        flagProfile(profileId, 'Profile', 'service', 'negative_sentiment', analysis.sentimentScore);
      }
    }

    saveMetrics(updatedMetrics);
    return analysis;
  };

  return {
    metrics,
    loading,
    error,
    analyzeSentiment,
    flagProfile,
    resolveFlag,
    incrementRewriteCount,
    trackProfileView,
    analyzeProfileSentiment,
    refreshMetrics: loadMetrics
  };
}

// Helper functions
function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisWeek(date: Date): boolean {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
}

function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function generateMockMetrics(): EngagementMetrics {
  const now = new Date();
  
  return {
    profileViews: [
      {
        profileId: 'mock-001',
        profileName: 'Thabo Mthembu',
        profileType: 'service',
        views: 156,
        uniqueViews: 134,
        viewsToday: 12,
        viewsThisWeek: 45,
        viewsThisMonth: 89,
        lastViewed: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        conversionRate: 8.5
      },
      {
        profileId: 'mock-002',
        profileName: 'Nomsa Dlamini',
        profileType: 'service',
        views: 203,
        uniqueViews: 187,
        viewsToday: 18,
        viewsThisWeek: 67,
        viewsThisMonth: 123,
        lastViewed: new Date(now.getTime() - 30 * 60 * 1000),
        conversionRate: 12.3
      },
      {
        profileId: 'local-001',
        profileName: 'Zanele Khumalo',
        profileType: 'local',
        views: 89,
        uniqueViews: 76,
        viewsToday: 5,
        viewsThisWeek: 23,
        viewsThisMonth: 54,
        lastViewed: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        conversionRate: 6.7
      }
    ],
    socialEngagement: [
      {
        postId: 'post-001',
        profileId: 'mock-001',
        platform: 'instagram',
        content: 'Just completed another successful plumbing project! 🔧 Professional results every time.',
        likes: 45,
        shares: 8,
        comments: 12,
        reach: 234,
        engagementRate: 27.8,
        sentimentScore: 0.8,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },
      {
        postId: 'post-002',
        profileId: 'mock-002',
        platform: 'facebook',
        content: 'Beautiful hair transformation today! Love creating stunning looks for my clients.',
        likes: 67,
        shares: 15,
        comments: 23,
        reach: 456,
        engagementRate: 23.0,
        sentimentScore: 0.9,
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
      }
    ],
    sentimentAnalysis: [
      {
        id: 'sentiment-001',
        profileId: 'mock-001',
        contentType: 'bio',
        content: 'Thabo is a skilled plumber with 8 years of experience serving clients in Khayelitsha and surrounding areas.',
        sentimentScore: 0.6,
        sentimentLabel: 'positive',
        confidence: 0.8,
        keywords: ['skilled', 'experience'],
        analyzedAt: new Date(now.getTime() - 60 * 60 * 1000),
        needsRewrite: false
      },
      {
        id: 'sentiment-002',
        profileId: 'mock-003',
        contentType: 'bio',
        content: 'Unreliable service provider with poor quality work and overpriced rates.',
        sentimentScore: -0.8,
        sentimentLabel: 'negative',
        confidence: 0.9,
        keywords: ['unreliable', 'poor', 'overpriced'],
        analyzedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        needsRewrite: true
      }
    ],
    topPerformingProfiles: [
      {
        profileId: 'mock-002',
        profileName: 'Nomsa Dlamini',
        profileType: 'service',
        totalViews: 203,
        totalEngagement: 105,
        averageSentiment: 0.9,
        bookingConversions: 25,
        overallScore: 92.5
      },
      {
        profileId: 'mock-001',
        profileName: 'Thabo Mthembu',
        profileType: 'service',
        totalViews: 156,
        totalEngagement: 65,
        averageSentiment: 0.6,
        bookingConversions: 13,
        overallScore: 78.3
      }
    ],
    flaggedProfiles: [
      {
        profileId: 'mock-003',
        profileName: 'Ahmed Hassan',
        profileType: 'service',
        flagReason: 'negative_sentiment',
        sentimentScore: -0.8,
        flaggedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        isResolved: false,
        rewriteCount: 0
      }
    ],
    overallStats: {
      totalProfiles: 13,
      totalViews: 1247,
      averageSentiment: 0.4,
      flaggedProfilesCount: 1,
      topService: 'Hair Styling',
      topLocation: 'Cape Town',
      engagementTrend: 'up',
      sentimentTrend: 'stable'
    }
  };
}