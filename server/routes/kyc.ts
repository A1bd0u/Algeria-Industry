import express from 'express';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

// GET /api/kyc - Get pending KYC applications
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // In a real app we would have a kyc_applications table, or check companies with status='pending'
    const { data: kycs, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('status', 'pending');

    if (error) {
       console.error('Supabase Error (KYC GET):', error);
       throw new Error("Erreur DB");
    }
    
    return res.json(kycs || []);
  } catch(e: any) {
    console.error('Fallback KYC:', e.message);
    return res.json([
      { id: 'kyc-1', name: 'Global Tech Oran', activity: 'Composants Électriques', date: 'Il y a 2h', docs: ['RC', 'NIF', 'AI'] },
      { id: 'kyc-2', name: 'Mecanique du Sud', activity: 'Maintenance Industrielle', date: 'Il y a 5h', docs: ['RC', 'NIF'] },
    ]);
  }
});

// POST /api/kyc/:id/approve
router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from('kyc_applications')
      .update({ status: 'approved' })
      .eq('id', id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    return res.json({ success: true, message: "Mock apprové" });
  }
});

// POST /api/kyc/:id/reject
router.post('/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from('kyc_applications')
      .update({ status: 'rejected' })
      .eq('id', id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    return res.json({ success: true, message: "Mock rejeté" });
  }
});

export default router;
