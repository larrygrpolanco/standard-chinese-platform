// src/lib/apiClient.js
import { OPENAI_API_KEY, DEEPSEEK_API_KEY, GOOGLE_API_KEY } from '$env/static/private';

// API provider configurations
const apiProviders = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: OPENAI_API_KEY,
    defaultModel: 'gpt-4o-mini-2024-07-18'
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: DEEPSEEK_API_KEY,
    defaultModel: 'deepseek-chat'
  },
  google: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    apiKey: GOOGLE_API_KEY, // Accessing from imported env variable
    defaultModel: 'gemini-3-flash-preview'
  }
};

// Model mapping from OpenAI to DeepSeek
const modelMapping = {
	'gpt-4o-mini-2024-07-18': 'deepseek-chat',
	'o3-mini-2025-01-31': 'deepseek-reasoner'
};

/**
 * Creates an API client for the specified provider
 * @param {string} provider - 'openai' or 'deepseek'
 * @returns API client functions
 */
export function createApiClient(provider = 'openai') {
  if (!apiProviders[provider]) {
    throw new Error(`Unsupported API provider: ${provider}`);
  }
  
  const config = apiProviders[provider];
  
  return {
    provider,
    
    /**
     * Fetches a completion from the selected API
     * @param {Array} messages - Array of message objects
     * @param {Object} options - Options like temperature, model, etc.
     */
    async fetchCompletion(messages, options = {}) {
      let model = options.model || config.defaultModel;
      
      // Google Gemini specific implementation
      if (provider === 'google') {
        const url = `${config.baseUrl}/${model}:generateContent?key=${config.apiKey}`;
        
        // Convert messages to Gemini format
        // System instructions are passed differently in Gemini, but for simplicity we'll prepend them or use system_instruction if supported
        // v1beta supports system_instruction
        
        let systemInstruction = undefined;
        let contents = [];
        
        for (const msg of messages) {
          if (msg.role === 'system') {
            systemInstruction = { parts: [{ text: msg.content }] };
          } else if (msg.role === 'user') {
            contents.push({ role: 'user', parts: [{ text: msg.content }] });
          } else if (msg.role === 'assistant') {
            contents.push({ role: 'model', parts: [{ text: msg.content }] });
          }
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents,
            system_instruction: systemInstruction,
            generationConfig: {
              temperature: options.temperature ?? 0.7
            }
          })
        });
        
        const data = await response.json();
        
        // Normalize response to look like OpenAI for the consumer
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
             // Mocking OpenAI structure
             data.choices = [{
                 message: {
                     content: data.candidates[0].content.parts[0].text
                 }
             }];
        }
        
        return { response, data };
      }

      // If using DeepSeek but providing an OpenAI model, map it
      if (provider === 'deepseek' && !model.startsWith('deepseek-') && modelMapping[model]) {
        model = modelMapping[model];
      }
      
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: options.temperature ?? 0.7,
          stream: options.stream ?? false
        })
      });
      
      const data = await response.json();
      return { response, data };
    }
  };
}