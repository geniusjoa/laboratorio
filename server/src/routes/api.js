const express = require('express');
const router = express.Router();
const db = require('../db');
const dns = require('dns').promises;
const os = require('os');
const net = require('net');

// Health Check Endpoint (For Dokploy & Admin Dashboard)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Hamburger Rapid Commercial v1.0',
    brand: 'Hamburger Rapid',
    database: dbStatus
  });
});

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
    res.json({ success: true, message: 'Catálogo de Hamburger Rapid restablecido.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
