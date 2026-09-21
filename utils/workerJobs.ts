import type { WorkerHomeJob } from "@/types";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

export const getAllJobItems = (response: any): any[] => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.jobs ?? data?.items ?? data?.results ?? data?.data ?? [];
};

export const getBookmarkedJobItems = (response: any): any[] => {
  const data = response?.data ?? response;
  const bookmarks = data?.bookmarks ?? data?.items ?? data?.results ?? [];

  if (!Array.isArray(bookmarks)) {
    return [];
  }

  return bookmarks.map((bookmark) => bookmark?.job).filter(Boolean);
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

const formatFullDate = (value: unknown) => {
  if (!value) return "Date not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPostedDate = (value: unknown) => {
  if (!value) return "Recently posted";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Recently posted";
  return `Posted ${formatDate(value)}`;
};

const formatDistance = (value: unknown) => {
  const distance = Number(value);
  if (!Number.isFinite(distance) || distance <= 0) return "";
  return ` - ${distance.toFixed(distance < 10 ? 1 : 0)} mi away`;
};

const getCoordinateLabel = (coordinates: any) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return "Nearby site";
  }

  const [longitude, latitude] = coordinates;

  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return "Nearby site";
  }

  return `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`;
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

const formatWorkingHours = (workingHours: any) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return "Hours not set";
  }

  return workingHours
    .map((schedule) => {
      const day = schedule?.day ?? "Day";
      const startTime = schedule?.startTime ?? "--:--";
      const endTime = schedule?.endTime ?? "--:--";
      const payRate = schedule?.isPayTwoX
        ? " 2x"
        : schedule?.isPayOnePointFiveX
          ? " 1.5x"
          : "";

      return `${day} ${startTime}-${endTime}${payRate}`;
    })
    .join(", ");
};

const formatTrade = (trade: string) =>
  trade
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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
      job.employerName ??
      job.employer?.name ??
      job.employerAuth?.profile?.name ??
      job.company ??
      "Employer",
    area: job.location?.address ?? getCoordinateLabel(job.location?.coordinates),
    distanceMiles: Number(distance ?? 0),
    workersNeeded: Number(job.workersNeeded ?? 0),
    startLabel: startDate ? `Starts ${formatDate(startDate)}` : "Start date not set",
    startDate: String(startDate ?? ""),
    startDateLabel: formatFullDate(startDate),
    endDateLabel: formatFullDate(endDate),
    posted: job.createdAt ? `Posted ${formatDate(job.createdAt)}` : "Recently posted",
    payRatePerDay: Math.round(hourlyRate * getDailyHours(job.workingHours)),
    duration: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    closingAt: String(endDate ?? ""),
    coordinate: { latitude: Number(latitude), longitude: Number(longitude) },
    mapPosition: {
      top: 80 + (index % 4) * 48,
      left: `${25 + (index % 4) * 20}%`,
    },
    trades: Array.isArray(job.trades) ? job.trades.map(formatTrade) : [],
    hourlyRate,
    workingHoursLabel: formatWorkingHours(job.workingHours),
    mustHave: Array.isArray(job.mustHave) ? job.mustHave.map(formatTrade) : [],
    note: job.note,
  };
};

export const mapApiJobToWorkerJobItem = (job: any): WorkerJobItem => {
  const startDate = job.startDate ?? job.startAt;
  const endDate = job.endDate ?? job.endAt;
  const distance = job.distanceMiles ?? job.distance;

  return {
    id: String(job.id ?? job._id),
    title: job.title ?? "Untitled job",
    company:
      job.employerName ??
      job.employer?.name ??
      job.employerAuth?.profile?.name ??
      job.company ??
      "Employer",
    payRate: String(Number(job.hourlyRate ?? 0)),
    tag: "Open",
    location: `${job.location?.address ?? "Job site"}${formatDistance(distance)}`,
    team: `${Number(job.workersNeeded ?? 0)} worker${
      Number(job.workersNeeded ?? 0) === 1 ? "" : "s"
    } needed`,
    duration: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    time: formatPostedDate(job.createdAt),
  };
};
