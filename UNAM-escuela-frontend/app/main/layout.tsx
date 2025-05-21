import GlobalNavbar from "@/components/global/globalNavbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <GlobalNavbar />

      {children}
    </>
  );
}

export default MainLayout;
