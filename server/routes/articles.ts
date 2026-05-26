import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/articles - Liste des articles (Blog/News)
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (Articles GET):', error);
      throw new Error("Erreur de db");
    }

    return res.json(articles || []);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      {
        id: 1,
        title: "L'Algérie accélère sa transition vers l'hydrogène vert",
        excerpt: "Le gouvernement algérien a dévoilé une nouvelle feuille de route ambitieuse pour devenir un leader régional de l'énergie propre d'ici 2030.",
        category: "Énergie",
        author: "Karim Mansouri",
        date: "28 Mars 2026",
        readTime: "6 min",
        image: "https://picsum.photos/seed/hydrogen/800/500",
        featured: true
      },
      {
        id: 2,
        title: "Industrie 4.0 : Les PME algériennes sautent le pas",
        excerpt: "De plus en plus de petites et moyennes entreprises adoptent des solutions d'automatisation et d'IA pour booster leur productivité.",
        category: "Technologie",
        author: "Sarah Benali",
        date: "25 Mars 2026",
        readTime: "4 min",
        image: "https://picsum.photos/seed/tech/600/400",
        featured: false
      },
      {
        id: 3,
        title: "Nouveau code de l'investissement : Premiers bilans",
        excerpt: "Six mois après son entrée en vigueur, le nouveau cadre législatif attire déjà des investisseurs majeurs dans le secteur automobile.",
        category: "Économie",
        author: "Ahmed Ziri",
        date: "20 Mars 2026",
        readTime: "8 min",
        image: "https://picsum.photos/seed/economy/600/400",
        featured: false
      }
    ]);
  }
});

export default router;
