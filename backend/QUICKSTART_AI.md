# AI Services Quick Start

## Setup

### 1. Get OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your_key_here
   ```

### 2. Run Database Migrations

```sql
-- In Supabase SQL Editor
\i supabase/ai-schema.sql
```

Or manually run `backend/supabase/ai-schema.sql`

### 3. Install Dependencies

```bash
cd backend
npm install
```

## Test Endpoints

### Resume Generation

```bash
curl -X POST http://localhost:3001/api/resumes/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Software Engineer",
    "experience_level": "mid",
    "industry": "Technology",
    "skills": ["JavaScript", "React", "Node.js"],
    "achievements": ["Led team of 5", "Increased performance by 40%"],
    "style": "professional"
  }'
```

### Job Matching

```bash
curl -X POST http://localhost:3001/api/jobs/match \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "uuid-here",
    "job_id": "uuid-here"
  }'
```

### Interview Questions

```bash
curl -X POST http://localhost:3001/api/interview/questions/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Full job description...",
    "count": 10,
    "difficulty": "medium"
  }'
```

### Salary Prediction

```bash
curl -X POST http://localhost:3001/api/salary/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Software Engineer",
    "location": "San Francisco, CA",
    "experience": 5,
    "industry": "Technology"
  }'
```

### Career Analysis

```bash
curl -X GET http://localhost:3001/api/career/analyze \
  -H "Authorization: Bearer <token>"
```

## Cost Estimates

- **Resume Generation**: ~$0.01-0.03 per request
- **Job Matching**: ~$0.001 per match (embeddings cached)
- **Interview Prep**: ~$0.005-0.01 per question set
- **Salary Intelligence**: ~$0.01 per prediction
- **Career Advisor**: ~$0.02-0.05 per analysis

**Monthly estimate for 1000 users**: $50-150 (depending on usage)

## Monitoring

Check OpenAI usage dashboard:
- [platform.openai.com/usage](https://platform.openai.com/usage)

Monitor backend logs:
```bash
tail -f logs/combined.log
```

## Troubleshooting

### "OpenAI API error"
- Check API key is set correctly
- Verify API key has credits
- Check rate limits

### "Embedding error"
- Ensure `text-embedding-3-large` model is available
- Check input text length (max 8191 tokens)

### Slow responses
- Normal for GPT-4 (5-15 seconds)
- Consider caching common requests
- Use GPT-3.5 for faster responses (modify in `openaiService.js`)

## Next Steps

1. Set up monitoring and alerts
2. Implement request queuing for high volume
3. Add caching for common queries
4. Set up cost tracking
5. Fine-tune prompts for your use case

See `README_AI.md` for full documentation.

