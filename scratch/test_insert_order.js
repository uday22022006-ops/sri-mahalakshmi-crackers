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
    console.log("Inserting test order...");
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: 'Test Customer',
        phone: '1234567890',
        address: '123 Test St',
        pincode: '600001',
        total_amount: 2500,
        payment_method: 'WhatsApp Checkout',
        status: 'Pending'
      }])
      .select();

    if (orderError) {
      console.error("Order Insert Error:", orderError);
      return;
    }

    console.log("Order Inserted successfully. Data:", orderData);
    const orderId = orderData[0].id;

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
        },
        {
          order_id: orderId,
          product_id: 2,
          product_name: 'Test Product 2',
          price: 500,
          qty: 2
        }
      ])
      .select();

    if (itemsError) {
      console.error("Items Insert Error:", itemsError);
      return;
    }

    console.log("Items Inserted successfully. Data:", itemsData);

    // Clean up
    console.log("Cleaning up test order...");
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (deleteError) {
      console.error("Cleanup error:", deleteError);
    } else {
      console.log("Cleaned up successfully.");
    }

  } catch (err) {
    console.error("Test failed:", err);
  }
}

testInsert();
