"use client";
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
import { getAllLevels } from "@/app/actions";
import { useState } from "react";
import GlobalLogoUNAM from "./globalLogoUNAM";

function GlobalNavbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  return (
    <Navbar
      isBordered
      disableAnimation
      className="bg-primary text-white"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Toggle para pantallas pequeñas */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="text-white"
        />
      </NavbarContent>

      {/* Logo centrado en pantallas pequeñas */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <GlobalLogoUNAM />
        </NavbarBrand>
      </NavbarContent>

      {/* Logo y menú de navegación para pantallas grandes */}
      <NavbarContent className="hidden sm:flex gap-4">
        <NavbarBrand>
          <GlobalLogoUNAM />
        </NavbarBrand>
        {levels?.data
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((level, index) => (
            <NavbarItem key={`nav-${index}`}>
              <Link
                href={`/main/levels/${level.id}/view`}
                color="foreground"
                className="transition-colors text-base font-medium text-white"
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
              className="transition-transform"
              color="default"
              fallback={<User size={24} />}
              size="md"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            disabledKeys={["profile"]}
          >
            <DropdownItem
              key="profile"
              color="primary"
              className="gap-2"
              classNames={{
                title: "text-black dark:text-white",
                base: "text-black dark:text-white",
              }}
            >
              <p className="font-semibold">Hola:</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              classNames={{
                title: "text-black dark:text-white",
                base: "text-black dark:text-white",
              }}
            >
              Opciones de Administrador
            </DropdownItem>
            <DropdownItem
              key="team_settings"
              classNames={{
                title: "text-black dark:text-white",
                base: "text-black dark:text-white",
              }}
              onPress={() => router.replace("/auth/login")}
            >
              Iniciar Sesión
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              classNames={{
                base: "text-black dark:text-white",
              }}
            >
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Menú móvil para pantallas pequeñas */}
      <NavbarMenu className="bg-primary/95 backdrop-blur-sm py-4">
      {levels?.data
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((level, index) => (
            <NavbarItem key={`nav-${index}`}>
              <Link
                href={`/main/levels/${level.id}/view`}
                color="foreground"
                className="transition-colors text-base font-medium text-white"
              >
                {level.name}
              </Link>
            </NavbarItem>
          ))}
        <NavbarMenuItem>
          <Link
            className="w-full text-white hover:text-gray-200 transition-colors text-lg"
            color="danger"
            href="#"
            size="lg"
            onClick={() => router.replace("/auth/login")}
          >
            Iniciar Sesión
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-white hover:text-gray-200 transition-colors text-lg"
            color="danger"
            href="#"
            size="lg"
          >
            Cerrar Sesión
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export default GlobalNavbar;
