import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export interface GlobalModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

export const GlobalModal = ({
  children,
  isOpen,
  onOpenChange,
  title,
}: GlobalModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
      classNames={{
        base: "!shadow-none !border-none",
        wrapper: "!shadow-none",
        closeButton:
          "!text-default-400 hover:!text-default-600 !bg-transparent hover:!bg-default-100 !shadow-none !border-none",
      }}
    >
      <ModalContent className="!shadow-none !border-none">
        <>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};
