import React from "react";

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
}) => (
  <div className="flex justify-between items-center mt-4 px-2 py-2 bg-default-50 rounded-lg">
    <div className="text-sm text-default-600">
      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
      {Math.min(currentPage * itemsPerPage, totalItems)} de{" "}
      <span className="font-semibold">{totalItems}</span> contenidos
    </div>
    <div className="text-sm text-default-500">
      Página {currentPage} de {totalPages}
    </div>
  </div>
);

export default PaginationInfo;
