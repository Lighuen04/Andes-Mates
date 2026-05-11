import SectionTitle from "@/components/SectionTitle";

export default function HistoriaPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Nuestra historia" subtitle="Andes Mates" />

        <div className="space-y-6 text-sm text-andes-mountain leading-relaxed">
          <p>
            Andes Mates nace cerca de la Cordillera de los Andes, con la idea de
            reunir mates y accesorios que transmitan simpleza, tradición y una
            estética propia de la montaña.
          </p>

          <p>
            La marca busca unir la tradición del mate con una estética sobria,
            natural y cercana al paisaje andino. Por eso trabaja una identidad
            visual basada en el gris de la piedra, el blanco de la nieve, el azul
            del cielo de montaña y el negro como contraste.
          </p>

          <p>
            El objetivo es ofrecer mates y accesorios con una presentación
            cuidada, pensados para quienes valoran los detalles, la simpleza y el
            momento de compartir un mate.
          </p>
        </div>
      </div>
    </div>
  );
}
