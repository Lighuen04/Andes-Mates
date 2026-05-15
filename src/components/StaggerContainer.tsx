"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

interface ItemProps {
  children: React.ReactNode;
}

export function StaggerGrid({ children, className }: GridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: ItemProps) {
  return <motion.div variants={fadeUp}>{children}</motion.div>;
}
