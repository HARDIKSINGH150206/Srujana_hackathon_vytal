// Llama2 Chatbot Configuration
// This file contains configuration for Llama2 AI chatbot integration

export const llama2Config = {
  // Llama2 API Configuration
  api: {
    // For local Llama2 deployment (using Ollama or similar)
    local: {
      baseUrl: 'http://localhost:11434', // Default Ollama port
      model: 'llama2:7b', // Llama2 7B model
      endpoint: '/api/generate'
    },
    // For cloud-based Llama2 API (if using services like Replicate, Hugging Face, etc.)
    cloud: {
      baseUrl: 'https://api.replicate.com/v1',
      model: 'meta/llama-2-7b-chat',
      apiKey: process.env.REPLICATE_API_TOKEN || 'your-api-key-here'
    }
  },
  
  // Chatbot Behavior Configuration
  behavior: {
    systemPrompt: `You are HealthAI, an advanced AI health coach specializing in chronic disease management. 
    Your role is to provide personalized, empathetic, and evidence-based health guidance.
    
    Key capabilities:
    - Analyze health data and provide insights
    - Offer personalized lifestyle recommendations
    - Provide medication adherence support
    - Answer health-related questions
    - Motivate users in their health journey
    - Adapt communication style based on user mood and context
    
    Guidelines:
    - Always prioritize user safety and recommend consulting healthcare providers for medical decisions
    - Be empathetic and supportive, especially for users dealing with chronic conditions
    - Provide actionable, personalized advice based on user data
    - Use encouraging language and celebrate small wins
    - Maintain privacy and confidentiality of health information
    - Adapt your tone based on user mood (stressed, motivated, confused, discouraged)`,
    
    maxTokens: 500,
    temperature: 0.7, // Balance between creativity and consistency
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1
  },
  
  // Health Context Configuration
  healthContext: {
    conditions: [
      'diabetes', 'hypertension', 'heart_disease', 'asthma', 'arthritis',
      'depression', 'anxiety', 'obesity', 'high_cholesterol', 'chronic_kidney_disease'
    ],
    medications: [
      'metformin', 'lisinopril', 'atorvastatin', 'insulin', 'albuterol',
      'ibuprofen', 'acetaminophen', 'aspirin', 'warfarin', 'levothyroxine'
    ],
    lifestyleFactors: [
      'exercise', 'diet', 'sleep', 'stress', 'smoking', 'alcohol',
      'meditation', 'yoga', 'walking', 'strength_training'
    ]
  },
  
  // Response Templates
  templates: {
    greeting: [
      "Hello! I'm HealthAI, your personal health coach. How can I help you today?",
      "Hi there! I'm here to support you on your health journey. What would you like to discuss?",
      "Welcome back! I'm ready to help you with your health goals. What's on your mind?"
    ],
    
    encouragement: [
      "You're doing great! Every small step counts in your health journey.",
      "I'm proud of your progress! Keep up the excellent work.",
      "Remember, you're stronger than you think. You've got this!"
    ],
    
    medicalDisclaimer: "Please remember that I'm an AI assistant and cannot replace professional medical advice. Always consult with your healthcare provider for medical decisions.",
    
    error: "I'm having trouble processing your request right now. Please try again or rephrase your question."
  },
  
  // Mood Detection Keywords
  moodDetection: {
    stressed: ['stressed', 'worried', 'anxious', 'overwhelmed', 'pressure', 'tension'],
    motivated: ['motivated', 'excited', 'ready', 'determined', 'focused', 'energized'],
    confused: ['confused', 'don\'t understand', 'help', 'unclear', 'lost', 'unsure'],
    discouraged: ['discouraged', 'frustrated', 'giving up', 'hopeless', 'defeated', 'tired']
  },
  
  // Conversation Memory
  memory: {
    maxHistory: 10, // Keep last 10 exchanges
    contextWindow: 5, // Use last 5 exchanges for context
    userPreferences: true, // Remember user preferences
    healthGoals: true // Remember health goals
  }
};

// Llama2 Chatbot Service Class
export class Llama2Chatbot {
  constructor(config = llama2Config) {
    this.config = config;
    this.conversationHistory = [];
    this.userContext = {
      mood: 'neutral',
      preferences: {},
      healthGoals: [],
      currentConditions: [],
      medications: []
    };
  }

  // Initialize the chatbot
  async initialize() {
    try {
      // Test connection to Llama2 API
      const response = await this.testConnection();
      if (response.success) {
        console.log('Llama2 chatbot initialized successfully');
        return true;
      } else {
        console.warn('Llama2 API not available, using fallback responses');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize Llama2 chatbot:', error);
      return false;
    }
  }

  // Test connection to Llama2 API
  async testConnection() {
    try {
      const testMessage = {
        model: this.config.api.local.model,
        prompt: "Hello, are you working?",
        stream: false
      };

      const response = await fetch(`${this.config.api.local.baseUrl}${this.config.api.local.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessage)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'API not available' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate response using Llama2
  async generateResponse(userMessage, context = {}) {
    try {
      // Detect user mood
      const mood = this.detectMood(userMessage);
      this.userContext.mood = mood;

      // Build conversation context
      const conversationContext = this.buildContext(userMessage, context);

      // Prepare prompt for Llama2
      const prompt = this.buildPrompt(userMessage, conversationContext);

      // Call Llama2 API
      const response = await this.callLlama2API(prompt);

      // Process and store response
      const processedResponse = this.processResponse(response, userMessage);

      // Update conversation history
      this.updateConversationHistory(userMessage, processedResponse);

      return processedResponse;
    } catch (error) {
      console.error('Error generating Llama2 response:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  // Detect user mood from message
  detectMood(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(this.config.moodDetection)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return mood;
      }
    }
    
    return 'neutral';
  }

  // Build conversation context
  buildContext(userMessage, additionalContext) {
    const recentHistory = this.conversationHistory.slice(-this.config.memory.contextWindow);
    const healthContext = this.buildHealthContext(additionalContext);
    
    return {
      history: recentHistory,
      mood: this.userContext.mood,
      healthContext: healthContext,
      userPreferences: this.userContext.preferences
    };
  }

  // Build health-specific context
  buildHealthContext(context) {
    return {
      conditions: context.conditions || this.userContext.currentConditions,
      medications: context.medications || this.userContext.medications,
      recentMetrics: context.recentMetrics || {},
      goals: context.goals || this.userContext.healthGoals
    };
  }

  // Build prompt for Llama2
  buildPrompt(userMessage, context) {
    let prompt = this.config.behavior.systemPrompt + '\n\n';
    
    // Add conversation history
    if (context.history.length > 0) {
      prompt += 'Recent conversation:\n';
      context.history.forEach(exchange => {
        prompt += `User: ${exchange.user}\nAssistant: ${exchange.assistant}\n\n`;
      });
    }
    
    // Add health context
    if (context.healthContext.conditions.length > 0) {
      prompt += `User's health conditions: ${context.healthContext.conditions.join(', ')}\n`;
    }
    
    if (context.healthContext.medications.length > 0) {
      prompt += `User's medications: ${context.healthContext.medications.join(', ')}\n`;
    }
    
    // Add mood context
    prompt += `User's current mood: ${context.mood}\n`;
    
    // Add current message
    prompt += `Current user message: ${userMessage}\n\n`;
    prompt += 'Please respond as HealthAI, providing helpful, personalized health guidance:';
    
    return prompt;
  }

  // Call Llama2 API
  async callLlama2API(prompt) {
    const requestBody = {
      model: this.config.api.local.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: this.config.behavior.temperature,
        top_p: this.config.behavior.topP,
        max_tokens: this.config.behavior.maxTokens
      }
    };

    const response = await fetch(`${this.config.api.local.baseUrl}${this.config.api.local.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Llama2 API error: ${response.status}`);
    }

    return await response.json();
  }

  // Process Llama2 response
  processResponse(apiResponse, userMessage) {
    const responseText = apiResponse.response || apiResponse.text || 'I apologize, but I had trouble processing your request.';
    
    return {
      message: responseText.trim(),
      mood: this.userContext.mood,
      suggestions: this.generateSuggestions(userMessage, responseText),
      confidence: 0.9, // High confidence for Llama2 responses
      timestamp: new Date().toISOString(),
      source: 'llama2'
    };
  }

  // Generate contextual suggestions
  generateSuggestions(userMessage, response) {
    const suggestions = [];
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      suggestions.push('Track your exercise', 'Set fitness goals', 'Find workout buddies');
    } else if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
      suggestions.push('Log your meals', 'Plan healthy recipes', 'Track nutrition');
    } else if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      suggestions.push('Set medication reminders', 'Track adherence', 'Review side effects');
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      suggestions.push('Try meditation', 'Practice deep breathing', 'Schedule relaxation time');
    }
    
    return suggestions;
  }

  // Update conversation history
  updateConversationHistory(userMessage, response) {
    this.conversationHistory.push({
      user: userMessage,
      assistant: response.message,
      timestamp: new Date().toISOString(),
      mood: this.userContext.mood
    });
    
    // Keep only recent history
    if (this.conversationHistory.length > this.config.memory.maxHistory) {
      this.conversationHistory = this.conversationHistory.slice(-this.config.memory.maxHistory);
    }
  }

  // Get fallback response when Llama2 is unavailable
  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        message: this.config.templates.greeting[Math.floor(Math.random() * this.config.templates.greeting.length)],
        mood: 'neutral',
        suggestions: ['Tell me about your health goals', 'How are you feeling today?'],
        confidence: 0.7,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      };
    }
    
    if (lowerMessage.includes('blood sugar') || lowerMessage.includes('glucose')) {
      return {
        message: "Blood sugar management is crucial for your health. I recommend monitoring your levels regularly, eating balanced meals, and staying active. Always consult your healthcare provider for personalized advice.",
        mood: 'motivated',
        suggestions: ['Log your blood sugar readings', 'Plan balanced meals', 'Schedule regular checkups'],
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      };
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return {
        message: "Regular exercise is one of the best things you can do for your health! Start with activities you enjoy and gradually increase intensity. Even 30 minutes of moderate activity daily can make a big difference.",
        mood: 'motivated',
        suggestions: ['Start with walking', 'Try strength training', 'Find an exercise buddy'],
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      };
    }
    
    // Default response
    return {
      message: "I'm here to help with your health journey! Could you tell me more about what you'd like to discuss? I can help with exercise, nutrition, medication management, and general wellness.",
      mood: 'neutral',
      suggestions: ['Share your health goals', 'Ask about nutrition', 'Discuss exercise plans'],
      confidence: 0.6,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
  }

  // Update user context
  updateUserContext(context) {
    this.userContext = { ...this.userContext, ...context };
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }
}

// Export default instance
export const llama2Chatbot = new Llama2Chatbot();

