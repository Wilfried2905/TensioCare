export const AUTH_STORAGE_KEY = 'tensiocare_auth';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export function getStoredAuth(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getStoredAuth() !== null;
}

export function hasRole(user: AuthUser | null, role: string): boolean {
  return user?.role === role;
}

export function hasAnyRole(user: AuthUser | null, roles: string[]): boolean {
  return user ? roles.includes(user.role) : false;
}
