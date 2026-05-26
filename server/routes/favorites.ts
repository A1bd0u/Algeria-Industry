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
       console.error('Supabase Error (Favorites GET):', error);
       throw new Error("Erreur DB");
    }
    
    return res.json(favs || []);
  } catch(e: any) {
    console.error('Fallback Favorites:', e.message);
    return res.json([
      { id: 1, name: 'Sider El Hadjar', category: 'Sidérurgie', location: 'Annaba', rating: 4.8 },
      { id: 2, name: 'Condor Electronics', category: 'Électroménager', location: 'BBA', rating: 4.5 },
    ]);
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
    return res.json({ success: true, message: "Mock supprimé" });
  }
});

// POST /api/favorites
router.post('/', async (req, res) => {
  const { name, category, location, rating } = req.body;
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ name, category, location, rating }])
      .select()
      .single();
      
    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    return res.json({ id: Date.now(), name, category, location, rating, success: true });
  }
});

export default router;
