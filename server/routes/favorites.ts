import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/favorites - Get specific user favorites
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // In a real app we would have a table linking users to companies/tenders
    const { data: favs, error } = await supabase
      .from('favorites')
      .select('*');

    if (error) {
       throw error;
    }
    
    return res.json(favs || []);
  } catch(e: any) {
    console.error("Supabase Error GET /favorites:", e);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Supabase Error DELETE /favorites/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/favorites
router.post('/', async (req, res) => {
  const { item_type, item_id, user_id } = req.body;
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ item_type, item_id, user_id: user_id || null }])
      .select()
      .single();
      
    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.error("Supabase Error POST /favorites:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
