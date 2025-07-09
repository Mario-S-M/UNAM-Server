"use client";

import { Card, CardBody } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { SkillsHeader } from "@/components/skills/SkillsHeader";
import { SkillsFilters } from "@/components/skills/SkillsFilters";
import { SkillsStats } from "@/components/skills/SkillsStats";
import { SkillsTable } from "@/components/skills/SkillsTable";
import CreateSkillModal from "./components/CreateSkillModal";
import EditSkillModal from "./components/EditSkillModal";
import useSkillsManagement from "./hooks/useSkillsManagement";

export default function SkillsManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard/skills">
      <SkillsManagementContent />
    </RouteGuard>
  );
}

function SkillsManagementContent() {
  const { canManageSkills } = usePermissions();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    skills,
    skillsLoading,
    skillsError,
    paginatedData,
    totalPages,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedSkill,
    handleCreateSkill,
    handleEditSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    handleToggleActive,
    createSkillMutation,
    updateSkillMutation,
  } = useSkillsManagement();

  if (!canManageSkills) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-default-500">
              No tienes permisos para acceder a esta página.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <SkillsHeader
          title="Gestión de Skills"
          subtitle="Administra las habilidades del sistema"
          onBack={() => (window.location.href = "/main/admin-dashboard")}
        />
        <SkillsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateSkill={() => setIsCreateModalOpen(true)}
        />
        <SkillsStats
          total={paginatedData?.total || 0}
          active={skills?.filter((s: any) => s.isActive).length || 0}
          inactive={skills?.filter((s: any) => !s.isActive).length || 0}
        />
        <SkillsTable
          skills={skills}
          skillsLoading={skillsLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          paginatedData={paginatedData}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onPageChange={setCurrentPage}
          onEditSkill={handleEditSkill}
          onToggleActive={handleToggleActive}
          onCreateSkill={() => setIsCreateModalOpen(true)}
        />
        <CreateSkillModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateSkill}
          isLoading={createSkillMutation.isPending}
        />
        <EditSkillModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          skill={selectedSkill}
          onSubmit={handleUpdateSkill}
          isLoading={updateSkillMutation.isPending}
        />
      </div>
    </div>
  );
}
