"use client";

import { motion } from "framer-motion";
import { smoothTransition } from "@/lib/animations";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...smoothTransition, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
