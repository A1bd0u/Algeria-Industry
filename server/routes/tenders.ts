import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/tenders - Liste tous les appels d'offres
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // We select without joining users if the users table causes issues, but we can try it first.
    // If it fails with users, it will jump to catch
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('*, author:users(name, company)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(tenders || []);
  } catch (err: any) {
    console.error("Supabase Error GET /tenders:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/tenders - Créer un appel d'offres
router.post('/', async (req, res) => {
  const { title, description, budget, deadline, category, author_id } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Le titre et la description sont obligatoires.' });
  }

  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('tenders')
      .insert([
        {
          title,
          description,
          budget: budget || null,
          deadline: deadline || null,
          category,
          author_id,
          status: 'open'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(data);
  } catch (err: any) {
    console.error("Supabase Error POST /tenders:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/tenders/:id - Obtenir un appel d'offres spécifique
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: tender, error } = await supabase
      .from('tenders')
      .select('*, author:users(name, company)')
      .eq('id', req.params.id)
      .single();

    if (error) {
      throw error;
    }

    return res.json(tender);
  } catch (err: any) {
    console.error("Supabase Error GET /tenders/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
