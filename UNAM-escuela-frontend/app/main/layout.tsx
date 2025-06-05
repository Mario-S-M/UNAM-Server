"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import GlobalNavbar from "@/components/global/globalNavbar";

interface LayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const match = pathname.match(/\/main\/levels\/([^/]+)\/view/);
  const lenguageId = match ? match[1] : undefined;

  return (
    <>
      <GlobalNavbar lenguageId={lenguageId} />
      {children}
    </>
  );
}

export default MainLayout;
