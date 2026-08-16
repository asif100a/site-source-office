import type { Href } from "expo-router";

import { safeGetWebStorageItem, safeSetWebStorageItem } from "@/constants/webStorage";
import type { UserRole } from "@/constants/Routes";

export const ACTIVE_ROLE_STORAGE_KEY = "site-source.active-role";
export const AUTH_STATUS_STORAGE_KEY = "site-source.is-authenticated";

export function setActiveRole(role: UserRole) {
  safeSetWebStorageItem(ACTIVE_ROLE_STORAGE_KEY, role);
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
