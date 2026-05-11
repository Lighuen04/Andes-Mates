# Andes Mates

Catálogo digital de mates y accesorios inspirado en la Cordillera de los Andes.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Base de datos, Autenticación, Storage)

## Requisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com/) (plan gratuito)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/andes-mates.git
cd andes-mates

# Instalar dependencias
npm install
```

## Variables de entorno

Copiar el archivo `.env.example` a `.env.local` y completar los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto (Settings > API > Project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (Settings > API > Anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Settings > API > Service role) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp con código de país (ej: 5492942530736) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL completa del perfil de Instagram |

> **Importante:** No subir `.env.local` al repositorio (ya está en `.gitignore`).

## Configuración de Supabase

### 1. Ejecutar el schema

Ir a **SQL Editor** en Supabase Dashboard y ejecutar el contenido de `supabase/schema.sql`.

Esto crea todas las tablas necesarias:
- `products` — Productos del catálogo
- `categories` — Categorías dinámicas
- `subcategories` — Subcategorías
- `product_images` — Galería de fotos por producto
- `site_settings` — Configuración del sitio (imagen del hero, etc.)
- `admin_profiles` — Perfiles de administradores

### 2. Crear buckets de Storage

Ir a **Storage** en Supabase Dashboard y crear los siguientes buckets **públicos**:

| Bucket | Uso |
|---|---|
| `product-images` | Fotos de productos |
| `category-images` | Imágenes de categorías |
| `site-images` | Imágenes del sitio (fondo del hero) |

Para cada bucket, agregar las siguientes políticas en **Storage > Policies**:

```sql
-- Lectura pública
CREATE POLICY "Public read BUCKET_NAME"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'BUCKET_NAME');

-- Subida solo para autenticados
CREATE POLICY "Admin upload BUCKET_NAME"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'BUCKET_NAME' AND auth.role() = 'authenticated');

-- Eliminación solo para autenticados
CREATE POLICY "Admin delete BUCKET_NAME"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'BUCKET_NAME' AND auth.role() = 'authenticated');
```

### 3. Habilitar autenticación

Ir a **Authentication > Settings** y habilitar el proveedor **Email/Password**.

## Crear usuarios administradores

Los usuarios administradores se crean manualmente desde Supabase Dashboard. No se hardcodean contraseñas en el código ni se guardan en texto plano.

### Paso 1: Crear el usuario en Supabase Auth

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard).
2. Seleccionar el proyecto.
3. Ir a **Authentication > Users**.
4. Hacer clic en **Add user**.
5. Ingresar:
   - **Email**: `alepelitoculo@andesmates.local`
   - **Password**: (definir una contraseña segura manualmente)
   - **Email confirmed**: activado
6. Hacer clic en **Create user**.
7. Repetir para el segundo usuario:
   - **Email**: `lighuen04@andesmates.local`
   - **Password**: (definir una contraseña segura manualmente)
   - **Email confirmed**: activado

### Paso 2: Agregar el perfil admin

1. Ir a **SQL Editor** en Supabase Dashboard.
2. Ejecutar la siguiente consulta, reemplazando los UUID por los IDs reales de los usuarios creados:

```sql
insert into public.admin_profiles (id, username, role, is_active)
values
('UUID_DEL_USUARIO_1', 'alepelitoculo', 'admin', true),
('UUID_DEL_USUARIO_2', 'Lighuen04', 'admin', true);
```

> **Importante:** Reemplazar `UUID_DEL_USUARIO_1` y `UUID_DEL_USUARIO_2` por los IDs reales que aparecen en Authentication > Users (columna ID).

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Admin

Ir a `/admin/login` e iniciar sesión con un usuario administrador.

Se puede ingresar con:
- **Email**: `alepelitoculo@andesmates.local` (o el email configurado)
- **Usuario**: `alepelitoculo` (el sistema resuelve automáticamente el email asociado)

### Funcionalidades del panel

#### Productos (`/admin/productos`)
- Ver listado de productos con stock, precio, disponibilidad
- Crear nuevos productos con imágenes
- Editar productos existentes
- Elegir categoría y subcategoría
- Subir múltiples fotos
- Elegir foto principal
- Modificar stock
- Activar/desactivar disponible
- Marcar como destacado
- Eliminar productos

#### Categorías (`/admin/catalogo/categorias`)
- Crear categorías con nombre, slug, descripción e imagen
- Editar categorías existentes
- Activar/desactivar categorías
- Crear subcategorías dentro de cada categoría
- Eliminar categorías (con subcategorías asociadas)

#### Configuración (`/admin/configuracion`)
- Subir o cambiar la imagen de fondo del Hero de la página principal
- La imagen se guarda en el bucket `site-images`
- La URL se almacena en `site_settings` con clave `hero_background`
- Si no hay imagen, se muestra el degradado por defecto

### Fotos de productos

- Cada producto puede tener múltiples fotos en la galería
- Una foto puede marcarse como **principal** (aparece en las cards del catálogo público)
- Todas las fotos aparecen en la galería del producto en la página pública
- Si no hay fotos, se muestra un placeholder "Foto pendiente"

### Seguridad

- Las rutas `/admin/*` están protegidas por middleware
- Solo usuarios autenticados en Supabase Auth pueden acceder
- Se verifica que el usuario exista en `admin_profiles` con `role = 'admin'` e `is_active = true`
- Usuarios sin permisos ven "Acceso denegado"
- Las contraseñas se gestionan exclusivamente desde Supabase Auth
- No hay contraseñas hardcodeadas en el código
- `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor, nunca en el navegador

## WhatsApp

El botón de WhatsApp usa el número configurado en `NEXT_PUBLIC_WHATSAPP_NUMBER`.

En productos, el mensaje precargado es:
```
Hola, quiero consultar por: [nombre del producto]
```

## Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Crear un proyecto en [Vercel](https://vercel.com/) y conectarlo con el repositorio.
3. En Vercel, ir a **Settings > Environment Variables** y agregar todas las variables de `.env.local`.
4. Marcar `SUPABASE_SERVICE_ROLE_KEY` como sensitive.
5. Desplegar.

## Estructura del proyecto

```
src/
  app/
    page.tsx              # Home
    admin/
      login/              # Login de administradores
      page.tsx            # Redirige a /admin/productos
      layout.tsx          # Layout con verificación de permisos
      productos/          # CRUD de productos
        page.tsx          # Listado
        nuevo/            # Crear producto
        [id]/             # Editar producto
      catalogo/
        categorias/       # Gestión de categorías
      configuracion/      # Configuración del sitio (hero)
    catalogo/             # Catálogo público (lee desde Supabase)
    api/
      resolve-username/   # API para resolver usuario → email
  components/             # Componentes reutilizables
  lib/
    supabase/             # Clientes de Supabase (server, client)
    data.ts               # Función de datos con fallback a catalog.ts
    products.ts           # Funciones para productos
    categories.ts         # Funciones para categorías y subcategorías
    product-images.ts     # Funciones para galería de fotos
    site-settings.ts      # Funciones para configuración del sitio
    utils.ts              # Utilidades generales
  types/
    product.ts            # Tipo Product
    site.ts               # Tipos Category, Subcategory, ProductImage, SiteSetting
  data/
    catalog.ts            # Datos de catálogo hardcodeados (fallback)
supabase/
  schema.sql              # Esquema de base de datos y políticas RLS
middleware.ts             # Protección de rutas del admin
```

## Personalización

- **Colores**: editarlos en `src/app/globals.css` en el bloque `@theme`.
- **WhatsApp**: cambiar el número desde `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Instagram**: cambiar la URL desde `NEXT_PUBLIC_INSTAGRAM_URL`.
- **Hero**: subir imagen de fondo desde `/admin/configuracion`.
