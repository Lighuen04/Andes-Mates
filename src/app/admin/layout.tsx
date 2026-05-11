"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type AdminUser = {
  id: string;
  email: string;
  username: string;
};

type AdminContextType = {
  user: AdminUser | null;
};

const AdminContext = createContext<AdminContextType>({ user: null });

export const useAdminUser = () => useContext(AdminContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        if (!isLoginPage) {
          router.push("/admin/login");
        } else {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!profile || profile.role !== "admin" || !profile.is_active) {
        if (!cancelled) setDenied(true);
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) {
        setUser({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email ?? "",
          username: profile.username,
        });
        setLoading(false);
      }

      if (isLoginPage) {
        router.push("/admin/productos");
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">
          Cargando...
        </p>
      </div>
    );
  }

  if (denied || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <div className="text-center max-w-sm mx-auto px-4">
          <h1 className="text-xl font-light tracking-wider text-andes-black mb-4">
            Acceso denegado
          </h1>
          <p className="text-andes-mountain text-sm mb-6">
            No tenés permisos para acceder al panel de administración.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-andes-black text-andes-white text-xs uppercase tracking-widest hover:bg-andes-blue transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ user }}>
      <div className="min-h-screen bg-andes-white">
        <nav className="border-b border-andes-snow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link
                  href="/admin/productos"
                  className="text-sm font-medium tracking-wider text-andes-black"
                >
                  ANDES MATES
                </Link>
                <div className="hidden sm:flex items-center gap-4">
                  <Link
                    href="/admin/productos"
                    className="text-[10px] uppercase tracking-widest text-andes-mountain hover:text-andes-black transition-colors"
                  >
                    Productos
                  </Link>
                  <Link
                    href="/admin/catalogo/categorias"
                    className="text-[10px] uppercase tracking-widest text-andes-mountain hover:text-andes-black transition-colors"
                  >
                    Categorías
                  </Link>
                  <Link
                    href="/admin/configuracion"
                    className="text-[10px] uppercase tracking-widest text-andes-mountain hover:text-andes-black transition-colors"
                  >
                    Configuración
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-andes-mountain">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
