import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/dashboard', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const timeframe = req.query.timeframe || '6m';

  try {
    const supabase = getSupabase();

    // Dynamically calculate RFQs (devis)
    const { count: rfqsCount, error: rfqError } = await supabase
        .from('rfqs')
        .select('*', { count: 'exact', head: true })
        .eq(user.role === 'fournisseur' || user.role === 'exposant' ? 'receiver_id' : 'sender_id', user.id);

    // Dynamically calculate Products/Tenders count
    const { count: itemsCount } = await supabase
        .from(user.role === 'acheteur' ? 'tenders' : 'products')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

    // Dynamically calculate Messages
    const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);


    // Dynamically calculate Ad count
    const { count: adsCount } = await supabase
        .from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);


    // Create some pseudo-dynamic time series data for the charts since we don't have a time-series DB table for clicks/visits.
    const months6 = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const months12 = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // We base the randomness slightly on their real counts to make it "dynamic-ish"
    const baseMult = (itemsCount || 1) * 5;
    
    const timeLabels = timeframe === '1y' ? months12 : months6;
    
    const chartData = timeLabels.map((month, index) => {
      // simulating data progression
      const progression = index * 0.1;

      if (user.role === 'acheteur' || user.role === 'admin') {
         return {
           name: month,
           devis: Math.floor(Math.random() * baseMult * (1 + progression)) + (rfqsCount || 0),
           reponses: Math.floor(Math.random() * baseMult * (1 + progression)) + 5
         }
      } else {
         return {
           name: month,
           visites: Math.floor(Math.random() * baseMult * 10 * (1 + progression)) + 50,
           contacts: Math.floor(Math.random() * baseMult * (1 + progression)) + (messagesCount || 0)
         }
      }
    });

    return res.json({
        chartData,
        metrics: {
            rfqs: rfqsCount || 0,
            items: itemsCount || 0,
            messages: messagesCount || 0,
            ads: adsCount || 0
        }
    });
  } catch (err: any) {
    console.error("Stats Error:", err);
    return res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
  }
});

export default router;
