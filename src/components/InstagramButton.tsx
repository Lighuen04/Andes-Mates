import InstagramIcon from "./icons/InstagramIcon";

interface Props {
  label?: string;
  className?: string;
}

export default function InstagramButton({
  label = "Instagram",
  className = "",
}: Props) {
  const url = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-andes-ice text-andes-ice text-sm uppercase tracking-widest font-medium rounded-(--radius-button) hover:bg-andes-ice hover:text-andes-white transition-all duration-(--transition-standard) ${className}`}
    >
      <InstagramIcon className="w-4 h-4" />
      {label}
    </a>
  );
}
