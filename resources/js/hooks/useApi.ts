import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';

interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

interface PaginatedResponse<T> {
  users: T[];
  pagination: PaginationData;
}

interface UseApiOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      const result: ApiResponse<T> = await response.json();

      if (result.status) {
        setData(result.data);
        options.onSuccess?.(result.data);
      } else {
        setError(result.message);
        options.onError?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch: () => fetchData(),
  };
}

export function usePaginatedApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<PaginatedResponse<T> | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      const result: ApiResponse<PaginatedResponse<T>> = await response.json();

      if (result.status) {
        setData(result.data);
        options.onSuccess?.(result.data);
      } else {
        setError(result.message);
        options.onError?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const goToPage = useCallback((page: number, currentParams: Record<string, any> = {}) => {
    fetchData({ ...currentParams, page });
  }, [fetchData]);

  const changePerPage = useCallback((perPage: number, currentParams: Record<string, any> = {}) => {
    fetchData({ ...currentParams, per_page: perPage, page: 1 });
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    goToPage,
    changePerPage,
    refetch: () => fetchData(),
  };
}

export function useApiMutation<T, P = any>(
  url: string,
  options: UseApiOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data: P, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'same-origin',
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      });

      const result: ApiResponse<T> = await response.json();

      if (result.status) {
        options.onSuccess?.(result.data);
        return result.data;
      } else {
        setError(result.message);
        options.onError?.(result);
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return {
    mutate,
    loading,
    error,
  };
}
