import type { WorkerHomeJob } from "@/types";

export const getAllJobItems = (response: any): any[] => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.jobs ?? data?.items ?? data?.results ?? data?.data ?? [];
};

export const getAllJobsHasNextPage = (
  response: any,
  itemCount: number,
  limit: number,
) => {
  const data = response?.data ?? response;
  const meta = data?.meta ?? data?.pagination ?? {};
  if (typeof meta.hasNextPage === "boolean") return meta.hasNextPage;
  if (typeof meta.totalPages === "number") return meta.page < meta.totalPages;
  if (typeof meta.total === "number") return meta.page * (meta.limit ?? limit) < meta.total;
  return itemCount >= limit;
};

const formatDate = (value: unknown) => {
  if (!value) return "Date not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const mapApiJobToWorkerHomeJob = (job: any, index: number): WorkerHomeJob => {
  const [longitude, latitude] = job.location?.coordinates ?? [0, 0];
  const startDate = job.startDate ?? job.startAt;
  const endDate = job.endDate ?? job.endAt;
  const hourlyRate = Number(job.hourlyRate ?? 0);

  return {
    id: String(job.id ?? job._id),
    title: job.title ?? "Untitled job",
    company: job.employerAuth?.profile?.name ?? job.company ?? "Employer",
    area: job.location?.address ?? "Nearby site",
    distanceMiles: Number(job.distanceMiles ?? 0),
    workersNeeded: Number(job.workersNeeded ?? 0),
    startLabel: startDate ? `Starts ${formatDate(startDate)}` : "Start date not set",
    startDate: String(startDate ?? ""),
    posted: job.createdAt ? `Posted ${formatDate(job.createdAt)}` : "Recently posted",
    payRatePerDay: hourlyRate * 9,
    duration: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    closingAt: String(endDate ?? ""),
    coordinate: { latitude: Number(latitude), longitude: Number(longitude) },
    mapPosition: {
      top: 80 + (index % 4) * 48,
      left: `${25 + (index % 4) * 20}%`,
    },
  };
};
