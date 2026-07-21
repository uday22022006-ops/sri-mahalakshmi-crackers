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

const dummyCartItems = [
  {
    id: 10,
    name: 'Fancy Flower Pots Special',
    category: 'Flower Pots',
    original_price: 500,
    price: 250,
    image: 'https://example.com/flowerpot.jpg',
    qty: 3
  },
  {
    id: 25,
    name: 'Deluxe Atom Bomb',
    category: 'Atom Bomb',
    original_price: 150,
    price: 80,
    image: 'https://example.com/bomb.jpg',
    qty: 5
  }
];

async function testActualInsertion() {
  try {
    const uniqueOrderNo = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Simulating checkout insert query for Order ID:", uniqueOrderNo);

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_id: uniqueOrderNo,
        customer_name: 'Verification Customer',
        phone: '8344112220',
        address: '456 Celebration Road, Sivakasi',
        pincode: '626123',
        total_amount: 1150,
        order_details: JSON.stringify(dummyCartItems),
        payment_method: 'WhatsApp Checkout',
        status: 'Pending'
      }])
      .select();

    if (error) {
      console.error("Simulation insert failed:", error);
    } else {
      console.log("Simulation insert succeeded! Inserted record:", data[0]);

      // Now let's simulate how AdminDashboard views this order detail
      console.log("\nSimulating admin dashboard order detail parsing...");
      const order = data[0];
      if (order.order_details) {
        const parsedItems = JSON.parse(order.order_details);
        console.log("Parsed items for details modal:", parsedItems);
        console.log("Item 1 Name:", parsedItems[0].name || parsedItems[0].product_name);
        console.log("Item 1 Qty:", parsedItems[0].qty);
        console.log("Item 1 Price:", parsedItems[0].price);
      }

      // Clean up
      console.log("\nCleaning up simulation record...");
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (deleteError) {
        console.error("Cleanup error:", deleteError);
      } else {
        console.log("Successfully cleaned up.");
      }
    }
  } catch (err) {
    console.error("Verification test failed:", err);
  }
}

testActualInsertion();
