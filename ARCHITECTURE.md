# Wardogs — Guía de Arquitectura

> Documento de referencia técnica para entender la arquitectura del proyecto,
> sus decisiones de diseño y los patrones establecidos.
> Objetivo: servir de base para reutilizar la lógica en proyectos nuevos.

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| UI Framework | React | ^19.2.0 |
| Build tool | Vite | ^7.2.4 |
| Routing | React Router DOM | ^7.13.0 |
| Estilos | Tailwind CSS | ^4.1.18 |
| Auth tokens | jwt-decode | ^4.0.0 |
| Iconos | react-icons | ^5.5.0 |
| Linting | ESLint | ^9.39.1 |

**Backend esperado:** API REST en `http://localhost:3000` (configurable via `.env`)

---

## 2. Estructura de directorios

```
wardogs/
├── public/                     # Assets estáticos (imágenes, webp)
│   └── assets/
│       ├── galeria/            # Imágenes de la galería
│       └── tienda/             # Imágenes de productos
├── src/
│   ├── main.jsx                # Punto de entrada — monta <App />
│   ├── App.jsx                 # Router raíz + AuthProvider
│   ├── index.css               # Estilos globales
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── Header.jsx          # Cabecera global
│   │   ├── Hero.jsx            # Banner principal (home)
│   │   ├── Footer.jsx          # Pie de página global
│   │   ├── ClassSchedule.jsx   # Horario de clases
│   │   ├── NewsSection.jsx     # Sección de noticias (home)
│   │   ├── ProtectedRoute.jsx  # Guard de rutas autenticadas
│   │   │
│   │   ├── admin/              # Panel de administración
│   │   │   ├── ContentManagement.jsx
│   │   │   ├── EventManagement.jsx
│   │   │   ├── GalleryManagement.jsx
│   │   │   ├── NewsManagement.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   └── UserManagement.jsx
│   │   │
│   │   └── user/               # Panel de usuario
│   │       ├── AvatarUpload.jsx
│   │       ├── UserPanel.jsx
│   │       └── UserEvents.jsx
│   │
│   ├── pages/                  # Vistas completas (una por ruta)
│   │   ├── Login.jsx
│   │   ├── Shop.jsx
│   │   ├── News.jsx
│   │   └── Fighters.jsx
│   │
│   ├── services/               # Capa de acceso a la API
│   │   ├── api.js              # Wrappers HTTP base (fetchAPI / fetchConToken)
│   │   ├── authService.js      # Login, registro
│   │   ├── userService.js      # CRUD de usuarios
│   │   ├── contentService.js   # Contenido CMS
│   │   ├── eventService.js     # Eventos
│   │   ├── galleryService.js   # Galería de imágenes
│   │   ├── newsService.js      # Noticias
│   │   ├── productService.js   # Tienda
│   │   └── uploadService.js    # Subida de archivos/imágenes
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Estado global de autenticación
│   │
│   ├── hooks/
│   │   └── useUser.js          # Hook para acceder a datos del usuario
│   │
│   └── utils/
│       └── auth.js             # Helpers JWT (guardar/obtener/eliminar token)
│
├── .env.development            # Variables para entorno local
├── .env.production             # Variables para producción
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 3. Arquitectura en capas

```
┌──────────────────────────────────────────────┐
│                  PAGES / VIEWS               │  ← Rutas top-level
├──────────────────────────────────────────────┤
│               COMPONENTS (UI)                │  ← Presentación, reutilizable
│        Layout | Features | Admin | User      │
├──────────────────────────────────────────────┤
│         CONTEXT + HOOKS + UTILS              │  ← Estado global y utilidades
│      AuthContext | useUser | auth.js         │
├──────────────────────────────────────────────┤
│                 SERVICES                     │  ← Abstracción de la API REST
│   authService | userService | ... | api.js   │
├──────────────────────────────────────────────┤
│              BACKEND REST API                │  ← Express / Node (externo)
└──────────────────────────────────────────────┘
```

**Flujo de datos unidireccional:**
`Componente → Service → api.js → Backend → Service → Componente`

---

## 4. Capa de servicios — Patrón establecido

### 4.1 `api.js` — Base HTTP

Dos funciones centrales que toda la app usa:

```js
// Petición pública (sin token)
fetchAPI(endpoint, options)

// Petición autenticada (añade JWT automáticamente)
fetchConToken(endpoint, options)
```

**Reglas:**
- `BACKEND_URL` se lee desde `import.meta.env.VITE_BACKEND_URL`
- El token JWT se almacena en `localStorage` bajo la clave `wardogs_token`
- Si el body es `FormData`, NO se añade `Content-Type` (el browser lo gestiona)
- Errores se propagan como `Error` con el mensaje del backend

### 4.2 Servicios específicos

Cada dominio tiene su propio archivo de servicio:

```js
// Patrón de servicio público
const authService = {
  login: (email, contrasena) => fetchAPI('/usuarios/login', { method: 'POST', body: JSON.stringify({ email, contrasena }) }),
  registro: (datosUsuario) => fetchAPI('/usuarios/registro', { method: 'POST', body: JSON.stringify(datosUsuario) })
}

// Patrón de servicio autenticado
const userService = {
  obtenerPerfil: () => fetchConToken('/usuarios/perfil'),
  actualizarPerfil: (datos) => fetchConToken('/usuarios/perfil', { method: 'PUT', body: JSON.stringify(datos) }),
  // Admin:
  obtenerUsuarios: () => fetchConToken('/admin/usuarios'),
  desactivarUsuario: (id) => fetchConToken(`/admin/usuarios/${id}`, { method: 'DELETE' })
}
```

---

## 5. Autenticación — Flujo completo

```
Login form
    │
    ▼
authService.login(email, pass)
    │
    ▼
Backend → devuelve { token, usuario }
    │
    ▼
guardarToken(token)          ← localStorage: 'wardogs_token'
setUsuario(usuario)          ← estado en AuthContext
    │
    ▼
estaAutenticado() === true
    │
    ▼
ProtectedRoute permite el acceso
```

### AuthContext — API expuesta

```js
const { usuario, cargando, login, logout, estaAutenticado } = useAuth()
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `usuario` | Object \| null | Datos del usuario autenticado |
| `cargando` | Boolean | True mientras se verifica la sesión inicial |
| `login(email, pass)` | async fn | Autentica y guarda el token |
| `logout()` | fn | Limpia token y estado |
| `estaAutenticado()` | fn → Boolean | Comprueba si hay sesión activa |

### Helpers JWT (`utils/auth.js`)

```js
guardarToken(token)          // localStorage.setItem
obtenerToken()               // localStorage.getItem
eliminarToken()              // localStorage.removeItem
obtenerUsuarioDelToken()     // jwt-decode del token guardado
```

---

## 6. Routing — Estructura de rutas

```jsx
// App.jsx
<AuthProvider>
  <Router>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/tienda"    element={<Shop />} />
      <Route path="/noticias"  element={<News />} />
      <Route path="/fighters"  element={<Fighters />} />

      {/* Rutas protegidas */}
      <Route path="/perfil"    element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
      <Route path="/admin"     element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
    </Routes>
  </Router>
</AuthProvider>
```

**Nota:** Las rutas `/perfil`, `/admin` y `/dashboard` renderizan `UserPanel` — la UI se adapta internamente según el rol del usuario.

### ProtectedRoute

```jsx
// Comportamiento:
// 1. Si cargando → spinner
// 2. Si no autenticado → <Navigate to="/login" replace />
// 3. Si autenticado → renderiza children
```

---

## 7. Variables de entorno

```bash
# .env.development
VITE_BACKEND_URL=http://localhost:3000

# .env.production
VITE_BACKEND_URL=https://tu-dominio-produccion.com
```

**Convención:** Todas las variables expuestas al cliente deben empezar con `VITE_`.

---

## 8. Convenciones de código

| Aspecto | Convención |
|---------|-----------|
| Idioma variables/funciones | Español (`obtenerPerfil`, `estaAutenticado`, `contrasena`) |
| Componentes | PascalCase (`UserPanel.jsx`) |
| Servicios | camelCase + sufijo Service (`userService.js`) |
| Hooks | prefijo `use` (`useUser.js`) |
| Contextos | sufijo Context (`AuthContext.jsx`) |
| Estilos | Tailwind CSS inline + CSS modules para casos complejos |
| Imágenes/assets | `public/assets/{dominio}/` |

---

## 9. Patrones reutilizables para proyectos nuevos

Estos son los bloques que puedes extraer directamente:

| Bloque | Archivos | Lo que resuelve |
|--------|----------|-----------------|
| HTTP Layer | `api.js` | Fetch wrapper con/sin auth, manejo de errores, FormData |
| Auth completa | `AuthContext.jsx`, `utils/auth.js`, `authService.js` | Login, logout, persistencia JWT, restauración de sesión |
| Route guard | `ProtectedRoute.jsx` | Protección de rutas con loading state |
| User hook | `hooks/useUser.js` | Acceso a datos de usuario desde cualquier componente |
| Servicio base | Cualquier `*Service.js` | Patrón CRUD sobre la misma API |
| Panel adaptativo | `components/user/UserPanel.jsx` | UI que cambia según rol sin cambiar ruta |

---

## 10. Diagrama de dependencias

```
App.jsx
  ├── AuthProvider (AuthContext.jsx)
  │     ├── authService.js → api.js
  │     └── utils/auth.js
  │
  ├── ProtectedRoute.jsx
  │     └── useAuth() ← AuthContext
  │
  ├── Pages/Components
  │     ├── useAuth() ← AuthContext
  │     ├── useUser() ← hooks/useUser.js
  │     └── *Service.js → api.js
  │
  └── admin/* / user/*
        └── *Service.js → api.js (con token)
```
