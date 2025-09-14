# Llama2 AI Chatbot Integration Guide

## Overview

The HealthAI platform now features a powerful Llama2-based AI chatbot that replaces the previous blockchain functionality. This integration provides intelligent health assistance, personalized recommendations, and secure data processing for chronic disease management.

## 🧠 AI Architecture

### Llama2 Model Integration
- **Model**: Llama2 7B (configurable)
- **Deployment**: Local (Ollama) or Cloud-based (Replicate/Hugging Face)
- **Response Time**: < 2 seconds average
- **Context Window**: 5 previous exchanges
- **Memory**: 10 conversation history limit

### Key Components

1. **Llama2Chatbot Class** (`config/llama2.config.js`)
   - Handles API communication
   - Manages conversation context
   - Processes user mood detection
   - Generates personalized responses

2. **Chat Integration** (`src/js/script.js`)
   - Real-time chat interface
   - Typing indicators
   - Error handling
   - Response confidence scoring

3. **Health Context Processing**
   - Chronic condition awareness
   - Medication tracking
   - Lifestyle factor analysis
   - Goal-oriented conversations

## 🚀 Setup and Configuration

### Local Setup (Ollama)

1. **Install Ollama**
   ```bash
   # Download from https://ollama.ai/
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull Llama2 Model**
   ```bash
   ollama pull llama2:7b
   ```

3. **Start Ollama Service**
   ```bash
   ollama serve
   # Service will run on http://localhost:11434
   ```

4. **Update Configuration**
   ```javascript
   // In config/llama2.config.js
   const llama2Config = {
     api: {
       local: {
         baseUrl: 'http://localhost:11434',
         model: 'llama2:7b',
         endpoint: '/api/generate'
       }
     }
   };
   ```

### Cloud Setup (Replicate)

1. **Get API Key**
   - Sign up at https://replicate.com/
   - Get your API token from account settings

2. **Update Configuration**
   ```javascript
   // In config/llama2.config.js
   const llama2Config = {
     api: {
       cloud: {
         baseUrl: 'https://api.replicate.com/v1',
         model: 'meta/llama-2-7b-chat',
         apiKey: 'your-api-key-here'
       }
     }
   };
   ```

## 💬 Chat Features

### Intelligent Responses
- **Health-focused**: Specialized in chronic disease management
- **Mood-adaptive**: Adjusts tone based on user emotional state
- **Contextual**: Remembers previous conversations
- **Personalized**: Uses user health data for tailored advice

### Mood Detection
The AI automatically detects user mood from messages:
- **Stressed**: Provides calming, supportive responses
- **Motivated**: Offers encouraging challenges and goals
- **Confused**: Gives clear, step-by-step explanations
- **Discouraged**: Provides empathetic motivation

### Health Context Integration
- Chronic conditions (diabetes, hypertension, etc.)
- Current medications
- Lifestyle factors (exercise, diet, sleep)
- Health goals and progress

## 🔒 Privacy and Security

### Data Protection
- **Local Processing**: Chat history stored locally
- **No External Sharing**: Health data never leaves the platform
- **GDPR Compliant**: Full user control over data
- **Encryption**: All data encrypted at rest

### User Controls
- **Export Chat History**: Download all conversations
- **Clear History**: Remove all chat data
- **Privacy Settings**: Control data usage
- **Delete Account**: Complete data removal

## 📊 Chat Analytics

### Response Quality Metrics
- **Confidence Score**: 0-100% response confidence
- **Source Tracking**: Llama2 vs fallback responses
- **Response Time**: Average processing time
- **User Satisfaction**: Implicit feedback from interactions

### Conversation Statistics
- Total chat sessions
- Average conversation length
- Most common topics
- User engagement patterns

## 🛠️ API Reference

### Core Methods

#### `generateResponse(message, context)`
Generates AI response to user message with health context.

**Parameters:**
- `message` (string): User's input message
- `context` (object): Health and user context data

**Returns:**
- `response` (object): AI response with suggestions and metadata

#### `updateUserContext(context)`
Updates user's health context for personalized responses.

**Parameters:**
- `context` (object): Updated user health information

#### `clearHistory()`
Clears conversation history for privacy.

### Configuration Options

#### Behavior Settings
```javascript
behavior: {
  systemPrompt: "Custom system prompt...",
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0.1,
  presencePenalty: 0.1
}
```

#### Memory Settings
```javascript
memory: {
  maxHistory: 10,        // Keep last 10 exchanges
  contextWindow: 5,      // Use last 5 for context
  userPreferences: true, // Remember preferences
  healthGoals: true      // Remember health goals
}
```

## 🧪 Testing

### Manual Testing
1. Open the application
2. Navigate to the AI Chat section
3. Send test messages to verify responses
4. Check mood detection with different emotional tones
5. Verify health context integration

### Automated Testing
```javascript
// Test chatbot initialization
await llama2Chatbot.initialize();

// Test response generation
const response = await llama2Chatbot.generateResponse(
  "I'm feeling stressed about my diabetes",
  { conditions: ['diabetes'], mood: 'stressed' }
);

console.log(response.message);
```

## 🔧 Troubleshooting

### Common Issues

#### Ollama Connection Failed
- Ensure Ollama is running: `ollama serve`
- Check port availability: `netstat -an | grep 11434`
- Verify model is pulled: `ollama list`

#### Slow Response Times
- Use smaller model: `llama2:7b` instead of `llama2:13b`
- Increase timeout settings
- Check system resources

#### Poor Response Quality
- Adjust temperature (0.1-1.0)
- Modify system prompt
- Update health context
- Check conversation history

### Fallback Mode
When Llama2 is unavailable, the system uses:
- Pre-defined response templates
- Keyword-based matching
- Basic health advice
- Reduced functionality with clear indicators

## 📈 Performance Optimization

### Response Speed
- Use local deployment for faster responses
- Implement response caching
- Optimize context window size
- Use smaller models for basic queries

### Memory Usage
- Regular history cleanup
- Context compression
- Efficient data structures
- Memory leak prevention

## 🔮 Future Enhancements

### Planned Features
- **Voice Integration**: Speech-to-text and text-to-speech
- **Multi-language**: Support for multiple languages
- **Advanced Analytics**: Detailed conversation insights
- **Integration APIs**: Connect with health devices
- **Custom Models**: Fine-tuned models for specific conditions

### Roadmap
- Q1 2024: Voice integration
- Q2 2024: Multi-language support
- Q3 2024: Advanced analytics
- Q4 2024: Custom model training

## 📞 Support

### Getting Help
- Check this documentation first
- Review troubleshooting section
- Test with fallback mode
- Contact development team

### Contributing
- Report issues on GitHub
- Suggest improvements
- Submit pull requests
- Help with documentation

---

**Note**: This integration replaces the previous blockchain functionality with a more practical and user-friendly AI chatbot solution that provides immediate value to users managing chronic diseases.

