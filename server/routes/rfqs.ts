import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/rfqs - Get RFQs
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
       throw error;
    }
    
    return res.json(rfqs || []);
  } catch(e: any) {
    console.error("Supabase Error GET /rfqs:", e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/rfqs - Submit a new RFQ (Demande de devis)
router.post('/', async (req, res) => {
  const { title, desiredDate, items, budget } = req.body;

  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('rfqs')
      .insert([{ title, target_date: desiredDate, items, budget }])
      .select()
      .single();
      
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err: any) {
    console.error("Supabase Error POST /rfqs:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
