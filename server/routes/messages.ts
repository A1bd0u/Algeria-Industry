import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/messages - Liste des messages 
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase Error (Messages GET):', error);
      throw new Error("Erreur de db");
    }

    return res.json(messages || []);
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.json([
      { id: 1, sender: 'them', text: 'Bonjour, nous avons bien reçu votre demande concernant les filtres HP-900. Voici notre première estimation technique.', time: '14:02' },
      { id: 2, sender: 'me', text: 'Parfait, merci. Quel est le délai de livraison vers la zone industrielle de Rouiba ?', time: '14:05' },
      { id: 3, sender: 'them', text: "S'agissant d'un produit en stock, il faut compter 48h maximum après validation de la commande.", time: '14:10', file: 'DEVIS_#8492.PDF' }
    ]);
  }
});

// POST /api/messages - Envoyer un message
router.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{ text, sender: 'me' }]) // En rėalité ce serait lié au Auth user ID.
      .select()
      .single();
      
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err: any) {
    console.error('Supabase Error (Messages POST):', err.message);
    // Mock for demo
    return res.status(201).json({
       id: Math.floor(Math.random() * 10000),
       sender: 'me',
       text,
       time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
  }
});

export default router;
