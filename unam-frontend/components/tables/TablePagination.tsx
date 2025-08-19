'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showItemCount?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showItemCount = true,
  showPageNumbers = true,
  maxPageNumbers = 5
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfRange = Math.floor(maxPageNumbers / 2);
    
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);
    
    // Ajustar si estamos cerca del inicio o final
    if (endPage - startPage + 1 < maxPageNumbers) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
      } else {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className)}>
      {/* Información de elementos */}
      {showItemCount && (
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {totalItems} elementos
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Ir a la primera página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Números de página */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className="h-8 w-8 p-0"
                >
                  1
                </Button>
                {pageNumbers[0] > 2 && (
                  <span className="text-muted-foreground px-2">...</span>
                )}
              </>
            )}
            
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="text-muted-foreground px-2">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="h-8 w-8 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Página siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Ir a la última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;