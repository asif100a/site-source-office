import { Href } from "expo-router";

type RouteMap = Record<string, Href>;
export type UserRole = "worker" | "employer";

const AuthRoutes: Href = "/auth";

const CommonRoutes: RouteMap = {
  NOTIFICATIONS: "/screens/common/Notifications",
};

const WorkerRoutes: RouteMap = {
  WORKER_HOME: "/tabs/(worker-tabs)",
  WORKER_DETAILS: "/screens/worker-details/[id]",
  SEARCH_WORKER: "/screens/search/SearchWorker",
  PROFILE_WORKER: "/tabs/(worker-tabs)/profile",
};

const EmployerRoutes: RouteMap = {
  EMPLOYER_HOME: "/tabs/(employer-tabs)",
  EMPLOYER_DETAILS: "/screens/employer-details/[id]",
  SEARCH_EMPLOYER: "/screens/search/SearchJobs",
  PROFILE_EMPLOYER: "/tabs/(employer-tabs)/profile",
};

export const DEFAULT_USER_ROLE: UserRole = "worker";

export const normalizeUserRole = (role?: string | string[]): UserRole => {
  const roleValue = Array.isArray(role) ? role[0] : role;
  return roleValue === "employer" ? "employer" : DEFAULT_USER_ROLE;
};

export const getDashboardRouteForRole = (role: UserRole): Href => {
  return role === "employer" ? EmployerRoutes.EMPLOYER_HOME : WorkerRoutes.WORKER_HOME;
};

export const Routes = { AuthRoutes, CommonRoutes, WorkerRoutes, EmployerRoutes };

export type Routes = typeof Routes;
