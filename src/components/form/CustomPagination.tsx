"use client";
 
import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type TProps = {
    totalPages: number;
    currentPage: number;
    siblingCount?: number;
}

 
const usePagination = ({ totalPages, currentPage, siblingCount = 1 }: TProps) => {
    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5;
 
        if (totalPageNumbers >= totalPages) {
            return [...Array(totalPages)].map((_, idx) => idx + 1);
        }
 
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
 
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
 
        const firstPageIndex = 1;
        const lastPageIndex = totalPages;
 
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = [...Array(leftItemCount)].map((_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }
 
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = [...Array(rightItemCount)].map((_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }
 
        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = [];
            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                middleRange.push(i);
            }
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    }, [totalPages, currentPage, siblingCount]);
 
    return paginationRange || [];
};
 

type TCustomPaginationProps = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    dataLength?: number;
}
 
const CustomPagination = ({
    currentPage,
    setCurrentPage,
    totalPages,
    dataLength
    
}: TCustomPaginationProps) => {
    const paginationRange = usePagination({ currentPage, totalPages });

    React.useEffect(() => {
        if (dataLength === 0 && currentPage > 1) {
          setCurrentPage(1)
        }
    }, [dataLength, currentPage, setCurrentPage])
   
 
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }
 
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Math.max(currentPage - 1, 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === '...') {
                        return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                    }
 
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
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
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Math.min(currentPage + 1, totalPages));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
 
export default CustomPagination