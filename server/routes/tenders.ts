import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/tenders - Liste tous les appels d'offres
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('*, users(name, company)');

    if (error) {
      console.error('Supabase Error (Tenders GET):', error);
      throw new Error("Supabase n'est pas configuré correctement.");
    }

    const mappedTenders = tenders?.map((t: any) => ({
      ...t,
      author: t.users,
      users: undefined
    })) || [];

    return res.json(mappedTenders);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    // Fallback de démonstration si Supabase n'est pas encore configuré
    return res.json([
      {
        id: '1',
        title: 'Fourniture de pompes hydrauliques industrielles',
        description: 'Nous recherchons un fournisseur pour 50 pompes hydrauliques haute pression pour nos installations dans le sud.',
        budget: 15000000,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'Équipement Industriel',
        author: { name: 'Ahmed', company: 'Sonatrach' }
      },
      {
        id: '2',
        title: 'Maintenance préventive des turbines à gaz',
        description: 'Contrat annuel pour la maintenance préventive et corrective de 3 turbines à gaz modèle GE.',
        budget: 45000000,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'Maintenance',
        author: { name: 'Karim', company: 'Sonelgaz' }
      }
    ]);
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
          budget,
          deadline,
          category,
          author_id,
          status: 'open'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error (Tenders POST):', error);
      return res.status(500).json({ error: "Erreur lors de la création de l'appel d'offres." });
    }

    return res.status(201).json(data);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.status(500).json({ error: "Supabase n'est pas encore configuré." });
  }
});

// GET /api/tenders/:id - Obtenir un appel d'offres spécifique
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: tender, error } = await supabase
      .from('tenders')
      .select('*, users(name, company)')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('Supabase Error (Tender GET):', error);
      throw new Error("Tender introuvable ou erreur db");
    }

    const mappedTender = {
      ...tender,
      author: tender.users,
      users: undefined
    };

    return res.json(mappedTender);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    // Mock for demo
    return res.json({
      id: req.params.id,
      title: 'Détails non disponibles en mode démonstration',
      description: 'Veuillez configurer Supabase pour voir les détails complets.',
      status: 'open',
      category: 'Inconnue'
    });
  }
});

export default router;
