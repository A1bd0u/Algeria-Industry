import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/articles - Liste des articles (Blog/News)
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(articles || []);
  } catch (err: any) {
    console.error("Supabase Error GET /articles:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
