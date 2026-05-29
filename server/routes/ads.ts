import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!ads || ads.length === 0) {
      return res.json([]);
    }

    return res.json(ads);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, type, url, duration } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Nom et type requis' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('ads')
      .insert([{ title: name, objective: type, duration, status: 'en_attente' }])
      .select()
      .single();
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(201).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
