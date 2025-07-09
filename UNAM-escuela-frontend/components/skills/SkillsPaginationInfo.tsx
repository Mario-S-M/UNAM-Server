import React from "react";

interface SkillsPaginationInfoProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const SkillsPaginationInfo: React.FC<SkillsPaginationInfoProps> = ({
  currentPage,
  pageSize,
  total,
  totalPages,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex justify-center mt-4">
      <p className="text-sm text-foreground/60">
        Mostrando {startItem} a {endItem} de {total} skills totales
        {totalPages > 1 && ` (página ${currentPage} de ${totalPages})`}
      </p>
    </div>
  );
};

export default SkillsPaginationInfo;
