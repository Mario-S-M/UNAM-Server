import React from "react";
import { Pagination } from "@heroui/react";

interface UsersPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const UsersPagination: React.FC<UsersPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => (
  <div className="flex justify-center mt-6">
    <Pagination
      total={totalPages}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      variant="light"
      size="lg"
      showControls
      className="gap-2"
      classNames={{
        wrapper: "gap-2 overflow-visible shadow-none",
        item: "w-10 h-10 text-sm bg-transparent border-0 rounded-lg hover:bg-default-100 text-default-600 hover:text-foreground",
        cursor: "bg-primary text-primary-foreground font-semibold shadow-sm",
        prev: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
        next: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
      }}
    />
  </div>
);

export default UsersPagination;
