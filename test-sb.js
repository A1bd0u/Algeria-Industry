import { getSupabase } from './server/db/supabaseClient.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const sb = getSupabase();
  const { data, error } = await sb.from('tenders').insert([{ title: 'test', description: 'desc', file_url: '/test.pdf' }]).select();
  console.log(data, error);
}
test();
