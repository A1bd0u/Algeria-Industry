import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('supabase url:', supabaseUrl);
  const { data, error } = await supabase.from('tenders').select('*');
  console.log(error);
}

test();
