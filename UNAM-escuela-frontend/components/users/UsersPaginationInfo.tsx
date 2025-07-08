import React from "react";

interface UsersPaginationInfoProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const UsersPaginationInfo: React.FC<UsersPaginationInfoProps> = ({
  currentPage,
  pageSize,
  total,
  totalPages,
}) => (
  <div className="flex justify-between items-center mt-4 text-small text-default-500">
    <span>
      Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
      {Math.min(currentPage * pageSize, total)} de {total} usuarios
    </span>
    <span>
      Página {currentPage} de {totalPages} ({pageSize} usuarios por página)
    </span>
  </div>
);

export default UsersPaginationInfo;
