import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrecio, getWhatsAppLink } from "@/lib/utils";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block bg-white border border-andes-snow overflow-hidden hover:border-andes-ice/50 transition-colors"
    >
      <div className="aspect-square bg-andes-snow/50 overflow-hidden">
        {product.imagen_url ? (
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-andes-mountain/30 text-sm uppercase tracking-widest">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-andes-mountain">
          {product.categoria}
        </p>

        <h3 className="text-sm font-medium text-andes-black tracking-wide">
          {product.nombre}
        </h3>

        {product.mostrar_precio && product.precio !== null && (
          <p className="text-sm text-andes-ice font-medium">
            {formatPrecio(product.precio)}
          </p>
        )}

        <p
          className={`text-[10px] uppercase tracking-widest ${
            product.disponible ? "text-green-700" : "text-red-600"
          }`}
        >
          {product.disponible ? "Disponible" : "No disponible"}
        </p>

        <div
          className="pt-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(
              getWhatsAppLink(whatsappNumber, product.nombre),
              "_blank"
            );
          }}
        >
          <span className="block w-full text-center px-4 py-2 border border-andes-blue text-andes-blue text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue hover:text-andes-white transition-colors cursor-pointer">
            Consultar por WhatsApp
          </span>
        </div>
      </div>
    </Link>
  );
}
