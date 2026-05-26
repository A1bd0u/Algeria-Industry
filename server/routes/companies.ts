import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/companies - Liste toutes les entreprises (pour l'annuaire)
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Jointure pour récupérer le nom du propriétaire si besoin
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*, users(name, email)');

    if (error) {
      console.error('Supabase Error (Companies GET):', error);
      throw new Error("Erreur de db");
    }

    const mappedCompanies = companies?.map((c: any) => ({
      ...c,
      owner: c.users,
      users: undefined
    })) || [];

    return res.json(mappedCompanies);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      {
        id: 'mock-1',
        name: 'Sonatrach',
        activity_sector: 'Énergie',
        description: 'Entreprise nationale pour la recherche, la production, le transport, la transformation et la commercialisation des hydrocarbures.',
        certified: true
      },
      {
        id: 'mock-2',
        name: 'Cevital',
        activity_sector: 'Agroalimentaire',
        description: 'Premier groupe privé algérien, présent dans divers secteurs.',
        certified: true
      }
    ]);
  }
});

// GET /api/companies/:id - Détails d'une entreprise
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: company, error } = await supabase
      .from('companies')
      .select('*, users(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('Supabase Error (Company GET):', error);
      throw new Error("Erreur");
    }

    const mappedCompany = {
      ...company,
      owner: company.users,
      users: undefined
    };

    return res.json(mappedCompany);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json({
      id: req.params.id,
      name: 'Entreprise Exemple',
      activity_sector: 'Industrie',
      description: 'Ceci est un exemple car la base de données n\'est pas encore configurée.'
    });
  }
});

// POST /api/companies - Créer ou mettre à jour le profil entreprise
router.post('/', async (req, res) => {
  const { name, nif, rc, description, activity_sector, owner_id } = req.body;

  if (!name || !owner_id) {
    return res.status(400).json({ error: "Le nom et l'ID du propriétaire sont obligatoires." });
  }

  try {
    const supabase = getSupabase();
    
    // Vérifier si l'utilisateur a déjà une entreprise
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', owner_id)
      .maybeSingle();

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('companies')
        .update({ name, nif, rc, description, activity_sector })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw error;
      return res.json(data);
    } else {
      // Insert
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name, nif, rc, description, activity_sector, owner_id }])
        .select()
        .single();
        
      if (error) throw error;
      return res.status(201).json(data);
    }
  } catch (err: any) {
    console.error('Supabase Error (Company POST):', err.message);
    return res.status(500).json({ error: "Erreur lors de la sauvegarde de l'entreprise." });
  }
});

export default router;
