import { User, UserRole } from "./types";

const AUTH_KEY = "supply_chain_auth";

export const login = (email: string, password: string, role: UserRole): User => {
  // Demo auth - just create a user object
  const user: User = {
    id: crypto.randomUUID(),
    email,
    role,
    name: email.split("@")[0],
  };
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
