import Link from "next/link";

interface Crumb {
  label: string;
  href: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-andes-mountain/60 mb-8">
      <Link href="/" className="hover:text-andes-ice transition-colors">
        Inicio
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          {i === crumbs.length - 1 ? (
            <span className="text-andes-mountain">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-andes-ice transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
