"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { generateCartMessageText, getCartWhatsAppLink } from "@/lib/cart";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    hasItemsWithoutPrice,
  } = useCart();

  const alias = 
    process.env.NEXT_PUBLIC_TRANSFER_ALIAS || "Alias no configurado";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const whatsappLink =
    items.length > 0
      ? getCartWhatsAppLink(items, totalPrice, hasItemsWithoutPrice, alias)
      : "#";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-andes-white z-50 shadow-[0_8px_24px_rgba(11,15,20,0.10)] transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-andes-snow shrink-0">
          <h2 className="font-serif text-lg text-andes-black">
            Carrito ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="text-andes-mountain hover:text-andes-black transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-andes-mountain py-12">
              El carrito está vacío
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-3 border-b border-andes-snow/50 last:border-0"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-md bg-andes-snow/30 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-andes-mountain/40 text-xs">
                      Sin img
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-andes-black truncate">
                    {item.name}
                  </p>
                  {item.price !== null ? (
                    <p className="text-xs text-andes-ice mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  ) : (
                    <p className="text-xs text-andes-mountain mt-0.5">
                      Consultar precio
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded border border-andes-snow text-andes-mountain hover:text-andes-black hover:border-andes-mountain transition-colors text-sm"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-andes-black w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded border border-andes-snow text-andes-mountain hover:text-andes-black hover:border-andes-mountain transition-colors text-sm"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  {item.price !== null && (
                    <p className="text-xs font-medium text-andes-black">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-andes-mountain/50 hover:text-red-500 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-andes-snow px-6 py-4 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-andes-black">
                {hasItemsWithoutPrice ? "Total parcial" : "Total"}
              </span>
              <span className="text-lg font-serif text-andes-ice">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>

            {hasItemsWithoutPrice && (
              <p className="text-xs text-andes-mountain">
                Hay productos con precio a consultar.
              </p>
            )}

            <div className="bg-andes-snow/30 rounded-md px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-andes-mountain mb-1">
                Alias para transferencia
              </p>
              <p className="text-sm font-medium text-andes-black font-mono">
                {alias}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-andes-blue text-andes-white text-sm uppercase tracking-widest font-medium rounded-(--radius-button) hover:bg-andes-ice transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar pedido por WhatsApp
              </a>

              <CopyButton cartText={generateCartMessageText(items, totalPrice, hasItemsWithoutPrice, alias)} instagramUrl={instagramUrl} />
            </div>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-andes-mountain/50 hover:text-red-500 transition-colors py-1 uppercase tracking-widest"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CopyButton({
  cartText,
  instagramUrl,
}: {
  cartText: string;
  instagramUrl: string;
}) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cartText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = cartText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={copyToClipboard}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-andes-snow text-andes-black text-xs uppercase tracking-widest font-medium rounded-(--radius-button) hover:bg-andes-snow/30 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        Copiar pedido
      </button>

      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-andes-ice text-andes-ice text-xs uppercase tracking-widest font-medium rounded-(--radius-button) hover:bg-andes-ice hover:text-andes-white transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Instagram
        </a>
      ) : (
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-andes-snow text-andes-mountain/50 text-xs uppercase tracking-widest font-medium rounded-(--radius-button) cursor-not-allowed"
        >
          Instagram no configurado
        </button>
      )}
    </div>
  );
}
