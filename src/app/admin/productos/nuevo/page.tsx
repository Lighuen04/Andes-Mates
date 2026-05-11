"use client";

import ProductForm from "@/components/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div className="min-h-screen bg-andes-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-light tracking-wider text-andes-black mb-8">
          Nuevo producto
        </h1>
        <ProductForm />
      </div>
    </div>
  );
}
