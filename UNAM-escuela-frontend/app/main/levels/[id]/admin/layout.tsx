import { verifySession } from "./auth/dal";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  await verifySession();
  return <>{children}</>;
}
