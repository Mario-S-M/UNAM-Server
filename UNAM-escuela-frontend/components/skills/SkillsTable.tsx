import React from "react";
import { SkillsTableProps } from "@/app/interfaces/skill-interfaces";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { BookOpen } from "lucide-react";
import { SkillRow } from "./SkillRow";
import SkillsTableHeader from "./SkillsTableHeader";
import SkillsEmptyState from "./SkillsEmptyState";
import SkillsPagination from "./SkillsPagination";
import SkillsPaginationInfo from "./SkillsPaginationInfo";

interface ExtendedSkillsTableProps extends SkillsTableProps {
  onEditSkill?: (skill: any) => void;
  onToggleActive?: (id: string) => void;
  onCreateSkill?: () => void;
}

export const SkillsTable: React.FC<ExtendedSkillsTableProps> = ({
  skills,
  skillsLoading,
  currentPage,
  totalPages,
  pageSize,
  paginatedData,
  searchTerm,
  statusFilter,
  onPageChange,
  onEditSkill,
  onToggleActive,
  onCreateSkill,
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Lista de Skills
          {paginatedData && (
            <span className="text-sm font-normal text-foreground/60 ml-2">
              (Página {currentPage} de {totalPages} - {paginatedData.total}{" "}
              skills totales)
            </span>
          )}
        </h2>
      </div>
    </CardHeader>
    <CardBody>
      {skillsLoading ? (
        <div className="flex justify-center py-12">
          <span>Cargando...</span>
        </div>
      ) : !skills || skills.length === 0 ? (
        <SkillsEmptyState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onCreateSkill={onCreateSkill}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <SkillsTableHeader />
            <tbody>
              {skills.map((skill: any) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  onEdit={onEditSkill}
                  onToggleActive={onToggleActive}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Paginación */}
      {skills && skills.length > 0 && totalPages > 1 && (
        <SkillsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
      {/* Información de paginación */}
      {paginatedData && (
        <SkillsPaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          total={paginatedData.total}
          totalPages={totalPages}
        />
      )}
    </CardBody>
  </Card>
);
