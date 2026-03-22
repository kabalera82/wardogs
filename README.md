# 🥊 WarDogs — Frontend

Interfaz web de la plataforma MMA **WarDogs**. Incluye noticias, galería, tienda, agenda de clases, perfil de usuario y panel de administración completo.

Conecta con la API REST [backendWardogs](https://github.com/kabalera82/backendWardogs).

---

## Stack Tecnológico

- **Framework:** React 19
- **Bundler:** Vite 7
- **Estilos:** Tailwind CSS 4
- **Router:** React Router DOM 7
- **Estado global:** Context API (AuthContext)
- **Auth:** jwt-decode
- **Iconos:** react-icons
- **Deploy:** Vercel

---

## Características

- 🏠 Landing page con hero, noticias destacadas y horario de clases
- 🛒 Tienda de productos con listado y detalle
- 📰 Sección de noticias
- 🥋 Página de luchadores del equipo
- 🔐 Autenticación JWT — login/logout con roles
- 👤 Panel de usuario: perfil, avatar, eventos inscritos
- 🛡️ Panel de administración: gestión de usuarios, productos, noticias, galería, eventos y contenido destacado
- 🚧 Rutas protegidas con `ProtectedRoute`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/kabalera82/wardogs.git
cd wardogs

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.development .env.local
# Editar con la URL de tu API

# 4. Arrancar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## Variables de Entorno

```env
# .env.development
VITE_BACKEND_URL=http://localhost:3000

# .env.production
VITE_BACKEND_URL=https://backend-wardogs.vercel.app
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Linting con ESLint |

---

## Rutas de la Aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home — hero, noticias, horario |
| `/login` | Público | Login de usuario |
| `/shop` | Público | Tienda de productos |
| `/news` | Público | Listado de noticias |
| `/fighters` | Público | Equipo de luchadores |
| `/profile` | Autenticado | Panel de usuario |
| `/admin` | Autenticado | Panel de administración |
| `/dashboard` | Autenticado | Dashboard |

---

## Estructura del Proyecto

```
src/
├── App.jsx                         # Router y layout principal
├── main.jsx                        # Punto de entrada
├── index.css                       # Estilos globales
├── context/
│   └── AuthContext.jsx             # Contexto de autenticación JWT
├── hooks/
│   └── useUser.js                  # Hook para datos del usuario
├── utils/
│   └── auth.js                     # Helpers de autenticación
├── services/
│   ├── api.js                      # Cliente HTTP base (fetch + headers)
│   ├── authService.js              # Login, registro, logout
│   ├── userService.js              # Perfil, actualización de usuario
│   ├── uploadService.js            # Subida de archivos
│   ├── productService.js           # Productos de la tienda
│   ├── newsService.js              # Noticias
│   ├── eventService.js             # Eventos
│   ├── galleryService.js           # Galería de imágenes
│   └── contentService.js           # Contenido destacado (peleas, horarios)
├── pages/
│   ├── Login.jsx
│   ├── Shop.jsx
│   ├── News.jsx
│   └── Fighters.jsx
└── components/
    ├── Header.jsx
    ├── Hero.jsx
    ├── Footer.jsx
    ├── NewsSection.jsx
    ├── ClassSchedule.jsx
    ├── ProtectedRoute.jsx          # Guard de rutas protegidas
    ├── admin/
    │   ├── ContentManagement.jsx   # Peleas y horarios destacados
    │   ├── EventManagement.jsx     # CRUD de eventos
    │   ├── GalleryManagement.jsx   # CRUD de galería
    │   ├── NewsManagement.jsx      # CRUD de noticias
    │   ├── ProductManagement.jsx   # CRUD de productos
    │   └── UserManagement.jsx      # CRUD de usuarios y roles
    └── user/
        ├── UserPanel.jsx           # Panel de usuario / admin
        ├── UserEvents.jsx          # Eventos del usuario
        └── AvatarUpload.jsx        # Subida de avatar
```

---

## Conexión con el Backend

Este frontend consume la API [backendWardogs](https://github.com/kabalera82/backendWardogs).

| Entorno | URL base |
|---------|----------|
| Producción | `https://backend-wardogs.vercel.app` |
| Local | `http://localhost:3000` |

Las rutas protegidas envían el token JWT en el header `Authorization: Bearer <token>`.

---

## Autor

**kabalera82** — [GitHub](https://github.com/kabalera82)
