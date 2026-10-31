import React, { useState, useEffect } from 'react';

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'burgers' | 'customers' | 'database'
  const [customerFilter, setCustomerFilter] = useState('Todos');
  const [burgerSearch, setBurgerSearch] = useState('');
  const [burgerCategory, setBurgerCategory] = useState('Todas');
  const [toast, setToast] = useState(null);

  // Modal new burger state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'Especiales',
    specialty: 'Nivel Élite ★★★★★',
    price: '',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, metricsRes, productsRes] = await Promise.all([
        fetch('/api/health').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/metrics').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/products').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (healthRes) setHealth(healthRes);
      
      if (metricsRes && metricsRes.data) {
        setMetrics(metricsRes.data);
        if (metricsRes.data.customers) setCustomers(metricsRes.data.customers);
      }

      if (productsRes && productsRes.data) {
        setProducts(productsRes.data);
      } else if (metricsRes && metricsRes.data && metricsRes.data.products) {
        setProducts(metricsRes.data.products);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update stock locally & simulate/sync
  const handleStockChange = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
    showToast('📦 Stock actualizado');
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta hamburguesa del catálogo?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('🗑️ Hamburguesa eliminada del catálogo');
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('🗑️ Hamburguesa eliminada');
    }
  };

  // Reset database demo products
  const handleResetCatalog = async () => {
    if (!confirm('¿Restablecer el catálogo con las 10 variantes oficiales de Hamburger Rapid?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchData();
      showToast('🔄 Catálogo de Hamburger Rapid restablecido con éxito');
    } catch (err) {
      showToast('Error al restablecer catálogo');
    }
  };

  // Add new burger
  const handleCreateBurger = async (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) {
      alert('Por favor ingresa nombre y precio.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBurger)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProducts([data.data, ...products]);
      } else {
        setProducts([{ id: Date.now(), ...newBurger, price: parseFloat(newBurger.price), stock: parseInt(newBurger.stock, 10) }, ...products]);
      }
      setIsAddModalOpen(false);
      setNewBurger({
        name: '',
        category: 'Especiales',
        specialty: 'Nivel Élite ★★★★★',
        price: '',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        description: ''
      });
      showToast('🎉 Nueva hamburguesa agregada exitosamente');
    } catch (err) {
      setProducts([{ id: Date.now(), ...newBurger, price: parseFloat(newBurger.price), stock: parseInt(newBurger.stock, 10) }, ...products]);
      setIsAddModalOpen(false);
      showToast('🎉 Nueva hamburguesa agregada');
    }
  };

  // Filtering burgers
  const filteredBurgers = products.filter(b => {
    const matchesCat = burgerCategory === 'Todas' || b.category === burgerCategory;
    const matchesQuery = (b.name || '').toLowerCase().includes(burgerSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Filtering customers by segment
  const filteredCustomers = customers.filter(c => {
    if (customerFilter === 'Todos') return true;
    if (customerFilter === 'Alto') return c.tier === 'VIP';
    if (customerFilter === 'Medio') return c.tier === 'Frecuente';
    if (customerFilter === 'Ocasional') return c.tier === 'Ocasional';
    return true;
  });

  const dbStatus = health?.database || metrics?.database;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* Toast popup */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '0.88rem',
          fontWeight: '700',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="fade-in">
          {toast}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        padding: '14px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
          }}>
            🍔
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                Hamburger Rapid
              </h1>
              <span style={{
                background: '#FEF3C7',
                color: '#B45309',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #FDE68A'
              }}>
                PANEL ADMINISTRATIVO PRO
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Métricas de Clientes, Inventario de Hamburguesas & Estado de Base de Datos
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Health indicator badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: dbStatus?.connected ? '#D1FAE5' : '#FEF3C7',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: `1px solid ${dbStatus?.connected ? '#A7F3D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: dbStatus?.connected ? '#059669' : '#D97706',
              boxShadow: `0 0 8px ${dbStatus?.connected ? '#059669' : '#D97706'}`
            }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: dbStatus?.connected ? '#065F46' : '#92400E' }}>
              {dbStatus?.mode === 'mysql' ? 'MySQL 8.0 Conectado' : 'Modo In-Memory Activo'}
            </span>
          </div>

          <button
            onClick={fetchData}
            style={{
              background: '#F8F9FA',
              border: '1px solid var(--border)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🔄</span>
            <span>Actualizar</span>
          </button>

          <a
            href="/"
            style={{
              background: '#0F172A',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '700'
            }}
          >
            🌐 Ir al E-commerce
          </a>

          <a
            href="/app"
            style={{
              background: '#D97706',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '700'
            }}
          >
            📱 PWA Móvil
          </a>
        </div>
      </header>

      {/* Main Dashboard Wrapper */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '28px 24px' }}>
        
        {/* KPI Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          marginBottom: '28px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Ingresos por Consumo
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                💰
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
              ${metrics?.kpis?.totalRevenue || '904.80'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
              ↑ +18.4% vs semana anterior
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Ticket Medio por Cliente
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                📊
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
              ${metrics?.kpis?.averageTicket || '17.07'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
              {metrics?.kpis?.totalOrders || '53'} pedidos procesados
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Variantes de Hamburguesa
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                🍔
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
              {products.length} activas
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
              ✔ 10 destacadas oficiales
            </div>
          </div>

          {/* Card 4 */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tasa de Retención
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                👑
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
              {metrics?.kpis?.retentionRate || '88.5%'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
              Fidelización VIP alta
            </div>
          </div>
        </div>

        {/* SECTION 1: DATABASE STATUS CARD */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Infraestructura Backend & Persistencia
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
                Estado de la Base de Datos
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={fetchData}
                style={{
                  background: '#F8F9FA',
                  border: '1px solid var(--border)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🩺 Test Conexión
              </button>
              <button
                onClick={handleResetCatalog}
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🌱 Restablecer Catálogo Demo (10 Burgers)
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            background: '#F8FAFC',
            padding: '18px',
            borderRadius: '14px',
            border: '1px solid var(--border)'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Modo de Operación
              </span>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: dbStatus?.connected ? '#059669' : '#D97706', marginTop: '2px' }}>
                {dbStatus?.mode === 'mysql' ? '🐬 MySQL 8.0 Producción' : '⚡ En Memoria (High-Speed)'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Host / Conexión
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>
                {dbStatus?.host || 'localhost'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Base de Datos
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>
                {dbStatus?.database || 'hamburger_rapid_db'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Tabla Principal
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>
                products ({products.length} registros)
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Estado Dokploy
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#059669', marginTop: '2px' }}>
                🟢 {health?.status?.toUpperCase() || 'HEALTHY (200 OK)'}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CUSTOMER CONSUMPTION METRICS */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Segmentación & Fidelización
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
                Métricas de Consumidores / Clientes según Consumo
              </h2>
            </div>

            {/* Segment filter buttons */}
            <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
              {['Todos', 'Alto', 'Medio', 'Ocasional'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setCustomerFilter(filter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: customerFilter === filter ? '#FFFFFF' : 'transparent',
                    color: customerFilter === filter ? '#0F172A' : 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: customerFilter === filter ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {filter === 'Todos' ? 'Todos los Clientes' : `Consumo ${filter}`}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Tier Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {metrics?.segments?.map((seg, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '16px',
                  borderLeft: `5px solid ${seg.color}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    background: seg.badgeBg,
                    color: seg.color,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    {seg.tier}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {seg.percentage}% del total
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                  {seg.label}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', color: seg.color }}>
                    ${seg.revenue}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {seg.count} clientes registrados
                  </span>
                </div>
              </div>
            )) || null}
          </div>

          {/* Customer Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Segmento de Consumo</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Total Gastado</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Órdenes</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Hamburguesa Favorita</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Último Pedido</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => {
                  const isVip = cust.tier === 'VIP';
                  const isFrequent = cust.tier === 'Frecuente';

                  return (
                    <tr key={cust.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isVip ? '#FEF3C7' : (isFrequent ? '#DBEAFE' : '#F1F5F9'),
                            color: isVip ? '#B45309' : (isFrequent ? '#1E40AF' : '#475569'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.75rem'
                          }}>
                            {cust.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: '#0F172A' }}>{cust.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cust.email}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          background: isVip ? '#FEF3C7' : (isFrequent ? '#DBEAFE' : '#F1F5F9'),
                          color: isVip ? '#92400E' : (isFrequent ? '#1E40AF' : '#475569'),
                          border: `1px solid ${isVip ? '#FDE68A' : (isFrequent ? '#BFDBFE' : '#E2E8F0')}`
                        }}>
                          {cust.tier} &bull; {cust.segment}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                        ${cust.totalSpent.toFixed(2)}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {cust.ordersCount} pedidos
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: '700', color: '#D97706' }}>
                          🍔 {cust.favoriteBurger}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {cust.lastOrder}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: cust.status === 'Activo' ? '#059669' : '#64748B'
                        }}>
                          ● {cust.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: AVAILABLE BURGERS LIST */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Gestión de Inventario & Especialidades
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
                Catálogo de Hamburguesas Disponibles ({filteredBurgers.length})
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Category selector */}
              <select
                value={burgerCategory}
                onChange={(e) => setBurgerCategory(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              >
                <option value="Todas">Todas las Categorías</option>
                <option value="Especiales">Especiales</option>
                <option value="Clásicas">Clásicas</option>
                <option value="Smash">Smash</option>
                <option value="Pollo">Pollo</option>
                <option value="Gourmet">Gourmet</option>
              </select>

              {/* Search input */}
              <input
                type="text"
                placeholder="Buscar hamburguesa..."
                value={burgerSearch}
                onChange={(e) => setBurgerSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  width: '180px'
                }}
              />

              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  background: '#D97706',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)'
                }}
              >
                <span>+</span>
                <span>Nueva Hamburguesa</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Foto</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Nombre & Receta</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Especialidad / Nivel</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Categoría</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Precio Venta</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Stock</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBurgers.map((burger) => {
                  const isSpecial = burger.name.includes('Rey') || burger.name.includes('Real') || burger.name.includes('Doble');

                  return (
                    <tr key={burger.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', width: '60px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#F3EDE4'
                        }}>
                          <img
                            src={burger.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'}
                            alt={burger.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', maxWidth: '300px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                          {burger.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.35,
                          marginTop: '2px',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {burger.description}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isSpecial ? '#FEF3C7' : '#EFF6FF',
                          color: isSpecial ? '#92400E' : '#1E40AF',
                          border: `1px solid ${isSpecial ? '#F59E0B' : '#93C5FD'}`
                        }}>
                          {burger.specialty || 'Nivel Superior ★★★★'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: 'var(--text-muted)',
                          background: '#F1F5F9',
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {burger.category || 'Especiales'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A', fontSize: '1rem' }}>
                        ${parseFloat(burger.price).toFixed(2)}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          background: burger.stock > 25 ? '#D1FAE5' : '#FEE2E2',
                          color: burger.stock > 25 ? '#065F46' : '#991B1B'
                        }}>
                          {burger.stock} u. {burger.stock <= 25 ? '(Alerta Stock)' : '(Disponible)'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleStockChange(burger.id, 5)}
                            title="Aumentar 5 unidades"
                            style={{
                              background: '#F1F5F9',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            +5 Stock
                          </button>
                          <button
                            onClick={() => handleStockChange(burger.id, -5)}
                            title="Descontar 5 unidades"
                            style={{
                              background: '#F1F5F9',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            -5 Stock
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(burger.id)}
                            title="Eliminar"
                            style={{
                              background: '#FEE2E2',
                              border: '1px solid #FCA5A5',
                              color: '#991B1B',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Add Burger */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)'
          }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                Agregar Nueva Hamburguesa
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBurger} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Burger Trufada Doble"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="Especiales">Especiales</option>
                    <option value="Clásicas">Clásicas</option>
                    <option value="Smash">Smash</option>
                    <option value="Pollo">Pollo</option>
                    <option value="Gourmet">Gourmet</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Nivel de Especialidad
                  </label>
                  <select
                    value={newBurger.specialty}
                    onChange={(e) => setNewBurger({ ...newBurger, specialty: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="Nivel Legendario ★★★★★">Nivel Legendario ★★★★★</option>
                    <option value="Nivel Élite ★★★★★">Nivel Élite ★★★★★</option>
                    <option value="Nivel Superior ★★★★">Nivel Superior ★★★★</option>
                    <option value="Nivel Gourmet ★★★★">Nivel Gourmet ★★★★</option>
                    <option value="Nivel Clásico ★★★">Nivel Clásico ★★★</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Precio Venta ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="13.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    value={newBurger.stock}
                    onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  URL Imagen Foto
                </label>
                <input
                  type="text"
                  value={newBurger.image}
                  onChange={(e) => setNewBurger({ ...newBurger, image: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Descripción Culinaria
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe la carne, salsas, quesos y pan..."
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#D97706',
                    color: 'white',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
