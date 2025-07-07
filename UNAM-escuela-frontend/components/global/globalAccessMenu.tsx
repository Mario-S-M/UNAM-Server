"use client";

import React, { useRef, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { PersonStanding, X } from "lucide-react";
import { ToogleTheme } from "../ui/toggle-Theme";
import FontSizeChanger from "../ui/toggle-Font";
import { LetterSpacingToggle } from "../ui/letter-Spacing-Toggle";
import { HideImagesToggle } from "../ui/toggle-Images";
import { DyslexiaFontToggle } from "../ui/dyslexia-Font-Toggle";
import { LineSpacingToggle } from "../ui/line-Spacing-Toggle";

export default function GlobalAccessMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  // Focus en el primer botón real cuando se abre el Drawer
  useEffect(() => {
    if (isOpen && drawerBodyRef.current) {
      const firstButton = drawerBodyRef.current.querySelector(
        "button, [tabindex='0']"
      ) as HTMLElement | null;
      if (firstButton) {
        firstButton.focus();
      }
    }
  }, [isOpen]);

  return (
    <>
      <Button
        id="accessibility-trigger-btn"
        isIconOnly
        radius="full"
        size="lg"
        className="!bg-primary !text-primary-foreground hover:!bg-primary/90 border-2 !border-primary-foreground/20 shadow-lg ring-2 ring-primary-foreground/30 dark:ring-primary-foreground/60 contraste:ring-yellow-400 transition-colors"
        onPress={onOpen}
        aria-label="Abrir menú de accesibilidad"
      >
        <PersonStanding
          size={52}
          className="text-primary-foreground contraste:text-black transition-colors"
        />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onOpenChange={onOpenChange}
        className="max-w-[370px] w-full h-full"
        classNames={{
          closeButton:
            "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent",
        }}
      >
        <DrawerContent className="max-w-[370px] w-full h-full rounded-l-2xl shadow-2xl">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-row items-center justify-between border-b pb-1 px-4 pt-4">
                <div>
                  <span className="text-lg font-bold">
                    Opciones de Accesibilidad
                  </span>
                  <span className="block text-xs text-default-500 leading-tight">
                    Personaliza tu experiencia
                  </span>
                </div>
              </DrawerHeader>
              <DrawerBody className="flex-1 overflow-y-auto px-3 pt-2 pb-1">
                <div ref={drawerBodyRef} className="flex flex-col gap-2">
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Tema
                    </span>
                    <ToogleTheme
                      size="sm"
                      classNames={{
                        tabList:
                          "gap-1 w-full rounded p-0.5 bg-transparent flex",
                        cursor: "w-full bg-primary rounded shadow",
                        tab: "flex-1 w-full px-2 h-7 rounded bg-transparent border-0 text-xs",
                        tabContent:
                          "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80",
                      }}
                    />
                  </div>
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Tamaño de Fuente
                    </span>
                    <FontSizeChanger
                      size="sm"
                      classNames={{
                        tabList:
                          "gap-1 w-full rounded p-0.5 bg-transparent flex",
                        cursor: "w-full bg-primary rounded shadow",
                        tab: "flex-1 w-full px-2 h-7 rounded bg-transparent border-0 text-xs",
                        tabContent:
                          "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80",
                      }}
                    />
                  </div>
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Espaciado entre caracteres
                    </span>
                    <LetterSpacingToggle
                      size="sm"
                      classNames={{
                        tabList:
                          "gap-1 w-full rounded p-0.5 bg-transparent flex",
                        cursor: "w-full bg-primary rounded shadow",
                        tab: "flex-1 w-full px-2 h-7 rounded bg-transparent border-0 text-xs",
                        tabContent:
                          "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80",
                      }}
                    />
                  </div>
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Ocultar Imágenes
                    </span>
                    <HideImagesToggle />
                  </div>
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Fuente para Dislexia
                    </span>
                    <DyslexiaFontToggle />
                  </div>
                  <div className="bg-default-50 rounded-lg p-2 flex flex-col gap-1">
                    <span className="block mb-0.5 font-semibold text-default-700 text-sm">
                      Interliniado
                    </span>
                    <LineSpacingToggle
                      size="sm"
                      classNames={{
                        tabList:
                          "gap-1 w-full rounded p-0.5 bg-transparent flex",
                        cursor: "w-full bg-primary rounded shadow",
                        tab: "flex-1 w-full px-2 h-7 rounded bg-transparent border-0 text-xs",
                        tabContent:
                          "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80",
                      }}
                    />
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="border-t pt-2 flex justify-end px-4 pb-3">
                <Button
                  color="default"
                  variant="solid"
                  onPress={onClose}
                  className="text-sm px-4 py-1.5"
                >
                  Cerrar
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
