# AI Provider Setup Guide

## Multi-Provider AI Support

The Workflow platform now supports multiple AI providers, allowing you to use free alternatives when OpenAI credits are exhausted.

## Supported Providers

1. **OpenAI** (Default) - Paid, best quality
2. **Hugging Face** - FREE alternative with good quality
3. **Anthropic Claude** - Paid, excellent quality
4. **Google Gemini** - FREE tier available
5. **Cohere** - Paid, good for embeddings

## Quick Setup

### Option 1: Use OpenAI (Default)
```bash
# In backend/.env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
```

### Option 2: Use Hugging Face (FREE)
```bash
# In backend/.env
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your-hf-token-here
```

### Option 3: Use Google Gemini (FREE tier)
```bash
# In backend/.env
AI_PROVIDER=gemini
GOOGLE_API_KEY=your-google-api-key-here
```

### Option 4: Use Anthropic Claude
```bash
# In backend/.env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-anthropic-key-here
```

### Option 5: Use Cohere
```bash
# In backend/.env
AI_PROVIDER=cohere
COHERE_API_KEY=your-cohere-key-here
```

## Getting API Keys

### Hugging Face (FREE - Recommended for Free Tier)
1. Go to https://huggingface.co/
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token
5. Copy the token to `HUGGINGFACE_API_KEY`

**Free Tier Limits:**
- 30 requests/minute
- Unlimited requests per month
- Good quality models available

### Google Gemini (FREE tier available)
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy to `GOOGLE_API_KEY`

**Free Tier:**
- 60 requests/minute
- 1,500 requests/day
- Good quality

### OpenAI (Paid)
1. Go to https://platform.openai.com/
2. Sign up and add payment method
3. Go to API Keys section
4. Create new secret key
5. Copy to `OPENAI_API_KEY`

### Anthropic Claude (Paid)
1. Go to https://console.anthropic.com/
2. Sign up and add payment
3. Create API key
4. Copy to `ANTHROPIC_API_KEY`

### Cohere (Paid)
1. Go to https://cohere.com/
2. Sign up and get API key
3. Copy to `COHERE_API_KEY`

## Automatic Fallback

The system automatically falls back to Hugging Face if:
- Primary provider fails
- API key is missing
- Rate limit is exceeded
- Credits are exhausted

## Environment Variables

Add to `backend/.env`:

```bash
# AI Provider Selection (openai, huggingface, anthropic, gemini, cohere)
AI_PROVIDER=openai

# OpenAI (if using OpenAI)
OPENAI_API_KEY=sk-...

# Hugging Face (FREE - recommended fallback)
HUGGINGFACE_API_KEY=hf_...

# Anthropic Claude (if using Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (if using Gemini)
GOOGLE_API_KEY=AIza...

# Cohere (if using Cohere)
COHERE_API_KEY=...
```

## Testing Your Setup

1. Start the backend:
```bash
cd backend
npm install
npm start
```

2. Test AI generation:
```bash
curl -X POST http://localhost:3001/api/resumes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "job_title": "Software Engineer",
    "experience_level": "mid",
    "industry": "Technology",
    "skills": ["JavaScript", "React", "Node.js"],
    "achievements": ["Built scalable web app"],
    "style": "professional"
  }'
```

## Model Selection

### Default Models by Provider:

- **OpenAI**: `gpt-4-turbo-preview`
- **Hugging Face**: `mistralai/Mistral-7B-Instruct-v0.2`
- **Anthropic**: `claude-3-opus-20240229`
- **Google Gemini**: `gemini-pro`
- **Cohere**: `command`

### Embedding Models:

- **OpenAI**: `text-embedding-3-large` (3072 dimensions)
- **Hugging Face**: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)
- **Cohere**: `embed-english-v3.0` (1024 dimensions)

## Cost Comparison

| Provider | Free Tier | Paid Tier | Quality |
|----------|-----------|-----------|---------|
| Hugging Face | ✅ Yes (30 req/min) | N/A | Good |
| Google Gemini | ✅ Yes (60 req/min) | $0.0005/1K tokens | Excellent |
| OpenAI | ❌ No | $0.01/1K tokens | Excellent |
| Anthropic | ❌ No | $0.015/1K tokens | Excellent |
| Cohere | ❌ No | $0.001/1K tokens | Good |

## Recommended Setup for Free Users

```bash
# Use Hugging Face as primary (FREE)
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your-token

# Or use Google Gemini (FREE tier)
AI_PROVIDER=gemini
GOOGLE_API_KEY=your-key
```

## Troubleshooting

### Error: "API key not found"
- Make sure the API key is in `backend/.env`
- Restart the backend server after adding keys
- Check for typos in the key

### Error: "Rate limit exceeded"
- The system will automatically fall back to Hugging Face
- Wait a few minutes and try again
- Consider upgrading to a paid tier

### Error: "Model not found"
- Check that the model name is correct
- Some models may require special access on Hugging Face
- Try a different model

## Features Supported

All AI features work with any provider:
- ✅ Resume Generation
- ✅ Job Matching
- ✅ Interview Prep
- ✅ Salary Intelligence
- ✅ Career Advisor
- ✅ Embeddings (for job matching)

## Next Steps

1. Choose your AI provider
2. Get an API key
3. Add it to `backend/.env`
4. Set `AI_PROVIDER` in `.env`
5. Restart backend server
6. Test AI features!

For free users, we recommend starting with **Hugging Face** or **Google Gemini**.

