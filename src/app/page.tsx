import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-andes-black min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-andes-blue/20 to-andes-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-light tracking-wider text-andes-white">
              Andes Mates
            </h1>
            <p className="mt-6 text-lg text-andes-snow/70 leading-relaxed max-w-lg">
              Mates y accesorios inspirados en la Cordillera de los Andes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/productos"
                className="inline-flex items-center px-8 py-3 bg-andes-ice text-andes-white text-sm uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors"
              >
                Ver catálogo
              </Link>
              <WhatsAppButton label="Escribinos" />
            </div>
          </div>
        </div>
      </section>

      {/* Inspirados en la cordillera */}
      <section className="py-24 bg-andes-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Inspirados en la cordillera"
            subtitle="Diseño, tradición y montaña"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#9968;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">
                Simpleza
              </h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                Cada producto está pensado para quienes valoran lo esencial y la
                belleza de lo simple.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#9733;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">
                Tradición
              </h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                El mate como ceremonia, como encuentro, como parte de nuestra
                identidad.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#127746;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">
                Montaña
              </h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                La estética de la cordillera en cada detalle: colores, texturas y
                materiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section className="py-24 bg-andes-snow/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title="Productos destacados"
              subtitle="Selección especial"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section className="py-24 bg-andes-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-wider text-andes-white">
            Contacto
          </h2>
          <p className="mt-4 text-andes-snow/70 text-sm leading-relaxed">
            Escribinos por WhatsApp o seguinos en Instagram para conocer las
            últimas novedades.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <WhatsAppButton label="WhatsApp" />
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border border-andes-ice text-andes-ice text-sm uppercase tracking-widest font-medium hover:bg-andes-ice hover:text-andes-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
