import React from "react";

const UsersTableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-divider">
      <th className="text-left py-3 px-4 font-medium text-foreground">
        USUARIO
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">EMAIL</th>
      <th className="text-left py-3 px-4 font-medium text-foreground">ROLES</th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        IDIOMAS ASIGNADOS
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        ESTADO
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        ÚLTIMA ACTUALIZACIÓN
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        ACCIONES
      </th>
    </tr>
  </thead>
);

export default UsersTableHeader;
