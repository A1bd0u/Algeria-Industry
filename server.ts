import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

// Fallback user database in memory for registered users
interface UserDbItem {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'acheteur' | 'fournisseur' | 'admin';
  isVerified: boolean;
  passwordHash: string;
}

const usersDb: UserDbItem[] = [
  {
    id: 'admin-1',
    name: 'Gérant Algérie Industrie',
    email: 'admin@industry.dz',
    company: 'Algérie Industrie',
    role: 'admin',
    isVerified: true,
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 'user-1',
    name: 'Ahmed Benali',
    email: 'ahmed@sonelgaz.dz',
    company: 'Sonelgaz',
    role: 'acheteur',
    isVerified: true,
    passwordHash: bcrypt.hashSync('user123', 10)
  },
  {
    id: 'user-2',
    name: 'Karim Yahi',
    email: 'karim@cevital.dz',
    company: 'Cevital',
    role: 'fournisseur',
    isVerified: true,
    passwordHash: bcrypt.hashSync('fournisseur123', 10)
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'algiers_industry_super_secure_secret_2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API - Auth - Get Current User
  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié - Aucun token fourni' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserDbItem;
      // Fetch latest from db or return decoded info
      const foundUser = usersDb.find(u => u.id === decoded.id) || decoded;
      return res.json({ user: foundUser });
    } catch (err) {
      return res.status(401).json({ error: 'Session expirée ou invalide' });
    }
  });

  // API - Auth - Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir l\'email et le mot de passe' });
    }

    // Try to find user in memory db
    let foundUser = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      // Prevent email enumeration by returning a generic error
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Verify password securely using bcrypt
    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Sign securely with JWT and set in HttpOnly cookie
    const token = jwt.sign(
      {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        company: foundUser.company,
        role: foundUser.role,
        isVerified: foundUser.isVerified
      },
      JWT_SECRET,
      { expiresIn: '72h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // secure cookie in production only (HTTPS)
      sameSite: 'strict',
      maxAge: 72 * 60 * 60 * 1000 // 72 hours
    });

    return res.json({ user: foundUser });
  });

  // API - Auth - Register
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, company, role, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (nom, email, mot de passe)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const existingUser = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Un compte avec cette adresse email existe déjà' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: UserDbItem = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      company: company || 'Entreprise DZ',
      role: role || 'acheteur',
      isVerified: false,
      passwordHash: hashedPassword
    };

    usersDb.push(newUser);

    // Sign securely with JWT and set in HttpOnly cookie
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        role: newUser.role,
        isVerified: newUser.isVerified
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

    return res.json({ user: newUser });
  });

  // API - Auth - Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict'
    });
    return res.json({ success: true, message: 'Déconnexion réussie' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVEUR AUTH] Serveur actif sur http://localhost:${PORT}`);
  });
}

startServer();
