"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePlaceholder from "./ImagePlaceholder";
import WhatsAppButton from "./WhatsAppButton";
import AddToCartButton from "./AddToCartButton";
import type { CatalogProduct } from "@/data/catalog";
import { smoothTransitionFast } from "@/lib/animations";
import { formatPrice } from "@/lib/format";

interface Props {
  product: CatalogProduct;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
  label: string;
}

const imageTransition = {
  duration: 0.5,
  ease: smoothTransitionFast.ease,
};

export default function ProductGallery({ product }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allMedia = useMemo(() => {
    const items: MediaItem[] = [];

    if (product.primary_image_url) {
      items.push({ url: product.primary_image_url, type: "image", label: "Principal" });
    }

    for (const url of product.galleryImages) {
      if (url !== product.primary_image_url) {
        items.push({ url, type: "image", label: `Foto ${items.length + 1}` });
      }
    }

    return items;
  }, [product.primary_image_url, product.galleryImages]);

  const current = allMedia[selectedIndex] ?? null;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={imageTransition}
          className="aspect-square bg-andes-snow/30 overflow-hidden rounded-lg flex items-center justify-center"
        >
          {current ? (
            current.type === "video" ? (
              <video
                src={current.url}
                controls
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta video.
              </video>
            ) : (
              <img
                src={current.url}
                alt={`${product.name} - ${current.label}`}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <ImagePlaceholder className="w-full h-full" text="Foto pendiente" />
          )}
        </motion.div>
      </AnimatePresence>

      {allMedia.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allMedia.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-(--transition-standard) ${
                i === selectedIndex
                  ? "border-andes-ice opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-andes-black flex items-center justify-center text-andes-white text-xl">
                  ▶
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`${product.name} miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={smoothTransitionFast}
        className="pt-4 space-y-4"
      >
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-andes-black">
            {product.name}
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-andes-mountain">
            {product.category === "mates" && product.subcategory
              ? `Mates de ${product.subcategory}`
              : product.category}
          </p>
          {product.show_price && product.price !== null && (
            <p className="mt-2 text-xl font-medium text-andes-ice">
              {formatPrice(product.price)}
            </p>
          )}
          {product.stock === 0 && (
            <p className="mt-2 text-xs uppercase tracking-widest text-andes-mountain">
              Sin stock
            </p>
          )}
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

        <div className="flex flex-wrap gap-3">
          <AddToCartButton product={product} />
          <WhatsAppButton productName={product.name} />
        </div>
      </motion.div>
    </div>
  );
}
