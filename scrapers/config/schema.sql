-- Database Schema for Job Scrapers

-- Indeed Jobs Table
CREATE TABLE IF NOT EXISTS indeed_jobs (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(100),
    description TEXT,
    url TEXT NOT NULL,
    date_posted TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_indeed_job_id ON indeed_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_indeed_date_posted ON indeed_jobs(date_posted);
CREATE INDEX IF NOT EXISTS idx_indeed_company ON indeed_jobs(company);

-- LinkedIn Jobs Table
CREATE TABLE IF NOT EXISTS linkedin_jobs (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    industry VARCHAR(255),
    seniority_level VARCHAR(100),
    employment_type VARCHAR(100),
    description TEXT,
    skills_required TEXT[],
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_linkedin_job_id ON linkedin_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_company ON linkedin_jobs(company);
CREATE INDEX IF NOT EXISTS idx_linkedin_industry ON linkedin_jobs(industry);

-- Glassdoor Companies Table
CREATE TABLE IF NOT EXISTS glassdoor_companies (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    salary_range VARCHAR(100),
    interview_difficulty DECIMAL(3, 2),
    ceo_approval_rating DECIMAL(3, 2),
    pros TEXT,
    cons TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_glassdoor_company_id ON glassdoor_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_glassdoor_company_name ON glassdoor_companies(company_name);

-- Glassdoor Salary Data Table
CREATE TABLE IF NOT EXISTS glassdoor_salaries (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES glassdoor_companies(company_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_glassdoor_salaries_company ON glassdoor_salaries(company_id);
CREATE INDEX IF NOT EXISTS idx_glassdoor_salaries_position ON glassdoor_salaries(position);

-- Scraping Logs Table
CREATE TABLE IF NOT EXISTS scraping_logs (
    id SERIAL PRIMARY KEY,
    scraper_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    jobs_scraped INTEGER DEFAULT 0,
    errors TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    execution_time_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_scraping_logs_type ON scraping_logs(scraper_type);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_started ON scraping_logs(started_at);

