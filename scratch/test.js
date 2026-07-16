import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lgyemfynoewifhngviet.supabase.co',
  'sb_publishable_raOnEu4_-V4VK2u1tSmi4g__X83x8IC'
);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('DATA:', data);
  console.log('ERROR:', error);
}
run();
