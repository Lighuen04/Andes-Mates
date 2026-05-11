interface Props {
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({
  text = "Foto pendiente",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-andes-blue/20 to-andes-mountain/20 text-andes-mountain/40 text-[10px] uppercase tracking-widest ${className}`}
    >
      {text}
    </div>
  );
}
