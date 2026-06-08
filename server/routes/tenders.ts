import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { generateReferenceId } from '../utils/reference';

const router = express.Router();

// GET /api/tenders - Liste tous les appels d'offres
router.get('/', async (req, res) => {
  try {
    const mockTenders = [
      {
        id: '1',
        title: 'Fourniture d\'EPI (Équipements de Protection Individuelle)',
        description: 'Nous recherchons un fournisseur pour 500 casques, 1000 paires de gants et 500 gilets de sécurité.',
        budget: '2 000 000 DZD',
        deadline: '2026-06-30',
        category: 'Sécurité Industrielle',
        author_id: 'mock-auth',
        status: 'open',
        created_at: new Date().toISOString(),
        author: {
          name: 'Mohammed Ali',
          company: 'Sonatrach Hassi Messaoud'
        }
      },
      {
        id: '2',
        title: 'Maintenance Préventive Ligne de Production Automatisée',
        description: 'Contrat annuel de maintenance pour ligne de production Krones.',
        budget: '5 000 000 DZD',
        deadline: '2026-06-15',
        category: 'Maintenance Industrielle',
        author_id: 'mock-auth',
        status: 'open',
        created_at: new Date().toISOString(),
        author: {
          name: 'Sarah Yelles',
          company: 'Cevital Agro-Industrie'
        }
      },
      {
        id: '3',
        title: 'Acquisition de 3 Chariots Élévateurs Électriques',
        description: 'Appel d\'offres pour l\'achat de matériels de manutention avec contrat de SAV.',
        budget: '12 000 000 DZD',
        deadline: '2026-07-01',
        category: 'Logistique & Manutention',
        author_id: 'mock-auth',
        status: 'open',
        created_at: new Date().toISOString(),
        author: {
          name: 'Karim Bouzid',
          company: 'Rouiba Logistique'
        }
      }
    ];

    return res.json(mockTenders);
  } catch (err: any) {
    console.error("Supabase Error GET /tenders:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/tenders/my - Obtenir les appels d'offres de l'utilisateur connecté
router.get('/my', requireAuth, async (req, res) => {
  const user = (req as any).user;
  try {
    const mockTenders = [
      {
        id: '1',
        title: 'Fourniture d\'EPI (Équipements de Protection Individuelle)',
        description: 'Nous recherchons un fournisseur pour 500 casques, 1000 paires de gants et 500 gilets de sécurité.',
        budget: '2 000 000 DZD',
        deadline: '2026-06-30',
        category: 'Sécurité Industrielle',
        author_id: user.id,
        status: 'open',
        created_at: new Date().toISOString(),
        author: {
          name: user.name,
          company: user.company
        }
      }
    ];

    return res.json(mockTenders);
  } catch (err: any) {
    console.error("Supabase Error GET /tenders/my:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/tenders - Créer un appel d'offres
router.post('/', requireAuth, requireRole(['acheteur', 'admin']), async (req, res) => {
  const { title, description, budget, deadline, category, file_url } = req.body;
  const user = (req as any).user;

  if (!title || !description) {
    return res.status(400).json({ error: 'Le titre et la description sont obligatoires.' });
  }

  try {
    const supabase = getSupabase();
    const finalDescription = file_url ? `${description}\n\n[ATTACHMENT]: ${file_url}` : description;
    const reference_id = generateReferenceId('TND');
    
    const { data, error } = await supabase
      .from('tenders')
      .insert([
        {
          reference_id,
          title,
          description: finalDescription,
          budget: budget || null,
          deadline: deadline || null,
          category,
          author_id: user.id,
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
    
    // Validate UUID format before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(404).json({ error: "Appel d'offres non trouvé (ID invalide)" });
    }

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
