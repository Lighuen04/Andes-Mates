import ImagePlaceholder from "./ImagePlaceholder";
import WhatsAppButton from "./WhatsAppButton";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  product: CatalogProduct;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group block bg-white border border-andes-snow overflow-hidden hover:border-andes-ice/50 transition-colors">
      <div className="aspect-square overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={product.nombre}
          />
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-andes-black tracking-wide text-center">
          {product.nombre}
        </h3>
        <p
          className={`text-[10px] uppercase tracking-widest text-center ${
            product.disponible ? "text-green-700" : "text-red-600"
          }`}
        >
          {product.disponible ? "Disponible" : "No disponible"}
        </p>
        <WhatsAppButton
          productName={product.nombre}
          className="w-full text-center justify-center"
        />
      </div>
    </div>
  );
}
