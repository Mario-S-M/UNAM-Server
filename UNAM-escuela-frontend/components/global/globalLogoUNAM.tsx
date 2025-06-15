import Image from "next/image";
import Link from "next/link";

interface GlobalLogoUNAMProps {
  variant?: "default" | "footer" | "navbar";
  noLink?: boolean;
}

function GlobalLogoUNAM({
  variant = "default",
  noLink = false,
}: GlobalLogoUNAMProps) {
  const logoBackgroundClass =
    variant === "footer"
      ? "bg-primary-foreground/10 border border-primary-foreground/20"
      : "bg-background";

  const textColorClass =
    variant === "footer" ? "text-primary-foreground" : "text-foreground";

  // Diferentes estilos según la variante
  const containerClass =
    variant === "navbar"
      ? "flex items-center gap-3"
      : "flex items-center gap-3 mb-4";

  const logoContent = (
    <div className={containerClass}>
      <div
        className={`p-2 rounded-full ${logoBackgroundClass} flex items-center justify-center`}
      >
        <Image
          src="/Logo-UNAM.svg"
          alt="Logo UNAM"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </div>
      <h3 className={`text-lg font-bold ${textColorClass}`}>UNAM</h3>
    </div>
  );

  if (noLink) {
    return logoContent;
  }

  return (
    <Link href="/" className={containerClass}>
      <div
        className={`p-2 rounded-full ${logoBackgroundClass} flex items-center justify-center`}
      >
        <Image
          src="/Logo-UNAM.svg"
          alt="Logo UNAM"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </div>
      <h3 className={`text-lg font-bold ${textColorClass}`}>UNAM</h3>
    </Link>
  );
}

export default GlobalLogoUNAM;
