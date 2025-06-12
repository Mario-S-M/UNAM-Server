import Image from "next/image";
import Link from "next/link";

interface GlobalLogoUNAMProps {
  variant?: "default" | "footer";
}

function GlobalLogoUNAM({ variant = "default" }: GlobalLogoUNAMProps) {
  const logoBackgroundClass =
    variant === "footer"
      ? "bg-primary-foreground/10 border border-primary-foreground/20"
      : "bg-background";

  const textColorClass =
    variant === "footer" ? "text-primary-foreground" : "text-foreground";

  return (
    <>
      <Link href="/" className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${logoBackgroundClass}`}>
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
    </>
  );
}

export default GlobalLogoUNAM;

