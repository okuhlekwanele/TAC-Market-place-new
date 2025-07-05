import { useState } from 'react';

interface GeminiResponse {
  bio: string;
  price: number;
}

export function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProfileContent = async (
    fullName: string,
    skill: string,
    yearsExperience: number,
    location: string
  ): Promise<GeminiResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const prompt = `You are helping a skilled township freelancer write a short professional bio and estimate a fair starting price. Their name is ${fullName}, they are a ${skill} with ${yearsExperience} years of experience in ${location}. Write a warm, confident, 1–2 sentence bio. Then suggest a fair starting price in ZAR (South African Rand). 

Please respond in this exact JSON format:
{
  "bio": "Professional bio here",
  "price": 250
}`;

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
            bio: parsedResponse.bio,
            price: parsedResponse.price
          };
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON, using fallback parsing');
      }

      // Fallback parsing if JSON format fails
      const bioMatch = generatedText.match(/bio["\s]*:["\s]*([^"]+)/i);
      const priceMatch = generatedText.match(/price["\s]*:["\s]*(\d+)/i);

      return {
        bio: bioMatch ? bioMatch[1] : generateFallbackBio(fullName, skill, yearsExperience, location),
        price: priceMatch ? parseInt(priceMatch[1]) : generateFallbackPrice(skill, yearsExperience)
      };

    } catch (err) {
      console.error('Gemini API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      
      // Return fallback content
      return {
        bio: generateFallbackBio(fullName, skill, yearsExperience, location),
        price: generateFallbackPrice(skill, yearsExperience)
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    generateProfileContent,
    loading,
    error
  };
}

function generateFallbackBio(fullName: string, skill: string, yearsExperience: number, location: string): string {
  const templates = [
    `${fullName} is a skilled ${skill.toLowerCase()} with ${yearsExperience} years of experience serving clients in ${location}. Known for delivering high-quality work and exceptional customer service.`,
    `With ${yearsExperience} years of hands-on experience, ${fullName} specializes in ${skill.toLowerCase()} and has built a reputation for reliability and expertise in ${location}.`,
    `${fullName} brings ${yearsExperience} years of professional ${skill.toLowerCase()} experience to every project. Based in ${location}, they are committed to exceeding client expectations.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateFallbackPrice(skill: string, yearsExperience: number): number {
  const basePrices: { [key: string]: number } = {
    'Hairdressing': 150,
    'Plumbing': 300,
    'Tutoring': 180,
    'Makeup': 200,
    'Cleaning': 120,
    'Catering': 250,
    'Photography': 400,
    'Sewing': 180,
    'Crochet': 150,
    'Electrical': 350,
    'Other': 200
  };
  
  const basePrice = basePrices[skill] || 200;
  const experienceMultiplier = 1 + (yearsExperience * 0.1);
  
  return Math.round(basePrice * experienceMultiplier);
}