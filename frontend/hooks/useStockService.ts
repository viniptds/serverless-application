import { useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004/v1';

export function useStockService() {
  const { token } = useAuth();

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const list = useCallback(async (searchQuery?: string) => {
    const response = await fetch(
      `${API_BASE_URL}/stocks?search=${encodeURIComponent(searchQuery ?? '')}`,
      {
        headers: authHeaders,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stocks');
    }

    return response.json();
  }, [token]);

  const get = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock');
    }

    return response.json();
  }, [token]);

  const create = useCallback(async (item: unknown) => {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to create stock');
    }

    return response.json();
  }, [token]);

  const updateItem = useCallback(async (id: string, item: unknown) => {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update stock');
    }

    return response.json();
  }, [token]);

  const deleteItem = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to delete stock');
    }
  }, [token]);

  return {
    list,
    get,
    create,
    updateItem,
    deleteItem,
  };
}
