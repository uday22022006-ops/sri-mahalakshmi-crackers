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

async function testInsert() {
  try {
    console.log("Inserting test order with dummy order_id...");
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: 'Test Customer',
        phone: '1234567890',
        address: '123 Test St',
        pincode: '600001',
        total_amount: 2500,
        payment_method: 'WhatsApp Checkout',
        status: 'Pending',
        order_id: 99999,
        order_details: 'Test order details'
      }])
      .select();

    if (error) {
      console.error("Insert Error:", error);
    } else {
      console.log("Successfully inserted order! Data columns:", Object.keys(data[0]));
      console.log("Full data row:", data[0]);
      
      const orderId = data[0].id;
      console.log("Inserting test order items for order ID:", orderId);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: orderId,
            product_id: 1,
            product_name: 'Test Product 1',
            price: 1500,
            qty: 1
          }
        ])
        .select();

      if (itemsError) {
        console.error("Items Insert Error:", itemsError);
      } else {
        console.log("Successfully inserted item! Data columns:", Object.keys(itemsData[0]));
        console.log("Full item row:", itemsData[0]);
      }

      // Clean up
      console.log("Cleaning up...");
      await supabase.from('orders').delete().eq('id', orderId);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testInsert();
