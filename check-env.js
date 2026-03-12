import dotenv from 'dotenv';
dotenv.config();

console.log('--- Env Check ---');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'DEFINED (' + process.env.SUPABASE_URL.substring(0, 10) + '...)' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'DEFINED' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINED' : 'MISSING');
console.log('PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY ? 'DEFINED' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
console.log('--- End Check ---');
