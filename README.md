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

## Configuración de Supabase

1. Crear un proyecto en [Supabase](https://supabase.com/).
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/schema.sql` para crear la tabla `products`, `admin_profiles` y las políticas de seguridad.
3. Ir a **Storage** y crear un bucket público llamado `product-images`.
4. En **Storage > Policies**, agregar las siguientes políticas:
   - **SELECT pública**: permitir lectura pública del bucket `product-images`.
   - **INSERT autenticado**: permitir inserción solo a usuarios autenticados.
5. Ir a **Authentication > Settings** y habilitar el proveedor **Email/Password**.

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
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp con código de país (ej: 5491123456789) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL completa del perfil de Instagram (ej: https://instagram.com/andesmates) |

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Admin

Ir a `/admin/login` e iniciar sesión con un usuario administrador.

Desde el panel se pueden:
- Ver listado de productos
- Crear nuevos productos (con imagen)
- Editar productos existentes
- Eliminar productos
- Marcar como disponible / no disponible
- Marcar como destacado / no destacado

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

> **Importante**: Reemplazar `UUID_DEL_USUARIO_1` y `UUID_DEL_USUARIO_2` por los IDs reales que aparecen en la tabla `auth.users` (los puedes ver en Authentication > Users, columna ID).

### Notas de seguridad

- No escribir contraseñas en `schema.sql`.
- No subir `.env.local` a GitHub (ya está en `.gitignore`).
- Las contraseñas se gestionan exclusivamente desde Supabase Auth.
- El login valida que el usuario exista en `admin_profiles` con `role = 'admin'` e `is_active = true`.

## Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Crear un proyecto en [Vercel](https://vercel.com/) y conectarlo con el repositorio.
3. En Vercel, ir a **Settings > Environment Variables** y agregar todas las variables de `.env.local`.
4. Desplegar.

La variable `SUPABASE_SERVICE_ROLE_KEY` se usa en el servidor para operaciones admin. En Vercel, asegurarse de marcarla como sensitive.

## Estructura del proyecto

```
src/
  app/                    # Páginas (App Router)
    page.tsx              # Home
    admin/                # Panel de administración
      login/              # Login
      productos/          # CRUD de productos
      catalogo/           # Gestión de catálogo
      configuracion/      # Configuración del sitio
    catalogo/             # Catálogo público
  components/             # Componentes reutilizables
  lib/                    # Lógica de negocio
    supabase/             # Clientes de Supabase
    products.ts           # Funciones para productos
    utils.ts              # Utilidades generales
  types/                  # Tipos de TypeScript
supabase/
  schema.sql              # Esquema de base de datos y políticas RLS
middleware.ts             # Protección de rutas del admin
```

## Personalización

- **Colores**: editarlos en `src/app/globals.css` en el bloque `@theme`.
- **WhatsApp**: cambiar el mensaje precargado en `src/lib/utils.ts` función `getWhatsAppLink`.
- **Número de WhatsApp**: cambiarlo desde la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Instagram**: cambiar la URL desde `NEXT_PUBLIC_INSTAGRAM_URL`.
