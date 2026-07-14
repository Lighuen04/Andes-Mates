import type { CartItem } from "@/context/CartContext";

export function generateCartMessageText(
  items: CartItem[],
  totalPrice: number,
  hasItemsWithoutPrice: boolean,
  alias: string
): string {
  let text = "Hola, quiero hacer este pedido en Andes Mates:\n\n";

  items.forEach((item, index) => {
    text += `${index + 1}. Producto: ${item.name}\n`;
    text += `   Cantidad: ${item.quantity}\n`;
    if (item.price !== null) {
      text += `   Precio unitario: $${item.price.toLocaleString("es-AR")}\n`;
      text += `   Subtotal: $${(item.price * item.quantity).toLocaleString("es-AR")}\n`;
    } else {
      text += `   Precio: Consultar\n`;
    }
    text += "\n";
  });

  if (hasItemsWithoutPrice) {
    text += "NOTA: Algunos productos tienen precio a consultar.\n\n";
  }

  text += `Total: $${totalPrice.toLocaleString("es-AR")}\n\n`;
  text += `Alias para transferencia: ${alias}`;

  return text;
}

export function getCartWhatsAppLink(
  items: CartItem[],
  totalPrice: number,
  hasItemsWithoutPrice: boolean,
  alias: string
): string {
  const message = generateCartMessageText(
    items,
    totalPrice,
    hasItemsWithoutPrice,
    alias
  );
  return `https://wa.me/5492604652513?text=${encodeURIComponent(message)}`;
}
