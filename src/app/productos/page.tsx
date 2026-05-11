import { getProductsByCategoria } from "@/lib/products";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { CATEGORIAS } from "@/types/product";

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoria = params.categoria || "todas";

  const productos = await getProductsByCategoria(categoria);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Catálogo"
          subtitle="Mates y accesorios"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <a
            href="/productos"
            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
              categoria === "todas"
                ? "bg-andes-black text-andes-white border-andes-black"
                : "bg-transparent text-andes-mountain border-andes-snow hover:border-andes-mountain"
            }`}
          >
            Todas
          </a>
          {CATEGORIAS.map((cat) => (
            <a
              key={cat.value}
              href={`/productos?categoria=${cat.value}`}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
                categoria === cat.value
                  ? "bg-andes-black text-andes-white border-andes-black"
                  : "bg-transparent text-andes-mountain border-andes-snow hover:border-andes-mountain"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products */}
        {productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-andes-mountain text-sm uppercase tracking-widest">
              No hay productos en esta categoría todavía.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
