// ========================================
// FitLife Bulgaria — Google Gemini Live AI Engine
// ========================================

const GEMINI_CONFIG_KEY = 'fitlife-gemini-key';

const GeminiAIService = {
  // Default endpoint and model
  model: 'gemini-1.5-flash',
  
  getApiKey() {
    return localStorage.getItem(GEMINI_CONFIG_KEY) || '';
  },

  setApiKey(key) {
    localStorage.setItem(GEMINI_CONFIG_KEY, key.trim());
  },

  hasApiKey() {
    const k = this.getApiKey();
    return k && k.length > 10;
  },

  // ── System Prompt for Elite Sports & Nutrition Coaching ──
  getSystemInstruction() {
    const isBg = getLang() === 'bg';
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() || {} : {};
    const profile = user.profile || {};
    
    return `You are FitLife AI Coach, an elite certified Sports Scientist, Olympic Strength Coach, and Master Clinical Nutritionist.
User Profile:
- Name: ${user.fullName || 'Athlete'}
- Goal: ${profile.goal || 'Hypertrophy & Strength'}
- Weight: ${profile.weight || '78'} kg
- Height: ${profile.height || '180'} cm
- Gender: ${profile.gender || 'Male'}
- Language: ${isBg ? 'Bulgarian (Български)' : 'English'}

Rules:
1. Respond in the user's selected language (${isBg ? 'Bulgarian' : 'English'}).
2. Be highly encouraging, scientifically accurate, concise, and structured with emojis and markdown bold points.
3. Keep responses practical and actionable for fitness, progressive overload, biomechanics, recovery, and macronutrients.`;
  },

  // ── Live Conversational AI Query (Gemini REST API) ──
  async askLiveGemini(query, chatHistory = []) {
    const isBg = getLang() === 'bg';
    const apiKey = this.getApiKey();

    if (!this.hasApiKey()) {
      // Fallback gracefully to our built-in offline sports science engine
      if (typeof AICoachService !== 'undefined' && AICoachService.askCoach) {
        return AICoachService.askCoach(query);
      }
      return isBg 
        ? '💡 **FitLife AI:** За най-добри резултати тренирай 4 дни в седмицата с прогресивно натоварване и приемай 2г протеин на килограм!' 
        : '💡 **FitLife AI:** For optimal progress, train 4 days/week with progressive overload and consume 2.0g of protein per kg of bodyweight!';
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;
      
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${this.getSystemInstruction()}\n\nUser Question: ${query}` }]
        }
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) return answer;
      throw new Error('Empty Gemini response');
    } catch (err) {
      console.warn('⚠️ Gemini Live API request failed, using intelligent fallback:', err);
      if (typeof AICoachService !== 'undefined' && AICoachService.askCoach) {
        return AICoachService.askCoach(query);
      }
      return isBg 
        ? '🤖 **FitLife AI Coach:** Тренирай последователно, следи съня и прогреса си!'
        : '🤖 **FitLife AI Coach:** Consistency in training and hitting your daily protein target will yield 90% of your results!';
    }
  },

  // ── Multimodal Vision Image Food Analyzer ──
  async analyzeFoodImageWithGemini(base64Image) {
    const apiKey = this.getApiKey();
    if (!this.hasApiKey() || !base64Image) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

      const prompt = `Identify this food plate in detail. Return a valid raw JSON object with this exact schema:
{
  "nameEn": "Dish name in English",
  "nameBg": "Dish name in Bulgarian",
  "calories": 520,
  "protein": 45,
  "carbs": 55,
  "fats": 12,
  "score": 95,
  "ingredients": [
    {"name": "Ingredient Name (amount)", "cal": 220, "protein": 35, "carbs": 0, "fats": 4}
  ],
  "aiFeedbackEn": "Short 1-sentence nutrition tip",
  "aiFeedbackBg": "Short 1-sentence nutrition tip in Bulgarian"
}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
            ]
          }]
        })
      });

      if (!response.ok) return null;
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('⚠️ Gemini Vision API exception:', err);
    }
    return null;
  }
};
