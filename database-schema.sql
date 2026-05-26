-- C'est un exemple de script SQL à exécuter dans l'éditeur SQL de Supabase (SQL Editor)
-- Copiez et collez ce code pour créer vos tables initiales.

-- 1. Table des utilisateurs (Gère les acheteurs, fournisseurs, admins)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  role TEXT NOT NULL CHECK (role IN ('acheteur', 'fournisseur', 'admin')),
  "isVerified" BOOLEAN DEFAULT FALSE,
  "passwordHash" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des entreprises (Profils des sociétés)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nif TEXT UNIQUE,
  rc TEXT UNIQUE,
  description TEXT,
  activity_sector TEXT,
  logo_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des appels d'offres (Créés par les acheteurs ou le gouvernement)
CREATE TABLE IF NOT EXISTS public.tenders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id TEXT REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(12, 2),
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'evaluating', 'closed', 'awarded')),
  category TEXT,
  documents_urls TEXT[], -- Tableau de liens vers les fichiers stockés dans Supabase Storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- POLITIQUES DE SÉCURITÉ (Row Level Security - RLS)
-- Par défaut, Supabase bloque l'accès public. Si vous utilisez l'API serveur (avec la clé secrète ou le service role), 
-- le backend a tous les droits, ce qui est très bien pour votre architecture actuelle (les requêtes viennent du serveur Node.js).
