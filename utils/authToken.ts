import type { UserRole } from "@/constants/Routes";

type TokenClaims = {
  role?: unknown;
  userRole?: unknown;
  user?: { role?: unknown };
  roles?: unknown;
};

const normalizeTokenRole = (value: unknown): UserRole | null => {
  if (typeof value !== "string") return null;

  const role = value.trim().toUpperCase();
  if (role === "EMPLOYER") return "employer";
  if (role === "WORKER") return "worker";
  return null;
};

export const getRoleFromToken = (token: string): UserRole | null => {
  try {
    const rawToken = token.replace(/^Bearer\s+/i, "").trim();
    const payload = rawToken.split(".")[1];
    if (!payload || typeof globalThis.atob !== "function") return null;

    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(
      base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
      "="
    );
    const decodedPayload = globalThis.atob(paddedPayload);
    const claims = JSON.parse(decodedPayload) as TokenClaims;

    return (
      normalizeTokenRole(claims.role) ??
      normalizeTokenRole(claims.userRole) ??
      normalizeTokenRole(claims.user?.role) ??
      (Array.isArray(claims.roles)
        ? normalizeTokenRole(claims.roles[0])
        : normalizeTokenRole(claims.roles))
    );
  } catch {
    return null;
  }
};
