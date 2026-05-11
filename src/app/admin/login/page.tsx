"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let email = input.trim();

      if (!email.includes("@")) {
        email = `${email.toLowerCase()}@andesmates.local`;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setError("Error al iniciar sesión");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!profile) {
        await supabase.auth.signOut();
        setError("No tenés permisos de administrador");
        setLoading(false);
        return;
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        setError("El usuario administrador está desactivado");
        setLoading(false);
        return;
      }

      router.push("/admin/productos");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-andes-white">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-wider text-andes-black">
            ANDES MATES
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-andes-mountain">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="input"
              className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
            >
              Usuario o email
            </label>
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice transition-colors"
              placeholder="usuario o email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs uppercase tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-andes-black text-andes-white text-sm uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
