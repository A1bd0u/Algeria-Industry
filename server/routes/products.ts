import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/products - Liste des produits
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Supabase Error (Products GET):', error);
      throw new Error("Erreur de db");
    }

    return res.json(products || []);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      { id: 'p1', name: 'Pompe Industrielle PX1', cat: 'Hydraulique', price: '450,000 DZD', status: 'Actif', color: 'text-success' },
      { id: 'p2', name: 'Groupe Électrogène 100kVA', cat: 'Énergie', price: '1,200,000 DZD', status: 'Actif', color: 'text-success' },
      { id: 'p3', name: "Compresseur d'air", cat: 'Pneumatique', price: '280,000 DZD', status: 'En rupture', color: 'text-error' },
    ]);
  }
});

// POST /api/products - Créer un produit
router.post('/', async (req, res) => {
  const { name, cat, price, status } = req.body;

  try {
    const supabase = getSupabase();
    
    // Pour une vraie base, on ajouterait owner_id
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, cat, price, status }])
      .select()
      .single();
      
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err: any) {
    console.error('Supabase Error (Product POST):', err.message);
    // Mock for demo
    return res.status(201).json({
       id: `p-${Math.floor(Math.random() * 1000)}`,
       name,
       cat,
       price,
       status,
       color: status === 'Actif' ? 'text-success' : 'text-gray-400'
    });
  }
});

export default router;
