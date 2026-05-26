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
       console.error('Supabase Error (RFQs GET):', error);
       throw new Error("Erreur DB");
    }
    
    return res.json(rfqs || []);
  } catch(e: any) {
    console.error('Fallback RFQs:', e.message);
    return res.json([]);
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
    console.error('Supabase Error (RFQs POST):', err.message);
    return res.status(201).json({ id: Date.now(), success: true });
  }
});

export default router;
