import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function getOpenAPISpec() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    try {
        const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
        const spec = await res.json();
        
        const jobsDefinition = spec.definitions.jobs;
        console.log("Jobs columns from OpenAPI:");
        for (const [colName, colDef] of Object.entries(jobsDefinition.properties)) {
            if (colDef.type === 'number' || colDef.type === 'integer' || colDef.format === 'numeric') {
                console.log(`${colName}: type=${colDef.type}, format=${colDef.format}, description=${colDef.description || ''}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

getOpenAPISpec();
