import type { WorkerHomeJob } from "@/types";

export const getAllJobItems = (response: any): any[] => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.jobs ?? data?.items ?? data?.results ?? data?.data ?? [];
};

export const getSingleJobData = (response: any) => response?.data ?? response;

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

const getHoursBetween = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return 0;

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (
    !Number.isFinite(startHour) ||
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endHour) ||
    !Number.isFinite(endMinute)
  ) {
    return 0;
  }

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  return Math.max(0, (end - start) / 60);
};

const getDailyHours = (workingHours: any) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return 9;
  }

  const hours = workingHours
    .map((schedule) => getHoursBetween(schedule?.startTime, schedule?.endTime))
    .filter((value) => value > 0);

  if (!hours.length) {
    return 9;
  }

  return hours.reduce((total, value) => total + value, 0) / hours.length;
};

export const mapApiJobToWorkerHomeJob = (job: any, index: number): WorkerHomeJob => {
  const [longitude, latitude] = job.location?.coordinates ?? [0, 0];
  const startDate = job.startDate ?? job.startAt;
  const endDate = job.endDate ?? job.endAt;
  const hourlyRate = Number(job.hourlyRate ?? 0);
  const distance = job.distanceMiles ?? job.distance;

  return {
    id: String(job.id ?? job._id),
    title: job.title ?? "Untitled job",
    company:
      job.employer?.name ??
      job.employerAuth?.profile?.name ??
      job.company ??
      "Employer",
    area: job.location?.address ?? "Nearby site",
    distanceMiles: Number(distance ?? 0),
    workersNeeded: Number(job.workersNeeded ?? 0),
    startLabel: startDate ? `Starts ${formatDate(startDate)}` : "Start date not set",
    startDate: String(startDate ?? ""),
    posted: job.createdAt ? `Posted ${formatDate(job.createdAt)}` : "Recently posted",
    payRatePerDay: Math.round(hourlyRate * getDailyHours(job.workingHours)),
    duration: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    closingAt: String(endDate ?? ""),
    coordinate: { latitude: Number(latitude), longitude: Number(longitude) },
    mapPosition: {
      top: 80 + (index % 4) * 48,
      left: `${25 + (index % 4) * 20}%`,
    },
  };
};
