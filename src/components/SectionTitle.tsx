"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-light tracking-wider text-andes-black">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-andes-mountain text-sm uppercase tracking-widest">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-4 h-px w-16 bg-andes-ice" />
    </motion.div>
  );
}
