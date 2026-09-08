import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Auth API stubs.
 * Never store passwords in localStorage.
 * Only store short-lived tokens returned by the backend.
 */
export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<{ token: string; user: unknown }>(
    '/auth/login',
    payload
  );
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<{ token: string; user: unknown }>(
    '/auth/register',
    payload
  );
  return data;
}

export async function logout() {
  // Clear token only – never clear other sensitive data incorrectly
  localStorage.removeItem('auth_token');
  await apiClient.post('/auth/logout').catch(() => undefined);
}
