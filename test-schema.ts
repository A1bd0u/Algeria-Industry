import { getSupabase } from './server/db/supabaseClient';

async function run() {
  const supabase = getSupabase();
  const { data: cols, error: err } = await supabase.from('kyc_requests').select('*').limit(1);
  console.log("data:", cols, "err:", err);
}

run();
