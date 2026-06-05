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
        .select('*, companies!users_company_id_fkey(status)')
        .eq('id', decoded.id)
        .single();
        
      if (foundUser && !error) {
        foundUser.isVerified = Boolean(foundUser.isVerified);
        
        let cStatus = null;
        if (foundUser.companies && foundUser.companies.status) {
           cStatus = foundUser.companies.status;
        } else if (Array.isArray(foundUser.companies) && foundUser.companies.length > 0 && foundUser.companies[0].status) {
           cStatus = foundUser.companies[0].status;
        }
        
        foundUser.companyStatus = cStatus;
        delete foundUser.companies; // optional cleanup
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
      .select('*, companies!users_company_id_fkey(status)')
      .ilike('email', email)
      .maybeSingle();

    if (!user || error) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const { companies, ...userData } = user;
    if (companies && !Array.isArray(companies)) {
       (userData as any).companyStatus = (companies as any).status;
    } else if (Array.isArray(companies) && companies.length > 0) {
       (userData as any).companyStatus = companies[0].status;
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 72 * 60 * 60 * 1000
    });

    return res.json({ user: { ...payload, companyStatus: (userData as any).companyStatus } });
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
      return res.status(500).json({ error: "Erreur lors de l'inscription dans la base de données: " + (insertError?.message || JSON.stringify(insertError)) });
    }

    // Automatically create a company for 'fournisseur' / 'exposant'
    if (cRoles === 'fournisseur' || cRoles === 'exposant') {
      try {
        // Create the company entity
        const { data: companyRow, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: cCompany,
              owner_id: newUserRow.id,
              status: 'unverified'
            }
          ])
          .select()
          .single();

        if (companyRow && !companyError) {
          // Link user to the new company 
          await supabase.from('users').update({ company_id: companyRow.id }).eq('id', newUserRow.id);
        } else {
          console.error("Erreur création company: ", companyError);
        }
      } catch (err) {
        console.error("KYC Generation Error: ", err);
      }
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 72 * 60 * 60 * 1000
    });

    return res.json({ success: true, user: payload, message: "Inscription réussie avec Supabase" });
  } catch (err: any) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API - Auth - Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Veuillez fournir une adresse email' });
  }

  try {
    const supabase = getSupabase();
    // Simulate checking if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();

    if (!user) {
      // Don't leak that the email doesn't exist for security
      return res.json({ success: true, message: 'Si cette adresse existe, un email a été envoyé.' });
    }

    // In a production backend, generate a secure token, store it with expiration, and send email
    // For this prototype, we simulate a successful email send.

    return res.json({ success: true, message: 'Si cette adresse existe, un email a été envoyé.' });
  } catch (err: any) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// API - Auth - Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Le jeton de réinitialisation et le nouveau mot de passe sont requis' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    // In a production backend, we would verify the token against the database, check expiration, 
    // hash the new password, and update the user record.
    
    // For prototype, simulate success
    return res.json({ success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' });
  } catch (err: any) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// API - Auth - Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  return res.json({ success: true, message: 'Déconnexion réussie' });
});

export default router;
