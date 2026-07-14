export default function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  return (
    <footer className="bg-andes-black border-t border-andes-mountain/20">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-serif text-xl tracking-wide text-andes-white mb-3">
              Andes Mates
            </h3>
            <p className="text-sm text-andes-snow/60 leading-relaxed max-w-xs">
              Mates y accesorios inspirados en la Cordillera de los Andes.
              Simpleza, calidad y tradición en cada pieza.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-andes-snow/80 mb-4 font-medium">
              Navegación
            </h4>
            <div className="space-y-2.5">
              <a
                href="/"
                className="block text-sm text-andes-snow/60 hover:text-andes-ice transition-colors duration-(--transition-standard)"
              >
                Inicio
              </a>
              <a
                href="/catalogo"
                className="block text-sm text-andes-snow/60 hover:text-andes-ice transition-colors duration-(--transition-standard)"
              >
                Catálogo
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-andes-snow/80 mb-4 font-medium">
              Contacto
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/5492604652513"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-andes-snow/60 hover:text-andes-ice transition-colors duration-(--transition-standard)"
              >
                WhatsApp
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-andes-snow/60 hover:text-andes-ice transition-colors duration-(--transition-standard)"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-andes-mountain/20 mt-12 pt-8 text-center">
          <p className="text-xs text-andes-snow/40">
            &copy; {new Date().getFullYear()} Andes Mates. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
