import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, 
  AlertTriangle, RefreshCw, CheckCircle, Flag, Users, 
  ThumbsUp, ThumbsDown, Zap, Target, Calendar, Filter,
  ArrowUp, ArrowDown, Minus, Star, Award, MapPin
} from 'lucide-react';
import { useEngagementMetrics } from '../hooks/useEngagementMetrics';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useLocalProfiles } from '../hooks/useLocalProfiles';
import { useGeminiAI } from '../hooks/useGeminiAI';

export function EngagementDashboard() {
  const { metrics, loading, flagProfile, resolveFlag, incrementRewriteCount, analyzeProfileSentiment } = useEngagementMetrics();
  const { providers, updateProvider } = useServiceProviders();
  const { profiles, updateProfile } = useLocalProfiles();
  const { generateProfileContent } = useGeminiAI();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'social' | 'sentiment' | 'flagged'>('overview');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [rewritingProfile, setRewritingProfile] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engagement metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics available</h3>
        <p className="text-gray-600">Engagement data will appear here as users interact with profiles.</p>
      </div>
    );
  }

  const handleRewriteProfile = async (profileId: string, contentType: 'bio' | 'social_post') => {
    setRewritingProfile(profileId);
    
    try {
      // Find the profile
      const serviceProvider = providers.find(p => p.id === profileId);
      const localProfile = profiles.find(p => p.id === profileId);
      
      if (serviceProvider) {
        const newContent = await generateProfileContent(
          serviceProvider.fullName,
          serviceProvider.service,
          serviceProvider.yearsExperience,
          serviceProvider.location
        );
        
        if (newContent) {
          updateProvider(profileId, { generatedBio: newContent.bio });
          await analyzeProfileSentiment(profileId, newContent.bio, 'bio');
          incrementRewriteCount(profileId);
        }
      } else if (localProfile) {
        const newContent = await generateProfileContent(
          localProfile.fullName,
          localProfile.skill,
          localProfile.yearsExperience,
          localProfile.location
        );
        
        if (newContent) {
          updateProfile(profileId, { bioAI: newContent.bio });
          await analyzeProfileSentiment(profileId, newContent.bio, 'bio');
          incrementRewriteCount(profileId);
        }
      }
    } catch (error) {
      console.error('Error rewriting profile:', error);
    } finally {
      setRewritingProfile(null);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
      case 'declining':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600 bg-green-100';
    if (score < -0.3) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Engagement Dashboard
            </h2>
            <p className="text-gray-600 text-lg">Monitor performance, sentiment, and user engagement</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-blue-900">{metrics.overallStats.totalViews.toLocaleString()}</div>
              {getTrendIcon(metrics.overallStats.engagementTrend)}
            </div>
            <div className="text-sm text-blue-700">Total Profile Views</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-green-900">
                {(metrics.overallStats.averageSentiment * 100).toFixed(0)}%
              </div>
              {getTrendIcon(metrics.overallStats.sentimentTrend)}
            </div>
            <div className="text-sm text-green-700">Average Sentiment</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{metrics.topPerformingProfiles.length}</div>
            <div className="text-sm text-purple-700">Top Performers</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-red-900">{metrics.overallStats.flaggedProfilesCount}</div>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-sm text-red-700">Flagged Profiles</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'profiles', label: 'Profile Performance', icon: Users },
            { id: 'social', label: 'Social Engagement', icon: Heart },
            { id: 'sentiment', label: 'Sentiment Analysis', icon: TrendingUp },
            { id: 'flagged', label: 'Flagged Content', icon: Flag }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-3 font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <div className="flex space-x-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' }
            ].map(period => (
              <button
                key={period.id}
                onClick={() => setTimeFilter(period.id as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === period.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Profiles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Top Performing Profiles
            </h3>
            <div className="space-y-4">
              {metrics.topPerformingProfiles.slice(0, 5).map((profile, index) => (
                <div key={profile.profileId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{profile.profileName}</p>
                      <p className="text-sm text-gray-600">{profile.totalViews} views • {profile.bookingConversions} conversions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{profile.overallScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {metrics.profileViews
                .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime())
                .slice(0, 5)
                .map(view => (
                  <div key={view.profileId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{view.profileName}</p>
                        <p className="text-sm text-gray-600">
                          {view.lastViewed.toLocaleTimeString()} • {view.viewsToday} views today
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{view.conversionRate.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Week</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Viewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.profileViews.map(view => (
                  <tr key={view.profileId} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          view.profileType === 'service' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{view.profileName}</p>
                          <p className="text-sm text-gray-500 capitalize">{view.profileType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{view.views}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{view.viewsToday}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{view.viewsThisWeek}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        view.conversionRate > 10 ? 'bg-green-100 text-green-800' :
                        view.conversionRate > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {view.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {view.lastViewed.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Social Media Engagement</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.socialEngagement.map(post => (
              <div key={post.postId} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      post.platform === 'instagram' ? 'bg-pink-100 text-pink-600' :
                      post.platform === 'facebook' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {post.platform === 'instagram' ? '📷' : post.platform === 'facebook' ? '👥' : '🐦'}
                    </div>
                    <span className="font-medium text-gray-900 capitalize">{post.platform}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(post.sentimentScore)}`}>
                    {(post.sentimentScore * 100).toFixed(0)}% sentiment
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-red-500 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
                      <Share2 className="w-4 h-4" />
                      <span className="font-semibold">{post.shares}</span>
                    </div>
                    <div className="text-xs text-gray-500">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-green-500 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold">{post.comments}</span>
                    </div>
                    <div className="text-xs text-gray-500">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-purple-500 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{post.reach}</span>
                    </div>
                    <div className="text-xs text-gray-500">Reach</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Engagement: {post.engagementRate.toFixed(1)}%</span>
                  <span>{post.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sentiment' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sentiment Analysis</h3>
          <div className="space-y-4">
            {metrics.sentimentAnalysis.map(analysis => (
              <div key={analysis.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getSentimentColor(analysis.sentimentScore)}`}>
                      {getSentimentIcon(analysis.sentimentLabel)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{analysis.sentimentLabel} Sentiment</p>
                      <p className="text-sm text-gray-600">
                        Score: {(analysis.sentimentScore * 100).toFixed(0)}% • 
                        Confidence: {(analysis.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  {analysis.needsRewrite && (
                    <button
                      onClick={() => handleRewriteProfile(analysis.profileId, analysis.contentType)}
                      disabled={rewritingProfile === analysis.profileId}
                      className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${rewritingProfile === analysis.profileId ? 'animate-spin' : ''}`} />
                      <span>Rewrite</span>
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{analysis.content}</p>
                </div>
                
                {analysis.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {analysis.keywords.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Analyzed: {analysis.analyzedAt.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'flagged' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Flagged Profiles ({metrics.flaggedProfiles.filter(f => !f.isResolved).length})
          </h3>
          
          {metrics.flaggedProfiles.filter(f => !f.isResolved).length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
              <p className="text-gray-600">No profiles are currently flagged for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.flaggedProfiles
                .filter(flag => !flag.isResolved)
                .map(flag => (
                  <div key={flag.profileId} className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Flag className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{flag.profileName}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {flag.flagReason.replace('_', ' ')} • 
                            Flagged {flag.flaggedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRewriteProfile(flag.profileId, 'bio')}
                          disabled={rewritingProfile === flag.profileId}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${rewritingProfile === flag.profileId ? 'animate-spin' : ''}`} />
                          <span>Rewrite</span>
                        </button>
                        <button
                          onClick={() => resolveFlag(flag.profileId)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-500">Sentiment Score</div>
                        <div className={`text-lg font-bold ${
                          flag.sentimentScore > 0 ? 'text-green-600' : 
                          flag.sentimentScore < 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {(flag.sentimentScore * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-500">Rewrite Attempts</div>
                        <div className="text-lg font-bold text-gray-900">{flag.rewriteCount}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-500">Profile Type</div>
                        <div className="text-lg font-bold text-gray-900 capitalize">{flag.profileType}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}