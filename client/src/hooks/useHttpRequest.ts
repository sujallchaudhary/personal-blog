import { useState, useCallback } from 'react';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown> | string | null;
  headers?: Record<string, string>;
  auth?: string | null; // Optional auth token (e.g., Bearer token)
}

interface UseHttpRequest<T> {
  isLoading: boolean;
  error: string | null;
  response: T | null;
  sendRequest: (config: RequestConfig) => Promise<T>;
}

const useHttpRequest = <T = any>(): UseHttpRequest<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<T | null>(null);

  const sendRequest = useCallback(
    async ({ url, method = 'GET', body = null, headers = {}, auth = null }: RequestConfig): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        // Add Authorization header if auth is provided
        if (auth) {
          headers = {
            ...headers,
            Authorization: `Bearer ${auth}`,
          };
        }

        const options: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        };

        if (body && (method === 'POST' || method === 'PUT')) {
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);

        if (!res.ok) {
          const errorMessage = `Error ${res.status}: ${res.statusText}`;
          throw new Error(errorMessage);
        }

        const data: T = await res.json();
        setResponse(data);
        return data;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, response, sendRequest };
};

export default useHttpRequest;
