import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
let url = '', key = '';
for (const line of lines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    url = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  }
  if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) {
    key = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase
    .schema('me_dataspace')
    .from('users')
    .select('*')
    .limit(1);
  console.log("DATA KEYS:", data ? Object.keys(data[0]) : null);
  console.log("DATA ROW:", data ? data[0] : null);
  console.log("ERROR:", error);
}
test();
