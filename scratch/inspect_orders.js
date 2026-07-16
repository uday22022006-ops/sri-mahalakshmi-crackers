import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    console.log("Connecting to Supabase at:", supabaseUrl);
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
      console.log("Error querying orders table:", error.message);
      console.log("Detail:", JSON.stringify(error, null, 2));
    } else {
      console.log("Success! Columns:", data.length > 0 ? Object.keys(data[0]) : "No rows, but table exists.");
      console.log("Sample data:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

test();
