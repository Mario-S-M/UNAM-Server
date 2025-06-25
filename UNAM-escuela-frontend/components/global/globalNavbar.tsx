"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Chip, useDisclosure } from "@heroui/react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import GlobalLogoUNAM from "./globalLogoUNAM";
import { getLevelsByLenguage } from "@/app/actions";
import { LevelsResponse } from "@/app/interfaces";
import { logoutAction, useCurrentUser } from "@/app/hooks/use-current-user";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";

interface PageProps {
  lenguageId?: string;
}

function GlobalNavbar({ lenguageId }: PageProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal states for login and register
  const loginModal = useDisclosure();
  const registerModal = useDisclosure();

  // Obtener información del usuario actual
  const { data: currentUser } = useCurrentUser();

  const { data } = useQuery<LevelsResponse>({
    queryKey: ["levels", lenguageId],
    queryFn: async () => {
      if (!lenguageId) {
        return { data: [] };
      }
      const result = await getLevelsByLenguage(lenguageId);
      return result;
    },
    enabled: !!lenguageId,
    refetchOnWindowFocus: true,
  });

  // Función para obtener el rol más alto del usuario
  const getHighestRole = (user: any) => {
    if (!user?.roles || user.roles.length === 0) return null;

    const roleHierarchy = {
      superUser: 5,
      admin: 4,
      docente: 3,
      alumno: 2,
      mortal: 1,
    };

    let highestRole = "mortal";
    let highestLevel = 0;

    for (const role of user.roles) {
      const level = roleHierarchy[role as keyof typeof roleHierarchy];
      if (level && level > highestLevel) {
        highestLevel = level;
        highestRole = role;
      }
    }

    return highestRole;
  };

  // Función para obtener color del rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case "superUser":
        return "danger";
      case "admin":
        return "warning";
      case "docente":
        return "primary";
      case "alumno":
        return "success";
      default:
        return "default";
    }
  };

  // Función para obtener nombre del rol
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superUser":
        return "Super Administrador";
      case "admin":
        return "Administrador";
      case "docente":
        return "Maestro";
      case "alumno":
        return "Alumno";
      case "mortal":
        return "Usuario";
      default:
        return "Invitado";
    }
  };

  // Función para obtener la ruta del panel según el rol
  const getPanelRoute = (role: string) => {
    switch (role) {
      case "superUser":
      case "admin":
        return "/main/admin-dashboard";
      case "docente":
        return "/main/teacher";
      case "alumno":
        return "/main/student";
      default:
        return "/main";
    }
  };

  const highestRole = getHighestRole(currentUser);
  const userName = currentUser?.fullName || "Invitado";
  const roleLabel = getRoleLabel(highestRole || "");
  const roleColor = getRoleColor(highestRole || "");

  return (
    <Navbar
      isBordered
      disableAnimation
      className="bg-background border-b-2 border-divider shadow-lg"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Toggle para pantallas pequeñas */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="!bg-transparent !text-foreground hover:!text-default-700 hover:!bg-transparent focus:!bg-transparent data-[pressed=true]:!bg-transparent data-[focus=true]:!bg-transparent"
        />
      </NavbarContent>

      {/* Logo centrado en pantallas pequeñas */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand className="flex items-center gap-2">
          <GlobalLogoUNAM variant="navbar" />
        </NavbarBrand>
      </NavbarContent>

      {/* Logo y menú de navegación para pantallas grandes */}
      <NavbarContent className="hidden sm:flex gap-6">
        <NavbarBrand className="flex items-center gap-2 mr-8">
          <GlobalLogoUNAM variant="navbar" />
        </NavbarBrand>
        {data?.data
          ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((level: any, index: number) => (
            <NavbarItem key={`nav-${index}`}>
              <Link
                href={`/main/levels/${level.id}/view`}
                className="text-base font-medium text-foreground hover:text-default-700 px-3 py-2 rounded-lg hover:bg-content1"
              >
                {level.name}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      {/* Avatar y dropdown */}
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="avatar-hover-border"
              color={roleColor as any}
              fallback={<User size={24} className="text-default-400" />}
              size="md"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Opciones de perfil"
            variant="faded"
            className="dropdown-white-text"
            classNames={{
              base: "shadow-none border-none",
              list: "shadow-none border-none",
            }}
          >
            <DropdownItem
              key="user-info"
              className="h-16 gap-2"
              textValue="Información del usuario"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{userName}</p>
                <div className="mt-1">
                  <Chip
                    size="sm"
                    color={roleColor as any}
                    variant="flat"
                    startContent={<User size={12} className="text-current" />}
                  >
                    {roleLabel}
                  </Chip>
                </div>
              </div>
            </DropdownItem>
            {currentUser && (
              <>
                <DropdownItem
                  key="panel"
                  className="text-foreground hover:bg-content1 dark:hover:text-black"
                  onPress={() => {
                    const panelRoute = getPanelRoute(highestRole || "");
                    router.replace(panelRoute);
                  }}
                  classNames={{
                    title: "dark:hover:text-black",
                    description: "dark:hover:text-black",
                  }}
                >
                  Panel
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger hover:bg-danger-50 dark:hover:text-black"
                  color="danger"
                  onPress={() => logoutAction()}
                  classNames={{
                    title: "dark:hover:text-black",
                    description: "dark:hover:text-black",
                  }}
                >
                  Cerrar Sesión
                </DropdownItem>
              </>
            )}
            {!currentUser && (
              <>
                <DropdownItem
                  key="login"
                  className="text-primary hover:bg-primary-50 dark:hover:text-black"
                  color="primary"
                  onPress={loginModal.onOpen}
                  classNames={{
                    title: "dark:hover:text-black",
                    description: "dark:hover:text-black",
                  }}
                >
                  Iniciar Sesión
                </DropdownItem>
                <DropdownItem
                  key="register"
                  className="text-primary hover:bg-primary-50 dark:hover:text-black"
                  color="primary"
                  onPress={registerModal.onOpen}
                  classNames={{
                    title: "dark:hover:text-black",
                    description: "dark:hover:text-black",
                  }}
                >
                  Crear Cuenta
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Menú móvil para pantallas pequeñas */}
      <NavbarMenu className="bg-background/95 backdrop-blur-sm py-4 border-r border-divider">
        {data?.data
          ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((level: any, index: number) => (
            <NavbarMenuItem key={`mobile-nav-${index}`}>
              <Link
                href={`/main/levels/${level.id}/view`}
                className="w-full text-base font-medium text-foreground hover:text-default-700 py-3 px-4 rounded-lg hover:bg-content1"
                size="lg"
              >
                {level.name}
              </Link>
            </NavbarMenuItem>
          ))}
        <NavbarMenuItem>
          <Link
            className="w-full text-foreground hover:text-default-700 text-base font-medium py-3 px-4 rounded-lg hover:bg-content1"
            href="#"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              loginModal.onOpen();
            }}
          >
            Iniciar Sesión
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-foreground hover:text-default-700 text-base font-medium py-3 px-4 rounded-lg hover:bg-content1"
            href="#"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              registerModal.onOpen();
            }}
          >
            Crear Cuenta
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-danger hover:text-danger-600 text-base font-medium py-3 px-4 rounded-lg hover:bg-danger-50"
            href="#"
            size="lg"
            onClick={() => logoutAction()}
          >
            Cerrar Sesión
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>

      {/* Login and Register Modals */}
      <LoginModal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
      />
      <RegisterModal
        isOpen={registerModal.isOpen}
        onOpenChange={registerModal.onOpenChange}
      />
    </Navbar>
  );
}

export default GlobalNavbar;
