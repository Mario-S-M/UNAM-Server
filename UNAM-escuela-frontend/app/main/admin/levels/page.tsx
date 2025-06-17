"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@heroui/react";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
} from "lucide-react";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { getActiveLenguages } from "@/app/actions/lenguage-actions";
import {
  getLevelsByLenguage,
  createLevel,
  deleteLevel,
} from "@/app/actions/level-actions";
import { Level, Lenguage } from "@/app/interfaces";
import { CreateLevelModal } from "./components/CreateLevelModal";
import { ContentManagementModal } from "./components/ContentManagementModal";

export default function AdminLevelsPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <AdminLevelsContent />
    </RouteGuard>
  );
}

function AdminLevelsContent() {
  const { canManageContent, userRole } = usePermissions();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const createLevelModal = useDisclosure();
  const contentModal = useDisclosure();
  const queryClient = useQueryClient();

  // Obtener idiomas
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: getActiveLenguages,
  });

  // Obtener niveles del idioma seleccionado
  const {
    data: levels,
    isLoading: levelsLoading,
    error,
  } = useQuery({
    queryKey: ["levels", selectedLanguage],
    queryFn: () => getLevelsByLenguage(selectedLanguage),
    enabled: !!selectedLanguage,
  });

  // Mutación para eliminar nivel
  const deleteLevelMutation = useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });

  const handleDeleteLevel = async (levelId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este nivel?")) {
      await deleteLevelMutation.mutateAsync(levelId);
    }
  };

  const handleManageContent = (level: Level) => {
    setSelectedLevel(level);
    contentModal.onOpen();
  };

  if (!canManageContent) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardBody>
              <p className="text-center text-gray-600">
                No tienes permisos para gestionar contenido.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  Gestión de Niveles y Contenido
                </h1>
                <p className="text-gray-600">
                  Administra los niveles educativos y su contenido
                </p>
              </div>
              <GlobalButton
                onPress={createLevelModal.onOpen}
                startContent={<Plus className="h-4 w-4" />}
                color="primary"
                text="Crear Nivel"
                isDisabled={!selectedLanguage}
              />
            </div>
          </CardHeader>
          <CardBody>
            {/* Selector de idioma */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Seleccionar Idioma:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 border rounded-lg"
                disabled={languagesLoading}
              >
                <option value="">Seleccione un idioma</option>
                {languages?.data?.map((lang: Lenguage) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de niveles */}
            {selectedLanguage && (
              <div>
                {levelsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    Error al cargar los niveles
                  </div>
                ) : levels?.data?.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No hay niveles creados para este idioma
                  </div>
                ) : (
                  <Table aria-label="Tabla de niveles">
                    <TableHeader>
                      <TableColumn>NOMBRE</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay niveles creados para este idioma">
                      {(levels?.data || []).map((level: Level) => (
                        <TableRow key={level.id}>
                          <TableCell>
                            <div className="font-medium">{level.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {level.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={
                                level.status === "active"
                                  ? "success"
                                  : "default"
                              }
                              size="sm"
                            >
                              {level.status === "active"
                                ? "Activo"
                                : "Inactivo"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleManageContent(level)}
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button isIconOnly size="sm" variant="light">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                  <DropdownItem
                                    key="edit"
                                    startContent={<Edit className="h-4 w-4" />}
                                  >
                                    Editar
                                  </DropdownItem>
                                  <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                      <Trash2 className="h-4 w-4" />
                                    }
                                    onPress={() => handleDeleteLevel(level.id)}
                                  >
                                    Eliminar
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Modales */}
        <CreateLevelModal
          isOpen={createLevelModal.isOpen}
          onOpenChange={createLevelModal.onOpenChange}
          languageId={selectedLanguage}
        />

        {selectedLevel && (
          <ContentManagementModal
            isOpen={contentModal.isOpen}
            onOpenChange={contentModal.onOpenChange}
            level={selectedLevel}
          />
        )}
      </div>
    </div>
  );
}
