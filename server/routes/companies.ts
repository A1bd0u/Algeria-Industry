import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { generateReferenceId } from '../utils/reference';

const router = express.Router();

// GET /api/companies - Liste toutes les entreprises (pour l'annuaire)
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*');

    if (error) {
      throw error;
    }

    return res.json(companies || []);
  } catch (err: any) {
    console.error("Supabase Error GET /companies:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/companies/:id - Détails d'une entreprise
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Validate UUID format before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(404).json({ error: "Entreprise non trouvée (ID invalide)" });
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.json(company);
  } catch (err: any) {
    if (err.code === '22P02') {
       // Invalid UUID
       return res.status(404).json({ error: "Invalid ID format" });
    }
    console.error("Supabase Error GET /companies/:id:", err);
    return res.status(500).json({ error: err.message });
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
      const reference_id = generateReferenceId('CMP');
      const { data, error } = await supabase
        .from('companies')
        .insert([{ reference_id, name, nif, rc, description, activity_sector, owner_id }])
        .select()
        .single();
        
      if (error) throw error;
      return res.status(201).json(data);
    }
  } catch (err: any) {
    // Supabase Error
    return res.status(500).json({ error: "Erreur lors de la sauvegarde de l'entreprise." });
  }
});

export default router;
