export function getWhatsAppLink(phone: string, productName?: string): string {
  const base = `https://wa.me/${phone}`;
  if (productName) {
    const text = encodeURIComponent(
      `Hola, quiero consultar por: ${productName}`
    );
    return `${base}?text=${text}`;
  }
  return base;
}

export function getWhatsAppNumber(): string {
  return "5492942530736";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPrecio(precio: number | null): string {
  if (precio === null) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}
