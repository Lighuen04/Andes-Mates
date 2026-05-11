export default function Footer() {
  return (
    <footer className="bg-andes-black border-t border-andes-mountain/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-andes-white mb-3">
              ANDES MATES
            </h3>
            <p className="text-sm text-andes-snow/70 leading-relaxed">
              Mates y accesorios inspirados en la Cordillera de los Andes.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-andes-snow mb-3">
              Navegación
            </h4>
            <div className="space-y-2">
              <a
                href="/productos"
                className="block text-sm text-andes-snow/70 hover:text-andes-ice transition-colors"
              >
                Catálogo
              </a>
              <a
                href="/historia"
                className="block text-sm text-andes-snow/70 hover:text-andes-ice transition-colors"
              >
                Historia
              </a>
              <a
                href="/contacto"
                className="block text-sm text-andes-snow/70 hover:text-andes-ice transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-andes-snow mb-3">
              Contacto
            </h4>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-andes-snow/70 hover:text-andes-ice transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-andes-snow/70 hover:text-andes-ice transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-andes-mountain/30 mt-8 pt-8 text-center">
          <p className="text-xs text-andes-snow/50">
            &copy; {new Date().getFullYear()} Andes Mates. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
