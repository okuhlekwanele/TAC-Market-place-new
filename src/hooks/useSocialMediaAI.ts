import { useState } from 'react';

interface SocialPostRequest {
  providerName: string;
  service: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  postType: 'promotion' | 'testimonial' | 'tips' | 'showcase';
}

interface SocialPost {
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  hashtags: string[];
  imagePrompt?: string;
}

export function useSocialMediaAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSocialPost = async (request: SocialPostRequest): Promise<SocialPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        // Use fallback content if no API key
        return generateFallbackPost(request);
      }

      const prompt = createPrompt(request);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No content generated from Gemini API');
      }

      // Try to parse JSON response
      try {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          return {
            platform: request.platform,
            content: parsedResponse.content,
            hashtags: parsedResponse.hashtags || [],
            imagePrompt: parsedResponse.imagePrompt
          };
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON, using fallback');
      }

      // Fallback parsing
      return parseGeneratedText(generatedText, request.platform);

    } catch (err) {
      console.error('Social Media AI error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate social post');
      
      // Return fallback content
      return generateFallbackPost(request);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSocialPost,
    loading,
    error
  };
}

function createPrompt(request: SocialPostRequest): string {
  const { providerName, service, platform, postType } = request;
  
  const platformSpecs = {
    instagram: 'Instagram (visual-focused, use emojis, 2200 character limit)',
    facebook: 'Facebook (community-focused, longer form content allowed)',
    twitter: 'Twitter/X (concise, 280 character limit, trending hashtags)'
  };

  const postTypeInstructions = {
    promotion: 'Create a promotional post highlighting the service benefits and encouraging bookings',
    testimonial: 'Write a post featuring a fictional but realistic client testimonial',
    tips: 'Share 3-5 professional tips related to the service',
    showcase: 'Showcase the quality and expertise of the service provider'
  };

  return `Create a ${postType} social media post for ${platform} for ${providerName}, a ${service} professional in South Africa.

Platform: ${platformSpecs[platform]}
Post Type: ${postTypeInstructions[postType]}

Requirements:
- Write engaging, authentic content that sounds natural
- Include relevant South African context where appropriate
- Suggest 5-8 relevant hashtags including local ones
- Keep tone professional but friendly
- Include a call-to-action
- Suggest an image description for visual content

Please respond in this exact JSON format:
{
  "content": "The main post content here",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "imagePrompt": "Description of suggested image/photo"
}`;
}

function parseGeneratedText(text: string, platform: string): SocialPost {
  // Extract content, hashtags, and image prompt from unstructured text
  const lines = text.split('\n').filter(line => line.trim());
  
  let content = '';
  let hashtags: string[] = [];
  let imagePrompt = '';
  
  let currentSection = 'content';
  
  for (const line of lines) {
    if (line.toLowerCase().includes('hashtag')) {
      currentSection = 'hashtags';
      const hashtagMatches = line.match(/#\w+/g);
      if (hashtagMatches) {
        hashtags.push(...hashtagMatches);
      }
    } else if (line.toLowerCase().includes('image') || line.toLowerCase().includes('photo')) {
      currentSection = 'image';
      imagePrompt = line.replace(/^.*?image.*?:/i, '').trim();
    } else if (currentSection === 'content' && !line.startsWith('#')) {
      content += line + '\n';
    }
  }
  
  return {
    platform: platform as any,
    content: content.trim() || generateFallbackContent(platform),
    hashtags: hashtags.length > 0 ? hashtags : generateFallbackHashtags(),
    imagePrompt: imagePrompt || 'Professional photo showcasing your work or service'
  };
}

function generateFallbackPost(request: SocialPostRequest): SocialPost {
  const { providerName, service, platform, postType } = request;
  
  const content = generateFallbackContent(platform, providerName, service, postType);
  const hashtags = generateFallbackHashtags(service);
  const imagePrompt = generateFallbackImagePrompt(service, postType);
  
  return {
    platform: request.platform,
    content,
    hashtags,
    imagePrompt
  };
}

function generateFallbackContent(platform: string, name?: string, service?: string, postType?: string): string {
  if (!name || !service) {
    return "🌟 Quality service you can trust! Contact us today for professional results. #QualityService #Professional";
  }

  const templates = {
    promotion: {
      instagram: `🌟 Looking for reliable ${service.toLowerCase()}? ${name} delivers exceptional results every time! ✨\n\n📞 Book your appointment today\n💯 Quality guaranteed\n🏆 Years of experience\n\n#BookNow #QualityService`,
      facebook: `Hi everyone! 👋\n\nI'm ${name}, your trusted ${service.toLowerCase()} professional. With years of experience serving our community, I'm committed to delivering exceptional results for every client.\n\n🔹 Professional service\n🔹 Competitive pricing\n🔹 Customer satisfaction guaranteed\n\nReady to book? Send me a message or call today!`,
      twitter: `🌟 ${name} - Professional ${service.toLowerCase()} services\n✅ Quality guaranteed\n📞 Book today!\n#${service.replace(/\s+/g, '')} #Professional`
    },
    testimonial: {
      instagram: `💬 "Amazing work by ${name}! Professional, reliable, and exceeded my expectations. Highly recommend!" - Happy Client ⭐⭐⭐⭐⭐\n\n🙏 Thank you for trusting us with your ${service.toLowerCase()} needs!\n\n#HappyClients #Testimonial`,
      facebook: `⭐⭐⭐⭐⭐ Client Review:\n\n"I recently used ${name} for ${service.toLowerCase()} and was thoroughly impressed. Professional, punctual, and the quality of work was outstanding. Will definitely be using their services again!"\n\nThank you for the amazing feedback! Reviews like this make our day. 😊`,
      twitter: `⭐⭐⭐⭐⭐ "Excellent ${service.toLowerCase()} service by ${name}! Professional and reliable." - Happy Client\n\n#CustomerReview #Quality`
    },
    tips: {
      instagram: `💡 Pro Tips for ${service.toLowerCase()}:\n\n1️⃣ Regular maintenance saves money long-term\n2️⃣ Quality materials make a difference\n3️⃣ Don't delay repairs - small issues become big problems\n\n👨‍🔧 Need professional help? I'm here to assist!\n\n#ProTips #Expert`,
      facebook: `🔧 Professional Tips for ${service.toLowerCase()}:\n\n✅ Tip 1: Regular maintenance prevents costly repairs\n✅ Tip 2: Always use quality materials and tools\n✅ Tip 3: Address small issues before they become major problems\n✅ Tip 4: When in doubt, consult a professional\n\nHave questions? Feel free to reach out!`,
      twitter: `💡 ${service} Pro Tips:\n✅ Regular maintenance\n✅ Quality materials\n✅ Address issues early\n\nNeed help? Contact ${name}! #ProTips`
    },
    showcase: {
      instagram: `🏆 Proud to showcase another successful ${service.toLowerCase()} project! \n\n✨ Attention to detail\n💪 Professional execution\n😊 Another satisfied client\n\nYour project could be next! DM for quotes.\n\n#Portfolio #Quality`,
      facebook: `🎯 Project Showcase!\n\nJust completed another fantastic ${service.toLowerCase()} project. It's incredibly rewarding to see the transformation and the smile on our client's face.\n\n🔹 Professional results\n🔹 Attention to detail\n🔹 Customer satisfaction\n\nInterested in similar work? Get in touch for a free quote!`,
      twitter: `🏆 Another successful ${service.toLowerCase()} project completed!\n\n✅ Professional results\n✅ Happy client\n\nYour turn next? #Quality #Professional`
    }
  };

  return templates[postType as keyof typeof templates]?.[platform as keyof typeof templates.promotion] || 
         templates.promotion.instagram;
}

function generateFallbackHashtags(service?: string): string[] {
  const baseHashtags = ['#TACMarketplace', '#SouthAfrica', '#LocalBusiness', '#Professional', '#Quality'];
  
  if (!service) return baseHashtags;
  
  const serviceHashtags: { [key: string]: string[] } = {
    'Plumbing': ['#Plumbing', '#PlumberSA', '#HomeRepairs', '#WaterProblems'],
    'Electrical Work': ['#Electrician', '#ElectricalWork', '#HomeSafety', '#PowerSolutions'],
    'Carpentry': ['#Carpentry', '#Woodwork', '#HomeImprovement', '#CustomFurniture'],
    'Painting': ['#Painting', '#HomeDecor', '#InteriorDesign', '#WallPainting'],
    'Gardening': ['#Gardening', '#Landscaping', '#GreenThumb', '#OutdoorSpaces'],
    'Cleaning': ['#Cleaning', '#CleaningServices', '#HomeClean', '#DeepClean'],
    'Tutoring': ['#Tutoring', '#Education', '#Learning', '#AcademicSupport'],
    'Catering': ['#Catering', '#FoodService', '#Events', '#DeliciousFood'],
    'Photography': ['#Photography', '#PhotoShoot', '#Memories', '#ProfessionalPhotos'],
    'Hairdressing': ['#Hairdressing', '#HairStylist', '#Beauty', '#HairCare'],
    'Makeup': ['#Makeup', '#MakeupArtist', '#Beauty', '#Glam']
  };
  
  const specificHashtags = serviceHashtags[service] || [`#${service.replace(/\s+/g, '')}`];
  
  return [...baseHashtags, ...specificHashtags].slice(0, 8);
}

function generateFallbackImagePrompt(service?: string, postType?: string): string {
  if (!service) return 'Professional photo showcasing quality service';
  
  const prompts = {
    promotion: `Professional photo of ${service.toLowerCase()} work in progress, showing tools and expertise`,
    testimonial: `Before and after photos showing the quality results of ${service.toLowerCase()} work`,
    tips: `Educational image showing ${service.toLowerCase()} tools, techniques, or best practices`,
    showcase: `High-quality photo showcasing completed ${service.toLowerCase()} project with excellent results`
  };
  
  return prompts[postType as keyof typeof prompts] || prompts.promotion;
}