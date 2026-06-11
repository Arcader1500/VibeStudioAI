/**
 * Multi-Provider AI Router
 * Implements SRS Phase 6 — §5 AI Layer
 *
 * Provides a unified wrapper around OpenRouter for intelligent fallback
 * across Gemini (default), Claude, GPT, and DeepSeek.
 */

export interface AIRoutingOptions {
  model?: 'gemini' | 'claude' | 'gpt' | 'deepseek' | 'auto';
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIResponse {
  content: string;
  provider: string;
  modelUsed: string;
  tokens: { prompt: number; completion: number; total: number };
}

// ---------------------------------------------------------------------------
// Provider Configurations
// ---------------------------------------------------------------------------

const PROVIDER_MODELS = {
  deepseek: 'deepseek/deepseek-v4-flash',// Default primary
  gemini: 'google/gemini-pro',           // Reliable fallback
  claude: 'anthropic/claude-3-haiku',    // Fast fallback
  gpt: 'openai/gpt-4o-mini',             // Reliable fallback
};

const FALLBACK_CHAIN = ['deepseek', 'gemini', 'claude', 'gpt'];

// ---------------------------------------------------------------------------
// Main Router
// ---------------------------------------------------------------------------

export class AIRouter {
  private apiKey: string;

  constructor() {
    // In a real production app, this would be fetched from a secure KMS or encrypted env
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      console.warn('OPENROUTER_API_KEY is missing. AI generations will fail.');
    }
    this.apiKey = key || '';
  }

  /**
   * Generates a completion, automatically falling back to secondary providers
   * if the primary fails (e.g., rate limits, downtime).
   */
  public async generate(prompt: string, options: AIRoutingOptions = {}): Promise<AIResponse> {
    const startModel = options.model && options.model !== 'auto' ? options.model : 'deepseek';
    const startIndex = FALLBACK_CHAIN.indexOf(startModel);
    
    // Try the preferred model and then cascade down the fallback chain
    for (let i = startIndex; i < FALLBACK_CHAIN.length; i++) {
      const currentProvider = FALLBACK_CHAIN[i] as keyof typeof PROVIDER_MODELS;
      const modelString = PROVIDER_MODELS[currentProvider];

      try {
        const result = await this.callOpenRouter(prompt, modelString, options);
        return {
          content: result.choices[0].message.content,
          provider: currentProvider,
          modelUsed: result.model,
          tokens: {
            prompt: result.usage?.prompt_tokens || 0,
            completion: result.usage?.completion_tokens || 0,
            total: result.usage?.total_tokens || 0,
          }
        };
      } catch (error) {
        console.error(`[AIRouter] Model ${currentProvider} failed:`, error instanceof Error ? error.message : error);
        if (i === FALLBACK_CHAIN.length - 1) {
          throw new Error('All AI providers in the fallback chain failed.');
        }
        console.log(`[AIRouter] Falling back to ${FALLBACK_CHAIN[i + 1]}...`);
      }
    }
    
    throw new Error('Unexpected router failure.');
  }

  /**
   * Direct fetch call to OpenRouter API
   */
  private async callOpenRouter(prompt: string, model: string, options: AIRoutingOptions) {
    const payload: any = {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    };

    if (options.jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://vibestudio.ai', // Required by OpenRouter
        'X-Title': 'VibeStudio AI',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
    }

    return response.json();
  }
}
