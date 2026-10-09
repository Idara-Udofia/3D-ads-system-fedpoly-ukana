import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';
const imageAssetsDir = path.resolve(rootDir, 'src/assets/images');

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static image assets for programme/facility/video/gallery content
app.use('/images', express.static(imageAssetsDir));

// API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    institution: 'Federal Polytechnic, Ukana',
    environment: isProd ? 'production' : 'development',
    time: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProd) {
    // Development mode with Vite Middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist/ not found. Run npm run build first.');
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Federal Polytechnic, Ukana Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
