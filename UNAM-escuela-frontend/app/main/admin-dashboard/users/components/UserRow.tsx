import React, { useState } from "react";
import { Button, Chip, Avatar } from "@heroui/react";
import { Edit, Settings, UserX, UserCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useBlockUser } from "@/app/hooks/use-users";
import { addToast } from "@heroui/react";
import { AssignAdminWithLanguageModal } from "@/components/ui/assign-admin-with-language-modal";
import { EditUserModal } from "@/components/ui/edit-user-modal";

const UserRow = ({ user }: { user: any }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { canManageUser } = usePermissions();
  const blockUserMutation = useBlockUser();

  const canBlockUser = () => {
    if (!currentUser) return false;
    if (currentUser.id === user.id) return false;
    return canManageUser(user);
  };

  const handleToggleStatus = () => {
    if (!canBlockUser()) {
      addToast({
        title: "Permisos insuficientes",
        description: "No tienes permisos para bloquear este usuario",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    blockUserMutation.mutate({ id: user.id });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superUser":
        return "danger";
      case "admin":
        return "warning";
      case "docente":
        return "primary";
      case "alumno":
        return "success";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superUser":
        return "Super Usuario";
      case "admin":
        return "Administrador";
      case "docente":
        return "Docente";
      case "alumno":
        return "Alumno";
      case "mortal":
        return "Usuario";
      default:
        return role;
    }
  };

  return (
    <tr className="border-b border-divider hover:bg-content2/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={user.fullName}
            size="sm"
            className="bg-primary-100 text-primary-600"
          />
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-foreground/50">
              ID: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">{user.email}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role: string) => (
            <Chip
              key={role}
              size="sm"
              color={getRoleColor(role)}
              variant="flat"
            >
              {getRoleLabel(role)}
            </Chip>
          ))}
        </div>
      </td>
      <td className="py-3 px-4">
        <Chip
          size="sm"
          color={user.isActive ? "success" : "danger"}
          variant="flat"
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </Chip>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">
          {user.lastUpdateBy
            ? `Por: ${user.lastUpdateBy.fullName}`
            : "Sin actualizaciones"}
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            title="Editar usuario"
            onPress={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="primary"
            onPress={() => setIsRoleModalOpen(true)}
            title="Cambiar rol"
          >
            <Settings className="h-4 w-4" />
          </Button>
          {canBlockUser() && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color={user.isActive ? "warning" : "success"}
              onPress={handleToggleStatus}
              isLoading={blockUserMutation.isPending}
              title={user.isActive ? "Bloquear usuario" : "Activar usuario"}
            >
              {user.isActive ? (
                <UserX className="h-4 w-4" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <AssignAdminWithLanguageModal
        user={user}
        isOpen={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
      />
      <EditUserModal
        user={user}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </tr>
  );
};

export default UserRow;
