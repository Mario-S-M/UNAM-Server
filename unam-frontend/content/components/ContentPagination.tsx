import { Button } from '@/components/ui/button';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ContentPaginationProps {
  meta: PaginationMeta | undefined;
  contentsCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ContentPagination({ meta, contentsCount, currentPage, onPageChange }: ContentPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = meta.totalPages;
    const current = currentPage;

    // Siempre mostrar la primera página
    if (totalPages > 0) {
      pages.push(
        <Button
          key={1}
          variant={current === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
          className="min-w-[40px]"
        >
          1
        </Button>
      );
    }

    // Agregar puntos suspensivos si es necesario
    if (current > 3) {
      pages.push(
        <span key="ellipsis1" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Páginas alrededor de la actual
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <Button
            key={i}
            variant={current === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className="min-w-[40px]"
          >
            {i}
          </Button>
        );
      }
    }

    // Agregar puntos suspensivos si es necesario
    if (current < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Siempre mostrar la última página
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={current === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="min-w-[40px]"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Mostrando {contentsCount} de {meta.total} contenidos
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        {renderPageNumbers()}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === meta.totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}