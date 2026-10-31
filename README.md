# 🍔 NextCollege - MasterGeniusjoa | Plataforma Comercial de Alto Rendimiento

> **Scaffold Profesional y Template Repository** diseñado para webinars, masterclasses y entornos de producción. Integra un ecosistema full-stack unificado con **Landing E-commerce (Astro)**, **PWA Móvil (React)** y **Panel de Administración (React)**, respaldado por una **API REST en Node.js/Express** con persistencia dual (**MySQL / In-Memory**) y despliegue automatizado con **Docker y Dokploy**.

---

## 🎨 Referencia Visual y Rediseño de UI de la Landing E-commerce

La interfaz de usuario de la capa **Landing E-commerce** ha sido renovada adoptando el diseño de la referencia visual ubicada en:

📍 **Ruta local de la imagen de referencia:**  
`D:\NetxCollege\Laboratorio\laboratorio\imagen\7109aefe8e230e92a685dfdb89915bfb.jpg`

### Elementos Visuales y Paleta Adoptada:
* **Paleta de Colores Dark Gourmet:**
  * **Fondo Principal (Background):** Deep Obsidian y Dark Slate (`#0B0C10`, `#14161E`).
  * **Acento Primario (Primary Amber):** Ámbar dorado y naranja vibrante (`#FF9F1C`, `#FFA200`, `#F59E0B`).
  * **Bordes y Superficies:** Tarjetas oscuras con relieve sutil (`#1B1E28`, bordes `#232733`).
  * **Tipografía:** Títulos en mayúsculas display condensadas (*Bebas Neue* / *Plus Jakarta Sans*), combinados con acentos caligráficos en script (*Caveat*).
* **Cabecera y Navegación:**
  * Logotipo de marca con icono de hamburguesa y lema *"TASTYBITES &bull; EAT. ENJOY. REPEAT."*.
  * Menú de navegación con estado activo resaltado (`HOME`, `MENU`, `OFFERS`, `ABOUT US`, `CONTACT`).
  * Acceso rápido a las capas del sistema (`PWA`, `Admin`) y botón píldora **"ORDER ONLINE 👜"** con contador de ítems en vivo.
* **Hero Section de Alto Impacto:**
  * Subtítulo en caligrafía *"Craving Something"*.
  * Titular gigante *"Delicious BURGERS"* con efecto tipográfico dual (blanco script + ámbar display).
  * Píldora de atributos de frescura: `HOT • FRESH • TASTY`.
  * Llamados a la acción principales: Botón de orden inmediata `ORDER NOW →` y botón interactivo `▶ WATCH VIDEO` con reproducción de video de preparación artesanal.
  * Sello circular de garantía: `★★★ 100% FRESH & PREMIUM ★★★`.
  * Composición fotográfica gastronómica en tabla de piedra con hamburguesa, patatas fritas y vaso térmico.
* **Barra Flotante de Categorías (Category Strip):**
  * Contenedor flotante tipo píldora blanca con 6 categorías ilustradas con microinteracciones:
    1. 🍔 **BURGERS** (*Juicy & Cheesy*)
    2. 🍟 **FRIES** (*Crispy & Golden*)
    3. 🍕 **PIZZA** (*Hot & Delicious*)
    4. 🥤 **DRINKS** (*Chill & Refreshing*)
    5. 🍗 **CHICKEN** (*Crispy & Spicy*)
    6. 🍨 **DESSERTS** (*Sweet Treats*)
  * Filtro interactivo que actualiza instantáneamente el catálogo de productos.
* **Sección "Popular Picks & OUR BESTSELLERS":**
  * Encabezado decorativo con filetes dorados simétricos.
  * Grilla de 4 tarjetas oscuras con badge circular de **"BEST SELLER"**:
    * **Signature Burger** ($5.49) &bull; *Loaded with cheese & special sauce*.
    * **Cheesy Pizza** ($8.49) &bull; *Fresh veggies, italian herbs & cheese*.
    * **Crispy Chicken** ($5.99) &bull; *Golden fried & perfectly seasoned*.
    * **Loaded Fries** ($2.99) &bull; *Crispy fries with cheese & sauce*.
  * Botón circular naranja **`+`** para adición inmediata al carrito.
* **Banner Promocional de Delivery:**
  * Bloque con degradado ámbar cálido y borde segmentado: *"HUNGRY? We Deliver To You!"*.
  * Ilustración animada de mensajero en scooter de entrega rápida.
  * Oferta especial: **"GET 20% OFF ON YOUR FIRST ORDER"** con código de cupón **`WELCOME20`**.
* **Drawer de Carrito y Modales Interactivos:**
  * Carrito de compras deslizante (*Cart Drawer*) con cálculo de total, listado de ítems y botón de checkout sincronizado hacia la PWA.
  * Modal detallado de ingredientes, desglose nutricional (calorías, gramaje de carne, tiempo de cocción) y especificaciones técnicas.
* **Footer Corporativo Completo:**
  * Resumen de marca, canales sociales (Facebook, Instagram, X, TikTok, YouTube).
  * Columnas de navegación: *Quick Links*, *Customer Care*, datos de contacto (+1 (555) 123-4567, hello@tastybites.com).
  * Insignias oficiales para descarga de app móvil (*App Store* y *Google Play*) con redirección directa a la PWA.

---

## 🏛️ Arquitectura del Proyecto: Las 3 Capas Principales

El proyecto está estructurado como un monorepositorio modular donde coexisten tres capas front-end independientes y un servidor backend centralizado:

```
laboratorio/
├── apps/
│   ├── ecommerce/         # Capa 1: Landing E-commerce de Alto Impacto (Astro)
│   ├── pwa/               # Capa 2: Progressive Web App Móvil de Pedidos (React + Vite)
│   └── admin/             # Capa 3: Panel de Administración & Métricas (React + Vite)
├── server/                # Backend API REST, Rutas y Persistencia (Node.js + Express)
│   ├── public/            # Artefactos estáticos compilados de las 3 capas
│   │   ├── ecommerce/     # Despachado en la ruta raíz '/'
│   │   ├── pwa/           # Despachado en la ruta '/app'
│   │   └── admin/         # Despachado en la ruta '/admin'
│   └── src/               # Código fuente del servidor (app.js, db.js, routes/api.js)
├── imagen/                # Recursos visuales y referencia de diseño
│   └── 7109aefe8e230e92a685dfdb89915bfb.jpg
├── Dockerfile             # Construcción multi-stage lista para Dokploy
└── package.json           # Orquestador de scripts globales
```

---

### 1️⃣ Capa 1: Landing E-commerce (`apps/ecommerce`)

* **Tecnología:** [Astro 4.x](https://astro.build/) (Static Site Generation - SSG).
* **Ruta de Acceso en Servidor:** `/` (Raíz).
* **Propósito y Capacidades:**
  * Creada para maximizar la velocidad de carga (Core Web Vitals óptimos) sin sobrecargar al cliente con JavaScript innecesario.
  * Implementa la identidad visual moderna (TastyBites Dark Luxury).
  * Catálogo completo con 10 variedades gastronómicas maestras (burgers de autor, pollo crispy, papas con trufa, pizzas artesanales y postres).
  * Filtrado reactivo en el navegador por categorías (*Burgers, Chicken, Fries, Pizza, Desserts*).
  * Modal interactivo para inspección de especificaciones gastronómicas: gramaje, calorías, tiempo de cocción y listado de ingredientes.
  * Carrito de compras deslizante en memoria (*Cart Drawer*) con badges dinámicos y redirección fluida hacia la experiencia de compra en la PWA.
  * Sección destacada con llamado a la acción para la descarga o uso de la PWA móvil.

---

### 2️⃣ Capa 2: Progressive Web App - PWA (`apps/pwa`)

* **Tecnología:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/).
* **Ruta de Acceso en Servidor:** `/app` (SPA con soporte de Service Worker y Fallback).
* **Propósito y Capacidades:**
  * Experiencia táctil optimizada para dispositivos móviles (iOS, Android y tablets) o pantallas de escritorio.
  * **PWA Instalable:** Dispone de `manifest.json` y Service Worker (`sw.js`) configurados con iconos en múltiples resoluciones (192px y 512px) para añadirse directamente a la pantalla de inicio del usuario sin pasar por tiendas tradicionales.
  * **Simulador de Pedidos en Vivo:** Selección rápida de hamburguesas, combos y acompañamientos.
  * **Cupones de Descuento:** Soporte para validación de cupones promocionales (incluyendo `WELCOME20`).
  * **Rastreador de Pedidos en Tiempo Real:** Interfaz visual con estados secuenciales (*Recibido &rarr; En Cocina &rarr; En Camino &rarr; Entregado*).
  * **Club VIP & Sistema de Puntos:** Módulo de fidelización con acumulación de saldo canjeable.

---

### 3️⃣ Capa 3: Panel de Administración (`apps/admin`)

* **Tecnología:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/).
* **Ruta de Acceso en Servidor:** `/admin` (SPA con gestión de datos).
* **Propósito y Capacidades:**
  * Panel de control integral para gerentes y operadores de cocina.
  * **Métricas en Tiempo Real:** Dashboard con recaudación diaria, tickets promedio, total de clientes registrados y estado del stock.
  * **Gestión de Catálogo (CRUD):** Visualización del inventario de productos, creación de nuevos platillos y eliminación de elementos en base de datos.
  * **Monitoreo de Infraestructura:** Consumo de `/api/health` para auditar la latencia, memoria del proceso, tiempo de actividad (*uptime*) y estado de conectividad con la base de datos.
  * **Sincronización Bidireccional:** Conexión continua con la API REST del backend para reflejar los cambios instantáneamente tanto en la Landing como en la PWA.

---

## ⚙️ Capa Backend y Persistencia de Datos (`server`)

* **Tecnología:** Node.js + Express 4.x.
* **Persistencia Dual Inteligente (`server/src/db.js`):**
  1. **Modo Producción con MySQL:** Conexión mediante `mysql2/promise` con soporte para variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
  2. **Modo Seguro con Mock In-Memory:** Si no se configuran credenciales de base de datos o el contenedor MySQL se encuentra inaccesible, el sistema activa automáticamente un fallback en memoria con el catálogo predeterminado de hamburguesas y clientes, garantizando alta disponibilidad sin caídas de servicio.
* **Endpoints de la API REST (`/api/*`):**
  * `GET /api/health`: Estado de salud, uptime, versión y conectividad de base de datos (ideal para Dokploy y Kubernetes).
  * `GET /api/products`: Catálogo completo de platillos.
  * `POST /api/products`: Creación de nuevo producto con especificaciones de precio y categoría.
  * `DELETE /api/products/:id`: Eliminación de un producto existente.
  * `GET /api/customers`: Listado de clientes frecuentes y métricas de consumo.
  * `GET /api/metrics`: Consolidado de métricas operativas y estadísticas de ventas.
  * `POST /api/reset`: Restablecimiento de fábrica del catálogo inicial.

---

## 🚀 Guía de Instalación y Ejecución

### Prerrequisitos
* Node.js v18.0.0 o superior.
* npm v9.0.0 o superior.

### 1. Instalación de Dependencias
Instala todas las dependencias en cascada (raíz, ecommerce, pwa, admin y server):
```bash
npm run install:all
```

### 2. Compilación de Artefactos (Build)
Puedes compilar cada capa individualmente o ejecutar la sincronización global:
```bash
# Compilar solo la Landing E-commerce (Astro)
npm run build:ecommerce

# Compilar solo la PWA Móvil (React)
npm run build:pwa

# Compilar solo el Panel Admin (React)
npm run build:admin

# Compilación completa y sincronización en server/public
npm run build:all
```

### 3. Ejecución del Servidor
Inicia el servidor Node.js unificado:
```bash
npm start
```
El servidor quedará disponible en:
* **Landing E-commerce:** [http://localhost:3000/](http://localhost:3000/)
* **PWA Móvil:** [http://localhost:3000/app](http://localhost:3000/app)
* **Panel de Control:** [http://localhost:3000/admin](http://localhost:3000/admin)
* **Health Check API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🐳 Despliegue con Docker y Dokploy

El proyecto incluye un `Dockerfile` multi-stage optimizado que:
1. Construye las 3 aplicaciones estáticas (`ecommerce`, `pwa`, `admin`).
2. Sincroniza los artefactos generados en `server/public`.
3. Instala las dependencias del servidor backend en una imagen Node.js Alpine ligera.
4. Expone el puerto `3000` y define el Healthcheck para orquestadores Dokploy / Coolify / Portainer.

Para desplegar localmente con Docker:
```bash
docker build -t nextcollege-masterclass .
docker run -p 3000:3000 -d nextcollege-masterclass
```

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Desarrollado para la serie formativa **NextCollege - MasterGeniusjoa**.
