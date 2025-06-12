import Image from "next/image";
import Link from "next/link";

function GlobalLogoUNAM() {
  return (
    <>
      <Link href="/" className="flex items-center gap-3">
        <div className="bg-background p-2 rounded-full">
          <Image
            src="/Logo-UNAM.svg"
            alt="Logo UNAM"
            width={32}
            height={32}
            className="rounded-full"
            priority
          />
        </div>
        <h3 className="text-lg font-bold">UNAM</h3>
      </Link>
    </>
  );
}

export default GlobalLogoUNAM;
