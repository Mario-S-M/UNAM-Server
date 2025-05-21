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
    >
      <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
      </ModalContent>
    </Modal>
  );
};
