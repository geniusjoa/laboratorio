const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    specialty: 'Nivel Legendario ★★★★★',
    price: 14.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: 'Nuestra creación cumbre: 220g de carne 100% Angus flameada a la leña de roble, triple queso cheddar añejo fundido, cebolla caramelizada al bourbon, panceta crocante glaseada y salsa secreta Galaxy en pan brioche artesanal dorado con mantequilla clarificada.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    specialty: 'Nivel Clásico ★★★',
    price: 9.50,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    description: 'La tradición elevada al máximo estándar: medallón de res 160g a la plancha de hierro fundido, queso americano derretido, lechuga romana crujiente, tomate fresco de huerta, pepinillos agridulces encurtidos en casa y aderezo imperial ahumado.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Especiales',
    specialty: 'Nivel Superior ★★★★',
    price: 13.50,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    description: 'Doble impacto de sabor: dos medallones Angus de 150g cada uno sellados con costra crujiente, cuatro lonchas de queso cheddar cheddar artesanal, cebolla picada fina en brunoise, mostaza Dijon suave y salsa relish secreta de la casa.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    specialty: 'Nivel Élite ★★★★★',
    price: 15.50,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1583032015879-c5625bf948c2?w=800&auto=format&fit=crop&q=80',
    description: 'Edición gourmet reservada para conocedores: doble carne Angus premium con centro de queso gouda fundido, doble ración de panceta ahumada al manzano, aros de cebolla crocantes y crema suave de trufa negra con mayonesa japonesa.'
  },
  {
    id: 5,
    name: 'Smash Trufada Galaxy',
    category: 'Smash',
    specialty: 'Nivel Gourmet ★★★★',
    price: 12.90,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80',
    description: 'Doble smash ultrafino con encaje crocante inconfundible, emulsión de trufa blanca de Alba, queso suizo Emmental fundido y champiñones silvestres salteados con tomillo fresco.'
  },
  {
    id: 6,
    name: 'Royal Crispy Chicken',
    category: 'Pollo',
    specialty: 'Nivel Dorado ★★★',
    price: 11.90,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
    description: 'Suprema de pechuga marinada 24h en buttermilk y especias cajún, rebozado extra crujiente dorado a la perfección, ensalada coleslaw fresca con toques de manzana verde y miel de mostaza casera.'
  },
  {
    id: 7,
    name: 'Bacon BBQ Suprema',
    category: 'Clásicas',
    specialty: 'Nivel Superior ★★★★',
    price: 13.90,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80',
    description: 'Para los devotos del ahumado: carne braseada a fuego vivo, cuádruple loncha de bacon crocante con sal marina, queso Monterey Jack fundido y generosa reducción de salsa BBQ artesanal al bourbon.'
  },
  {
    id: 8,
    name: 'Smoked Cheese Monster',
    category: 'Especiales',
    specialty: 'Nivel Élite ★★★★★',
    price: 14.50,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    description: 'Una erupción de sabor lácteo: disco de queso scamorza ahumado rebozado y frito que se funde sobre carne Angus jugosa, pulled pork desmechado a cocción lenta y cebolla morada encurtida.'
  },
  {
    id: 9,
    name: 'Veggie Avocado Gourmet',
    category: 'Gourmet',
    specialty: 'Nivel Verde Premium ★★★★',
    price: 10.90,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80',
    description: 'Opción 100% plant-based sin compromisos de sabor: medallón artesanal de quinoa roja, lentejas beluga y hongos shiitake, abanico de aguacate hass cremoso, brotes tiernos y mayonesa vegana de lima.'
  },
  {
    id: 10,
    name: 'Volcano Jalapeño Picante',
    category: 'Especiales',
    specialty: 'Nivel Fuego Bravo ★★★★',
    price: 12.50,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80',
    description: 'Intensidad picante equilibrada: carne Angus sazonada con pimientas tostadas, queso pepper jack fundente, rodajas de jalapeños encurtidos en tequila, nachos crocantes y suave crema alioli de chipotle.'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    tier: 'VIP',
    segment: 'Consumo Alto (> $100)',
    totalSpent: 284.50,
    ordersCount: 16,
    favoriteBurger: 'Rey de las Burgers',
    lastOrder: 'Hace 2 horas',
    status: 'Activo'
  },
  {
    id: 2,
    name: 'Valeria Rivas',
    email: 'valeria.rivas@email.com',
    tier: 'VIP',
    segment: 'Consumo Alto (> $100)',
    totalSpent: 215.80,
    ordersCount: 12,
    favoriteBurger: 'Burger Doble Especial',
    lastOrder: 'Ayer',
    status: 'Activo'
  },
  {
    id: 3,
    name: 'Mateo Fernández',
    email: 'mateo.f@email.com',
    tier: 'VIP',
    segment: 'Consumo Alto (> $100)',
    totalSpent: 162.20,
    ordersCount: 9,
    favoriteBurger: 'Smash Trufada Galaxy',
    lastOrder: 'Hace 3 días',
    status: 'Activo'
  },
  {
    id: 4,
    name: 'Sofía Navarro',
    email: 'sofia.navarro@email.com',
    tier: 'Frecuente',
    segment: 'Consumo Medio ($40 - $100)',
    totalSpent: 89.40,
    ordersCount: 6,
    favoriteBurger: 'Burger Real Doble',
    lastOrder: 'Hace 1 día',
    status: 'Activo'
  },
  {
    id: 5,
    name: 'Diego Morales',
    email: 'diego.m@email.com',
    tier: 'Frecuente',
    segment: 'Consumo Medio ($40 - $100)',
    totalSpent: 64.50,
    ordersCount: 4,
    favoriteBurger: 'Burger Real Clásica',
    lastOrder: 'Hace 4 días',
    status: 'Activo'
  },
  {
    id: 6,
    name: 'Camila Torres',
    email: 'camila.t@email.com',
    tier: 'Frecuente',
    segment: 'Consumo Medio ($40 - $100)',
    totalSpent: 48.90,
    ordersCount: 3,
    favoriteBurger: 'Royal Crispy Chicken',
    lastOrder: 'Hace 5 días',
    status: 'Activo'
  },
  {
    id: 7,
    name: 'Ignacio Silva',
    email: 'ignacio.s@email.com',
    tier: 'Ocasional',
    segment: 'Consumo Ocasional (< $40)',
    totalSpent: 24.50,
    ordersCount: 2,
    favoriteBurger: 'Burger Real Clásica',
    lastOrder: 'Hace 2 semanas',
    status: 'Poco Frecuente'
  },
  {
    id: 8,
    name: 'Elena Benítez',
    email: 'elena.b@email.com',
    tier: 'Ocasional',
    segment: 'Consumo Ocasional (< $40)',
    totalSpent: 14.99,
    ordersCount: 1,
    favoriteBurger: 'Rey de las Burgers',
    lastOrder: 'Hace 3 semanas',
    status: 'Nuevo'
  }
];

let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryCustomers = [...INITIAL_CUSTOMERS];
let isConnectedToMySQL = false;
let pool = null;
let lastDbError = null;

async function initDB() {
  if (pool) return;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER || 'pablovaldivia';
  const password = process.env.DB_PASSWORD || 'masterclass2024';
  const database = process.env.DB_NAME || 'demo';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!host && !process.env.DATABASE_URL) {
    console.log('⚡ [DB] Sin variables de entorno MySQL. Operando en modo In-Memory con catálogo de Galaxy Hamburguesas.');
    isConnectedToMySQL = false;
    return;
  }

  try {
    if (process.env.DATABASE_URL) {
      pool = mysql.createPool(process.env.DATABASE_URL);
    } else {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL (${host || 'URL'} - BD: ${database})`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        specialty VARCHAR(100) DEFAULT '',
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Inicializando catálogo oficial de Galaxy Hamburguesas en MySQL...');
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, specialty, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.specialty || '', p.price, p.stock, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    console.warn(`⚠️ [DB] Conexión directa a MySQL no disponible (${error.message}). Operando en modo In-Memory.`);
    lastDbError = error.message;
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows;
    } catch (err) {
      console.error('Error consultando MySQL, recurriendo a memoria temporal:', err.message);
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, specialty, price, stock, image, description }) {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  const cleanPrice = parseFloat(price) || 0;
  const cleanStock = parseInt(stock, 10) || 0;
  const cleanSpecialty = specialty || 'Nivel Especial ★★★★';

  if (isConnectedToMySQL && pool) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, specialty, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category || 'Especiales', cleanSpecialty, cleanPrice, cleanStock, image || '', description || '']
    );
    return { id: result.insertId, name, category, specialty: cleanSpecialty, price: cleanPrice, stock: cleanStock, image, description };
  }

  const newProduct = {
    id: Date.now(),
    name,
    category: category || 'Especiales',
    specialty: cleanSpecialty,
    price: cleanPrice,
    stock: cleanStock,
    image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: description || 'Hamburguesa artesanal de Galaxy Hamburguesas con ingredientes frescos.'
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    return true;
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    await pool.query('TRUNCATE TABLE products');
    for (const p of INITIAL_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category, specialty, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.specialty, p.price, p.stock, p.image, p.description]
      );
    }
    return;
  }
  inMemoryProducts = [...INITIAL_PRODUCTS];
}

function getCustomers() {
  return inMemoryCustomers;
}

function getMetrics() {
  const customers = inMemoryCustomers;
  const products = inMemoryProducts;
  
  const vipCustomers = customers.filter(c => c.tier === 'VIP');
  const frequentCustomers = customers.filter(c => c.tier === 'Frecuente');
  const occasionalCustomers = customers.filter(c => c.tier === 'Ocasional');

  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrders = customers.reduce((acc, c) => acc + c.ordersCount, 0);
  const averageTicket = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  return {
    database: getDbStatus(),
    kpis: {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageTicket,
      retentionRate: '88.5%',
      activeBurgersCount: products.length,
      totalCustomersCount: customers.length
    },
    segments: [
      {
        tier: 'VIP / Platino',
        label: 'Consumo Alto (> $100)',
        count: vipCustomers.length,
        percentage: ((vipCustomers.length / customers.length) * 100).toFixed(1),
        revenue: vipCustomers.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(2),
        color: '#D97706',
        badgeBg: '#FEF3C7'
      },
      {
        tier: 'Frecuentes / Oro',
        label: 'Consumo Medio ($40 - $100)',
        count: frequentCustomers.length,
        percentage: ((frequentCustomers.length / customers.length) * 100).toFixed(1),
        revenue: frequentCustomers.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(2),
        color: '#2563EB',
        badgeBg: '#DBEAFE'
      },
      {
        tier: 'Ocasionales / Plata',
        label: 'Consumo Ocasional (< $40)',
        count: occasionalCustomers.length,
        percentage: ((occasionalCustomers.length / customers.length) * 100).toFixed(1),
        revenue: occasionalCustomers.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(2),
        color: '#64748B',
        badgeBg: '#F1F5F9'
      }
    ],
    customers,
    products
  };
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'localhost (in-memory mode)'),
    database: process.env.DB_NAME || 'galaxy_hamburguesas_db',
    user: process.env.DB_USER || 'galaxy_admin',
    table: 'products (10 variantes destacadas)',
    engine: isConnectedToMySQL ? 'MySQL 8.0 InnoDB' : 'In-Memory Engine (NextCollege Fast-Sync)',
    error: lastDbError
  };
}

module.exports = {
  initDB,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getCustomers,
  getMetrics,
  getDbStatus,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS
};
