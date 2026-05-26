import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabase } from '../db/supabaseClient';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'algiers_industry_super_secure_secret_2026';

// API - Auth - Get Current User
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié - Aucun token fourni' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Attempt to fetch from Supabase
    try {
      const supabase = getSupabase();
      const { data: foundUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();
        
      if (foundUser && !error) {
        foundUser.isVerified = Boolean(foundUser.isVerified);
        return res.json({ user: foundUser });
      }
    } catch (dbError) {
      // Supabase not configured yet, fallback to JWT decoded payload for smooth preview
      console.warn("Supabase check failed on /me:", dbError);
    }
    
    return res.json({ user: decoded }); // Fallback to token data
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou invalide' });
  }
});

// API - Auth - Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez saisir l\'email et le mot de passe' });
  }

  try {
    const supabase = getSupabase();
    
    // Try to find user in Supabase
    const { data: foundUser, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase DB error:', error);
      return res.status(500).json({ error: 'Erreur de base de données.' });
    }

    if (!foundUser) {
      return res.status(401).json({ error: 'Identifiants incorrects ou compte inexistant.' });
    }

    // Verify password securely using bcrypt
    // Un-commented for real professional usage.
    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        company: foundUser.company,
        role: foundUser.role,
        isVerified: Boolean(foundUser.isVerified)
      },
      JWT_SECRET,
      { expiresIn: '72h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 72 * 60 * 60 * 1000
    });

    return res.json({ user: foundUser });
  } catch (err: any) {
    console.warn("Supabase not fully configured:", err.message);
    
    // TEMPORARY FALLBACK FOR PREVIEW WHEN KEYS ARE MISSING
    // Automatically accept any login for demonstration if Supabase is missing
    const role = email.toLowerCase().includes('admin') ? 'admin' : (email.toLowerCase().includes('fournisseur') ? 'fournisseur' : 'acheteur');
    const newId = 'user-demo-' + Math.random().toString(36).substring(2, 9);
    
    const token = jwt.sign(
      {
        id: newId,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        company: 'Demo Company (No DB)',
        role: role,
        isVerified: true
      },
      JWT_SECRET,
      { expiresIn: '72h' }
    );

    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 72 * 60 * 60 * 1000 });
    return res.json({ user: jwt.decode(token) });
  }
});

// API - Auth - Register
router.post('/register', async (req, res) => {
  const { name, email, company, role, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    const supabase = getSupabase();
    
    // Check if exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'Un compte avec cette adresse email existe déjà' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newId = 'user-' + Math.random().toString(36).substring(2, 9);
    const cRoles = role || 'acheteur';
    const cCompany = company || 'Entreprise DZ';
    
    const newUser = {
      id: newId,
      name: name,
      email: email,
      company: cCompany,
      role: cRoles,
      isVerified: false
    };

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          ...newUser,
          passwordHash: hashedPassword
        }
      ]);
      
    if (insertError) {
      console.error('Supabase Error:', insertError);
      return res.status(500).json({ error: "Erreur lors de l'inscription dans la base de données" });
    }

    const token = jwt.sign(
      newUser,
      JWT_SECRET,
      { expiresIn: '72h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 72 * 60 * 60 * 1000
    });

    return res.json({ success: true, user: newUser, message: "Inscription réussie avec Supabase" });
  } catch (err: any) {
    console.error('Supabase fallback:', err.message);
    return res.status(500).json({ error: "Supabase n'est pas encore configuré (Clés manquantes dans l'environnement)." });
  }
});

// API - Auth - Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict'
  });
  return res.json({ success: true, message: 'Déconnexion réussie' });
});

export default router;
