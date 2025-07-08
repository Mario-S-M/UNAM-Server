import React from "react";

const SkillsTableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-divider">
      <th className="text-left py-3 px-4 font-medium text-foreground">
        NOMBRE
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        DESCRIPCIÓN
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">COLOR</th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        ESTADO
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground">
        ACCIONES
      </th>
    </tr>
  </thead>
);

export default SkillsTableHeader;
