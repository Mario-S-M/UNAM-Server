"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { UserX, AlertTriangle } from "lucide-react";
import { logoutAction } from "@/app/hooks/use-current-user";

interface BlockedUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function BlockedUserModal({
  isOpen,
  onClose,
  userName = "Usuario",
}: BlockedUserModalProps) {
  const handleLogout = async () => {
    await logoutAction();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
      hideCloseButton
      isDismissable={false}
      classNames={{
        base: "bg-content1 border border-danger-200",
        header: "border-b border-danger-200 bg-danger-50",
        body: "py-6",
        footer: "border-t border-danger-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-danger-100">
              <UserX className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-danger-800">
                Cuenta Desactivada
              </h3>
              <p className="text-sm text-danger-600 font-normal">
                Tu acceso ha sido restringido
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-500 mt-0.5" />
            <div className="space-y-3">
              <p className="text-foreground">
                Hola <strong>{userName}</strong>, tu cuenta ha sido desactivada
                por un administrador.
              </p>
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                <p className="text-warning-800 text-sm">
                  <strong>¿Qué significa esto?</strong>
                </p>
                <ul className="text-warning-700 text-sm mt-2 space-y-1">
                  <li>• No puedes acceder a las funciones del sistema</li>
                  <li>• Tus datos están seguros y no se han eliminado</li>
                  <li>
                    • Puedes contactar al administrador para más información
                  </li>
                </ul>
              </div>
              <p className="text-foreground/70 text-sm">
                Si crees que esto es un error, contacta al administrador del
                sistema para revisar tu caso.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="solid"
            onPress={handleLogout}
            className="w-full"
          >
            Cerrar Sesión
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
