import React, { useState, useEffect } from 'react';

// 10 Burgers catalogue for PWA
const BURGERS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    specialty: 'Nivel Legendario ★★★★★',
    specialtyClass: 'legendario',
    price: 14.99,
    rating: 4.98,
    calories: '850 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: '220g carne 100% Angus a la leña, triple cheddar añejo, bacon glaseado al bourbon y salsa secreta Galaxy en brioche artesanal.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    specialty: 'Nivel Clásico ★★★',
    specialtyClass: 'clasico',
    price: 9.50,
    rating: 4.88,
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón 160g res a la plancha de hierro, queso americano fundido, tomate, lechuga y aderezo imperial ahumado.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Especiales',
    specialty: 'Nivel Superior ★★★★',
    specialtyClass: 'superior',
    price: 13.50,
    rating: 4.94,
    calories: '920 kcal',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Doble carne Angus 300g, cuatro lonchas de cheddar, cebolla brunoise crujiente y salsa relish casera.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    specialty: 'Nivel Élite ★★★★★',
    specialtyClass: 'elite',
    price: 15.50,
    rating: 4.99,
    calories: '960 kcal',
    image: 'https://images.unsplash.com/photo-1583032015879-c5625bf948c2?w=600&auto=format&fit=crop&q=80',
    description: 'Doble Angus premium con centro de queso gouda fundido, panceta al manzano y crema de trufa negra.'
  },
  {
    id: 5,
    name: 'Smash Trufada Galaxy',
    category: 'Smash',
    specialty: 'Nivel Gourmet ★★★★',
    specialtyClass: 'gourmet',
    price: 12.90,
    rating: 4.92,
    calories: '740 kcal',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Doble smash ultrafino crocante, emulsión de trufa blanca, queso suizo Emmental y champiñones al tomillo.'
  },
  {
    id: 6,
    name: 'Royal Crispy Chicken',
    category: 'Pollo',
    specialty: 'Nivel Dorado ★★★',
    specialtyClass: 'dorado',
    price: 11.90,
    rating: 4.87,
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h en buttermilk, rebozado 11 especias, ensalada coleslaw fresca y honey mustard casera.'
  },
  {
    id: 7,
    name: 'Bacon BBQ Suprema',
    category: 'Clásicas',
    specialty: 'Nivel Superior ★★★★',
    specialtyClass: 'superior',
    price: 13.90,
    rating: 4.91,
    calories: '890 kcal',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Carne braseada a la leña, cuádruple loncha de bacon crocante, queso Monterey Jack y salsa BBQ al bourbon.'
  },
  {
    id: 8,
    name: 'Smoked Cheese Monster',
    category: 'Especiales',
    specialty: 'Nivel Élite ★★★★★',
    specialtyClass: 'elite',
    price: 14.50,
    rating: 4.96,
    calories: '980 kcal',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    description: 'Disco de queso scamorza ahumado crujiente fundido sobre carne Angus, pulled pork suave y cebolla morada encurtida.'
  },
  {
    id: 9,
    name: 'Veggie Avocado Gourmet',
    category: 'Gourmet',
    specialty: 'Nivel Verde Premium ★★★★',
    specialtyClass: 'verde',
    price: 10.90,
    rating: 4.85,
    calories: '590 kcal',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón artesanal de quinoa, lentejas y shiitake, aguacate hass fresco en láminas y mayonesa vegana de lima.'
  },
  {
    id: 10,
    name: 'Volcano Jalapeño Picante',
    category: 'Especiales',
    specialty: 'Nivel Fuego Bravo ★★★★',
    specialtyClass: 'fuego',
    price: 12.50,
    rating: 4.89,
    calories: '820 kcal',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Carne Angus con costra de pimienta negra, queso pepper jack, jalapeños encurtidos en tequila y alioli de chipotle.'
  }
];

const OFFERS = [
  {
    id: 101,
    title: 'Combo Rey Imperial',
    tag: '30% DE AHORRO',
    price: 16.99,
    oldPrice: 22.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    desc: '1 Rey de las Burgers + Papas Rústicas Trufadas + Bebida Artesanal 500ml + Salsa Especial.',
    items: ['Rey de las Burgers', 'Papas Rústicas Trufadas', 'Bebida Artesanal']
  },
  {
    id: 102,
    title: 'Dúo Pareja Real Doble',
    tag: '2X1 EN PAPAS',
    price: 24.90,
    oldPrice: 32.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    desc: '2 Burger Real Doble + 2 Papas Fritas Grandes + 2 Bebidas a elección.',
    items: ['2x Burger Real Doble', '2x Papas Grandes', '2x Bebidas']
  },
  {
    id: 103,
    title: 'Martes Smash & Shake',
    tag: 'COMBO POPULAR',
    price: 13.90,
    oldPrice: 17.50,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    desc: '1 Smash Trufada Galaxy + 1 Batido Clásico de Vainilla Bourbon con crema batida.',
    items: ['Smash Trufada Galaxy', 'Batido Vainilla Bourbon']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'offers' | 'orders' | 'profile'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Orders list simulation
  const [orders, setOrders] = useState([
    {
      id: 'HR-7291',
      date: 'Hoy, hace 25 min',
      items: [
        { name: 'Burger Real Clásica', quantity: 1, price: 9.50 },
        { name: 'Papas Rústicas', quantity: 1, price: 3.50 }
      ],
      total: 13.00,
      statusStep: 3, // 1: Recibido, 2: En Parrilla, 3: En Camino, 4: Entregado
      statusText: 'Repartidor en camino (a 5 min)',
      driverName: 'Matías R. (Moto Honda #41)',
      eta: '5 minutos'
    }
  ]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add burger to cart
  const addToCart = (burger) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === burger.id);
      if (existing) {
        return prev.map(item =>
          item.id === burger.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...burger, quantity: 1 }];
    });
    showToast(`🍔 "${burger.name}" agregada al carrito`);
  };

  // Update item quantity in cart
  const updateQuantity = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Apply discount coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME20' || code === 'GALAXYVIP' || code === 'RAPIDVIP' || code === 'GALAXYFIRST' || code === 'RAPIDFIRST') {
      setCouponDiscount(3.50);
      setCouponApplied(true);
      showToast('🎉 ¡Cupón aplicado: -$3.50!');
    } else if (code === 'GALAXY10' || code === 'RAPID10') {
      setCouponDiscount(2.00);
      setCouponApplied(true);
      showToast('🎉 ¡Cupón aplicado: -$2.00!');
    } else {
      showToast('⚠️ Cupón no válido. Prueba WELCOME20 o GALAXYVIP');
    }
  };

  // Cart totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 15 ? 0.00 : (subtotal > 0 ? 1.99 : 0.00);
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Simulate complete checkout
  const handleSimulateCheckout = () => {
    if (cart.length === 0) return;

    const newOrderNumber = `GX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderNumber,
      date: 'Hace un momento',
      items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total: total,
      statusStep: 1, // Recibido en cocina
      statusText: 'Recibido en cocina de Galaxy Burgers',
      driverName: 'Asignando repartidor express...',
      eta: '18-20 minutos'
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode('');
    setActiveTab('orders');
    showToast(`🎉 ¡Orden ${newOrderNumber} confirmada con éxito!`);
  };

  // Progress simulation for demo
  const advanceOrderStatus = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const nextStep = order.statusStep < 4 ? order.statusStep + 1 : 4;
        let text = order.statusText;
        let driver = order.driverName;
        let eta = order.eta;

        if (nextStep === 2) {
          text = 'En parrilla flameándose al carbón de roble';
          driver = 'Repartidor Sebastián V. en camino al local';
          eta = '12 minutos';
        } else if (nextStep === 3) {
          text = 'Repartidor en camino con empaque térmico';
          driver = 'Sebastián V. (Moto Eléctrica #18)';
          eta = '6 minutos';
        } else if (nextStep === 4) {
          text = '¡Orden Entregada! ¡Que disfrutes tu Galaxy Burger!';
          driver = 'Entregado por Sebastián V.';
          eta = 'Completado';
        }

        return { ...order, statusStep: nextStep, statusText: text, driverName: driver, eta };
      }
      return order;
    }));
    showToast('🔄 Estado de orden avanzado en tiempo real');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar esta PWA: En tu navegador presiona el menú ⋮ o Compartir y selecciona "Instalar aplicación" o "Agregar a pantalla de inicio".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const filteredBurgers = BURGERS.filter(b => {
    const matchesCategory = categoryFilter === 'Todas' || b.category === categoryFilter;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1C1917',
          color: '#FFFFFF',
          padding: '10px 18px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: '700',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #44403C'
        }} className="fade-in">
          {toastMessage}
        </div>
      )}

      {/* Top Mobile Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)'
          }}>
            🍔
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1C1917', lineHeight: 1.1 }}>
              Galaxy Burgers
            </h1>
            <div style={{ fontSize: '0.72rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📍 Caracas - Venezuela</span>
              <span>&bull;</span>
              <span style={{ color: '#059669', fontWeight: '700' }}>20 min</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Online badge */}
          <span style={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: '700',
            background: isOnline ? '#D1FAE5' : '#FEE2E2',
            color: isOnline ? '#065F46' : '#991B1B'
          }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>

          {/* Cart Icon trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: '#F6F1E9',
              border: '1px solid var(--border)',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              cursor: 'pointer'
            }}
            aria-label="Abrir Carrito"
          >
            🛒
            {totalItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#DC2626',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '90px', overflowY: 'auto' }}>
        
        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <div className="fade-in">
            {/* Promo banner strip */}
            <div style={{
              background: 'linear-gradient(135deg, #1C1917, #292524)',
              color: 'white',
              padding: '16px 20px',
              margin: '14px 16px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '9999px', fontWeight: '800', textTransform: 'uppercase' }}>
                  Cupón GALAXYVIP
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '6px 0 2px' }}>$3.50 OFF en tu orden</h3>
                <p style={{ fontSize: '0.75rem', color: '#A8A29E' }}>Válido para las 10 variantes gourmet</p>
              </div>
              <button
                onClick={() => {
                  setCouponCode('GALAXYVIP');
                  setIsCartOpen(true);
                }}
                style={{
                  background: '#D97706',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Usar Cupón
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: '0 16px', marginBottom: '12px' }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span style={{ fontSize: '1rem', marginRight: '8px', color: '#78716C' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar hamburguesa o ingrediente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    background: 'transparent',
                    color: '#1C1917'
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', fontSize: '1rem' }}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category filter pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              padding: '0 16px 14px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {['Todas', 'Especiales', 'Clásicas', 'Smash', 'Pollo', 'Gourmet'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: categoryFilter === cat ? '#1C1917' : 'var(--border)',
                    background: categoryFilter === cat ? '#1C1917' : '#FFFFFF',
                    color: categoryFilter === cat ? '#FFFFFF' : '#78716C',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat} {cat === 'Todas' ? `(${BURGERS.length})` : ''}
                </button>
              ))}
            </div>

            {/* Burgers List */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBurgers.map((burger) => {
                const inCartItem = cart.find(item => item.id === burger.id);
                const isSpecialFeatured = burger.id <= 4; // Top 4 requested variants

                return (
                  <div
                    key={burger.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid var(--border)',
                      padding: '14px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '95px',
                      height: '95px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      background: '#F3EDE4'
                    }}>
                      <img
                        src={burger.image}
                        alt={burger.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'rgba(255,255,255,0.92)',
                        padding: '2px 5px',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: '#1C1917'
                      }}>
                        ★ {burger.rating}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: isSpecialFeatured ? '#FEF3C7' : '#F1F5F9',
                          color: isSpecialFeatured ? '#92400E' : '#475569',
                          border: isSpecialFeatured ? '1px solid #F59E0B' : '1px solid #CBD5E1'
                        }}>
                          {burger.specialty}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1C1917', marginBottom: '4px', lineHeight: 1.2 }}>
                        {burger.name}
                      </h3>

                      <p style={{
                        fontSize: '0.75rem',
                        color: '#78716C',
                        lineHeight: 1.35,
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {burger.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1C1917' }}>
                          ${burger.price.toFixed(2)}
                        </span>

                        {inCartItem ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#F6F1E9',
                            borderRadius: '10px',
                            border: '1px solid var(--border)'
                          }}>
                            <button
                              onClick={() => updateQuantity(burger.id, -1)}
                              style={{ border: 'none', background: 'none', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', color: '#1C1917' }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', minWidth: '18px', textAlign: 'center' }}>
                              {inCartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(burger.id, 1)}
                              style={{ border: 'none', background: 'none', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', color: '#D97706' }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(burger)}
                            style={{
                              background: '#D97706',
                              color: 'white',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '10px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)'
                            }}
                          >
                            <span>+</span>
                            <span>Pedir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: OFERTAS */}
        {activeTab === 'offers' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Promociones Exclusivas App
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1C1917', marginTop: '2px' }}>
                Combos & Descuentos Galaxy
              </h2>
              <p style={{ color: '#78716C', fontSize: '0.82rem' }}>
                Ahorra hasta un 30% en combinaciones con nuestras hamburguesas maestras.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ height: '140px', position: 'relative', background: '#F3EDE4' }}>
                    <img
                      src={offer.image}
                      alt={offer.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#DC2626',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      🔥 {offer.tag}
                    </span>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1C1917', marginBottom: '4px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#78716C', lineHeight: 1.4, marginBottom: '12px' }}>
                      {offer.desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ textDecoration: 'line-through', color: '#A8A29E', fontSize: '0.82rem', marginRight: '6px' }}>
                          ${offer.oldPrice.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1C1917' }}>
                          ${offer.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            id: offer.id,
                            name: offer.title,
                            price: offer.price,
                            specialty: 'Combo Oferta',
                            image: offer.image
                          });
                        }}
                        style={{
                          background: '#1C1917',
                          color: 'white',
                          border: 'none',
                          padding: '9px 16px',
                          borderRadius: '12px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Reclamar Oferta
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ÓRDENES */}
        {activeTab === 'orders' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Seguimiento en Vivo
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1C1917', marginTop: '2px' }}>
                Tus Órdenes Activas
              </h2>
              <p style={{ color: '#78716C', fontSize: '0.82rem' }}>
                Monitorea el estado de tu pedido desde la parrilla hasta tu mesa.
              </p>
            </div>

            {orders.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1C1917', marginBottom: '6px' }}>
                  Aún no tienes pedidos registrados
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#78716C', marginBottom: '20px' }}>
                  Elige tus hamburguesas favoritas en la pestaña Menú y simula tu primera compra.
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: '#D97706',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid var(--border)',
                      padding: '18px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: '600' }}>Orden {order.date}</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1C1917' }}>{order.id}</h3>
                      </div>
                      <span style={{
                        background: order.statusStep === 4 ? '#D1FAE5' : '#FEF3C7',
                        color: order.statusStep === 4 ? '#065F46' : '#92400E',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        {order.statusStep === 4 ? '✔ Completada' : `En Proceso (${order.eta})`}
                      </span>
                    </div>

                    {/* Stepper Visualization */}
                    <div style={{
                      background: '#F6F1E9',
                      borderRadius: '14px',
                      padding: '14px',
                      marginBottom: '14px',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
                        {[
                          { step: 1, label: 'Recibido', icon: '📝' },
                          { step: 2, label: 'Parrilla', icon: '🔥' },
                          { step: 3, label: 'En Camino', icon: '🛵' },
                          { step: 4, label: 'Entregado', icon: '🎉' }
                        ].map((s) => {
                          const isDone = order.statusStep >= s.step;
                          const isCurrent = order.statusStep === s.step;

                          return (
                            <div key={s.step} style={{ textAlign: 'center', zIndex: 2, flex: 1 }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isDone ? '#D97706' : '#E5E7EB',
                                color: isDone ? 'white' : '#9CA3AF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 4px',
                                fontSize: '0.9rem',
                                fontWeight: '800',
                                boxShadow: isCurrent ? '0 0 0 4px #FDE68A' : 'none',
                                transition: 'all 0.3s'
                              }}>
                                {s.icon}
                              </div>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: isDone ? '700' : '500',
                                color: isDone ? '#1C1917' : '#9CA3AF'
                              }}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#1C1917', fontWeight: '700', marginTop: '10px', textAlign: 'center' }}>
                        {order.statusText}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#78716C', textAlign: 'center', marginTop: '2px' }}>
                        {order.driverName}
                      </div>

                      {order.statusStep < 4 && (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--border)',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              color: '#D97706',
                              cursor: 'pointer'
                            }}
                          >
                            ⏩ Simular Siguiente Estado
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#78716C', textTransform: 'uppercase' }}>
                        Detalle del Pedido:
                      </span>
                      <ul style={{ listStyle: 'none', margin: '6px 0', fontSize: '0.82rem' }}>
                        {order.items.map((it, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#1C1917', padding: '2px 0' }}>
                            <span>{it.quantity}x {it.name}</span>
                            <span style={{ fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '0.95rem', paddingTop: '6px', borderTop: '1px dashed var(--border)' }}>
                        <span>Total Pagado:</span>
                        <span style={{ color: '#D97706' }}>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PERFIL */}
        {activeTab === 'profile' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            {/* User Profile Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                }}>
                  CM
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1C1917' }}>Carlos Mendoza</h3>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#FEF3C7',
                    color: '#92400E',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    marginTop: '2px'
                  }}>
                    👑 Socio Gold VIP &bull; Club Galaxy
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '2px' }}>
                    carlos.mendoza@email.com
                  </div>
                </div>
              </div>

              {/* GalaxyPoints Balance */}
              <div style={{
                background: '#F6F1E9',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: '700', textTransform: 'uppercase' }}>
                    GalaxyPoints Acumulados
                  </span>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1C1917' }}>
                    1,450 pts
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                    Equivalen a $14.50 en saldo gratis
                  </span>
                </div>
                <button
                  onClick={() => showToast('⭐ Tienes puntos suficientes para canjear 1 Burger Real Clásica gratis.')}
                  style={{
                    background: '#D97706',
                    color: 'white',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Canjear
                </button>
              </div>
            </div>

            {/* Quick Links / Platform Switcher */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', marginBottom: '12px' }}>
                Accesos Directos a la Plataforma
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F6F1E9',
                    color: '#1C1917',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>🌐 Landing E-commerce Galaxy Burgers</span>
                  <span>→</span>
                </a>

                <a
                  href="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F6F1E9',
                    color: '#1C1917',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>⚙️ Panel Administrativo & Métricas</span>
                  <span>→</span>
                </a>

                <a
                  href="/api/health"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F6F1E9',
                    color: '#1C1917',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>🩺 API Health Dokploy</span>
                  <span>→</span>
                </a>

                <a
                  href="https://wa.me/584142899554"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ECFDF5',
                    color: '#065F46',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    border: '1px solid #A7F3D0'
                  }}
                >
                  <span>💬 WhatsApp Soporte: +58 414-2899554</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Install PWA Prompt */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                style={{
                  width: '100%',
                  background: '#1C1917',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span>📲 Instalar Galaxy Burgers en el Inicio</span>
              </button>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px', color: '#A8A29E', fontSize: '0.72rem' }}>
              &copy; 2026 Galaxy Burgers Inc. Todos los derechos reservados. Arquitectura MasterGeniusjoa.
            </div>
          </div>
        )}
      </main>

      {/* Floating Cart Button when cart has items (visible in menu/offers) */}
      {cart.length > 0 && !isCartOpen && (activeTab === 'menu' || activeTab === 'offers') && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '440px',
          zIndex: 45
        }}>
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              background: '#D97706',
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '16px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(217, 119, 6, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'white', color: '#D97706', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '800' }}>
                {totalItemsCount}
              </span>
              <span>Ver Carrito Galaxy Burgers</span>
            </div>
            <span>${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Modal / Checkout Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)'
          }} className="fade-in">
            {/* Header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1C1917' }}>Tu Carrito Galaxy</h3>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Entrega estimada: 18-20 min</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#F6F1E9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: '#1C1917'
                }}
              >
                ✕
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛒</div>
                  <p style={{ color: '#78716C', fontSize: '0.9rem' }}>Tu carrito está vacío.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '10px' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1C1917' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: '700' }}>
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#F6F1E9',
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ border: 'none', background: 'none', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', color: '#1C1917' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ border: 'none', background: 'none', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', color: '#D97706' }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: '800', fontSize: '0.92rem', color: '#1C1917' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="text"
                      placeholder="Cupón (ej: GALAXYVIP)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        fontSize: '0.82rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#1C1917',
                        color: 'white',
                        border: 'none',
                        padding: '0 16px',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponApplied && (
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                      ✔ Cupón aplicado con éxito (-${couponDiscount.toFixed(2)})
                    </div>
                  )}

                  {/* Order Summary Calculations */}
                  <div style={{ background: '#F6F1E9', borderRadius: '14px', padding: '14px', marginTop: '10px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#78716C' }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: '700', color: '#1C1917' }}>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#78716C' }}>
                      <span>Envío Express (20 min)</span>
                      <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#059669' : '#1C1917' }}>
                        {deliveryFee === 0 ? '¡GRATIS!' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#059669' }}>
                        <span>Descuento Promocional</span>
                        <span style={{ fontWeight: '700' }}>-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '1.05rem', fontWeight: '800', color: '#1C1917' }}>
                      <span>Total a Pagar</span>
                      <span style={{ color: '#D97706' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer action */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: '#FFFFFF' }}>
                <button
                  onClick={handleSimulateCheckout}
                  style={{
                    width: '100%',
                    background: '#D97706',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '16px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.35)'
                  }}
                >
                  Confirmar y Simular Compra (${total.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation Tabs Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: '#FFFFFF',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0 14px',
        zIndex: 50,
        boxShadow: '0 -4px 15px rgba(0,0,0,0.04)'
      }}>
        {[
          { id: 'menu', label: 'Menú', icon: '🍔' },
          { id: 'offers', label: 'Ofertas', icon: '🏷️' },
          { id: 'orders', label: 'Órdenes', icon: '📋', badge: orders.filter(o => o.statusStep < 4).length },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                position: 'relative',
                flex: 1,
                color: isActive ? '#D97706' : '#78716C',
                transition: 'color 0.2s'
              }}
            >
              <div style={{ position: 'relative', fontSize: '1.35rem' }}>
                {tab.icon}
                {tab.badge > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: '#DC2626',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid white'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: isActive ? '800' : '600' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
