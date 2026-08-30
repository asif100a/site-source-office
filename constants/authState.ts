import type { Href } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { safeGetWebStorageItem, safeSetWebStorageItem } from "@/constants/webStorage";
import { DEFAULT_USER_ROLE, normalizeUserRole, type UserRole } from "@/constants/Routes";

export const ACTIVE_ROLE_STORAGE_KEY = "site-source.active-role";
export const AUTH_STATUS_STORAGE_KEY = "site-source.is-authenticated";

export function setActiveRole(role: UserRole) {
  safeSetWebStorageItem(ACTIVE_ROLE_STORAGE_KEY, role);
  void AsyncStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role).catch(() => {});
}

export function markUserAuthenticated() {
  safeSetWebStorageItem(AUTH_STATUS_STORAGE_KEY, "true");
}

export function clearUserAuthenticated() {
  safeSetWebStorageItem(AUTH_STATUS_STORAGE_KEY, "false");
}

export function isUserAuthenticated() {
  return safeGetWebStorageItem(AUTH_STATUS_STORAGE_KEY) === "true";
}

export async function getActiveRole() {
  const webRole = safeGetWebStorageItem(ACTIVE_ROLE_STORAGE_KEY);

  if (webRole) {
    return normalizeUserRole(webRole);
  }

  try {
    const storedRole = await AsyncStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
    return storedRole ? normalizeUserRole(storedRole) : DEFAULT_USER_ROLE;
  } catch {
    return DEFAULT_USER_ROLE;
  }
}

export function getWorkerLoginRoute(returnTo?: Href | string) {
  return {
    pathname: "/auth" as const,
    params: {
      step: "login",
      role: "worker",
      ...(returnTo ? { returnTo } : {}),
    },
  };
}
