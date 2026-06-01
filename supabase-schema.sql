-- Schéma SQL pour la base de données Supabase AI Studio (ConsolePro / B2B)

-- 1. Table users (extension de l'authentification)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  role TEXT DEFAULT 'fournisseur',
  passwordHash TEXT,
  isVerified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cat TEXT NOT NULL,
  price TEXT,
  description TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'Actif',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table tenders (Appels d'offres)
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  budget NUMERIC,
  deadline TIMESTAMP WITH TIME ZONE,
  category TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'open',
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table kyc (Vérification d'entreprise)
CREATE TABLE IF NOT EXISTS kyc_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  activity TEXT,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES users(id),
  docs JSONB,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table articles (Actualités et blog)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'published',
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table messages (Messagerie B2B)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table favorites (Favoris)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  item_type TEXT NOT NULL,
  item_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Table ads (Publicités)
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  budget TEXT,
  duration TEXT,
  objective TEXT,
  status TEXT DEFAULT 'Actif',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Table events (Événements)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date TEXT,
  location TEXT,
  organizer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Table rfqs (Request for Quotes)
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  buyer TEXT,
  target_date TEXT,
  items TEXT,
  budget TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Table catalogues (Catalogues)
CREATE TABLE IF NOT EXISTS catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Table companies (Entreprises)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nif TEXT,
  rc TEXT,
  description TEXT,
  activity_sector TEXT,
  owner_id UUID REFERENCES users(id),
  certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active RLS (Row Level Security) - Optionnel mais recommandé
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;

-- Politiques de base (permettre la lecture à tous, écriture authentifiée)
DROP POLICY IF EXISTS "Lecture publique" ON products;
CREATE POLICY "Lecture publique" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertion authentifiée" ON products;
CREATE POLICY "Insertion authentifiée" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture publique" ON tenders;
CREATE POLICY "Lecture publique" ON tenders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertion authentifiée" ON tenders;
CREATE POLICY "Insertion authentifiée" ON tenders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture publique" ON users;
CREATE POLICY "Lecture publique" ON users FOR SELECT USING (true);
