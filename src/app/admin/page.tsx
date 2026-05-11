"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Credenciales inválidas. Intentá de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
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
              htmlFor="email"
              className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice transition-colors"
              placeholder="admin@andesmates.com"
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
