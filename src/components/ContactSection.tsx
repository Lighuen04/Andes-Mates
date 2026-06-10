import WhatsAppButton from "./WhatsAppButton";
import InstagramButton from "./InstagramButton";

export default function ContactSection() {
  return (
    <section className="py-24 md:py-32 bg-andes-black">
      <div className="section-container section-container--narrow text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-andes-white leading-tight text-balance">
          Contacto
        </h2>
        <p className="mt-4 text-andes-snow/60 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          ¿Querés consultar por un producto? Escribinos por WhatsApp o Instagram
          para conocer disponibilidad, precios y opciones de entrega.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <WhatsAppButton
            label="Lighuen"
            phone="5492942530736"
          />
          <WhatsAppButton
            label="Alejandro"
            phone="5492604652513"
          />
          <InstagramButton />
        </div>
      </div>
    </section>
  );
}
