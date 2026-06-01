import express from 'express';
import { getSupabase } from '../db/supabaseClient';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/kyc - Get pending KYC applications
router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // In a real app we would have a kyc_applications table, or check companies with status='pending'
    const { data: kycs, error } = await supabase
      .from('kyc_requests')
      .select('*')
      .eq('status', 'pending');

    if (error) {
       throw error;
    }
    
    return res.json(kycs || []);
  } catch(e: any) {
    console.error("Supabase Error GET /kyc:", e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/kyc/:id/approve
router.post('/:id/approve', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    
    // approve KYC
    const { data: kycData, error } = await supabase
      .from('kyc_requests')
      .update({ status: 'approved' })
      .eq('id', id)
      .select('user_id')
      .single();
      
    if (error) throw error;

    // update user isVerified status
    if (kycData?.user_id) {
       await supabase.from('users').update({ isVerified: true }).eq('id', kycData.user_id);
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Supabase Error POST /kyc/:id/approve:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/kyc/:id/reject
router.post('/:id/reject', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from('kyc_requests')
      .update({ status: 'rejected' })
      .eq('id', id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Supabase Error POST /kyc/:id/reject:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
