import React from "react";

const SkillsTableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-divider">
      <th className="text-left py-3 px-4 font-medium text-foreground/80">
        Nombre
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground/80">
        Descripción
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground/80">
        Color
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground/80">
        Estado
      </th>
      <th className="text-left py-3 px-4 font-medium text-foreground/80">
        Acciones
      </th>
    </tr>
  </thead>
);

export default SkillsTableHeader;
