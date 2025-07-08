import React from "react";
import { UsersStatsProps } from "@/app/interfaces/users-interfaces";
import { Card, CardBody } from "@heroui/react";
import { Users, UserCheck, UserX, Mail } from "lucide-react";

export const UsersStats: React.FC<UsersStatsProps> = ({
  total,
  active,
  inactive,
  teachers,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card className="bg-blue-50 dark:bg-blue-950/30">
      <CardBody className="p-4 text-center">
        <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-blue-600">{total}</p>
        <p className="text-sm text-blue-500">Total Usuarios</p>
      </CardBody>
    </Card>
    <Card className="bg-green-50 dark:bg-green-950/30">
      <CardBody className="p-4 text-center">
        <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-green-600">{active}</p>
        <p className="text-sm text-green-500">Activos</p>
      </CardBody>
    </Card>
    <Card className="bg-orange-50 dark:bg-orange-950/30">
      <CardBody className="p-4 text-center">
        <UserX className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-orange-600">{inactive}</p>
        <p className="text-sm text-orange-500">Inactivos</p>
      </CardBody>
    </Card>
    <Card className="bg-purple-50 dark:bg-purple-950/30">
      <CardBody className="p-4 text-center">
        <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-purple-600">{teachers}</p>
        <p className="text-sm text-purple-500">Docentes</p>
      </CardBody>
    </Card>
  </div>
);
