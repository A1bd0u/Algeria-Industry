import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/favorites - Get specific user favorites
router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).user;
  try {
    const supabase = getSupabase();
    
    const { data: favs, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);

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
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const supabase = getSupabase();
    
    // Make sure they own this favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Supabase Error DELETE /favorites/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/favorites
router.post('/', requireAuth, async (req, res) => {
  const { item_type, item_id } = req.body;
  const user = (req as any).user;
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ item_type, item_id, user_id: user.id }])
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
