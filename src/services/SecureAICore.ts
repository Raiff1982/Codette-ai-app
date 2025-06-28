import { SecurityUtils } from '../utils/security';

class SecureAICore {
  private fallbackResponses: string[];
  private initialized: boolean = false;
  private rateLimiter: (identifier: string) => boolean;
  private requestCount: number = 0;
  private maxRequestsPerSession: number = 100;

  constructor() {
    this.fallbackResponses = [
      "I understand your question. Let me process this through my secure reasoning framework.",
      "That's an interesting point. From a logical perspective, I'll analyze this safely.",
      "I'm processing this through my ethical reasoning framework to provide a secure response.",
      "Let me apply my secure reasoning to explore your question responsibly.",
      "Through my protected processing, I can see several safe approaches to this.",
      "From a secure perspective, there are responsible ways to approach this challenge.",
      "My protected analysis suggests we should examine this carefully.",
      "Using my secure reasoning module, I can explore this safely."
    ];

    // Rate limiter: max 10 requests per minute
    this.rateLimiter = SecurityUtils.createRateLimiter(10, 60000);
  }

  async initialize() {
    try {
      this.initialized = true;
      console.log('Secure AI Core initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Secure AI Core:', error);
      throw error;
    }
  }

  async processInput(query: string, forceVariation: boolean = false): Promise<string> {
    // Security checks
    if (!this.rateLimiter('default')) {
      return 'Rate limit exceeded. Please wait before making another request.';
    }

    if (this.requestCount >= this.maxRequestsPerSession) {
      return 'Session limit reached. Please refresh the page to continue.';
    }

    // Sanitize input
    const sanitizedQuery = SecurityUtils.sanitizeInput(query);
    
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      return 'I apologize, but I cannot process an empty or invalid query. Please provide clean text for me to work with.';
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousContent(sanitizedQuery)) {
      return 'I cannot process this request as it contains potentially harmful content. Please rephrase your question.';
    }

    this.requestCount++;

    try {
      // Simulate secure processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const response = this.generateSecureResponse(sanitizedQuery, forceVariation);
      
      return response;
    } catch (error) {
      console.error('Error in secure processing:', error);
      return this.getSecureFallbackResponse(sanitizedQuery);
    }
  }

  private containsSuspiciousContent(query: string): boolean {
    const suspiciousPatterns = [
      // Script injection attempts
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      
      // SQL injection attempts
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      
      // Command injection attempts
      /\|\s*nc\s/i,
      /\|\s*netcat/i,
      /\|\s*wget/i,
      /\|\s*curl/i,
      /\|\s*bash/i,
      /\|\s*sh/i,
      
      // Path traversal attempts
      /\.\.\//,
      /\.\.\\/,
      
      // Suspicious protocols
      /file:\/\//i,
      /ftp:\/\//i,
      /data:text\/html/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(query));
  }

  private generateSecureResponse(query: string, forceVariation: boolean = false): string {
    const queryLower = query.toLowerCase();
    
    // Safe content detection and response generation
    if (queryLower.includes('security') || queryLower.includes('safety')) {
      return this.generateSecurityResponse(query);
    } else if (queryLower.includes('help') || queryLower.includes('assist')) {
      return this.generateHelpResponse(query);
    } else if (queryLower.includes('creative') || queryLower.includes('art')) {
      return this.generateCreativeResponse(query);
    } else {
      return this.generateGeneralSecureResponse(query, forceVariation);
    }
  }

  private generateSecurityResponse(query: string): string {
    const securityResponses = [
      "Security is paramount in all digital interactions. I'm designed with multiple layers of protection to ensure safe and responsible AI assistance.",
      "I prioritize security and privacy in all my responses. My processing includes input validation, output sanitization, and ethical guidelines.",
      "Safety and security are core principles in my design. I'm built to provide helpful assistance while maintaining strict security protocols."
    ];
    return securityResponses[Math.floor(Math.random() * securityResponses.length)];
  }

  private generateHelpResponse(query: string): string {
    const helpResponses = [
      "I'm here to help you with information, analysis, and creative problem-solving in a safe and secure manner.",
      "I can assist you with various tasks while maintaining security and ethical standards. What specific help do you need?",
      "My purpose is to provide helpful, accurate, and secure assistance. I'm designed to be both useful and safe."
    ];
    return helpResponses[Math.floor(Math.random() * helpResponses.length)];
  }

  private generateCreativeResponse(query: string): string {
    const creativeResponses = [
      "Creativity flourishes within secure boundaries. I can help you explore creative ideas while maintaining safety and appropriateness.",
      "I enjoy creative challenges! Let me help you brainstorm ideas in a constructive and secure environment.",
      "Creative thinking combined with responsible AI principles can lead to wonderful innovations. How can I help spark your creativity?"
    ];
    return creativeResponses[Math.floor(Math.random() * creativeResponses.length)];
  }

  private generateGeneralSecureResponse(query: string, forceVariation: boolean = false): string {
    const responses = [
      "I've analyzed your question through my secure reasoning framework and can provide helpful insights.",
      "Through my protected processing system, I can offer a thoughtful response to your inquiry.",
      "My secure analysis reveals several interesting aspects to consider in response to your question.",
      "Using my safety-first approach, I can explore your question from multiple secure perspectives.",
      "My protected reasoning system has processed your query and can offer valuable insights."
    ];

    if (forceVariation) {
      const timestamp = Date.now();
      const variation = timestamp % responses.length;
      return responses[variation] + ` [Securely regenerated at ${new Date().toLocaleTimeString()}]`;
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSecureFallbackResponse(query: string): string {
    const fallbackIndex = Math.floor(Math.random() * this.fallbackResponses.length);
    return this.fallbackResponses[fallbackIndex] + " I'm operating in secure mode to ensure your safety.";
  }

  // Method to reset session limits if needed
  resetSession(): void {
    this.requestCount = 0;
    console.log('AI session reset for security');
  }
}

export default SecureAICore;