import { WorkerHomeDateRange, WorkerHomeFilter, WorkerHomeJob, WorkerHomeModalFilters } from "@/types";

export const WORKER_HOME_TRADE_OPTIONS = [
  "Labourer",
  "Groundworker",
  "Carpenter",
  "Scaffolder",
  "Bricklayer",
  "Plant op",
] as const;

export const DEFAULT_HOME_LOCATION = "Shoreditch, E2";

export const WORKER_HOME_FILTERS: WorkerHomeFilter[] = [
  "All",
  "Closing soon",
  "Highest paid",
  "Nearby",
];

export const WORKER_HOME_JOBS: WorkerHomeJob[] = [
  {
    id: "scaffolder",
    title: "Scaffolder",
    company: "Eastway Access",
    area: "Shoreditch",
    distanceMiles: 0.7,
    workersNeeded: 5,
    startLabel: "Starts tomorrow",
    startDate: "2026-08-17",
    posted: "Posted 8 min ago",
    payRatePerDay: 260,
    duration: "1 day",
    closingAt: "2026-08-17T09:00:00.000Z",
    coordinate: {
      latitude: 51.5276,
      longitude: -0.0783,
    },
    mapPosition: {
      top: 160,
      left: "65%",
    },
  },
  {
    id: "labourer",
    title: "Labourer",
    company: "London Builder Ltd",
    area: "Shoreditch",
    distanceMiles: 0.8,
    workersNeeded: 4,
    startLabel: "Starts tomorrow",
    startDate: "2026-08-17",
    posted: "Posted 12 min ago",
    payRatePerDay: 220,
    duration: "2 weeks",
    closingAt: "2026-08-17T16:00:00.000Z",
    coordinate: {
      latitude: 51.5249,
      longitude: -0.0718,
    },
    mapPosition: {
      top: 96,
      left: "29%",
    },
  },
  {
    id: "groundworker",
    title: "Groundworker",
    company: "Kerigan Civils",
    area: "Hackney Wick",
    distanceMiles: 1.4,
    workersNeeded: 2,
    startLabel: "Starts Mon 24 Aug",
    startDate: "2026-08-24",
    posted: "Posted 1 hr ago",
    payRatePerDay: 200,
    duration: "6 weeks",
    closingAt: "2026-08-18T12:00:00.000Z",
    coordinate: {
      latitude: 51.5434,
      longitude: -0.0226,
    },
    mapPosition: {
      top: 84,
      left: "58%",
    },
  },
  {
    id: "bricklayer",
    title: "Bricklayer",
    company: "Fieldstone Projects",
    area: "Bethnal Green",
    distanceMiles: 1.1,
    workersNeeded: 1,
    startLabel: "Urgent today",
    startDate: "2026-08-16",
    posted: "Posted 25 min ago",
    payRatePerDay: 180,
    duration: "4 days",
    closingAt: "2026-08-16T18:00:00.000Z",
    coordinate: {
      latitude: 51.5279,
      longitude: -0.0555,
    },
    mapPosition: {
      top: 188,
      left: "44%",
    },
  },
];

function matchesTrade(job: WorkerHomeJob, trades: string[]) {
  if (trades.length === 0) {
    return true;
  }

  const normalizedTitle = job.title.toLowerCase();

  return trades.some((trade) => normalizedTitle.includes(trade.toLowerCase()));
}

function toLocalDate(value: string | Date) {
  if (value instanceof Date) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    );
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function matchesDateRange(job: WorkerHomeJob, dateRange: WorkerHomeDateRange) {
  const { from, to } = dateRange;

  if (!from && !to) {
    return true;
  }

  const jobStartDate = toLocalDate(job.startDate).getTime();
  const normalizedFrom = from ? toLocalDate(from).getTime() : undefined;
  const normalizedTo = to ? toLocalDate(to).getTime() : undefined;

  if (normalizedFrom !== undefined && jobStartDate < normalizedFrom) {
    return false;
  }

  if (normalizedTo !== undefined && jobStartDate > normalizedTo) {
    return false;
  }

  return true;
}

export function filterWorkerHomeJobs(
  jobs: WorkerHomeJob[],
  filters: WorkerHomeModalFilters,
) {
  const nextJobs = jobs.filter((job) => {
    return (
      matchesTrade(job, filters.trades) &&
      job.distanceMiles <= filters.maxDistanceMiles &&
      job.payRatePerDay >= filters.minRatePerDay &&
      matchesDateRange(job, filters.dateRange)
    );
  });

  return sortWorkerHomeJobs(nextJobs, filters.sortBy);
}

export function sortWorkerHomeJobs(
  jobs: WorkerHomeJob[],
  filter: WorkerHomeFilter,
) {
  const nextJobs = [...jobs];

  if (filter === "Closing soon") {
    return nextJobs.sort(
      (a, b) =>
        new Date(a.closingAt).getTime() - new Date(b.closingAt).getTime(),
    );
  }

  if (filter === "Highest paid") {
    return nextJobs.sort((a, b) => b.payRatePerDay - a.payRatePerDay);
  }

  if (filter === "Nearby") {
    return nextJobs.sort((a, b) => a.distanceMiles - b.distanceMiles);
  }

  return nextJobs;
}

export function formatDistance(distanceMiles: number) {
  return `${distanceMiles.toFixed(1)} mi`;
}

export function formatNeeded(workersNeeded: number) {
  return `${workersNeeded} needed`;
}

export function formatPayRate(payRatePerDay: number) {
  return `£${payRatePerDay}/hr`;
}
