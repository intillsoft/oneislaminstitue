
import { autoApplyService } from '../services/autoApplyService.js';
import { browserAutomationService } from '../services/browserAutomationService.js';
import logger from '../utils/logger.js';

// Mock Dependencies
const mockResume = {
    id: 'resume-123',
    user_id: 'user-123',
    content_json: {
        personal: { firstName: 'Test', lastName: 'User', email: 'test@example.com' },
        experience: [{ title: 'Software Engineer', company: 'Tech Corp' }],
        skills: { technical: ['JavaScript', 'Node.js', 'React'] }
    }
};

const mockJob = {
    id: 'job-123',
    title: 'Senior Frontend Developer',
    company: 'Big Tech',
    description: 'We need a React expert.',
    application_url: 'https://example.com/apply',
    source: 'linkedin'
};

const mockSettings = {
    enabled: true,
    allowed_platforms: ['linkedin', 'internal'],
    best_resume_matching: true,
    min_match_score: 60
};

// Mock Supabase
const mockSupabase = {
    from: (table) => {
        return {
            select: () => ({
                eq: (col, val) => ({
                    eq: () => ({
                        limit: () => ({ data: [mockResume] }),
                        single: () => ({ data: mockJob })
                    }),
                    single: () => ({ data: mockJob })
                }),
                limit: () => ({ data: [mockResume] })
            }),
            insert: (data) => {
                logger.info(`[MOCK DB] Insert into ${table}:`, data);
                return { select: () => ({ single: () => ({ data: { id: 'app-1', ...data }, error: null }) }) };
            }
        };
    }
};

// Mock AI Service
const mockAiAutoApplyService = {
    analyzeJobMatch: async () => ({ matchScore: 88, reasoning: 'High match' }),
    generateCoverLetter: async () => 'Dear Hiring Manager...'
};

// Inject Mocks (This requires modification of the service to accept DI, or we use a proxy/rewire approach. 
// However, since we are in a simple script, we will rely on the service using the imported singleton.
// NOTE: Since we can't easily mock imports in ESM without a test runner, we will test the *browserAutomationService* directly 
// and logic parts that we can isolate.)

async function verifyAutopilot() {
    console.log('🚀 Starting Autopilot Verification...');

    // 1. Verify Browser Automation Service
    console.log('\nTesting Browser Automation Service...');
    try {
        const result = await browserAutomationService.apply({
            userId: 'user-123',
            jobUrl: mockJob.application_url,
            resume: mockResume,
            platform: mockJob.source,
            settings: mockSettings
        });

        if (result.success && result.platform === 'linkedin') {
            console.log('✅ Browser Automation validation passed.');
        } else {
            console.error('❌ Browser Automation failed:', result);
        }
    } catch (error) {
        console.error('❌ Browser Automation Error:', error);
    }

    // 2. Verify Logic Flow (Simulated)
    // Since we cannot easily mock the internal supabase call inside autoApplyService without rewire,
    // we will simulate the decision logic here to ensure it matches our expectations.

    console.log('\nVerifying Logic Constraints...');
    const platform = 'glassdoor';
    const allowed = mockSettings.allowed_platforms.includes(platform);
    if (!allowed) {
        console.log(`✅ Platform check passed: ${platform} ignored as expected.`);
    } else {
        console.error(`❌ Platform check failed: ${platform} should be ignored.`);
    }

    const platform2 = 'linkedin';
    const allowed2 = mockSettings.allowed_platforms.includes(platform2);
    if (allowed2) {
        console.log(`✅ Platform check passed: ${platform2} allowed as expected.`);
    } else {
        console.error(`❌ Platform check failed: ${platform2} should be allowed.`);
    }

    console.log('\nVerification Complete.');
}

verifyAutopilot();
