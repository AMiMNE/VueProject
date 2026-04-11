export const LLM_CONFIG = {
  enabled: false,
  
  apiKey: '',
  
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  
  model: 'gpt-3.5-turbo',
  
  temperature: 0.7,
  
  maxTokens: 1000,
  
  timeout: 30000
}

export function setLLMConfig(config) {
  Object.assign(LLM_CONFIG, config)
}

export function isLLMEnabled() {
  return LLM_CONFIG.enabled && LLM_CONFIG.apiKey
}
