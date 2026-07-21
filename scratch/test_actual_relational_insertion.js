import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse env manually
const envPath = '.env';
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
    id: 12,
    name: 'Flower Pots Deluxe (5 Pcs)',
    category: 'FLOWER POTS',
    original_price: 1200,
    price: 626,
    qty: 3
  },
  {
    id: 15,
    name: 'Fancy Sparklers Red',
    category: 'SPARKLERS',
    original_price: 400,
    price: 200,
    qty: 2
  }
];

async function testRelationalInsertion() {
  try {
    const uniqueOrderNo = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("1. Simulating checkout database write...");
    console.log("Inserting order metadata...");
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: uniqueOrderNo,
        customer_name: 'Relational Test Customer',
        phone: '9999999999',
        address: '777 Sparkler Ave, Sivakasi',
        landmark: 'Near Temple Gate',
        city: 'Sivakasi',
        pincode: '626123',
        delivery_date: '2026-10-20',
        total_amount: 2278,
        order_details: JSON.stringify(dummyCartItems),
        payment_method: 'WhatsApp Checkout',
        status: 'Pending'
      }])
      .select();

    if (orderError) {
      console.error("Order Insert Failed:", orderError);
      return;
    }

    const insertedOrder = orderData[0];
    console.log("Order Insert Succeeded! ID:", insertedOrder.id, "Order No:", insertedOrder.order_id);
    console.log("City:", insertedOrder.city, "Landmark:", insertedOrder.landmark, "Delivery Date:", insertedOrder.delivery_date);

    console.log("\n2. Inserting relational items...");
    const orderItemsPayload = dummyCartItems.map(item => ({
      order_id: insertedOrder.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      qty: item.qty
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload)
      .select();

    if (itemsError) {
      console.error("Order Items Insert Failed:", itemsError);
    } else {
      console.log("Order Items Insert Succeeded! Rows inserted:", itemsData.length);
      console.log("Inserted Items:", itemsData.map(item => `${item.product_name} (Qty: ${item.qty}, Price: ${item.price})`));
    }

    // Now let's fetch to verify relational link
    console.log("\n3. Querying order items linking back to order ID:", insertedOrder.id);
    const { data: fetchItems, error: fetchError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', insertedOrder.id);
      
    if (fetchError) {
      console.error("Fetch items failed:", fetchError);
    } else {
      console.log("Fetched linked items count:", fetchItems.length);
    }

    // Clean up order (should cascade delete items automatically)
    console.log("\n4. Cleaning up test records (Deleting Order)...");
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', insertedOrder.id);

    if (deleteError) {
      console.error("Deletion failed:", deleteError);
    } else {
      console.log("Cleaned up order successfully.");
      
      // Let's verify that the order items were deleted by cascade
      const { data: verifyItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', insertedOrder.id);
        
      console.log("Remaining order items in database for this order:", verifyItems?.length ?? 0);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testRelationalInsertion();
