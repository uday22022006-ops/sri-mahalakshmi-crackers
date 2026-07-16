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

async function inspectSchema() {
  try {
    // We can run an RPC or fetch a mock query that fails or returns column info, 
    // or run a select query on pg_catalog or information_schema.
    // Wait, let's query the RPC or do a query via HTTP using the REST API.
    // In PostgREST, we can query information_schema if enabled, but usually we can't do direct SQL via createClient unless we use an RPC.
    // Let's check if there is an RPC we can use, or let's try to query public.orders to see what columns are returned or if it's empty.
    // Wait, if it has no rows, we can still see columns by fetching the swagger spec or checking what columns are in the error detail.
    // Wait, the error details said:
    // 'Failing row contains (4, null, Test Customer, 1234567890, 123 Test St, null, null, 600001, null, 2500.00, null, Pending, WhatsApp Checkout, ...)'
    // Let's do a request to the REST API /rest/v1/?apikey=... to get the OpenAPI schema! That describes all tables and columns!
    
    const fetchUrl = `${supabaseUrl}/rest/v1/`;
    const response = await fetch(fetchUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    const schema = await response.json();
    console.log("Schema keys:", Object.keys(schema));
    if (schema.definitions) {
      console.log("\n--- ORDERS TABLE DEFINITIONS ---");
      console.log(schema.definitions.orders);
      console.log("\n--- ORDER_ITEMS TABLE DEFINITIONS ---");
      console.log(schema.definitions.order_items);
    } else {
      console.log("No definitions found. Full schema output:", JSON.stringify(schema, null, 2));
    }
    
    // Let's look at /orders and /order_items definitions
    console.log("\n--- ORDERS TABLE DEFINITIONS ---");
    const orderPath = schema.paths['/orders'];
    if (orderPath && orderPath.post) {
      console.log("POST parameters (columns):", orderPath.post.parameters.map(p => `${p.name} (${p.type}) - required: ${p.required}`));
    }
    
    console.log("\n--- ORDER_ITEMS TABLE DEFINITIONS ---");
    const orderItemsPath = schema.paths['/order_items'];
    if (orderItemsPath && orderItemsPath.post) {
      console.log("POST parameters (columns):", orderItemsPath.post.parameters.map(p => `${p.name} (${p.type}) - required: ${p.required}`));
    }
    
  } catch (err) {
    console.error("Inspect schema failed:", err);
  }
}

inspectSchema();
