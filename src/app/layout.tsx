import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProvider from "@/components/ClientProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Andes Mates | Mates y accesorios",
  description:
    "Mates y accesorios inspirados en la Cordillera de los Andes. Descubrí nuestra colección.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <ClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
