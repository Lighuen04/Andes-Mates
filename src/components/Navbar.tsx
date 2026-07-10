"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CartButton from "./CartButton";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "instagram", label: "Instagram", external: true },
  { href: "whatsapp", label: "WhatsApp", external: true },
];

function getHref(link: (typeof links)[0]) {
  if (!link.external) return link.href;
  if (link.href === "whatsapp") {
    return "https://wa.me/5492942530736";
  }
  return process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="bg-andes-black/95 backdrop-blur-sm border-b border-andes-mountain/20 sticky top-0 z-50">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl tracking-wide text-andes-white"
            >
              Andes Mates
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={getHref(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.2em] text-andes-snow/80 hover:text-andes-ice transition-colors duration-(--transition-standard)"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs uppercase tracking-[0.2em] text-andes-snow/80 hover:text-andes-ice transition-colors duration-(--transition-standard)"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <CartButton onClick={() => setCartOpen(true)} />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <CartButton onClick={() => setCartOpen(true)} />
              <button
                className="text-andes-white"
                onClick={() => setOpen(!open)}
                aria-label="Menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {open ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-andes-mountain/20 bg-andes-black/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={getHref(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block text-xs uppercase tracking-[0.2em] text-andes-snow/80 hover:text-andes-ice transition-colors duration-(--transition-standard)"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-xs uppercase tracking-[0.2em] text-andes-snow/80 hover:text-andes-ice transition-colors duration-(--transition-standard)"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
