import { useState, useEffect, useMemo } from 'react';
import useDebounce2 from './useDebounce2';

// Type definitions
interface QueryHookParams {
  page?: number;
  searchTerm?: string;
  [key: string]: unknown;
}

interface Meta {
  total?: number;
  totalPages?: number;
  totalPage?: number;
  limit?: number;
  page?: number;
}

interface QueryHookResult<T = unknown> {
  data?: {
    data: T[];
    meta: Meta;
  };
  isLoading: boolean;
  isError: boolean;
}

interface UseSmartFetchHookOptions {
  [key: string]: unknown;
}

interface UseSmartFetchHookReturn<T = unknown> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  total: number;
  items: T[];
  limit: number;
  page: number;
  isLoading: boolean;
  isError: boolean;
  filterParams: Record<string, unknown>;
  setFilterParams: (params: Record<string, unknown>) => void;
}

const useSmartFetchHook = <T = unknown>(
  queryHook: (params: QueryHookParams) => QueryHookResult<T>,
  options: UseSmartFetchHookOptions = {},
  initialParams: Record<string, unknown> = {}
): UseSmartFetchHookReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState<Record<string, unknown>>(initialParams);
  
  // Debounce search term and search params
  const debouncedSearchTerm = useDebounce2(searchTerm);
  const debouncedFilterParams = useDebounce2(filterParams);

  const { ...queryOptions } = options;

  // Memoize the stringified debounced search params
  const stringifiedDebouncedParams = useMemo(
    () => JSON.stringify(debouncedFilterParams),
    [debouncedFilterParams]
  );

  // Combine all parameters for the query
  const queryParams = useMemo(() => ({
    page: currentPage,
    searchTerm: debouncedSearchTerm,
    ...debouncedFilterParams,
    ...queryOptions,
  }), [currentPage, debouncedSearchTerm, debouncedFilterParams, queryOptions]);

  const { data, isLoading, isError } = queryHook(queryParams);

  // Reset to first page when debounced search term or params change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, stringifiedDebouncedParams]);

  const items = data?.data || [];
  const meta = data?.meta;
  const total = meta?.total || 0;
  const page = meta?.page || 0;
  const limit = (queryParams as any)?.limit || meta?.limit;
  const totalPages = meta?.totalPages || 1;

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    limit,
    page,
    items,
    isLoading,
    isError,
    filterParams,
    setFilterParams,
  };
};

export default useSmartFetchHook;