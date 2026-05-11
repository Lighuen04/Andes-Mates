"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePlaceholder from "./ImagePlaceholder";
import WhatsAppButton from "./WhatsAppButton";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  product: CatalogProduct;
}

export default function ProductGallery({ product }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.galleryImages;
  const hasImages = images.length > 0;

  const currentImage = hasImages ? images[selectedIndex] : null;
  const galleryItems = hasImages ? images : Array(4).fill(null);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="aspect-square bg-andes-snow/30 overflow-hidden rounded-lg"
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${product.name} - Foto ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" text="Foto pendiente" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {galleryItems.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              i === selectedIndex
                ? "border-andes-ice opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {img ? (
              <img
                src={img}
                alt={`${product.name} miniatura ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlaceholder
                className="w-full h-full"
                text={`${i + 1}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Product info */}
      <div className="pt-4 space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-andes-black">
            {product.name}
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-andes-mountain">
            {product.category === "mates" && product.subcategory
              ? `Mates de ${product.subcategory}`
              : product.category}
          </p>
          {!product.available && (
            <p className="mt-2 text-xs uppercase tracking-widest text-red-600">
              No disponible
            </p>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-andes-mountain leading-relaxed">
            {product.description}
          </p>
        )}

        <WhatsAppButton productName={product.name} />
      </div>
    </div>
  );
}
