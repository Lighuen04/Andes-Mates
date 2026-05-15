"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WhatsAppButton from "./WhatsAppButton";
import { heroContainer, heroItem, heroItemSubtitle } from "@/lib/animations";

interface Props {
  backgroundImage?: string;
}

export default function Hero({ backgroundImage }: Props) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-andes-black">
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-andes-blue/50 via-andes-black/60 to-andes-black/90" />
        </>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-andes-blue/20 to-andes-black" />
      )}

      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full section-container"
      >
        <div className="max-w-2xl">
          <motion.p
            variants={heroItemSubtitle}
            className="text-andes-ice text-sm uppercase tracking-[0.2em] mb-4 font-medium"
          >
            Tradición y diseño de montaña
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-andes-white leading-[1.1] tracking-tight text-balance"
          >
            Andes Mates
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 text-base sm:text-lg text-andes-snow/80 leading-relaxed max-w-lg"
          >
            Mates y accesorios inspirados en la Cordillera de los Andes.
            Simpleza, calidad y tradición en cada pieza.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/catalogo"
              className="inline-flex items-center px-8 py-3.5 bg-andes-ice text-andes-white text-sm uppercase tracking-widest font-medium rounded-(--radius-button) hover:bg-andes-blue transition-all duration-(--transition-standard) shadow-lg shadow-andes-blue/20 hover:shadow-andes-blue/30"
            >
              Ver catálogo
            </Link>
            <WhatsAppButton label="Consultar por WhatsApp" variant="outline" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-px h-12 bg-gradient-to-b from-andes-snow/40 to-transparent" />
      </motion.div>
    </section>
  );
}
