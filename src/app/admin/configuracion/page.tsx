"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminConfiguracionPage() {
  const supabase = createClient();
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroUrl, setHeroUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_background")
      .single()
      .then(({ data }) => {
        if (data) {
          setHeroUrl(data.value);
          setPreview(data.value);
        }
      });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!heroFile) return;
    setSaving(true);
    setMessage("");

    const fileExt = heroFile.name.split(".").pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(fileName, heroFile, { upsert: true });

    if (uploadError) {
      setMessage("Error al subir la imagen");
      setSaving(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("site-images")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    setPreview(publicUrl);
    setHeroFile(null);

    const { error: dbError } = await supabase
      .from("site_settings")
      .upsert({ key: "hero_background", value: publicUrl }, { onConflict: "key" });

    if (dbError) {
      setMessage("Error al guardar la configuración");
    } else {
      setMessage("Imagen de fondo actualizada correctamente");
    }
    setSaving(false);
  }, [heroFile]);

  const handleRemove = async () => {
    setSaving(true);
    setMessage("");
    setPreview(null);
    setHeroUrl("");

    await supabase
      .from("site_settings")
      .upsert({ key: "hero_background", value: "" }, { onConflict: "key" });

    setMessage("Imagen de fondo eliminada. Se usará el degradado por defecto.");
    setSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-light tracking-wider text-andes-black mb-2">
        Configuración
      </h1>
      <p className="text-andes-mountain text-xs uppercase tracking-widest mb-8">
        Ajustes del sitio
      </p>

      <div className="max-w-lg space-y-8">
        {/* Hero Background */}
        <div>
          <h2 className="text-sm font-medium text-andes-black mb-1">
            Fondo del Hero (página principal)
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-andes-mountain mb-4">
            Imagen de fondo para la sección principal del home
          </p>

          {preview && (
            <div className="mb-4 border border-andes-snow overflow-hidden">
              <img
                src={preview}
                alt="Hero background"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={saving || !heroFile}
                className="px-6 py-3 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar imagen"}
              </button>
              {preview && (
                <button
                  onClick={handleRemove}
                  disabled={saving}
                  className="px-6 py-3 border border-red-600 text-red-600 text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        {message && (
          <p className="text-andes-ice text-xs uppercase tracking-widest">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
