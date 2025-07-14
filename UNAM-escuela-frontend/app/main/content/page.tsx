"use client";

import React, { useState, Suspense } from "react";
import type { FC } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Spinner,
} from "@heroui/react";
import {
  BookOpen,
  Eye,
  FileText,
  Calendar,
  Users,
  User,
  Edit,
} from "lucide-react";
import { getActiveSkills } from "../../actions/skill-actions";
import {
  getContentsBySkill,
  getContentsByLevel,
  getContentsByLevelAndSkill,
  getValidatedContentsBySkill,
  getValidatedContentsByLevel,
  getValidatedContentsByLevelAndSkill,
} from "../../actions/content-actions";
import { getLevel } from "../../actions/level-actions";
import { Content } from "../../interfaces/content-interfaces";
import { Skill } from "../../interfaces/skill-interfaces";
import { BackButton } from "../../../components/ui/back-button";
import { usePermissions } from "../../hooks/use-authorization";
import { useAuth } from "../../../components/providers/auth-provider";

// Server Component
const ContentPage: FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const levelId = searchParams.get("level");
  const { canTeach, canManageContent, userRole } = usePermissions();

  // Fetch all active skills
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: getActiveSkills,
  });

  // Fetch level information if levelId is provided
  const { data: levelInfo } = useQuery({
    queryKey: ["level", levelId],
    queryFn: () => (levelId ? getLevel(levelId) : Promise.resolve(null)),
    enabled: !!levelId,
  });

  // Fetch contents for selected skill and level - use validated content for students
  const { data: skillContents, isLoading: contentsLoading } = useQuery({
    queryKey: ["skillContents", selectedSkill, levelId, userRole],
    queryFn: () => {
      // For admins and teachers, show all content
      const showAllContent = canTeach || canManageContent;

      if (selectedSkill && levelId) {
        return showAllContent
          ? getContentsByLevelAndSkill(levelId, selectedSkill)
          : getValidatedContentsByLevelAndSkill(levelId, selectedSkill);
      } else if (selectedSkill) {
        return showAllContent
          ? getContentsBySkill(selectedSkill)
          : getValidatedContentsBySkill(selectedSkill);
      } else if (levelId) {
        return showAllContent
          ? getContentsByLevel(levelId)
          : getValidatedContentsByLevel(levelId);
      }
      return Promise.resolve([]);
    },
    enabled: !!(selectedSkill || levelId),
  });

  if (selectedSkill) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <BackButton
              label="Volver a Skills"
              onClick={() => setSelectedSkill(null)}
            />

            {/* Selected Skill Header */}
            {skills?.data &&
              (() => {
                const skill = skills.data.find(
                  (s: Skill) => s.id === selectedSkill
                );
                return skill ? (
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                      <h1 className="text-3xl font-bold text-foreground">
                        {skill.name}
                      </h1>
                    </div>
                    <p className="text-default-500 text-lg">
                      {skill.description}
                    </p>
                    {levelId && levelInfo?.data && (
                      <Chip color="primary" variant="flat" className="mt-2">
                        Nivel: {levelInfo.data.name}
                      </Chip>
                    )}
                  </div>
                ) : null;
              })()}

            {/* Contents Grid */}
            {contentsLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="mt-4 text-gray-600">Cargando contenidos...</p>
                </div>
              </div>
            ) : skillContents && skillContents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillContents.map((content: Content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-default-500 mb-2">
                  No hay contenidos disponibles
                </h3>
                <p className="text-default-400">
                  Esta skill aún no tiene contenidos asignados
                  {levelId ? " para este nivel" : ""}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Contenidos por Skills
            {levelInfo?.data && (
              <div className="text-lg font-normal text-default-500 mt-2">
                Nivel: {levelInfo.data.name}
              </div>
            )}
          </h1>
          <p className="text-default-500 text-lg mb-6">
            Explora todo el contenido educativo organizado por habilidades
            {levelId && " para el nivel seleccionado"}
          </p>
        </div>

        {/* Skills Loading */}
        {skillsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Cargando skills...</p>
            </div>
          </div>
        ) : skillsError ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <BookOpen className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Error al cargar skills
              </h3>
              <p>Intenta recargar la página</p>
            </div>
          </div>
        ) : skills?.data && skills.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.data.map((skill: Skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                levelId={levelId}
                onSelect={() => setSelectedSkill(skill.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-default-500 mb-2">
              No hay skills disponibles
            </h3>
            <p className="text-default-400">
              Aún no se han configurado habilidades en el sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
const ContentPageWrapper: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <ContentPage />
    </Suspense>
  );
};

export default ContentPageWrapper;

// Skill Card Component
interface SkillCardProps {
  skill: Skill;
  levelId: string | null;
  onSelect: () => void;
}

function SkillCard({ skill, levelId, onSelect }: SkillCardProps) {
  const { canTeach, canManageContent } = usePermissions();

  const { data: skillContents } = useQuery({
    queryKey: [
      "skillContentsCount",
      skill.id,
      levelId,
      canTeach,
      canManageContent,
    ],
    queryFn: () => {
      // For admins and teachers, show all content count
      const showAllContent = canTeach || canManageContent;

      if (levelId) {
        return showAllContent
          ? getContentsByLevelAndSkill(levelId, skill.id)
          : getValidatedContentsByLevelAndSkill(levelId, skill.id);
      } else {
        return showAllContent
          ? getContentsBySkill(skill.id)
          : getValidatedContentsBySkill(skill.id);
      }
    },
  });

  const contentCount = skillContents?.length || 0;

  return (
    <Card
      className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 hover:border-primary/30"
      isPressable
      onPress={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${skill.color}20`,
                border: `2px solid ${skill.color}`,
              }}
            >
              <BookOpen className="h-6 w-6" style={{ color: skill.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">
                {skill.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {skill.description}
              </p>
            </div>
          </div>
          <Chip color="primary" variant="flat" size="sm">
            {contentCount} contenido{contentCount !== 1 ? "s" : ""}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span>Skill activa</span>
            {levelId && (
              <>
                <span>•</span>
                <span>Nivel específico</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Eye className="h-3 w-3" />
            <span>Ver Contenidos</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Content Card Component
interface ContentCardProps {
  content: Content;
}

function ContentCard({ content }: ContentCardProps) {
  const { canTeach, canManageContent } = usePermissions();
  const { user } = useAuth();

  // Verificar si el usuario actual está asignado a este contenido
  const isAssignedTeacher =
    user &&
    content.assignedTeachers &&
    content.assignedTeachers.some((teacher: any) => teacher.id === user.id);

  // Determinar si puede editar: es admin/manager O es profesor asignado
  const canEdit = canManageContent || (canTeach && isAssignedTeacher);

  return (
    <Card className="hover:bg-gray-50 transition-colors border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">
                {content.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {content.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* Validation status for all users */}
            <Chip
              color={
                content.validationStatus === "validado" ? "success" : "danger"
              }
              variant="dot"
              size="sm"
            >
              {content.validationStatus === "validado"
                ? "Validado"
                : "Sin validar"}
            </Chip>
            {/* Indicator if user is assigned teacher */}
            {isAssignedTeacher && (
              <Chip color="primary" variant="flat" size="sm">
                Asignado
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-3">
          {/* Información adicional */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                Creado: {new Date(content.createdAt || "").toLocaleDateString()}
              </span>
            </div>
            {content.assignedTeachers &&
              content.assignedTeachers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {content.assignedTeachers.length} profesor
                    {content.assignedTeachers.length !== 1 ? "es" : ""}
                  </span>
                </div>
              )}
          </div>

          {content.markdownPath && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                Archivo markdown disponible
              </span>
            </div>
          )}

          {/* Skill badge */}
          {content.skill && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: content.skill.color }}
              />
              <span className="text-sm text-gray-600">
                {content.skill.name}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          <Link href={`/main/content/${content.id}`}>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Eye className="h-4 w-4" />}
              className="text-sm"
            >
              Ver Contenido
            </Button>
          </Link>
          {/* Botón de editar para profesores asignados o administradores */}
          {canEdit && (
            <Link href={`/main/teacher/edit/${content.id}`}>
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<Edit className="h-4 w-4" />}
                className="text-sm"
              >
                Editar
              </Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
