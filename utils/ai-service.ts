/**
 * AI Service with Fallback Models
 *
 * Fallback chain: Claude → OpenAI → Local Model
 * Handles rate limits, errors, and retries automatically
 */

interface AIResponse {
  text: string;
  model: string;
  provider: 'claude' | 'openai' | 'local';
  tokensUsed?: number;
}

interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

class AIService {
  private claudeApiKey: string | undefined;
  private openaiApiKey: string | undefined;

  constructor() {
    this.claudeApiKey = process.env.ANTHROPIC_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  /**
   * Generate text with automatic fallback
   */
  async generateText(
    prompt: string,
    options: AIServiceOptions = {},
  ): Promise<AIResponse> {
    const { temperature = 0.7, maxTokens = 1000, systemPrompt } = options;

    // Try Claude first
    try {
      return await this.callClaude(prompt, {
        temperature,
        maxTokens,
        systemPrompt,
      });
    } catch (error: any) {
      console.error('Claude failed:', error.message);

      // Check if rate limited
      if (this.isRateLimited(error)) {
        console.log('Claude rate limited, falling back to OpenAI...');
      }

      // Fallback to OpenAI
      try {
        return await this.callOpenAI(prompt, {
          temperature,
          maxTokens,
          systemPrompt,
        });
      } catch (openaiError: any) {
        console.error('OpenAI failed:', openaiError.message);

        // Check if rate limited
        if (this.isRateLimited(openaiError)) {
          console.log('OpenAI rate limited, falling back to local model...');
        }

        // Final fallback: Local model
        try {
          return await this.callLocalModel(prompt, {
            temperature,
            maxTokens,
            systemPrompt,
          });
        } catch (localError: any) {
          console.error('All AI services failed:', localError.message);
          throw new Error(
            'All AI services unavailable. Please try again later.',
          );
        }
      }
    }
  }

  /**
   * Call Claude API
   */
  private async callClaude(
    prompt: string,
    options: AIServiceOptions,
  ): Promise<AIResponse> {
    if (!this.claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        system: options.systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      model: 'claude-3-sonnet',
      provider: 'claude',
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    prompt: string,
    options: AIServiceOptions,
  ): Promise<AIResponse> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages: any[] = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: 'gpt-4-turbo',
      provider: 'openai',
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Call local model (Ollama or similar)
   */
  private async callLocalModel(
    prompt: string,
    options: AIServiceOptions,
  ): Promise<AIResponse> {
    const localModelUrl =
      process.env.LOCAL_MODEL_URL || 'http://localhost:11434';

    const response = await fetch(`${localModelUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: options.systemPrompt
          ? `${options.systemPrompt}\n\n${prompt}`
          : prompt,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Local model unavailable');
    }

    const data = await response.json();
    return {
      text: data.response,
      model: 'llama2',
      provider: 'local',
    };
  }

  /**
   * Check if error is due to rate limiting
   */
  private isRateLimited(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    const status = error.status;

    return (
      status === 429 ||
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('quota exceeded')
    );
  }

  /**
   * Generate embeddings (for semantic search, RAG, etc.)
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key required for embeddings');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embeddings');
    }

    const data = await response.json();
    return data.data[0].embedding;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types
export type { AIResponse, AIServiceOptions };
