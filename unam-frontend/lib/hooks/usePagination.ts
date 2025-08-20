import { useState, useCallback } from 'react';
import type { PaginationInfo } from '@/types';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  setPaginationData: (data: PaginationInfo) => void;
  getPageNumbers: () => number[];
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  onPageChange,
  onPageSizeChange
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [paginationData, setPaginationData] = useState<PaginationInfo>({
    total: 0,
    page: initialPage,
    limit: initialPageSize,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  }, [paginationData.totalPages, onPageChange]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    onPageSizeChange?.(size);
  }, [onPageSizeChange]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, paginationData.hasNextPage, handlePageChange]);

  const goToPreviousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, paginationData.hasPreviousPage, handlePageChange]);

  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const goToLastPage = useCallback(() => {
    handlePageChange(paginationData.totalPages);
  }, [paginationData.totalPages, handlePageChange]);

  const getPageNumbers = useCallback((): number[] => {
    const { totalPages } = paginationData;
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents dots
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages); // -1 represents dots
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, paginationData]);

  return {
    currentPage,
    pageSize,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.total,
    hasNextPage: paginationData.hasNextPage,
    hasPreviousPage: paginationData.hasPreviousPage,
    setCurrentPage,
    setPageSize,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    handlePageChange,
    handlePageSizeChange,
    setPaginationData,
    getPageNumbers
  };
}

export default usePagination;