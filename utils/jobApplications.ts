export type AppliedJobApplication = {
  id: string;
  jobId: string;
  appliedAt?: string;
  status?: string;
  job?: {
    id: string;
    title?: string;
    trades?: string[];
    hourlyRate?: number;
    workersNeeded?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    location?: {
      coordinates?: number[];
    };
    employerAuth?: {
      profile?: {
        name?: string;
      };
    };
  };
};

export type JobApplication = {
  id: string;
  appliedAt?: string;
  status?: string;
  auth?: {
    email?: string;
    profile?: {
      name?: string;
      image?: string | null;
    };
    workerProfile?: {
      trades?: string[];
      experience?: string | null;
    };
  };
};

export function getAppliedJobApplications(response: any): AppliedJobApplication[] {
  if (Array.isArray(response?.data?.applications)) {
    return response.data.applications;
  }

  if (Array.isArray(response?.applications)) {
    return response.applications;
  }

  return [];
}

export function getAppliedJobsHasNextPage(
  response: any,
  itemCount: number,
  limit: number,
) {
  const meta = response?.data?.meta ?? response?.meta;

  if (typeof meta?.total === "number" && typeof meta?.page === "number") {
    return meta.page * (meta.limit ?? limit) < meta.total;
  }

  return itemCount >= limit;
}

export function getJobApplications(response: any): JobApplication[] {
  if (Array.isArray(response?.data?.applications)) {
    return response.data.applications;
  }

  if (Array.isArray(response?.applications)) {
    return response.applications;
  }

  return [];
}

export function getJobApplicationsHasNextPage(
  response: any,
  itemCount: number,
  limit: number,
) {
  const meta = response?.data?.meta ?? response?.meta;

  if (typeof meta?.total === "number" && typeof meta?.page === "number") {
    return meta.page * (meta.limit ?? limit) < meta.total;
  }

  return itemCount >= limit;
}

export function formatAppliedJobDate(value?: string) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
