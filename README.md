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
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/schema.sql` para crear la tabla `products` y las políticas de seguridad.
3. Ir a **Storage** y crear un bucket público llamado `product-images`.
4. En **Storage > Policies**, agregar las siguientes políticas:
   - **SELECT pública**: permitir lectura pública del bucket `product-images`.
   - **INSERT autenticado**: permitir inserción solo a usuarios autenticados.
5. Ir a **Authentication > Settings** y habilitar el proveedor **Email/Password**.
6. Crear un usuario admin en **Authentication > Users > Invite user** con el email y contraseña que usarás para acceder al panel `/admin`.

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

Ir a `/admin` e iniciar sesión con el usuario creado en Supabase.

Desde el panel se pueden:
- Ver listado de productos
- Crear nuevos productos (con imagen)
- Editar productos existentes
- Eliminar productos
- Marcar como disponible / no disponible
- Marcar como destacado / no destacado

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
    productos/            # Catálogo y detalle
    historia/             # Página "Nuestra historia"
    contacto/             # Página de contacto
    admin/                # Panel de administración
  components/             # Componentes reutilizables
  lib/                    # Lógica de negocio
    supabase/             # Clientes de Supabase
    products.ts           # Funciones para productos
    utils.ts              # Utilidades generales
  types/                  # Tipos de TypeScript
supabase/
  schema.sql              # Esquema de base de datos y políticas RLS
```

## Personalización

- **Colores**: editarlos en `src/app/globals.css` en el bloque `@theme`.
- **WhatsApp**: cambiar el mensaje precargado en `src/lib/utils.ts` función `getWhatsAppLink`.
- **Número de WhatsApp**: cambiarlo desde la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Instagram**: cambiar la URL desde `NEXT_PUBLIC_INSTAGRAM_URL`.
