# Wardogs — Guia de Backend con Supabase

> Guia step by step para construir el backend de Wardogs usando **Supabase**
> como base de datos en lugar de MongoDB.
>
> La arquitectura Express permanece igual. Solo cambia: DB (Supabase), Auth
> (Supabase Auth), y Ficheros (Supabase Storage).

---

## Stack resultante

| Capa | Antes (MongoDB) | Ahora (Supabase) |
|------|----------------|-----------------|
| Base de datos | MongoDB + Mongoose | Supabase (PostgreSQL) |
| ORM/Query builder | Mongoose schemas | `@supabase/supabase-js` |
| Autenticacion | bcrypt + JWT propio | Supabase Auth (JWT incluido) |
| Ficheros | Multer + disco local | Supabase Storage |
| Framework HTTP | Express | Express (igual) |
| Variables de entorno | dotenv | dotenv (igual) |

---

## Fase 0 — Crear el proyecto Supabase

### 0.1 Crear cuenta y proyecto

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto:
   - Nombre: `wardogs`
   - Password: una contrasena fuerte (guardala, la necesitaras)
   - Region: la mas cercana a tus usuarios (EU West para Espana)
3. Espera ~2 min a que el proyecto arranque

### 0.2 Obtener las credenciales

En el panel de Supabase → **Project Settings → API**:

```
Project URL:    https://xxxxxxxxxxxx.supabase.co
anon key:       eyJhbGci...  (clave publica, va en el frontend)
service_role:   eyJhbGci...  (clave privada, SOLO en el backend)
```

**NUNCA pongas la `service_role` key en el frontend. Nunca.**

---

## Fase 1 — Setup del proyecto Express

### 1.1 Instalar dependencias

```bash
# Clonar o crear el proyecto
git clone git@github.com:kabalera82/backendWardogs.git
cd backendWardogs

# Quitar Mongoose, añadir Supabase
npm uninstall mongoose
npm install @supabase/supabase-js

# El resto permanece igual
npm install express cors dotenv jsonwebtoken bcryptjs multer
npm install -D nodemon
```

`package.json` resultante:

```json
{
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "bcryptjs": "^3.x.x",
    "cors": "^2.x.x",
    "dotenv": "^16.x.x",
    "express": "^4.x.x",
    "jsonwebtoken": "^9.x.x",
    "multer": "^2.x.x"
  },
  "devDependencies": {
    "nodemon": "^3.x.x"
  }
}
```

### 1.2 Variables de entorno

```bash
# .env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=una-clave-secreta-muy-larga-y-aleatoria

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...  # service_role key (privada)
```

---

## Fase 2 — Crear el cliente Supabase

Sustituye `src/config/db.js` (que conectaba a MongoDB) por el cliente de Supabase:

```js
// src/config/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan las variables SUPABASE_URL o SUPABASE_SERVICE_KEY')
    process.exit(1)
}

// service_role bypasses Row Level Security — solo para el backend
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

console.log('Supabase client inicializado correctamente')
```

En `src/index.js`, elimina `conectarDB()` — Supabase no necesita conexion previa:

```js
// src/index.js — elimina estas dos lineas:
// import conectarDB from './config/db.js'
// conectarDB()

// Y añade el import del cliente (aunque no lo uses directamente aqui)
import './config/supabase.js'
```

---

## Fase 3 — Crear las tablas en Supabase

Supabase usa **PostgreSQL**. Vas a crear las tablas desde el panel:
**Supabase Dashboard → SQL Editor → New query**

Copia y ejecuta este SQL completo:

```sql
-- =============================================
-- TABLA: usuarios
-- =============================================
CREATE TABLE usuarios (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    contrasena  TEXT NOT NULL,
    nombre      TEXT NOT NULL,
    apellidos   TEXT,
    telefono    TEXT,
    dni         TEXT,
    seudonimo   TEXT UNIQUE,
    rol         TEXT NOT NULL DEFAULT 'usuario'
                    CHECK (rol IN ('admin','entrenador','usuario','luchador','cliente')),
    estado_federacion TEXT NOT NULL DEFAULT 'no_aplica'
                    CHECK (estado_federacion IN ('federado','no_federado','no_aplica')),
    numero_licencia TEXT,
    especializacion TEXT,
    certificaciones TEXT[] DEFAULT '{}',
    avatar      TEXT,
    biografia   TEXT CHECK (char_length(biografia) <= 500),
    activo      BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    ultimo_acceso TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: eventos
-- =============================================
CREATE TABLE eventos (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo      TEXT NOT NULL,
    fecha       TIMESTAMPTZ NOT NULL,
    ubicacion   TEXT NOT NULL,
    descripcion TEXT,
    imagen      TEXT,
    publicado   BOOLEAN DEFAULT TRUE,
    creado_por  UUID REFERENCES usuarios(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: productos
-- =============================================
CREATE TABLE productos (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre      TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio      NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    tallas      TEXT[] DEFAULT '{}',
    stock       INTEGER DEFAULT 0 CHECK (stock >= 0),
    categoria   TEXT DEFAULT 'General',
    imagen      TEXT,
    activo      BOOLEAN DEFAULT TRUE,
    creado_por  UUID REFERENCES usuarios(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: noticias
-- =============================================
CREATE TABLE noticias (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo      TEXT NOT NULL,
    contenido   TEXT NOT NULL,
    imagen      TEXT,
    publicado   BOOLEAN DEFAULT FALSE,
    creado_por  UUID REFERENCES usuarios(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: galeria
-- =============================================
CREATE TABLE galeria (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url         TEXT NOT NULL,
    titulo      TEXT,
    descripcion TEXT,
    creado_por  UUID REFERENCES usuarios(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: contenido (CMS)
-- =============================================
CREATE TABLE contenido (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clave       TEXT UNIQUE NOT NULL,
    valor       TEXT,
    tipo        TEXT DEFAULT 'texto',
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: horarios
-- =============================================
CREATE TABLE horarios (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dia         TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin    TEXT NOT NULL,
    clase       TEXT NOT NULL,
    entrenador  TEXT,
    activo      BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Trigger: actualizar updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER tr_eventos_updated_at
    BEFORE UPDATE ON eventos
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER tr_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER tr_noticias_updated_at
    BEFORE UPDATE ON noticias
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
```

**Verificacion:** Ve a **Table Editor** y deberias ver todas las tablas creadas.

---

## Fase 4 — Crear los Buckets de almacenamiento

En **Supabase Dashboard → Storage → New bucket**:

| Bucket | Publico | Uso |
|--------|---------|-----|
| `avatars` | Si | Fotos de perfil de usuarios |
| `eventos` | Si | Imagenes de eventos |
| `productos` | Si | Imagenes de productos |
| `galeria` | Si | Galeria del gym |

Marcalos como **publicos** para que las URLs sean accesibles sin autenticacion.

---

## Fase 5 — Reemplazar los modelos Mongoose por queries Supabase

### Tabla de equivalencias

| Mongoose | Supabase |
|----------|----------|
| `Model.find({})` | `supabase.from('tabla').select('*')` |
| `Model.find({ activo: true })` | `.eq('activo', true)` |
| `Model.findById(id)` | `.select('*').eq('id', id).single()` |
| `new Model(data).save()` | `.insert(data).select().single()` |
| `Model.findByIdAndUpdate(id, data)` | `.update(data).eq('id', id).select().single()` |
| `Model.findByIdAndDelete(id)` | `.delete().eq('id', id)` |
| `Model.countDocuments(filtros)` | `.select('*', { count: 'exact', head: true })` |
| `.limit(n).skip(m)` | `.range(m, m + n - 1)` |
| `.sort({ fecha: 1 })` | `.order('fecha', { ascending: true })` |
| `.select('nombre email')` | `.select('nombre, email')` |

### Ejemplo: controller de usuarios con Supabase

```js
// src/controllers/usuario.controller.js

import { supabase } from '../config/supabase.js'
import { generarToken } from '../utils/token.auth.js'
import bcrypt from 'bcryptjs'

class UsuarioController {

    // POST /api/usuarios/registro
    static async registro(req, res) {
        try {
            const { email, contrasena, nombre, apellidos, telefono } = req.body

            if (!email || !contrasena || !nombre) {
                return res.status(400).json({ success: false, error: 'Email, contraseña y nombre son obligatorios' })
            }

            // Verificar si el email ya existe
            const { data: existente } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', email.toLowerCase())
                .single()

            if (existente) {
                return res.status(409).json({ success: false, error: 'El email ya esta registrado' })
            }

            // Hashear contrasena
            const hash = await bcrypt.hash(contrasena, 10)

            // Insertar usuario
            const { data: usuario, error } = await supabase
                .from('usuarios')
                .insert({
                    email: email.toLowerCase(),
                    contrasena: hash,
                    nombre,
                    apellidos,
                    telefono,
                    rol: 'usuario'
                })
                .select('id, email, nombre, apellidos, rol')
                .single()

            if (error) throw error

            const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol })

            res.status(201).json({ success: true, mensaje: 'Usuario registrado', data: { usuario, token } })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // POST /api/usuarios/login
    static async login(req, res) {
        try {
            const { email, contrasena } = req.body

            if (!email || !contrasena) {
                return res.status(400).json({ success: false, error: 'Email y contraseña son obligatorios' })
            }

            // Buscar usuario incluyendo contrasena (select explicito)
            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('id, email, nombre, apellidos, rol, avatar, activo, contrasena')
                .eq('email', email.toLowerCase())
                .single()

            if (error || !usuario) {
                return res.status(401).json({ success: false, error: 'Credenciales invalidas' })
            }

            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
            if (!contrasenaValida) {
                return res.status(401).json({ success: false, error: 'Credenciales invalidas' })
            }

            if (!usuario.activo) {
                return res.status(403).json({ success: false, error: 'Usuario desactivado' })
            }

            // Actualizar ultimo acceso
            await supabase
                .from('usuarios')
                .update({ ultimo_acceso: new Date().toISOString() })
                .eq('id', usuario.id)

            const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol })

            // No devolver la contrasena
            const { contrasena: _, ...usuarioSinPass } = usuario

            res.json({ success: true, mensaje: 'Login exitoso', data: { usuario: usuarioSinPass, token } })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // GET /api/usuarios/perfil
    static async obtenerPerfil(req, res) {
        try {
            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('id, email, nombre, apellidos, telefono, seudonimo, rol, avatar, biografia, activo, created_at')
                .eq('id', req.usuario.id)
                .single()

            if (error || !usuario) {
                return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
            }

            res.json({ success: true, data: usuario })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // GET /api/usuarios (admin)
    static async listarUsuarios(req, res) {
        try {
            const { rol, activo, pagina = 1, limite = 10 } = req.query
            const desde = (parseInt(pagina) - 1) * parseInt(limite)
            const hasta = desde + parseInt(limite) - 1

            let query = supabase
                .from('usuarios')
                .select('id, email, nombre, apellidos, rol, activo, created_at', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(desde, hasta)

            if (rol)    query = query.eq('rol', rol)
            if (activo !== undefined) query = query.eq('activo', activo === 'true')

            const { data: usuarios, count, error } = await query

            if (error) throw error

            res.json({
                success: true,
                data: {
                    usuarios,
                    paginacion: {
                        total: count,
                        pagina: parseInt(pagina),
                        limite: parseInt(limite),
                        totalPaginas: Math.ceil(count / parseInt(limite))
                    }
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // DELETE /api/usuarios/:id (admin — desactivar)
    static async desactivarUsuario(req, res) {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({ activo: false })
                .eq('id', req.params.id)

            if (error) throw error

            res.json({ success: true, mensaje: 'Usuario desactivado' })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}

export default UsuarioController
```

---

## Fase 6 — Subida de ficheros con Supabase Storage

Sustituye Multer + disco local por Multer + Supabase Storage.

Multer sigue recibiendo el fichero en memoria (`memoryStorage`), luego lo sube a Supabase.

```js
// src/middleware/upload.js

import multer from 'multer'
import { supabase } from '../config/supabase.js'
import path from 'path'

// Multer en memoria — no guarda en disco
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mime = allowedTypes.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Solo se permiten imagenes (jpeg, jpg, png, webp, gif)'))
}

export const uploadAvatar    = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter })
export const uploadEventImage = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter })
export const uploadProduct   = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter })
export const uploadGallery   = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter })

// Helper para subir a Supabase Storage
export const subirAStorage = async (bucket, carpeta, file, prefijo = 'file') => {
    const ext = path.extname(file.originalname)
    const nombre = `${carpeta}/${prefijo}-${Date.now()}${ext}`

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(nombre, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        })

    if (error) throw new Error(`Error subiendo fichero: ${error.message}`)

    // Obtener URL publica
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(nombre)
    return urlData.publicUrl
}
```

### Usar `subirAStorage` en un controller

```js
// Ejemplo en event.controller.js
import { subirAStorage } from '../middleware/upload.js'

static async crearEvento(req, res) {
    try {
        const { titulo, fecha, ubicacion, descripcion, publicado } = req.body

        let imagenUrl = null
        if (req.file) {
            // Sube la imagen a Supabase Storage, bucket 'eventos'
            imagenUrl = await subirAStorage('eventos', 'imagenes', req.file, req.usuario.id)
        }

        const { data: evento, error } = await supabase
            .from('eventos')
            .insert({
                titulo,
                fecha,
                ubicacion,
                descripcion,
                imagen: imagenUrl,
                publicado: publicado === 'true',
                creado_por: req.usuario.id
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({ success: true, mensaje: 'Evento creado', data: evento })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}
```

---

## Fase 7 — JWT (sin cambios)

El middleware de autenticacion `src/utils/token.auth.js` **no cambia**. Sigue usando `jsonwebtoken`.

El token lleva `{ id, email, rol }` y se verifica en cada request protegida.

```js
// token.auth.js — igual que antes
export const autenticar = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Token no proporcionado' })
    }
    const token = authHeader.substring(7)
    const decoded = verificarToken(token)    // lanza si expira o es invalido
    req.usuario = { id: decoded.id, email: decoded.email, rol: decoded.rol }
    next()
}

export const autorizar = (...roles) => (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({ success: false, error: 'Sin permisos' })
    }
    next()
}
```

---

## Fase 8 — Crear el admin inicial (seed)

```js
// src/seeds/crearAdmin.js

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const crearAdmin = async () => {
    const email = 'admin@wardogs.com'
    const contrasena = 'Admin1234!'
    const nombre = 'Administrador'

    const { data: existente } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single()

    if (existente) {
        console.log('El admin ya existe')
        process.exit(0)
    }

    const hash = await bcrypt.hash(contrasena, 10)

    const { data, error } = await supabase
        .from('usuarios')
        .insert({ email, contrasena: hash, nombre, rol: 'admin' })
        .select()
        .single()

    if (error) {
        console.error('Error creando admin:', error.message)
        process.exit(1)
    }

    console.log('Admin creado:', data.email)
    process.exit(0)
}

crearAdmin()
```

Ejecutar una sola vez:

```bash
node src/seeds/crearAdmin.js
```

---

## Fase 9 — Estructura de rutas (sin cambios)

Las rutas de Express son identicas al backend original. El patron es:

```js
// src/routes/usuario.routes.js
import express from 'express'
import UsuarioController from '../controllers/usuario.controller.js'
import { autenticar, autorizar } from '../utils/token.auth.js'
import { uploadAvatar } from '../middleware/upload.js'

const router = express.Router()

// Publicas
router.post('/registro',        UsuarioController.registro)
router.post('/login',           UsuarioController.login)
router.get('/public/team',      UsuarioController.obtenerEquipoPublico)

// Autenticadas
router.get('/perfil',           autenticar, UsuarioController.obtenerPerfil)
router.put('/perfil',           autenticar, UsuarioController.actualizarPerfil)
router.put('/cambiar-contrasena', autenticar, UsuarioController.cambiarContrasena)
router.post('/avatar',          autenticar, uploadAvatar.single('avatar'), UsuarioController.subirAvatar)

// Solo admin
router.get('/',                 autenticar, autorizar('admin'), UsuarioController.listarUsuarios)
router.put('/:id/rol',         autenticar, autorizar('admin'), UsuarioController.cambiarRol)
router.put('/:id',             autenticar, autorizar('admin'), UsuarioController.actualizarUsuarioPorAdmin)
router.delete('/:id',          autenticar, autorizar('admin'), UsuarioController.desactivarUsuario)

export default router
```

El patron de rutas es **identico para todos los dominios**. Copia y adapta.

---

## Fase 10 — Checklist antes de hacer commit

- [ ] `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` en `.env` (nunca en git)
- [ ] `.env` esta en `.gitignore`
- [ ] Tablas creadas en Supabase (verificado en Table Editor)
- [ ] Buckets de Storage creados y marcados como publicos
- [ ] Admin seed ejecutado al menos una vez
- [ ] `npm run dev` arranca sin errores
- [ ] Health check responde: `GET /api/health`
- [ ] Login devuelve token valido

---

## Referencia rapida — Queries Supabase mas usadas

```js
// SELECT todos
const { data } = await supabase.from('eventos').select('*')

// SELECT con filtro
const { data } = await supabase.from('eventos').select('*').eq('publicado', true)

// SELECT uno por ID
const { data } = await supabase.from('eventos').select('*').eq('id', id).single()

// SELECT con paginacion
const { data, count } = await supabase
    .from('usuarios')
    .select('*', { count: 'exact' })
    .range(0, 9)   // primera pagina de 10

// INSERT
const { data } = await supabase.from('eventos').insert({ titulo, fecha }).select().single()

// UPDATE
const { data } = await supabase.from('eventos').update({ titulo }).eq('id', id).select().single()

// DELETE
await supabase.from('eventos').delete().eq('id', id)

// Subir fichero a Storage
const { data } = await supabase.storage.from('avatars').upload('ruta/fichero.jpg', buffer, { contentType: 'image/jpeg' })

// URL publica de fichero
const { data } = supabase.storage.from('avatars').getPublicUrl('ruta/fichero.jpg')
// → data.publicUrl
```

---

## Errores comunes y como evitarlos

| Error | Causa | Solucion |
|-------|-------|----------|
| `Invalid API key` | `service_role` key incorrecta | Copia desde Project Settings → API |
| `relation "tabla" does not exist` | Tabla no creada | Ejecuta el SQL del Fase 3 |
| `JWT expired` | Token de 7 dias caducado | El cliente debe hacer login de nuevo |
| `new row violates check constraint` | Valor no valido en campo `rol` o `estado_federacion` | Revisa los valores permitidos en el CHECK del SQL |
| `null value in column "creado_por"` | `req.usuario.id` es undefined | Asegurate de usar el middleware `autenticar` en la ruta |
| Imagen no sube | Bucket no existe o no es publico | Crea el bucket en Supabase Storage |
| `CORS error` | Frontend no permitido | Revisa el `FRONTEND_URL` en `.env` y el `cors()` en `index.js` |
