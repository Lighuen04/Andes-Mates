import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

interface Props {
  backgroundImage?: string;
}

export default function Hero({ backgroundImage }: Props) {
  const heroStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {};

  return (
    <section
      className="relative bg-andes-black min-h-[80vh] flex items-center"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-andes-blue/40 to-andes-black/80" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-light tracking-wider text-andes-white">
            Andes Mates
          </h1>
          <p className="mt-6 text-lg text-andes-snow/80 leading-relaxed max-w-lg">
            Mates y accesorios inspirados en la Cordillera de los Andes.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center px-8 py-3 bg-andes-ice text-andes-white text-sm uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors"
            >
              Ver catálogo
            </Link>
            <WhatsAppButton label="Escribinos" />
          </div>
        </div>
      </div>
    </section>
  );
}
