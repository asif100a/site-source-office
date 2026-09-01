import type { JobCard, JobStatus } from "@/types";

export type JobListTab = "upcoming" | "active" | "completed";

export const getJobItems = (response: any): any[] => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.items ?? data?.jobs ?? data?.results ?? data?.data ?? [];
};

export const getHasNextPage = (response: any, itemCount: number, limit: number) => {
  const data = response?.data ?? response;
  const pagination = data?.pagination ?? data?.meta ?? {};

  if (typeof pagination.hasNextPage === "boolean") return pagination.hasNextPage;
  if (typeof pagination.hasNext === "boolean") return pagination.hasNext;
  if (typeof pagination.totalPages === "number" && typeof pagination.page === "number") {
    return pagination.page < pagination.totalPages;
  }
  if (typeof pagination.total === "number" && typeof pagination.page === "number") {
    return pagination.page * (pagination.limit ?? limit) < pagination.total;
  }
  return itemCount >= limit;
};

const toStatus = (value: unknown): JobStatus => {
  const status = String(value ?? "new").toLowerCase();
  if (["active", "in_progress", "ongoing", "started"].includes(status)) {
    return "active";
  }
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "canceled") return "cancelled";
  return "upcoming";
};

const formatDate = (value: unknown) => {
  if (!value) return "Date not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const mapJobToCard = (job: any): JobCard => {
  const status = toStatus(job.status ?? job.jobStatus);
  const coordinates = job.location?.coordinates;
  const location =
    job.location?.address ??
    job.address ??
    (Array.isArray(coordinates) ? `${coordinates[1]}, ${coordinates[0]}` : "Location not set");
  const startDate = job.startDate ?? job.startAt;
  const endDate = job.endDate ?? job.endAt;

  return {
    id: String(job.id ?? job._id),
    title: job.title ?? "Untitled job",
    company: job.employer?.name ?? job.company?.name ?? job.company ?? "Your company",
    badge: status === "active" ? "Active" : status === "completed" ? "Completed" : status === "cancelled" ? "Cancelled" : "New",
    location,
    coordinates: Array.isArray(coordinates)
      ? [Number(coordinates[0]), Number(coordinates[1])]
      : undefined,
    team: `${job.workersNeeded ?? 0} worker${job.workersNeeded === 1 ? "" : "s"} needed`,
    duration: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    status,
    rate: job.hourlyRate != null ? `£${job.hourlyRate}/hour` : "Rate not set",
    applications:
      job.applicationsCount != null || job.totalApplicants != null
        ? `+ ${job.applicationsCount ?? job.totalApplicants} Applications`
        : undefined,
  };
};
