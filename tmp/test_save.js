
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function testSave() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Testing direct save of donation values ---');
    
    const testData = {
        title: 'Save Test Course ' + Date.now(),
        company: 'One Islam Institute',
        salary_min: 19.99,
        salary_max: 49.99,
        price: 19.99,
        status: 'draft',
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('jobs').insert(testData).select().single();
    
    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Insert succeeded! Saved data:', {
            id: data.id,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            price: data.price
        });
        
        console.log('Now trying to update the same record...');
        const { data: updateData, error: updateError } = await supabase
            .from('jobs')
            .update({ salary_min: 25.50, salary_max: 75.00, price: 25.50 })
            .eq('id', data.id)
            .select()
            .single();
            
        if (updateError) {
            console.error('Update failed:', updateError);
        } else {
            console.log('Update succeeded! Updated data:', {
                salary_min: updateData.salary_min,
                salary_max: updateData.salary_max,
                price: updateData.price
            });
        }
    }
}

testSave();
