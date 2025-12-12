import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env manually since we are running this script directly
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Checking Supabase Configuration...');
console.log(`URL Present: ${!!url}`);
console.log(`Key Present: ${!!key}`);

if (url) console.log(`URL Value (masked): ${url.substring(0, 10)}...`);

if (!url || !key) {
    console.error('❌ Missing Supabase credentials in .env file.');
    process.exit(1);
}

const supabase = createClient(url, key);

async function checkConnection() {
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed or table "users" missing.');
            console.error('Error details:', error.message);
            if (error.code === 'PGRST301') {
                console.error('Hint: RLS might be blocking access, or the table does not exist.');
            }
        } else {
            console.log('✅ Connected to Supabase successfully!');
            console.log('✅ "users" table exists and is accessible.');
        }
    } catch (err) {
        console.error('❌ Unexpected error during connection check:', err.message);
    }
}

checkConnection();
