import type { UserRole } from "@/constants/Routes";

export type NotificationNavigationData = {
  url?: string;
  jobId?: string;
  offerId?: string;
  applicationId?: string;
  conversationId?: string;
  timeSheetId?: string;
  timeSheetDayId?: string;
};

type NotificationRoute = {
  pathname: string;
  params: Record<string, string>;
};

export function getNotificationRoute(
  data: NotificationNavigationData | undefined,
  title: string | undefined,
  role: UserRole,
): NotificationRoute | null {
  if (data?.conversationId) {
    return {
      pathname: "/screens/chats/[id]",
      params: { id: data.conversationId, origin: role },
    };
  }

  if (!data?.jobId) return null;

  const normalizedTitle = title?.toLowerCase() ?? "";

  if (data.offerId || normalizedTitle.includes("job offer")) {
    return {
      pathname: "/screens/job/[id]",
      params: { id: data.jobId, applicationStatus: "offer" },
    };
  }

  if (normalizedTitle.includes("completed")) {
    return {
      pathname: "/screens/completed-jobs/[id]",
      params: { id: data.jobId, origin: role },
    };
  }

  if (
    data.applicationId ||
    data.timeSheetId ||
    data.timeSheetDayId ||
    normalizedTitle.includes("timesheet")
  ) {
    return {
      pathname: "/screens/active-jobs/[id]",
      params: { id: data.jobId, status: "active", origin: role },
    };
  }

  return {
    pathname: "/screens/job/[id]",
    params: { id: data.jobId, applicationStatus: "notification" },
  };
}
