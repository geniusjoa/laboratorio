const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api', apiRoutes);

// Define paths for the 3 compiled frontends
const pwaPath = path.join(__dirname, '../public/pwa');
const adminPath = path.join(__dirname, '../public/admin');
const ecommercePath = path.join(__dirname, '../public/ecommerce');

function hasBuild(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}

// 1. Mobile PWA under /app
if (hasBuild(pwaPath)) {
  app.use('/app', express.static(pwaPath));
  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(pwaPath, 'index.html'));
  });
} else {
  app.get('/app*', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:50px;background:#fbf9f5;color:#1c1917;min-height:100vh;">
        <h2>📱 Hamburger Rapid &bull; PWA Mobile aún no compilada</h2>
        <p>Ejecuta <code>npm run build:pwa</code> o <code>npm run build:all</code> para sincronizar los artefactos en <code>server/public/pwa</code>.</p>
        <p><a href="/">Volver a Landing E-commerce</a> | <a href="/admin">Panel Admin</a></p>
      </div>
    `);
  });
}

// 2. Control Panel under /admin
if (hasBuild(adminPath)) {
  app.use('/admin', express.static(adminPath));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });
} else {
  app.get('/admin*', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:50px;background:#fbf9f5;color:#1c1917;min-height:100vh;">
        <h2>⚙️ Hamburger Rapid &bull; Panel Admin aún no compilado</h2>
        <p>Ejecuta <code>npm run build:admin</code> o <code>npm run build:all</code> para sincronizar los artefactos en <code>server/public/admin</code>.</p>
        <p><a href="/">Volver a Landing E-commerce</a> | <a href="/app">PWA Mobile</a></p>
      </div>
    `);
  });
}

// 3. E-commerce Portal on Root /
if (hasBuild(ecommercePath)) {
  app.use(express.static(ecommercePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(ecommercePath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Hamburger Rapid &bull; Edición Comercial</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #fbf9f5; color: #1c1917; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #ffffff; padding: 2.5rem; border-radius: 1.25rem; max-width: 650px; text-align: center; border: 1px solid #f1ece5; box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
          h1 { color: #d97706; margin-bottom: 0.5rem; font-size: 2rem; font-weight: 800; }
          .badge { display: inline-block; background: #fef3c7; color: #b45309; padding: 0.35rem 0.9rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; margin-bottom: 1.5rem; border: 1px solid #fde68a; }
          .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
          .btn { background: #d97706; color: white; text-decoration: none; padding: 0.75rem 1.4rem; border-radius: 0.75rem; font-weight: 700; transition: background 0.2s; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25); }
          .btn:hover { background: #b45309; }
          .btn-secondary { background: #1c1917; box-shadow: 0 4px 12px rgba(28, 25, 23, 0.2); }
          .btn-secondary:hover { background: #292524; }
          .status { text-align: left; background: #faf8f5; padding: 1.25rem; border-radius: 0.75rem; font-family: monospace; font-size: 0.85rem; margin-top: 1.75rem; border: 1px solid #eee8df; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🍔 Hamburger Rapid &bull; Plataforma Comercial</h1>
          <div class="badge">Primera Versión Comercial v1.0</div>
          <p>Servidor backend activo. Para cargar la interfaz visual completa, ejecuta <code>npm run build:all</code>.</p>
          <div class="links">
            <a class="btn" href="/app">📱 PWA Mobile</a>
            <a class="btn btn-secondary" href="/admin">⚙️ Panel Admin</a>
            <a class="btn" style="background:#059669;" href="/api/health">🩺 Health Check</a>
            <a class="btn" style="background:#dc2626;" href="/api/products">🍔 Catálogo API</a>
          </div>
          <div class="status">
            <div>• Puerto Activo: ${PORT}</div>
            <div>• Modo BD: ${db.getDbStatus().mode}</div>
            <div>• Motor: ${db.getDbStatus().engine}</div>
            <div>• Entorno: ${process.env.NODE_ENV || 'production'}</div>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}

// Start server and initialize DB
async function start() {
  await db.initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🍔 Hamburger Rapid Platform ejecutándose en puerto ${PORT}`);
    console.log(`   - Landing E-commerce: http://localhost:${PORT}/`);
    console.log(`   - PWA Mobile App:     http://localhost:${PORT}/app`);
    console.log(`   - Panel Administrativo: http://localhost:${PORT}/admin`);
    console.log(`   - API Health:         http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

start();
