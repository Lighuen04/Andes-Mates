import WhatsAppButton from "./WhatsAppButton";
import InstagramButton from "./InstagramButton";

export default function ContactSection() {
  return (
    <section className="py-24 bg-andes-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-light tracking-wider text-andes-white">
          Contacto
        </h2>
        <p className="mt-4 text-andes-snow/70 text-sm leading-relaxed">
          ¿Querés consultar por un producto? Escribinos por WhatsApp o Instagram
          para conocer disponibilidad, precios y opciones de entrega.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <WhatsAppButton label="WhatsApp" />
          <InstagramButton />
        </div>
      </div>
    </section>
  );
}
