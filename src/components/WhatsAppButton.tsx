import { getWhatsAppLink, getWhatsAppNumber } from "@/lib/utils";
import WhatsAppIcon from "./icons/WhatsAppIcon";

interface Props {
  productName?: string;
  label?: string;
  className?: string;
  variant?: "solid" | "outline";
  phone?: string;
}

export default function WhatsAppButton({
  productName,
  label = "Consultar por WhatsApp",
  className = "",
  variant = "solid",
  phone,
}: Props) {
  const href = getWhatsAppLink(phone ?? getWhatsAppNumber(), productName);

  const base =
    "inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase tracking-widest font-medium rounded-(--radius-button) transition-all duration-(--transition-standard)";

  const styles = {
    solid: `${base} bg-andes-blue text-andes-white hover:bg-andes-ice shadow-lg shadow-andes-blue/20 hover:shadow-andes-ice/30 ${className}`,
    outline: `${base} border-2 border-andes-snow/30 text-andes-snow hover:bg-andes-white/10 hover:border-andes-snow/50 ${className}`,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles[variant]}
    >
      <WhatsAppIcon className="w-4 h-4" />
      {label}
    </a>
  );
}
