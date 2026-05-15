import SectionTitle from "./SectionTitle";

export default function HistorySection() {
  return (
    <section className="py-24 md:py-32 bg-andes-white">
      <div className="section-container section-container--narrow">
        <SectionTitle title="Nuestra historia" subtitle="Andes Mates" />
        <div className="space-y-5 text-sm sm:text-base text-andes-mountain leading-relaxed max-w-2xl mx-auto">
          <p>
            Andes Mates nace cerca de la Cordillera de los Andes, con la idea
            de reunir mates y accesorios que transmitan simpleza, tradición y
            una estética propia de la montaña.
          </p>
          <p>
            La marca busca unir la tradición del mate con una estética sobria,
            natural y cercana al paisaje andino. Por eso trabaja una identidad
            visual basada en el gris de la piedra, el blanco de la nieve, el
            azul del cielo de montaña y el negro como contraste.
          </p>
          <p>
            El objetivo es ofrecer mates y accesorios con una presentación
            cuidada, pensados para quienes valoran los detalles, la simpleza y
            el momento de compartir un mate.
          </p>
        </div>
      </div>
    </section>
  );
}
