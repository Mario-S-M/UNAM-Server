"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Card,
  CardBody,
  Chip,
  ButtonGroup,
} from "@heroui/react";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentById,
  getContentMarkdown,
  validateContent,
  invalidateContent,
} from "@/app/actions/content-actions";
import { addToast } from "@heroui/react";
import dynamic from "next/dynamic";
import GlobalButton from "@/components/global/globalButton";

// Importar el visor de solo lectura igual que usa el teacher
const MilkdownReadOnlyViewer = dynamic(
  () => import("@/components/global/milkdown-readonly-viewer"),
  { ssr: false }
);

interface ContentPreviewReadOnlyModalProps {
  contentId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContentPreviewReadOnlyModal({
  contentId,
  isOpen,
  onOpenChange,
}: ContentPreviewReadOnlyModalProps) {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId!),
    enabled: !!contentId,
  });

  const markdownQuery = useQuery({
    queryKey: ["contentMarkdown", contentId],
    queryFn: () => getContentMarkdown(contentId!),
    enabled: !!contentId,
  });

  const {
    data: markdownContent,
    isLoading: markdownLoading,
    error: markdownError,
  } = markdownQuery;

  // Safe refetch function
  const handleRefetchMarkdown = () => {
    if (contentId && markdownQuery.refetch) {
      markdownQuery.refetch();
    }
  };

  // Mutations
  const validateMutation = useMutation({
    mutationFn: (id: string) => validateContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido validado exitosamente",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error al validar",
        description: error.message || "No se pudo validar el contenido",
        color: "danger",
      });
    },
  });

  const invalidateMutation = useMutation({
    mutationFn: (id: string) => invalidateContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido marcado como no validado",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo invalidar el contenido",
        color: "danger",
      });
    },
  });

  // Handlers
  const handleValidate = () => {
    if (contentId) {
      validateMutation.mutate(contentId);
    }
  };

  const handleInvalidate = () => {
    if (contentId) {
      invalidateMutation.mutate(contentId);
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case "validado":
        return "success";
      case "sin validar":
        return "warning";
      default:
        return "default";
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case "validado":
        return <CheckCircle className="h-4 w-4" />;
      case "sin validar":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const isLoading = contentLoading || markdownLoading;
  const hasError = contentError || markdownError;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
        header: "px-6 py-4 border-b",
        footer: "px-6 py-4 border-t",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {content?.data?.name || "Contenido"}
                  </h2>
                  <p className="text-sm text-default-500">
                    Vista de solo lectura - Igual que ve el maestro
                  </p>
                </div>
                {content?.data && (
                  <div className="flex items-center gap-2">
                    <Chip
                      color={getValidationColor(
                        (content.data as any)?.validationStatus || "sin validar"
                      )}
                      variant="flat"
                      startContent={getValidationIcon(
                        (content.data as any)?.validationStatus || "sin validar"
                      )}
                      size="sm"
                    >
                      {(content.data as any)?.validationStatus || "sin validar"}
                    </Chip>
                    <ButtonGroup size="sm" variant="flat">
                      {((content.data as any)?.validationStatus ||
                        "sin validar") === "validado" ? (
                        <GlobalButton
                          color="warning"
                          onPress={handleInvalidate}
                          isLoading={invalidateMutation.isPending}
                          startContent={<XCircle className="h-4 w-4" />}
                          size="sm"
                        >
                          Invalidar
                        </GlobalButton>
                      ) : (
                        <GlobalButton
                          color="success"
                          onPress={handleValidate}
                          isLoading={validateMutation.isPending}
                          startContent={<CheckCircle className="h-4 w-4" />}
                          size="sm"
                        >
                          Validar
                        </GlobalButton>
                      )}
                      <GlobalButton
                        color="default"
                        onPress={handleRefetchMarkdown}
                        startContent={<RefreshCw className="h-4 w-4" />}
                        size="sm"
                      >
                        Recargar
                      </GlobalButton>
                    </ButtonGroup>
                  </div>
                )}
              </div>
            </ModalHeader>

            <ModalBody className="px-0 py-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600">Cargando contenido...</p>
                  </div>
                </div>
              ) : hasError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">
                      Error al cargar el contenido
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {contentError instanceof Error
                        ? contentError.message
                        : markdownError &&
                          typeof markdownError === "object" &&
                          "message" in markdownError
                        ? (markdownError as Error).message
                        : "Error desconocido"}
                    </p>
                    <GlobalButton
                      color="primary"
                      onPress={handleRefetchMarkdown}
                      startContent={<RefreshCw className="h-4 w-4" />}
                    >
                      Reintentar
                    </GlobalButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Información del contenido - igual que teacher */}
                  {content?.data && (
                    <Card className="m-6 mb-0">
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Descripción:
                            </span>
                            <p className="text-gray-600 mt-1">
                              {content.data.description}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Skill:
                            </span>
                            <p className="text-gray-600 mt-1">
                              {(content.data as any)?.skill?.name ||
                                "Sin skill asignado"}
                            </p>
                          </div>
                          {content.data.assignedTeachers &&
                            content.data.assignedTeachers.length > 0 && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">
                                  Profesores asignados:
                                </span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {content.data.assignedTeachers.map(
                                    (teacher: any) => (
                                      <Chip
                                        key={teacher.id}
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                      >
                                        {teacher.fullName}
                                      </Chip>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          <div className="md:col-span-2 flex items-center space-x-4 text-sm text-gray-600">
                            {content.data.assignedTeachers && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>
                                  {content.data.assignedTeachers.length}{" "}
                                  profesor(es) asignado(s)
                                </span>
                              </div>
                            )}
                            {content.data.updatedAt && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Última actualización:{" "}
                                  {new Date(
                                    content.data.updatedAt
                                  ).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Contenido Markdown - IGUAL QUE EL TEACHER */}
                  <Card className="m-6 mt-4 flex-1">
                    <CardBody className="p-2">
                      {markdownContent?.data ? (
                        <div className="prose prose-gray max-w-none">
                          <MilkdownReadOnlyViewer
                            content={markdownContent.data}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-600 mb-2">
                            No hay contenido disponible
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {markdownError
                              ? `Error: ${
                                  markdownError &&
                                  typeof markdownError === "object" &&
                                  "message" in markdownError
                                    ? (markdownError as Error).message
                                    : String(markdownError)
                                }`
                              : "Este contenido aún no tiene material educativo."}
                          </p>
                          {markdownError && (
                            <GlobalButton
                              color="primary"
                              onPress={handleRefetchMarkdown}
                              startContent={<RefreshCw className="h-4 w-4" />}
                              size="sm"
                            >
                              Reintentar
                            </GlobalButton>
                          )}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Vista de solo lectura (como la ve el maestro)</span>
                </div>
                <div className="flex gap-2">
                  <GlobalButton
                    color="default"
                    variant="light"
                    onPress={onClose}
                  >
                    Cerrar
                  </GlobalButton>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
