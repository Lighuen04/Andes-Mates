"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center mb-12 md:mb-16"
    >
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-andes-black leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-andes-mountain text-xs uppercase tracking-[0.2em] font-medium">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-5 h-0.5 w-12 bg-andes-ice/60 rounded-full" />
    </motion.div>
  );
}
