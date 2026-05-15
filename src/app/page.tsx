import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import SectionTitle from "@/components/SectionTitle";
import HistorySection from "@/components/HistorySection";
import ContactSection from "@/components/ContactSection";
import { getCatalogCategories } from "@/lib/data";
import { getHeroBackground } from "@/lib/site-settings";

export default async function HomePage() {
  const categories = await getCatalogCategories();
  const heroBg = await getHeroBackground();

  return (
    <>
      <Hero backgroundImage={heroBg ?? undefined} />

      <section className="py-24 bg-andes-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Catálogo"
            subtitle="Mates, bombillas, materos, termos y combos"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-andes-snow/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Inspirados en la cordillera"
            subtitle="Diseño, tradición y montaña"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#127807;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">Simpleza</h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                Cada producto está pensado para quienes valoran lo esencial y la belleza de lo simple.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#129545;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">Tradición</h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                El mate como ceremonia, como encuentro, como parte de nuestra identidad.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-andes-black flex items-center justify-center">
                <span className="text-andes-ice text-xl">&#9968;</span>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-andes-black mb-2">Montaña</h3>
              <p className="text-sm text-andes-mountain leading-relaxed">
                La estética de la cordillera en cada detalle: colores, texturas y materiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HistorySection />
      <ContactSection />
    </>
  );
}
