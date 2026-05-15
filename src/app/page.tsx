import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import SectionTitle from "@/components/SectionTitle";
import AnimatedSection from "@/components/AnimatedSection";
import { StaggerGrid, StaggerItem } from "@/components/StaggerContainer";
import HistorySection from "@/components/HistorySection";
import ContactSection from "@/components/ContactSection";
import { getCatalogCategories } from "@/lib/data";
import { getHeroBackground } from "@/lib/site-settings";

const features = [
  {
    icon: "🌿",
    title: "Simpleza",
    description:
      "Cada producto está pensado para quienes valoran lo esencial y la belleza de lo simple.",
  },
  {
    icon: "🐔",
    title: "Tradición",
    description:
      "El mate como ceremonia, como encuentro, como parte de nuestra identidad.",
  },
  {
    icon: "⛰",
    title: "Montaña",
    description:
      "La estética de la cordillera en cada detalle: colores, texturas y materiales.",
  },
];

export default async function HomePage() {
  const categories = await getCatalogCategories();
  const heroBg = await getHeroBackground();

  return (
    <>
      <Hero backgroundImage={heroBg ?? undefined} />

      <AnimatedSection className="py-24 md:py-32 bg-andes-white">
        <div className="section-container">
          <SectionTitle
            title="Catálogo"
            subtitle="Mates, bombillas, materos, termos y combos"
          />
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard category={cat} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </AnimatedSection>

      <section className="py-24 md:py-32 bg-andes-snow/30">
        <div className="section-container section-container--narrow">
          <SectionTitle
            title="Inspirados en la cordillera"
            subtitle="Diseño, tradición y montaña"
          />
          <StaggerGrid className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-andes-black flex items-center justify-center">
                    <span className="text-andes-ice text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="font-serif text-lg text-andes-black mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-andes-mountain leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <HistorySection />
      <ContactSection />
    </>
  );
}
