import SectionTitle from "@/components/SectionTitle";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactoPage() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionTitle title="Contacto" subtitle="Escribinos" />

        <p className="text-sm text-andes-mountain leading-relaxed mb-10 max-w-md mx-auto">
          Si tenés alguna consulta, querés saber más sobre algún producto o
          simplemente querés saludarnos, no dudes en escribirnos.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <WhatsAppButton label="WhatsApp" />
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-andes-ice text-andes-ice text-sm uppercase tracking-widest font-medium hover:bg-andes-ice hover:text-andes-white transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
