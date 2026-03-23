# Wardogs — Guía de Desarrollo Step by Step

> Para quien necesita construir este frontal desde cero, sin saltarse nada.
> Sigue el orden. No improvises.

---

## Fase 0 — Antes de escribir una sola linea

### 0.1 Requisitos previos

- [ ] Node.js >= 20 instalado (`node -v`)
- [ ] npm >= 10 instalado (`npm -v`)
- [ ] Git configurado (`git config --global user.name`)
- [ ] El backend ya corre en `http://localhost:3000` o conoces la URL de produccion
- [ ] Tienes acceso al repositorio

### 0.2 Leer antes de tocar nada

1. Lee `ARCHITECTURE.md` completo — entiende la estructura
2. Identifica que dominio vas a trabajar (auth, users, productos, eventos...)
3. Revisa si ya existe un service para ese dominio en `src/services/`

---

## Fase 1 — Arrancar el proyecto

```bash
# 1. Clonar el repo
git clone https://github.com/kabalera82/wardogs.git
cd wardogs

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.development .env.local
# Edita .env.local y pon la URL de tu backend:
# VITE_BACKEND_URL=http://localhost:3000

# 4. Arrancar en desarrollo
npm run dev
# La app abre en http://localhost:5173
```

**Verificacion:** Ves la home con Header, Hero y Footer. Si no carga, revisa la consola del navegador.

---

## Fase 2 — Entender el flujo de autenticacion

Antes de tocar nada, reproduce el flujo de login en tu cabeza:

```
Usuario rellena email + password
    ↓
Login.jsx llama a authService.login()
    ↓
authService llama a fetchAPI('/usuarios/login', ...)
    ↓
fetchAPI hace POST al backend
    ↓
Backend responde { token, usuario }
    ↓
AuthContext.login() guarda el token en localStorage
    ↓
setUsuario(usuario) actualiza el estado global
    ↓
ProtectedRoute ya permite pasar
```

Si no entiendes este flujo, para y leelo de nuevo. Todo lo demas depende de esto.

---

## Fase 3 — Crear una nueva funcionalidad (paso a paso)

Vamos a usar como ejemplo "crear la seccion de Eventos".

### Paso 1 — Crear el servicio

Siempre empieza por el servicio. Nunca hagas fetch directamente desde un componente.

```js
// src/services/eventService.js

import { fetchAPI, fetchConToken } from './api'

const eventService = {
  // Publico — cualquiera puede ver los eventos
  obtenerEventos: () =>
    fetchAPI('/eventos'),

  obtenerEvento: (id) =>
    fetchAPI(`/eventos/${id}`),

  // Autenticado — solo admins
  crearEvento: (datos) =>
    fetchConToken('/eventos', { method: 'POST', body: JSON.stringify(datos) }),

  actualizarEvento: (id, datos) =>
    fetchConToken(`/eventos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),

  eliminarEvento: (id) =>
    fetchConToken(`/eventos/${id}`, { method: 'DELETE' })
}

export default eventService
```

**Regla:** Si la operacion necesita estar logado, usa `fetchConToken`. Si no, `fetchAPI`.

### Paso 2 — Crear la pagina

Una pagina es un componente que ocupa toda la ruta. No tiene logica de negocio compleja — delega en servicios.

```jsx
// src/pages/Events.jsx

import { useState, useEffect } from 'react'
import eventService from '../services/eventService'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Events() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    eventService.obtenerEventos()
      .then(setEventos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p>Cargando...</p>
  if (error)    return <p>Error: {error}</p>

  return (
    <>
      <Header />
      <main>
        {eventos.map((evento) => (
          <div key={evento.id}>
            <h2>{evento.titulo}</h2>
            <p>{evento.descripcion}</p>
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}

export default Events
```

### Paso 3 — Registrar la ruta

```jsx
// src/App.jsx — añade la ruta nueva

import Events from './pages/Events'

// Dentro de <Routes>:
<Route path="/eventos" element={<Events />} />
```

### Paso 4 — Crear componentes especificos (si los necesitas)

Si el componente se usa en mas de un sitio, va a `src/components/`.
Si solo se usa en una pagina, puedes definirlo en el mismo archivo de la pagina.

```jsx
// Componente de tarjeta de evento — reutilizable
// src/components/EventCard.jsx

function EventCard({ titulo, fecha, descripcion }) {
  return (
    <article className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold">{titulo}</h3>
      <p className="text-gray-400 text-sm">{fecha}</p>
      <p className="text-gray-300">{descripcion}</p>
    </article>
  )
}

export default EventCard
```

### Paso 5 — Añadir al panel de admin (si necesita CRUD)

```jsx
// src/components/admin/EventManagement.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import eventService from '../../services/eventService'

function EventManagement() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    eventService.obtenerEventos().then(setEventos)
  }, [])

  const handleEliminar = async (id) => {
    await eventService.eliminarEvento(id)
    setEventos(eventos.filter((e) => e.id !== id))
  }

  return (
    <section>
      <h2>Gestion de Eventos</h2>
      {eventos.map((e) => (
        <div key={e.id}>
          <span>{e.titulo}</span>
          <button onClick={() => handleEliminar(e.id)}>Eliminar</button>
        </div>
      ))}
    </section>
  )
}

export default EventManagement
```

---

## Fase 4 — Subir archivos e imagenes

Usa `uploadService` para cualquier archivo. Nunca hagas el FormData manual en el componente.

```jsx
// Ejemplo de uso en un componente
import uploadService from '../services/uploadService'

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('imagen', file)

  const resultado = await uploadService.subirImagen(formData)
  console.log('URL de la imagen:', resultado.url)
}
```

---

## Fase 5 — Proteger una ruta

Cualquier ruta que requiera login:

```jsx
// App.jsx
import ProtectedRoute from './components/ProtectedRoute'

<Route
  path="/mi-ruta-privada"
  element={
    <ProtectedRoute>
      <MiComponente />
    </ProtectedRoute>
  }
/>
```

`ProtectedRoute` se encarga de:
1. Mostrar spinner mientras carga la sesion
2. Redirigir a `/login` si no hay sesion
3. Renderizar el componente si hay sesion activa

---

## Fase 6 — Acceder a los datos del usuario en cualquier componente

```jsx
import { useAuth } from '../context/AuthContext'

function MiComponente() {
  const { usuario, estaAutenticado } = useAuth()

  return (
    <div>
      {estaAutenticado() ? (
        <p>Hola, {usuario.nombre}</p>
      ) : (
        <p>No estas autenticado</p>
      )}
    </div>
  )
}
```

---

## Fase 7 — Estilos con Tailwind

El proyecto usa Tailwind CSS v4. Todos los estilos van inline en el JSX.

```jsx
// Correcto
<div className="flex items-center justify-between bg-gray-900 p-4">

// Incorrecto — no crees clases CSS custom salvo que Tailwind no lo cubra
<div className="mi-clase-personalizada">
```

Para casos especiales (animaciones complejas, estilos del backend como avatares dinamicos), usa un `.css` junto al componente:

```
components/user/AvatarUpload.jsx
components/user/AvatarUpload.css   ← solo si Tailwind no llega
```

---

## Fase 8 — Checklist antes de hacer commit

- [ ] El servicio existe y usa `fetchAPI` o `fetchConToken` correctamente
- [ ] El componente no hace fetch directamente (siempre via servicio)
- [ ] La ruta esta registrada en `App.jsx`
- [ ] Si es privada, esta envuelta en `ProtectedRoute`
- [ ] No hay tokens, passwords ni secrets en el codigo
- [ ] Las variables de entorno usan el prefijo `VITE_`
- [ ] El codigo compila sin errores: `npm run build`
- [ ] El linter no da errores: `npm run lint`

---

## Fase 9 — Flujos especiales

### Cambiar password

```js
// Desde el panel de usuario
import userService from '../services/userService'

const handleCambiarPassword = async () => {
  await userService.cambiarContrasena({ passwordActual, passwordNueva })
}
```

### Gestion de roles (admin)

```js
// Solo accesible si usuario.rol === 'admin'
import userService from '../services/userService'

const handleCambiarRol = async (userId, nuevoRol) => {
  await userService.cambiarRol(userId, nuevoRol)
}
```

---

## Fase 10 — Construir para produccion

```bash
# Genera los archivos optimizados en /dist
npm run build

# Preview local del build de produccion
npm run preview
```

Asegurate de que `.env.production` tiene la URL correcta del backend antes de hacer el build.

---

## Referencia rapida — Donde va cada cosa

| Que quieres hacer | Donde va |
|-------------------|----------|
| Llamada a la API | `src/services/*.js` |
| Estado global (auth, user) | `src/context/` |
| Logica reutilizable | `src/hooks/` |
| Funciones de ayuda (JWT, fechas...) | `src/utils/` |
| Vista completa de una ruta | `src/pages/` |
| Bloque visual reutilizable | `src/components/` |
| Admin CRUD panel | `src/components/admin/` |
| Panel de usuario autenticado | `src/components/user/` |
| Imagen/icono estatico | `public/assets/` |
| Variable de entorno | `.env.development` / `.env.production` |

---

## Errores comunes y como evitarlos

| Error | Causa | Solucion |
|-------|-------|----------|
| `401 Unauthorized` | No se envia el token | Usar `fetchConToken` en vez de `fetchAPI` |
| El token no persiste | Se guarda en memoria, no en localStorage | Usar `guardarToken()` de `utils/auth.js` |
| `useAuth` lanza error | Se usa fuera de `AuthProvider` | Asegurarse de que `AuthProvider` envuelve el componente en `App.jsx` |
| FormData falla | Se añade `Content-Type: application/json` manualmente | Dejar que `fetchAPI` detecte el FormData automaticamente |
| Ruta no protegida | Se olvida `ProtectedRoute` | Revisar `App.jsx` y envolver la ruta |
| Variables de entorno undefined | Falta el prefijo `VITE_` | Renombrar a `VITE_MI_VARIABLE` |
