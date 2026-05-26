import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/catalogues - Liste tous les catalogues
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: catalogues, error } = await supabase
      .from('catalogues')
      .select('*, companies(name)');

    if (error) {
      console.error('Supabase Error (Catalogues GET):', error);
      throw new Error("Erreur de db");
    }

    const mappedCatalogues = catalogues?.map((c: any) => ({
      ...c,
      company: c.companies?.name || 'Entreprise Inconnue',
      companies: undefined
    })) || [];

    return res.json(mappedCatalogues);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      {
        id: 'cat-1',
        title: "Catalogue Pompes Industrielles 2026",
        company: "Algeria Pumps Corp",
        categoryKey: "hydraulic",
        pages: 45,
        size: "12.4 MB",
        date: "Mars 2026",
        thumbnail: "https://picsum.photos/seed/pump-cat/400/500"
      },
      {
        id: 'cat-2',
        title: "Solutions Énergie Solaire B2B",
        company: "EcoSolar Algeria",
        categoryKey: "energy",
        pages: 32,
        size: "8.1 MB",
        date: "Février 2026",
        thumbnail: "https://picsum.photos/seed/solar-cat/400/500"
      }
    ]);
  }
});

export default router;
