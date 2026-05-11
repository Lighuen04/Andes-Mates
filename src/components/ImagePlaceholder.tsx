interface Props {
  text?: string;
  className?: string;
  count?: number;
}

export default function ImagePlaceholder({
  text = "Foto pendiente",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-andes-blue/15 to-andes-mountain/15 text-andes-mountain/30 text-[10px] uppercase tracking-widest ${className}`}
    >
      <div className="text-center">
        <svg
          className="w-8 h-8 mx-auto mb-2 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{text}</span>
      </div>
    </div>
  );
}
