/**
 * useFetch Hook
 * 
 * SOLID Principle Applied: Single Responsibility
 * This hook ONLY handles data fetching logic.
 * 
 * Generic and reusable for any API endpoint.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/types/api';

interface UseFetchOptions {
  skip?: boolean; // Skip initial fetch
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { skip = false, method = 'GET', body } = options;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const config = {
        method,
        url,
        data: body,
      };

      const response = await apiClient(config);
      setData(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err as ApiError);
      } else {
        setError(
          new ApiError(500, 'An unexpected error occurred', err)
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
