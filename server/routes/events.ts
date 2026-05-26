import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/events - Liste des événements
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Supabase Error (Events GET):', error);
      throw new Error("Erreur de db");
    }

    return res.json(events || []);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      {
        id: 1,
        title: "Salon International de l'Industrie (Algeria Industry 2026)",
        type: "Physique",
        category: "Salon",
        date: "15 - 18 Juin 2026",
        location: "Palais des Expositions (SAFEX), Alger",
        description: "Le plus grand rassemblement industriel de l'année en Algérie. Plus de 500 exposants attendus.",
        image: "https://picsum.photos/seed/expo/800/400",
        status: "Bientôt"
      },
      {
        id: 2,
        title: "Webinaire : L'IA au service de la maintenance prédictive",
        type: "En ligne",
        category: "Webinaire",
        date: "12 Avril 2026",
        time: "10:00 - 11:30",
        location: "Plateforme Zoom",
        description: "Découvrez comment l'intelligence artificielle révolutionne la maintenance industrielle avec nos experts.",
        image: "https://picsum.photos/seed/webinar/800/400",
        status: "Ouvert"
      }
    ]);
  }
});

export default router;
