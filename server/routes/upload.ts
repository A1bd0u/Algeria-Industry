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

// Decide whether to use Supabase Storage based on presence of Supabase keys and possibly SERVICE_ROLE
// Note: RLS policies might block uploads from Anon key, so SERVICE_ROLE is heavily recommended.
const USE_SUPABASE_STORAGE = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

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
        // If it's an RLS error on upload, we fallback to local storage dynamically.
        if (error.message.includes('row-level security') || error.message.includes('RLS')) {
            console.warn("Upload to Supabase blocked by RLS. Falling back to local storage...");
            return handleLocalFallback(req, res, uploadDir);
        }
        throw error;
      }

      // Generate the public URL (if the bucket is public), or use the signed URL structure
      const { data: publicUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(filename);
      
      return res.json({ url: publicUrlData.publicUrl });
    } catch (e: any) {
      console.error("Supabase Upload Error:", e);
      // Fallback
      console.warn("Upload to Supabase failed. Falling back to local storage...");
      return handleLocalFallback(req, res, uploadDir);
    }
  } else {
    return handleLocalFallback(req, res, uploadDir);
  }
});

function handleLocalFallback(req: any, res: any, targetDir: string) {
    if (req.file.buffer) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
        const destPath = path.join(targetDir, filename);
        fs.writeFileSync(destPath, req.file.buffer);
        console.log("File uploaded locally (fallback):", filename);
        res.json({ url: `/uploads/${filename}` });
    } else if (req.file.filename) {
        console.log("File uploaded locally (disk):", req.file.filename);
        res.json({ url: `/uploads/${req.file.filename}` });
    } else {
        res.status(500).json({ error: "Upload failed: No file buffer or filename" });
    }
}

router.use((err: any, req: any, res: any, next: any) => {
  console.error("Upload Error Middleware:", err);
  res.status(500).json({ error: 'Upload failed', details: err.message });
});

export default router;
