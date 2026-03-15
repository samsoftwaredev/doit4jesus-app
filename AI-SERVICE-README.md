# AI Service with Fallback Models

Robust AI integration with automatic fallback when services are rate-limited or unavailable.

## Fallback Chain

```
1. Claude (Primary) → Fast, high-quality responses
2. OpenAI (Fallback 1) → If Claude rate limited
3. Local Model (Fallback 2) → If OpenAI rate limited
```

## Setup

### 1. Install Local Model (Optional)

For the final fallback, install Ollama:

```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Then pull a model
ollama pull llama2
ollama serve
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Claude API (Primary)
ANTHROPIC_API_KEY=your_claude_api_key_here

# OpenAI API (Fallback)
OPENAI_API_KEY=your_openai_api_key_here

# Local Model URL (Optional)
LOCAL_MODEL_URL=http://localhost:11434
```

## Usage Examples

### Basic Text Generation

```typescript
import { aiService } from '@/utils/ai-service';

// Simple generation
const response = await aiService.generateText('Write a prayer for peace');

console.log(response.text); // Generated text
console.log(response.model); // 'claude-3-sonnet'
console.log(response.provider); // 'claude'
```

### With Options

```typescript
const response = await aiService.generateText(
  'Explain the mysteries of the rosary',
  {
    temperature: 0.7, // Creativity (0-1)
    maxTokens: 500, // Length limit
    systemPrompt: 'You are a Catholic theologian.',
  },
);
```

### Generate Embeddings

```typescript
// For semantic search, RAG, etc.
const embedding = await aiService.generateEmbeddings(
  'Our Father who art in heaven',
);

// Returns: number[] (1536 dimensions)
```

## Use Cases

### 1. AI-Generated Prayer Reflections

```typescript
// pages/api/generate-reflection.ts
import { aiService } from '@/utils/ai-service';

export default async function handler(req, res) {
  try {
    const { mysteryName } = req.body;

    const response = await aiService.generateText(
      `Write a brief reflection on the ${mysteryName} of the rosary.`,
      {
        systemPrompt: 'You are a Catholic spiritual director.',
        maxTokens: 300,
      },
    );

    res.json({ reflection: response.text, model: response.model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2. Prayer Intention Suggestions

```typescript
const response = await aiService.generateText(
  `Suggest 5 prayer intentions for someone struggling with ${userInput}`,
  { temperature: 0.8, maxTokens: 200 },
);
```

### 3. Rosary Meditation Guide

```typescript
const response = await aiService.generateText(
  'Guide me through meditating on the Joyful Mysteries',
  {
    systemPrompt: 'You are a contemplative prayer guide.',
    temperature: 0.6,
  },
);
```

### 4. Scripture Context for Mysteries

```typescript
const response = await aiService.generateText(
  `What Bible verses relate to the ${mystery}?`,
  {
    systemPrompt: 'You are a Biblical scholar. Cite specific verses.',
    maxTokens: 400,
  },
);
```

## Error Handling

The service automatically handles:

- ✅ Rate limits (429 errors)
- ✅ API errors
- ✅ Network failures
- ✅ Missing API keys

```typescript
try {
  const response = await aiService.generateText('Hello');
  // Use response
} catch (error) {
  // All fallbacks failed
  console.error('All AI services unavailable');
}
```

## Cost Analysis

### Per 1,000 Requests

| Provider | Model       | Input Cost | Output Cost | Total (avg) |
| -------- | ----------- | ---------- | ----------- | ----------- |
| Claude   | Sonnet      | $3.00      | $15.00      | ~$9.00      |
| OpenAI   | GPT-4 Turbo | $10.00     | $30.00      | ~$20.00     |
| Local    | Llama2      | $0.00      | $0.00       | **$0.00**   |

**Recommendation:** Use Claude as primary (best quality/cost), OpenAI as fallback, local for testing/dev.

## Rate Limits

| Provider | Free Tier  | Paid Tier    |
| -------- | ---------- | ------------ |
| Claude   | 50 req/min | 1000 req/min |
| OpenAI   | 3 req/min  | 500 req/min  |
| Local    | Unlimited  | Unlimited    |

## Best Practices

### 1. Cache Responses

```typescript
// Cache generated reflections
const cacheKey = `reflection:${mysteryId}`;
let reflection = cache.get(cacheKey);

if (!reflection) {
  const response = await aiService.generateText(...);
  reflection = response.text;
  cache.set(cacheKey, reflection, { ttl: 86400 }); // 24 hours
}
```

### 2. Batch Requests

```typescript
// Instead of 10 separate calls:
const responses = await Promise.all(
  mysteries.map((m) => aiService.generateText(m.prompt)),
);
```

### 3. Set Appropriate Limits

```typescript
// Short responses = lower cost
const response = await aiService.generateText(prompt, {
  maxTokens: 200, // Don't generate more than needed
});
```

### 4. Use System Prompts

```typescript
// Better quality with system prompts
const response = await aiService.generateText(prompt, {
  systemPrompt: 'You are concise and reverent. No flowery language.',
});
```

## Testing

```bash
# Test the service
npm run test utils/ai-service.test.ts

# Test with all providers
npm run test:ai-integration
```

## Monitoring

Track usage in production:

```typescript
// Log AI usage
console.log(
  `AI Request: ${response.provider}/${response.model} - ${response.tokensUsed} tokens`,
);

// Track costs
const cost = calculateCost(response.provider, response.tokensUsed);
logToAnalytics({ provider: response.provider, cost });
```

## Feature Ideas

Potential features using this service:

1. **AI Prayer Companion**
   - Chat with AI about spiritual struggles
   - Get personalized prayer suggestions

2. **Mystery Explanations**
   - AI-generated insights for each mystery
   - Different perspectives (historical, theological, personal)

3. **Prayer Journal Analysis**
   - AI analyzes journal entries
   - Identifies spiritual patterns and growth

4. **Confession Prep Helper**
   - AI guides examination of conscience
   - Suggests areas for reflection

5. **Scripture Study**
   - AI explains difficult passages
   - Connects scripture to rosary mysteries

6. **Personalized Meditations**
   - Generate custom meditations based on user's situation
   - Adapt to user's spiritual level

## Security Notes

- ✅ Never expose API keys in client-side code
- ✅ All AI calls happen server-side (API routes)
- ✅ Rate limit user requests (prevent abuse)
- ✅ Validate and sanitize user input
- ✅ Don't store sensitive data in prompts

## Troubleshooting

### "Claude API key not configured"

- Add `ANTHROPIC_API_KEY` to `.env.local`
- Get key from: https://console.anthropic.com

### "All AI services unavailable"

- Check API keys are valid
- Verify rate limits not exceeded
- Test local model: `curl http://localhost:11434/api/generate`

### High costs

- Reduce `maxTokens`
- Implement caching
- Use cheaper models for simple tasks

---

**Built with ❤️ for DoIt4Jesus**
