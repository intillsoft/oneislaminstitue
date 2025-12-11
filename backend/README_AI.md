# AI Services API Documentation

## Overview

Workflow backend includes 5 AI-powered services using OpenAI GPT-4:

1. **Resume Generator** - AI-powered resume creation
2. **Job Matching** - Intelligent job-resume matching
3. **Interview Prep** - Mock interviews and question generation
4. **Salary Intelligence** - ML-based salary predictions
5. **Career Advisor** - Personalized career guidance

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure OpenAI

Add to `.env`:
```env
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 3. Run Database Migrations

```sql
-- Run the AI schema
\i supabase/ai-schema.sql
```

## API Endpoints

### Resume Generator

#### POST /api/resumes/generate
Generate AI-powered resume

**Request:**
```json
{
  "job_title": "Software Engineer",
  "experience_level": "mid",
  "industry": "Technology",
  "skills": ["JavaScript", "React", "Node.js"],
  "achievements": ["Led team of 5", "Increased performance by 40%"],
  "style": "professional", // professional, creative, technical, executive
  "job_description": "Optional job description for ATS optimization",
  "include_ats": true,
  "ab_test": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": {
      "summary": "...",
      "experience": [...],
      "skills": {...},
      "education": [...]
    },
    "ats_optimization": {
      "score": 85,
      "missing_keywords": [...],
      "suggestions": [...]
    }
  }
}
```

#### GET /api/resumes/styles
Get available writing styles

---

### Job Matching

#### POST /api/jobs/match
Calculate job-resume compatibility

**Request:**
```json
{
  "resume_id": "uuid",
  "job_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "match_score": 87,
    "breakdown": {
      "semantic_similarity": 85,
      "skills_match": 90,
      "experience_match": 100,
      "location_match": 80
    },
    "missing_skills": [...],
    "strengths": [...],
    "recommendations": [...]
  }
}
```

---

### Interview Prep

#### POST /api/interview/questions/generate
Generate interview questions

**Request:**
```json
{
  "job_description": "Full job description...",
  "count": 10,
  "difficulty": "medium", // easy, medium, hard, expert
  "question_types": ["behavioral", "technical", "situational"]
}
```

#### GET /api/interview/questions/company/:companyName
Get company-specific questions

#### POST /api/interview/analyze
Analyze interview answer

**Request:**
```json
{
  "question": "Tell me about yourself",
  "answer": "User's answer...",
  "job_description": "Optional context"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "content_quality": 85,
      "structure": 80,
      "relevance": 90,
      "overall_score": 85,
      "strengths": [...],
      "improvements": [...]
    },
    "sentiment": {
      "sentiment": "positive",
      "confidence": 85,
      "professionalism": 90
    }
  }
}
```

#### POST /api/interview/mock/create
Create mock interview session

**Request:**
```json
{
  "job_id": "uuid",
  "difficulty": "medium",
  "question_count": 5,
  "include_follow_ups": true
}
```

#### POST /api/interview/performance/track
Track interview performance

---

### Salary Intelligence

#### POST /api/salary/predict
Predict salary range

**Request:**
```json
{
  "job_title": "Software Engineer",
  "location": "San Francisco, CA",
  "experience": 5,
  "industry": "Technology",
  "skills": ["JavaScript", "React"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "salary_range": {
      "min": 120000,
      "max": 180000,
      "median": 150000,
      "percentiles": {
        "p25": 135000,
        "p75": 165000,
        "p90": 175000
      }
    },
    "confidence_score": 85,
    "market_trends": {...},
    "negotiation_tips": [...]
  }
}
```

#### POST /api/salary/report
Generate comprehensive market report

---

### Career Advisor

#### GET /api/career/analyze
Analyze career profile and provide recommendations

**Response:**
```json
{
  "success": true,
  "data": {
    "current_state": {...},
    "career_paths": [...],
    "skill_gaps": [...],
    "learning_roadmap": {
      "short_term": [...],
      "medium_term": [...],
      "long_term": [...]
    },
    "market_forecast": {...},
    "recommendations": [...]
  }
}
```

## Features

### Resume Generator
- ✅ Multiple writing styles (professional, creative, technical, executive)
- ✅ ATS optimization
- ✅ A/B testing for templates
- ✅ Structured JSON output

### Job Matching
- ✅ Semantic similarity using embeddings
- ✅ Skills analysis
- ✅ Experience level matching
- ✅ Location compatibility
- ✅ Missing skills identification
- ✅ Personalized recommendations

### Interview Prep
- ✅ Dynamic question generation
- ✅ Company-specific questions
- ✅ Answer analysis with feedback
- ✅ Sentiment analysis
- ✅ Mock interview sessions
- ✅ Performance tracking
- ✅ Progressive difficulty

### Salary Intelligence
- ✅ Multi-source data aggregation
- ✅ ML-based predictions
- ✅ Market trends analysis
- ✅ Negotiation tips
- ✅ Comprehensive reports

### Career Advisor
- ✅ Career path suggestions
- ✅ Skill gap analysis
- ✅ Learning roadmaps
- ✅ Market trend predictions
- ✅ Personalized recommendations

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Rate Limiting

AI endpoints are rate-limited to prevent abuse:
- 10 requests per minute per user
- 100 requests per hour per user

## Costs

**OpenAI API Costs:**
- GPT-4 Turbo: ~$0.01-0.03 per resume generation
- Embeddings: ~$0.0001 per embedding
- Average request: $0.01-0.05

Monitor usage in OpenAI dashboard.

## Best Practices

1. **Cache embeddings** - Already implemented for job matching
2. **Batch requests** - When possible, batch similar requests
3. **Use appropriate models** - GPT-4 for quality, GPT-3.5 for speed
4. **Validate input** - All endpoints validate required fields
5. **Handle errors gracefully** - Fallback responses provided

## Testing

```bash
# Test resume generation
curl -X POST http://localhost:3001/api/resumes/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Software Engineer",
    "experience_level": "mid",
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "achievements": ["Led team"]
  }'
```

## Support

For issues or questions, check logs in `logs/` directory.

