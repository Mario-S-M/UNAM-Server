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
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import GlobalLogoUNAM from "./globalLogoUNAM";
import { getLevelsByLenguage } from "@/app/actions";
import { LevelsResponse } from "@/app/interfaces";
import { logoutAction } from "@/app/hooks/use-current-user";

interface PageProps {
  lenguageId?: string;
}

function GlobalNavbar({ lenguageId }: PageProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              className="border-divider hover:border-default-300 bg-content1"
              color="default"
              fallback={<User size={24} className="text-foreground" />}
              size="md"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Opciones de perfil" variant="flat">
            <DropdownItem
              key="profile"
              className="text-foreground hover:bg-content1"
            >
              Mi Perfil
            </DropdownItem>
            <DropdownItem
              key="admin"
              className="text-foreground hover:bg-content1"
              onPress={() => {
                if (lenguageId) {
                  router.replace(`/main/levels/${lenguageId}/admin`);
                }
              }}
            >
              Administrador
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger hover:bg-danger-50"
              color="danger"
              onPress={() => logoutAction()}
            >
              Cerrar Sesión
            </DropdownItem>
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
            href="/"
            size="lg"
          >
            Iniciar Sesión
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
    </Navbar>
  );
}

export default GlobalNavbar;
