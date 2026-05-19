import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xvokwyntwdetsyzyeofr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2t3eW50d2RldHN5enllb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjA0MTMsImV4cCI6MjA4MDEzNjQxM30.QOUjA6gL71YuxyYf2COxfqxiy36RyZpTCovoBahR91E';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateCourses() {
    const { data, error } = await supabase
        .from('courses')
        .update({ company: 'Hope Dawah Institute' })
        .eq('company', 'Hope Dawah Institute');
        
    if (error) {
        console.error('Error updating courses:', error);
    } else {
        console.log('Successfully updated courses database records');
    }
}

updateCourses();
