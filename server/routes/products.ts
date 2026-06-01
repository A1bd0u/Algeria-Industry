import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/products - Liste des produits
router.get('/', async (req, res) => {
  try {
    const mockProducts = [
      {
        id: '1',
        name: 'Pièces d\'usinage CNC',
        category: 'Usinage',
        description: 'Usinage mécanique de précision pour pièces industrielles complexes.',
        price: 'Sur devis',
        status: 'Actif',
        owner_id: 'mock-user-1',
        created_at: new Date().toISOString(),
        file_url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&auto=format&fit=crop',
        color: 'text-success'
      },
      {
        id: '4',
        name: 'Pièces de Rechange Auto',
        category: 'Automobile',
        description: 'Vente et distribution de pièces auto d\'origine et adaptables.',
        price: 'Variable',
        status: 'Actif',
        owner_id: 'mock-user-2',
        created_at: new Date().toISOString(),
        file_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop',
        color: 'text-success'
      },
      {
        id: '2',
        name: 'Transformateur 400kVA',
        category: 'Énergie',
        description: 'Transformateur de distribution électrique triphasé haute performance.',
        price: '2 500 000 DZD',
        status: 'Actif',
        owner_id: 'mock-user-2',
        created_at: new Date().toISOString(),
        file_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop',
        color: 'text-success'
      },
      {
        id: '3',
        name: 'Moules d\'injection plastique',
        category: 'Plasturgie',
        description: 'Conception et fabrication de moules d\'injection sur mesure.',
        price: 'Sur devis',
        status: 'Inactif',
        owner_id: 'mock-user-3',
        created_at: new Date().toISOString(),
        file_url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=600&auto=format&fit=crop',
        color: 'text-gray-400'
      }
    ];

    return res.json(mockProducts);
  } catch (err: any) {
    console.error("Supabase Error GET /products:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/products/my - Liste des produits de l'utilisateur connecté
router.get('/my', requireAuth, async (req, res) => {
  const user = (req as any).user;
  try {
    const mockProducts = [
      {
        id: '1',
        name: 'Pièces d\'usinage CNC',
        category: 'Usinage',
        description: 'Usinage mécanique de précision pour pièces industrielles complexes.',
        price: 'Sur devis',
        status: 'Actif',
        owner_id: user.id,
        created_at: new Date().toISOString(),
        file_url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&auto=format&fit=crop',
        color: 'text-success'
      }
    ];

    return res.json(mockProducts);
  } catch (err: any) {
    console.error("Supabase Error GET /products/my:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Créer un produit
router.post('/', requireAuth, requireRole(['fournisseur', 'admin']), async (req, res) => {
  const { name, category, price, description, file_url, status } = req.body;
  const user = (req as any).user;

  try {
    const supabase = getSupabase();
    
    // Fallback \`category\` to \`cat\` in db if your schema expects it
    const finalDescription = file_url ? `${description || ''}\n\n[ATTACHMENT]: ${file_url}` : (description || '');
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, category: category || "Non catégorisé", description: finalDescription, price, status: status || 'Actif', owner_id: user.id }])
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
