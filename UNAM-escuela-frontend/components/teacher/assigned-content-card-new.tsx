"use client";

import { Card, CardBody, CardHeader, Chip, Button } from "@heroui/react";
import { BookOpen, Edit, Eye, Users } from "lucide-react";
import Link from "next/link";
import { Content } from "@/app/actions/content-actions";

interface AssignedContentCardProps {
  content: Content;
}

export function AssignedContentCard({ content }: AssignedContentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "primary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return status || "Sin estado";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-3 rounded-full">
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
          <Chip
            color={getStatusColor(content.status || "draft")}
            variant="flat"
            size="sm"
          >
            {getStatusText(content.status || "draft")}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-3">
          {/* Información adicional */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{content.assignedTeachers?.length || 0} profesor(es)</span>
            </div>
            {content.createdAt && (
              <span>
                {new Date(content.createdAt).toLocaleDateString("es-ES")}
              </span>
            )}
          </div>

          {/* Acciones */}
          <div className="flex space-x-2">
            <Link
              href={`/main/teacher/content/${content.id}/edit`}
              className="flex-1"
            >
              <Button
                color="primary"
                variant="flat"
                className="w-full"
                startContent={<Edit className="h-4 w-4" />}
              >
                Editar
              </Button>
            </Link>
            <Link href={`/main/teacher/content/${content.id}`}>
              <Button
                color="default"
                variant="light"
                isIconOnly
                aria-label="Ver contenido"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
