/**
 * Database Setup Script
 * Creates tables and indexes for the job scrapers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    logger.info('Setting up database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await client.query(schema);
    
    logger.info('✅ Database setup completed successfully');
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

