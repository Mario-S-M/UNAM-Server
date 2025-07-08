"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import SkillsHeader from "./components/SkillsHeader";
import SkillsTable from "./components/SkillsTable";
import CreateSkillModal from "./components/CreateSkillModal";
import EditSkillModal from "./components/EditSkillModal";
import useSkillsManagement from "./hooks/useSkillsManagement";

export default function SkillsManagementPage() {
  const { canManageSkills } = usePermissions();
  const {
    searchTerm,
    setSearchTerm,
    filteredSkills,
    isLoading,
    error,
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
      <div className="flex items-center justify-center h-96">
        <p className="text-danger">No tienes permisos para gestionar skills</p>
      </div>
    );
  }

  return (
    <RouteGuard requiredPage="/main/admin-dashboard/skills">
      <div className="flex flex-col gap-6 p-6">
        <SkillsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={() => setIsCreateModalOpen(true)}
        />
        <SkillsTable
          skills={filteredSkills}
          searchTerm={searchTerm}
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
          onToggleActive={handleToggleActive}
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
    </RouteGuard>
  );
}
