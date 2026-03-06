import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSchema() {
  let report = '';
  try {
    // Query information_schema for table names
    const { data: tablesData, error: tablesError } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
    
    let tableNames = [];
    if (tablesError) {
      report += `Error fetching tables via info_schema: ${tablesError.message}\n`;
      // Fallback
      tableNames = ['users', 'applications', 'jobs', 'notifications', 'study_progress', 'lesson_progress', 'study_streaks', 'course_modules', 'course_lessons'];
    } else {
      tableNames = tablesData.map(t => t.table_name);
    }
    // ... rest of the logic remains same

    for (const table of tableNames) {
      report += `\n=== TABLE: ${table} ===\n`;
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          report += `[${table}] Error: ${error.message} (Code: ${error.code})\n`;
        } else if (data && data.length > 0) {
          report += `[${table}] Columns: ${Object.keys(data[0]).join(', ')}\n`;
          const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
          report += `[${table}] Count: ${count}\n`;
        } else {
          report += `[${table}] Table exists but is empty.\n`;
        }
      } catch (err) {
        report += `[${table}] Fatal: ${err.message}\n`;
      }
    }
  } catch (err) {
    report += `Fatal checkSchema Error: ${err.message}\n`;
  }
  fs.writeFileSync('schema-report.txt', report);
  console.log('Report written to schema-report.txt');
}

checkSchema();
