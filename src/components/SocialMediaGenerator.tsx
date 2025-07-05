import React, { useState } from 'react';
import { Share2, Instagram, Facebook, Twitter, Copy, Download, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useSocialMediaAI } from '../hooks/useSocialMediaAI';
import { useServiceProviders } from '../hooks/useServiceProviders';
import { useLocalProfiles } from '../hooks/useLocalProfiles';

interface SocialPost {
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  hashtags: string[];
  imagePrompt?: string;
}

export function SocialMediaGenerator() {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'facebook' | 'twitter'>('instagram');
  const [postType, setPostType] = useState<'promotion' | 'testimonial' | 'tips' | 'showcase'>('promotion');
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null);
  const [copiedText, setCopiedText] = useState<string>('');
  
  const { generateSocialPost, loading } = useSocialMediaAI();
  const { providers } = useServiceProviders();
  const { profiles } = useLocalProfiles();

  // Combine all providers for selection
  const allProviders = [
    ...providers.map(p => ({ id: p.id, name: p.fullName, service: p.service, type: 'advanced' })),
    ...profiles.map(p => ({ id: p.id, name: p.fullName, service: p.skill, type: 'local' }))
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-black' }
  ];

  const postTypes = [
    { id: 'promotion', name: 'Service Promotion', description: 'Promote your services to attract new clients' },
    { id: 'testimonial', name: 'Client Testimonial', description: 'Share positive feedback from satisfied customers' },
    { id: 'tips', name: 'Expert Tips', description: 'Share professional tips and advice' },
    { id: 'showcase', name: 'Work Showcase', description: 'Display your best work and achievements' }
  ];

  const handleGenerate = async () => {
    if (!selectedProvider) return;

    const provider = allProviders.find(p => p.id === selectedProvider);
    if (!provider) return;

    const post = await generateSocialPost({
      providerName: provider.name,
      service: provider.service,
      platform: selectedPlatform,
      postType
    });

    if (post) {
      setGeneratedPost(post);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const downloadPost = () => {
    if (!generatedPost) return;

    const content = `${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPlatform}-post.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">Social Media Post Generator</h2>
            <p className="text-gray-600 text-lg">Create engaging social media content with AI</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
          <h3 className="text-xl font-bold text-gray-900">Post Configuration</h3>
          
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Service Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            >
              <option value="">Choose a provider...</option>
              {allProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.service} ({provider.type})
                </option>
              ))}
            </select>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Platform
            </label>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id as any)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedPlatform === platform.id
                      ? 'border-teal-500 bg-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <platform.icon className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                  <div className="text-sm font-semibold text-gray-900">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Post Type
            </label>
            <div className="space-y-3">
              {postTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setPostType(type.id as any)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    postType === type.id
                      ? 'border-teal-500 bg-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedProvider || loading}
            className="w-full bg-gradient-to-r from-teal-500 to-orange-400 text-white font-bold py-4 px-6 rounded-xl hover:from-teal-600 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Post...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Generate Social Post</span>
              </div>
            )}
          </button>
        </div>

        {/* Generated Post Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Generated Post</h3>
            {generatedPost && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(`${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`)}
                  className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadPost}
                  className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                  title="Download post"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {generatedPost ? (
            <div className="space-y-6">
              {/* Platform Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                {platforms.find(p => p.id === selectedPlatform)?.icon && (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    platforms.find(p => p.id === selectedPlatform)?.color
                  } shadow-lg`}>
                    {React.createElement(platforms.find(p => p.id === selectedPlatform)!.icon, {
                      className: "w-5 h-5 text-white"
                    })}
                  </div>
                )}
                <span className="font-bold text-gray-900 text-lg">
                  {platforms.find(p => p.id === selectedPlatform)?.name} Post
                </span>
              </div>

              {/* Post Content */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
                <div className="whitespace-pre-wrap text-gray-900 mb-4 leading-relaxed">
                  {generatedPost.content}
                </div>
                
                {/* Hashtags */}
                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Suggestion */}
              {generatedPost.imagePrompt && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <ImageIcon className="w-6 h-6 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Suggested Image</h4>
                      <p className="text-sm text-orange-700">{generatedPost.imagePrompt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Copy Success Message */}
              {copiedText && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium">✓ Post copied to clipboard!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-10 h-10 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No post generated yet</h3>
              <p className="text-gray-600">Select a provider and configure your post settings to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-orange-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Social Media Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Best Posting Times</h4>
            <p className="text-sm text-gray-600">Post when your audience is most active - typically 9-11 AM and 7-9 PM</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Engage with Comments</h4>
            <p className="text-sm text-gray-600">Respond to comments quickly to build relationships and boost engagement</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Use Quality Images</h4>
            <p className="text-sm text-gray-600">High-quality visuals get 94% more views than text-only posts</p>
          </div>
        </div>
      </div>
    </div>
  );
}