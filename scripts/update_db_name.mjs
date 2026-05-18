import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvokwyntwdetsyzyeofr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2t3eW50d2RldHN5enllb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjA0MTMsImV4cCI6MjA4MDEzNjQxM30.QOUjA6gL71YuxyYf2COxfqxiy36RyZpTCovoBahR91E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCourses() {
    console.log('Updating courses in Supabase...');
    
    // First fetch courses to see what we have
    const { data: courses, error: fetchError } = await supabase
        .from('courses')
        .select('id, company');
        
    if (fetchError) {
        console.error('Error fetching courses:', fetchError);
        return;
    }
    
    console.log(`Found ${courses.length} courses.`);
    
    let updatedCount = 0;
    for (const course of courses) {
        if (course.company === 'One Islam Institute') {
            const { error: updateError } = await supabase
                .from('courses')
                .update({ company: 'Hope Dawah Institute' })
                .eq('id', course.id);
                
            if (updateError) {
                console.error(`Failed to update course ${course.id}:`, updateError);
            } else {
                updatedCount++;
            }
        }
    }
    
    console.log(`Successfully updated ${updatedCount} courses.`);
}

updateCourses().catch(console.error);
