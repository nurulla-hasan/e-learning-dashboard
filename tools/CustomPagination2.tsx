import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../src/components/ui/pagination";

type PaginationRange = (number | "...")[];

interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

const usePagination = ({
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps): PaginationRange => {
  const paginationRange = React.useMemo<PaginationRange>(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange: number[] = [];
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        middleRange.push(i);
      }
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  return paginationRange;
};

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  length?: number;
}

const CustomPagination2: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  length,
}) => {
  const paginationRange = usePagination({ currentPage, totalPages });

  React.useEffect(() => {
    if (length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [length, currentPage, setCurrentPage]);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setCurrentPage(Math.max(currentPage - 1, 1));
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setCurrentPage(pageNumber as number);
                }}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setCurrentPage(Math.min(currentPage + 1, totalPages));
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination2;
