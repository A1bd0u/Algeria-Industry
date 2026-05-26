import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/auth';
import tenderRoutes from './server/routes/tenders';
import companyRoutes from './server/routes/companies';
import catalogueRoutes from './server/routes/catalogues';
import productRoutes from './server/routes/products';
import messageRoutes from './server/routes/messages';
import articleRoutes from './server/routes/articles';
import eventRoutes from './server/routes/events';
import rfqRoutes from './server/routes/rfqs';
import kycRoutes from './server/routes/kyc';
import favoriteRoutes from './server/routes/favorites';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tenders', tenderRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/catalogues', catalogueRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/rfqs', rfqRoutes);
  app.use('/api/kyc', kycRoutes);
  app.use('/api/favorites', favoriteRoutes);

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
    console.log(`[SERVEUR PRINCIPAL] Serveur actif sur http://localhost:${PORT}`);
  });
}

startServer();
