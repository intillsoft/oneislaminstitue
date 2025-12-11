-- ============================================================================
-- INSERT WORKFLOW TEAM COMPANY AND JOBS
-- ============================================================================
-- This script creates the Workflow team company and 10 real job postings
-- All positions are equity-based for tech enthusiasts
-- ============================================================================

-- First, create the Workflow company
INSERT INTO companies (
    id,
    name,
    website,
    logo,
    description,
    industry,
    size,
    location,
    founded_year
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid, -- Fixed UUID for Workflow
    'Workflow Team',
    'https://workflowly.com',
    'https://workflowly.com/logo.png',
    'Workflow is a cutting-edge job search and career management platform. We''re building the future of recruitment technology, helping job seekers find their dream careers and companies discover top talent. Join us in revolutionizing how people connect with opportunities.',
    'Technology',
    '11-50',
    'Remote',
    2024
)
ON CONFLICT (name) DO UPDATE SET
    website = EXCLUDED.website,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- 10 REAL JOB POSTINGS FOR WORKFLOW TEAM
-- ============================================================================

-- 1. Senior Full Stack Developer
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    salary_min,
    salary_max,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Senior Full Stack Developer',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    NULL,
    NULL,
    'We''re looking for an experienced Full Stack Developer to join our growing team. You''ll work on building and scaling our job search platform, working with modern technologies like React, Node.js, PostgreSQL, and Supabase. This is an equity-based position perfect for someone passionate about building products that make a real impact on people''s careers.

**What You''ll Do:**
- Design and implement new features for our job search platform
- Optimize database queries and improve application performance
- Collaborate with designers and product managers to ship high-quality features
- Write clean, maintainable code following best practices
- Participate in code reviews and technical discussions
- Help shape the technical direction of the product

**Tech Stack:**
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Express, PostgreSQL, Supabase
- Tools: Git, Docker, CI/CD pipelines',
    '**Required:**
- 5+ years of full stack development experience
- Strong proficiency in JavaScript/TypeScript, React, and Node.js
- Experience with PostgreSQL and database design
- Understanding of RESTful APIs and microservices architecture
- Experience with version control (Git)
- Strong problem-solving skills and attention to detail
- Excellent communication and collaboration skills

**Preferred:**
- Experience with Supabase or similar BaaS platforms
- Knowledge of AI/ML integration (OpenAI, Hugging Face)
- Experience with payment processing (Stripe)
- Understanding of job search/recruitment industry
- Portfolio of projects demonstrating full stack capabilities',
    'full-time',
    'senior',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/senior-full-stack-developer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 2. Frontend Developer (React Specialist)
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Frontend Developer - React Specialist',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Join our frontend team and help build beautiful, intuitive user experiences for job seekers and recruiters. You''ll work with cutting-edge React technologies, create responsive designs, and ensure our platform is accessible and performant.

**What You''ll Do:**
- Build responsive, accessible user interfaces using React and TypeScript
- Implement dark mode and theme customization features
- Optimize frontend performance and bundle sizes
- Create reusable component libraries
- Collaborate with UX designers to implement pixel-perfect designs
- Write unit and integration tests for frontend components
- Ensure cross-browser compatibility and mobile responsiveness

**Tech Stack:**
- React 18, TypeScript, Tailwind CSS
- Vite, React Router, Context API
- Component libraries and design systems
- Testing: Jest, React Testing Library',
    '**Required:**
- 3+ years of frontend development experience
- Strong proficiency in React, JavaScript/TypeScript
- Experience with modern CSS (Tailwind, CSS-in-JS)
- Understanding of responsive design principles
- Experience with state management (Context API, Zustand)
- Knowledge of web accessibility standards (WCAG)
- Strong eye for design and user experience

**Preferred:**
- Experience with Vite or similar build tools
- Knowledge of animation libraries (Framer Motion)
- Experience with form handling (React Hook Form)
- Understanding of SEO best practices
- Portfolio showcasing React projects',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/frontend-developer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 3. Backend Developer (Node.js/API)
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Backend Developer - Node.js/API Specialist',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'We need a skilled backend developer to build robust APIs, integrate third-party services, and ensure our platform scales efficiently. You''ll work on everything from AI integrations to payment processing, making sure our backend is fast, secure, and reliable.

**What You''ll Do:**
- Design and implement RESTful APIs using Node.js and Express
- Integrate with AI services (OpenAI, Hugging Face, Google Gemini)
- Build payment processing workflows with Stripe
- Optimize database queries and design efficient data models
- Implement authentication and authorization systems
- Set up webhook handlers for third-party integrations
- Monitor and improve API performance and reliability
- Write comprehensive API documentation

**Tech Stack:**
- Node.js, Express, TypeScript
- PostgreSQL, Supabase
- AI APIs (OpenAI, Hugging Face, Anthropic)
- Stripe, Resend (email), Puppeteer
- Docker, CI/CD pipelines',
    '**Required:**
- 4+ years of backend development experience
- Strong proficiency in Node.js and Express
- Experience with PostgreSQL and database optimization
- Understanding of RESTful API design principles
- Experience with authentication/authorization (JWT, OAuth)
- Knowledge of API security best practices
- Strong debugging and problem-solving skills

**Preferred:**
- Experience with Supabase or similar platforms
- Knowledge of AI/ML API integrations
- Experience with payment processing (Stripe)
- Understanding of microservices architecture
- Experience with Docker and containerization
- Knowledge of job search/recruitment industry',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/backend-developer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 4. UI/UX Designer
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'UI/UX Designer',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Help us create beautiful, intuitive user experiences that make job searching enjoyable and effective. You''ll design user interfaces, create design systems, conduct user research, and ensure our platform is both beautiful and functional.

**What You''ll Do:**
- Design user interfaces for web and mobile platforms
- Create wireframes, prototypes, and high-fidelity designs
- Develop and maintain our design system and component library
- Conduct user research and usability testing
- Collaborate with developers to ensure design implementation
- Create user flows and information architecture
- Design email templates and marketing materials
- Ensure accessibility and responsive design principles

**Tools:**
- Figma, Adobe XD, Sketch
- Prototyping tools (Framer, Principle)
- User research and testing tools
- Design system documentation',
    '**Required:**
- 3+ years of UI/UX design experience
- Strong portfolio showcasing web and mobile designs
- Proficiency in design tools (Figma, Adobe Creative Suite)
- Understanding of user-centered design principles
- Experience with design systems and component libraries
- Knowledge of accessibility standards (WCAG)
- Strong visual design and typography skills

**Preferred:**
- Experience with job search/recruitment platforms
- Knowledge of frontend development (HTML/CSS basics)
- Experience with user research and testing
- Understanding of conversion optimization
- Experience with dark mode design
- Portfolio demonstrating complex SaaS applications',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/ui-ux-designer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 5. DevOps Engineer
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'DevOps Engineer',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Join our team to build and maintain our infrastructure, ensure high availability, and automate our deployment processes. You''ll work with cloud platforms, CI/CD pipelines, and monitoring tools to keep our platform running smoothly.

**What You''ll Do:**
- Design and maintain cloud infrastructure (AWS, Vercel, Netlify)
- Set up and optimize CI/CD pipelines
- Implement monitoring, logging, and alerting systems
- Automate deployment and scaling processes
- Ensure security best practices across infrastructure
- Optimize application performance and costs
- Manage database backups and disaster recovery
- Collaborate with developers to improve deployment workflows

**Tech Stack:**
- Cloud: AWS, Vercel, Netlify, Supabase
- CI/CD: GitHub Actions, GitLab CI
- Containers: Docker, Kubernetes (optional)
- Monitoring: Sentry, DataDog, or similar
- Infrastructure as Code: Terraform, CloudFormation',
    '**Required:**
- 3+ years of DevOps/SRE experience
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong knowledge of CI/CD pipelines
- Experience with Docker and containerization
- Understanding of infrastructure as code
- Knowledge of monitoring and logging tools
- Strong scripting skills (Bash, Python, or similar)
- Understanding of security best practices

**Preferred:**
- Experience with serverless architectures
- Knowledge of database administration (PostgreSQL)
- Experience with CDN configuration
- Understanding of microservices deployment
- Certifications (AWS, GCP, Azure)
- Experience with Kubernetes',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/devops-engineer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 6. Product Manager
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    'Product Manager',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Lead product strategy and execution for our job search platform. You''ll work closely with engineering, design, and stakeholders to define product vision, prioritize features, and ensure we''re building the right solutions for job seekers and recruiters.

**What You''ll Do:**
- Define product strategy and roadmap
- Gather and analyze user feedback and market research
- Write detailed product requirements and user stories
- Prioritize features based on user needs and business goals
- Collaborate with engineering and design teams
- Track product metrics and KPIs
- Conduct user interviews and usability testing
- Manage product launches and feature releases

**Focus Areas:**
- Job search and discovery features
- Application tracking and management
- AI-powered recommendations
- Subscription and billing features
- User onboarding and engagement',
    '**Required:**
- 3+ years of product management experience
- Experience with SaaS or B2C products
- Strong analytical and problem-solving skills
- Excellent communication and collaboration skills
- Experience with product analytics and metrics
- Understanding of agile development processes
- Ability to balance user needs with business goals

**Preferred:**
- Experience with job search/recruitment platforms
- Technical background (can read code, understand APIs)
- Experience with AI/ML products
- Knowledge of subscription business models
- Experience with user research and testing
- MBA or related degree',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/product-manager',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 7. Data Engineer
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440007'::uuid,
    'Data Engineer',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Build and maintain our data infrastructure to support analytics, AI features, and business intelligence. You''ll work on data pipelines, ETL processes, and ensure our data is clean, accessible, and actionable.

**What You''ll Do:**
- Design and build data pipelines for job scraping and processing
- Create ETL processes to transform and clean data
- Build data warehouses and analytics databases
- Implement data quality monitoring and validation
- Optimize database queries and data storage
- Support AI/ML teams with data preparation
- Create dashboards and reports for business intelligence
- Ensure data privacy and compliance (GDPR, etc.)

**Tech Stack:**
- PostgreSQL, Supabase
- ETL tools and data pipelines
- Python, SQL
- Data visualization tools
- Job scraping: Puppeteer, Cheerio
- Analytics: Custom dashboards, BI tools',
    '**Required:**
- 3+ years of data engineering experience
- Strong SQL skills and database design knowledge
- Experience with ETL processes and data pipelines
- Proficiency in Python or similar scripting language
- Understanding of data modeling and warehousing
- Experience with data quality and validation
- Strong problem-solving and analytical skills

**Preferred:**
- Experience with web scraping and data collection
- Knowledge of job search/recruitment data
- Experience with AI/ML data preparation
- Understanding of data privacy regulations
- Experience with analytics and BI tools
- Knowledge of PostgreSQL optimization',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/data-engineer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 8. Mobile Developer (React Native)
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440008'::uuid,
    'Mobile Developer - React Native',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Build our mobile app for iOS and Android using React Native. You''ll create a native-feeling experience that helps job seekers search, apply, and track applications on the go.

**What You''ll Do:**
- Develop iOS and Android apps using React Native
- Implement native features (push notifications, camera, etc.)
- Optimize app performance and battery usage
- Ensure smooth animations and transitions
- Integrate with backend APIs and services
- Test apps on multiple devices and OS versions
- Publish and maintain apps in App Store and Google Play
- Collaborate with designers to implement mobile UI/UX

**Tech Stack:**
- React Native, TypeScript
- Native modules and libraries
- App Store and Google Play deployment
- Push notifications, analytics
- State management (Context API, Redux)',
    '**Required:**
- 2+ years of mobile development experience
- Strong proficiency in React Native
- Experience with iOS and Android app development
- Understanding of mobile UI/UX best practices
- Experience with app store submission processes
- Knowledge of mobile performance optimization
- Strong debugging skills for mobile platforms

**Preferred:**
- Experience with native iOS (Swift) or Android (Kotlin)
- Knowledge of mobile analytics and crash reporting
- Experience with push notifications
- Understanding of mobile security best practices
- Portfolio of published mobile apps
- Experience with job search or productivity apps',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/mobile-developer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 9. QA Engineer / Test Automation
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440009'::uuid,
    'QA Engineer - Test Automation',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Ensure our platform is bug-free and reliable through comprehensive testing. You''ll write automated tests, perform manual testing, and work with the team to improve our testing processes and code quality.

**What You''ll Do:**
- Write and maintain automated test suites (unit, integration, E2E)
- Perform manual testing for new features and bug fixes
- Create test plans and test cases
- Set up and maintain CI/CD test pipelines
- Identify, document, and track bugs
- Work with developers to reproduce and fix issues
- Improve testing processes and best practices
- Ensure cross-browser and cross-device compatibility

**Tech Stack:**
- Testing: Jest, React Testing Library, Cypress
- CI/CD: GitHub Actions
- Bug tracking: GitHub Issues, Jira
- Test automation frameworks
- API testing tools (Postman, Insomnia)',
    '**Required:**
- 2+ years of QA/testing experience
- Experience with test automation frameworks
- Strong knowledge of testing methodologies
- Experience with JavaScript/TypeScript testing
- Understanding of CI/CD pipelines
- Strong attention to detail and analytical skills
- Excellent bug reporting and documentation skills

**Preferred:**
- Experience with E2E testing (Cypress, Playwright)
- Knowledge of API testing
- Experience with performance testing
- Understanding of accessibility testing
- Experience with job search/recruitment platforms
- ISTQB or similar certification',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/qa-engineer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- 10. Technical Writer / Developer Advocate
INSERT INTO jobs (
    id,
    title,
    company,
    company_id,
    location,
    salary,
    description,
    requirements,
    job_type,
    experience_level,
    industry,
    company_size,
    remote,
    source,
    url,
    logo,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    'Technical Writer / Developer Advocate',
    'Workflow Team',
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Remote',
    'Equity-based compensation',
    'Help developers and users understand our platform through clear documentation, tutorials, and content. You''ll write API docs, create guides, produce educational content, and represent Workflow in the developer community.

**What You''ll Do:**
- Write comprehensive API documentation and developer guides
- Create tutorials and how-to articles for users
- Produce technical blog posts and case studies
- Maintain documentation website and knowledge base
- Create video tutorials and educational content
- Engage with developer community (forums, social media)
- Gather user feedback and improve documentation
- Work with engineering to document new features

**Content Types:**
- API documentation
- User guides and tutorials
- Blog posts and technical articles
- Video tutorials
- Community engagement',
    '**Required:**
- 2+ years of technical writing experience
- Strong writing and communication skills
- Ability to explain complex technical concepts clearly
- Experience with documentation tools (Markdown, Git)
- Understanding of web development and APIs
- Portfolio of technical writing samples
- Self-motivated and organized

**Preferred:**
- Experience with job search/recruitment platforms
- Knowledge of React, Node.js, or similar technologies
- Experience with video content creation
- Community management experience
- Technical background (can read code)
- Experience with documentation platforms (GitBook, Notion)',
    'full-time',
    'mid',
    'Technology',
    '11-50',
    'remote',
    'manual',
    'https://workflowly.com/careers/technical-writer',
    'https://workflowly.com/logo.png',
    NOW()
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check company was created
-- SELECT * FROM companies WHERE name = 'Workflow Team';

-- Check all jobs were created
-- SELECT id, title, company, location, job_type, experience_level 
-- FROM jobs 
-- WHERE company = 'Workflow Team' 
-- ORDER BY created_at;

-- Count jobs by type
-- SELECT job_type, COUNT(*) 
-- FROM jobs 
-- WHERE company = 'Workflow Team' 
-- GROUP BY job_type;

