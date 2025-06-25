"use client";

import { logoutAction, User } from "@/app/hooks/use-current-user";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { RoleBadge } from "@/components/ui/role-badge";
import GlobalLogoUNAM from "@/components/global/globalLogoUNAM";
import {
  Card,
  CardBody,
  Avatar,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import {
  LogOut,
  User as UserIcon,
  Settings,
  Home,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/app/hooks/use-authorization";

interface ClientHeaderProps {
  initialUser?: User | null;
}

export function ClientHeader({ initialUser }: ClientHeaderProps) {
  const { user, isLoading } = useAuth();
  const { canAccessAdminPanel, userMainPage } = usePermissions();
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
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-content1 p-2 rounded-lg transition-colors">
                      <Avatar
                        icon={<UserIcon className="h-6 w-6" />}
                        size="sm"
                        classNames={{
                          base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                          icon: "text-black/80",
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.fullName}
                        </span>
                        {user.roles &&
                          user.roles.length > 0 &&
                          !user.roles.every(
                            (role: string) => role === "mortal"
                          ) && <RoleBadge roles={user.roles} />}
                      </div>
                      <ChevronDown className="h-4 w-4 text-default-600" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Opciones de usuario"
                    variant="faded"
                    className="dropdown-white-text"
                    classNames={{
                      base: "shadow-none border-none",
                      list: "shadow-none border-none",
                    }}
                  >
                    <DropdownSection title="Navegación" showDivider>
                      <DropdownItem
                        key="main-page"
                        startContent={<Home className="h-4 w-4" />}
                        as={Link}
                        href={userMainPage}
                      >
                        Panel Principal
                      </DropdownItem>
                      {canAccessAdminPanel ? (
                        <DropdownItem
                          key="dashboard"
                          startContent={<Settings className="h-4 w-4" />}
                          as={Link}
                          href="/main/admin-dashboard"
                        >
                          Dashboard Admin
                        </DropdownItem>
                      ) : null}
                    </DropdownSection>
                    <DropdownSection title="Cuenta">
                      <DropdownItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<LogOut className="h-4 w-4" />}
                        onPress={handleLogout}
                      >
                        Cerrar Sesión
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-content1 p-2 rounded-lg transition-colors">
                      <Avatar
                        icon={<UserIcon className="h-6 w-6" />}
                        size="sm"
                        classNames={{
                          base: "bg-default-200",
                          icon: "text-default-600",
                        }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        Invitado
                      </span>
                      <ChevronDown className="h-4 w-4 text-default-600" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Opciones de invitado"
                    variant="faded"
                    className="dropdown-white-text"
                    classNames={{
                      base: "shadow-none border-none",
                      list: "shadow-none border-none",
                    }}
                  >
                    <DropdownItem
                      key="login"
                      startContent={
                        <UserIcon className="h-4 w-4 text-foreground" />
                      }
                      onPress={loginModal.onOpen}
                      className="text-foreground"
                    >
                      <span className="text-foreground">Iniciar Sesión</span>
                    </DropdownItem>
                    <DropdownItem
                      key="register"
                      startContent={
                        <UserIcon className="h-4 w-4 text-foreground" />
                      }
                      onPress={registerModal.onOpen}
                      className="text-foreground"
                    >
                      <span className="text-foreground">Crear Cuenta</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
