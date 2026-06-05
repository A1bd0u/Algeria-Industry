import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middlewares/authMiddleware';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Keep local disk storage as a fallback
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// We recommend using memoryStorage so the backend can buffer the file and send it straight to Supabase Storage
const memoryStorage = multer.memoryStorage();

// Toggle this variable once you have created the `kyc-documents` bucket in Supabase!
const USE_SUPABASE_STORAGE = true;

const upload = multer({ storage: USE_SUPABASE_STORAGE ? memoryStorage : diskStorage });

router.post('/', requireAuth, upload.single('file'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé' });
  }
  
  if (USE_SUPABASE_STORAGE) {
    try {
      const supabase = getSupabase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .upload(filename, req.file.buffer, {
           contentType: req.file.mimetype,
           upsert: false
        });

      if (error) {
        throw error;
      }

      // Generate the public URL (if the bucket is public), or use the signed URL structure
      const { data: publicUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(filename);
      
      return res.json({ url: publicUrlData.publicUrl });
    } catch (e: any) {
      console.error("Supabase Upload Error:", e);
      return res.status(500).json({ error: "Erreur lors de l'upload vers Supabase", details: e.message });
    }
  } else {
    // Local ephemeral storage (fallback prototype mode)
    console.log("File uploaded locally:", req.file.filename);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  }
});

router.use((err: any, req: any, res: any, next: any) => {
  console.error("Upload Error Middleware:", err);
  res.status(500).json({ error: 'Upload failed', details: err.message });
});

export default router;
