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
    
    // Check if exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (!user || error) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      isVerified: Boolean(user.isVerified)
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '72h' });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 72 * 60 * 60 * 1000
    });

    return res.json({ user: payload });
  } catch (err: any) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
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
    
    const cRoles = role || 'acheteur';
    const cCompany = company || 'Entreprise DZ';
    
    const { data: newUserRow, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: name,
          email: email,
          company: cCompany,
          role: cRoles,
          passwordHash: hashedPassword,
          isVerified: false
        }
      ])
      .select()
      .single();
      
    if (insertError || !newUserRow) {
      console.error(insertError);
      return res.status(500).json({ error: "Erreur lors de l'inscription dans la base de données" });
    }

    // Automatically create a KYC request for 'fournisseur' / 'exposant' so the admin can review them
    if (cRoles === 'fournisseur' || cRoles === 'exposant') {
      await supabase.from('kyc_requests').insert([
        {
          user_id: newUserRow.id,
          name: cCompany,
          activity: 'Vente et Distribution',
          status: 'pending',
          date: new Date().toLocaleDateString('fr-FR'),
          docs: ['RC', 'NIF', 'NIS', 'RIB']
        }
      ]);
    }

    const payload = {
        id: newUserRow.id,
        name: newUserRow.name,
        email: newUserRow.email,
        company: newUserRow.company,
        role: newUserRow.role,
        isVerified: false
    };

    const token = jwt.sign(
      payload,
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

    return res.json({ success: true, user: payload, message: "Inscription réussie avec Supabase" });
  } catch (err: any) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
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
