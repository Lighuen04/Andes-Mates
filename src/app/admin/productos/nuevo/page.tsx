"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProductForm from "@/components/ProductForm";

export default function NuevoProductoPage() {
  const [session, setSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push("/admin");
        return;
      }
      setSession(true);
    });
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-andes-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-light tracking-wider text-andes-black mb-8">
          Nuevo producto
        </h1>
        <ProductForm />
      </div>
    </div>
  );
}
