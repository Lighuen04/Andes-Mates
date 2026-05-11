import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatPrecio } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/productos"
          className="inline-flex items-center text-xs uppercase tracking-widest text-andes-mountain hover:text-andes-ice transition-colors mb-8"
        >
          &larr; Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-andes-snow/50 overflow-hidden">
            {product.imagen_url ? (
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-andes-mountain/30 text-sm uppercase tracking-widest">
                Sin imagen
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-andes-mountain">
              {product.categoria}
            </p>

            <h1 className="text-3xl md:text-4xl font-light tracking-wider text-andes-black">
              {product.nombre}
            </h1>

            {product.mostrar_precio && product.precio !== null && (
              <p className="text-2xl text-andes-ice font-medium">
                {formatPrecio(product.precio)}
              </p>
            )}

            <p
              className={`text-xs uppercase tracking-widest ${
                product.disponible ? "text-green-700" : "text-red-600"
              }`}
            >
              {product.disponible ? "Disponible" : "No disponible"}
            </p>

            {product.descripcion && (
              <p className="text-sm text-andes-mountain leading-relaxed">
                {product.descripcion}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <WhatsAppButton productName={product.nombre} />
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-andes-ice text-andes-ice text-sm uppercase tracking-widest font-medium hover:bg-andes-ice hover:text-andes-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Ver en Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
