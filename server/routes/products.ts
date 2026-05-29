import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/products - Liste des produits
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert string colors if they don't exist
    const enhancedProducts = (products || []).map(p => ({
      ...p,
      color: p.status === 'Actif' ? 'text-success' : 'text-gray-400'
    }));

    return res.json(enhancedProducts);
  } catch (err: any) {
    console.error("Supabase Error GET /products:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Créer un produit
router.post('/', async (req, res) => {
  const { name, cat, price, status } = req.body;

  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, cat, price, status: status || 'Actif' }])
      .select()
      .single();
      
    if (error) throw error;
    
    const responseData = {
        ...data,
        color: data.status === 'Actif' ? 'text-success' : 'text-gray-400'
    };
    return res.status(201).json(responseData);
  } catch (err: any) {
    console.error("Supabase Error POST /products:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
