import { useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004/v1';

export function useUserService() {
  const { token } = useAuth();

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const getItems = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }, [token]);

  const createItem = useCallback(async (item: unknown) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }, [token]);

  const updateItem = useCallback(async (id: string, item: unknown) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }, [token]);

  const deleteItem = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }, [token]);

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
