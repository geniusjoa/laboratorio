const express = require('express');
const router = express.Router();
const db = require('../db');
const idempiereService = require('../services/idempiereService');

// Health Check Endpoint (For Dokploy & Admin Dashboard)
router.get('/health', async (req, res) => {
  const dbStatus = db.getDbStatus();
  const idempiereStatus = await idempiereService.getStatus();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Galaxy Burgers Full-Stack Platform v1.0',
    brand: 'Galaxy Burgers',
    database: dbStatus,
    idempiere: {
      url: idempiereStatus.configuredUrl,
      reachable: idempiereStatus.isReachable,
      sessionsActive: idempiereStatus.activeSessionsCount
    }
  });
});

// ==========================================
// iDempiere ERP REST API v1 Auth Endpoints
// ==========================================

// Login against iDempiere ERP REST v1 (/api/v1/auth/tokens)
router.post('/auth/idempiere-login', async (req, res) => {
  try {
    const { userName, password, parameters, customBaseUrl } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario (userName) y la contraseña (password) son obligatorios.'
      });
    }

    const result = await idempiereService.authenticate({
      userName,
      password,
      parameters,
      customBaseUrl
    });

    if (result.success) {
      return res.json({
        success: true,
        message: 'Autenticación con iDempiere ERP exitosa',
        data: result.data
      });
    }

    return res.status(result.status || 401).json({
      success: false,
      error: result.error
    });
  } catch (error) {
    console.error('[Auth Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check connectivity with iDempiere ERP
router.get('/auth/idempiere-status', async (req, res) => {
  try {
    const status = await idempiereService.getStatus(req.query.url);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify active Bearer Token
router.get('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No se suministró cabecera Authorization.' });
  }

  const session = idempiereService.validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Sesión no válida o expirada.' });
  }

  res.json({ success: true, session });
});

// Logout endpoint
router.post('/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    idempiereService.logoutSession(authHeader);
  }
  res.json({ success: true, message: 'Sesión cerrada con éxito.' });
});

// ==========================================
// Catalog & Business Endpoints
// ==========================================

// List all burgers
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new burger
router.post('/products', async (req, res) => {
  try {
    const { name, category, specialty, price, stock, image, description } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos.' });
    }
    const product = await db.addProduct({ name, category, specialty, price, stock, image, description });
    res.status(201).json({ success: true, message: 'Hamburguesa creada exitosamente', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete burger
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);
    res.json({ success: true, message: `Hamburguesa ${id} eliminada.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Customers list
router.get('/customers', (req, res) => {
  try {
    const customers = db.getCustomers();
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete consumption & database metrics
router.get('/metrics', (req, res) => {
  try {
    const metrics = db.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset initial burgers
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Catálogo de Galaxy Hamburguesas restablecido.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
