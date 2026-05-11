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

export function getWhatsAppLink(numero: string, productoNombre: string): string {
  const mensaje = encodeURIComponent(
    `Hola, quiero consultar por el producto: ${productoNombre}`
  );
  return `https://wa.me/${numero}?text=${mensaje}`;
}

export function getWhatsAppLinkGeneral(numero: string): string {
  return `https://wa.me/${numero}`;
}
