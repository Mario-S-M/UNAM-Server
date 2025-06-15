"use client";

import { logoutAction, User } from "@/app/hooks/use-current-user";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { RoleBadge } from "@/components/ui/role-badge";
import GlobalButton from "@/components/global/globalButton";
import GlobalLogoUNAM from "@/components/global/globalLogoUNAM";
import { Card, CardBody, Avatar, useDisclosure } from "@heroui/react";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface ClientHeaderProps {
  initialUser?: User | null;
}

export function ClientHeader({ initialUser }: ClientHeaderProps) {
  const { user, isLoading } = useAuth();
  const loginModal = useDisclosure();
  const registerModal = useDisclosure();

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <>
      <Card className="mb-6 !shadow-none">
        <CardBody>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <GlobalLogoUNAM variant="navbar" noLink />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Avatar
                    icon={<UserIcon className="h-6 w-6" />}
                    size="sm"
                    classNames={{
                      base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                      icon: "text-black/80",
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.fullName}</span>
                    {user.roles &&
                      user.roles.length > 0 &&
                      !user.roles.every(
                        (role: string) => role === "mortal"
                      ) && <RoleBadge roles={user.roles} />}
                  </div>
                  <GlobalButton
                    onPress={handleLogout}
                    variant="bordered"
                    size="sm"
                    startContent={<LogOut className="h-4 w-4" />}
                    text="Cerrar Sesión"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <GlobalButton
                    onPress={loginModal.onOpen}
                    text="Iniciar Sesión"
                    color="primary"
                    size="sm"
                  />
                  <GlobalButton
                    onPress={registerModal.onOpen}
                    text="Crear Cuenta"
                    variant="bordered"
                    color="primary"
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <LoginModal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
      />
      <RegisterModal
        isOpen={registerModal.isOpen}
        onOpenChange={registerModal.onOpenChange}
      />
    </>
  );
}

// Export por defecto para compatibilidad
export function Header() {
  return <ClientHeader />;
}
