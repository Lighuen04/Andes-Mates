"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { generateCartMessageText, getCartWhatsAppLink } from "@/lib/cart";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import InstagramIcon from "./icons/InstagramIcon";

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
                <div className="w-16 h-16 flex-shrink-0 rounded-md bg-andes-snow/30 overflow-hidden relative">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
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
                <WhatsAppIcon className="w-4 h-4" />
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
          <InstagramIcon className="w-4 h-4" />
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
