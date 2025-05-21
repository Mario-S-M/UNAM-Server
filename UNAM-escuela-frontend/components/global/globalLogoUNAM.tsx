import Image from "next/image";

function GlobalLogoUNAM() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full">
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
      </div>
    </>
  );
}

export default GlobalLogoUNAM;
