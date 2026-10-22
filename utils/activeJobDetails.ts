export type ActiveJobDetails = {
  title: string;
  company: string;
  statusBadge: string;
  location: string;
  team: string;
  duration: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  startDate: string;
  endDate: string;
  hours: string;
  daysPerWeek: string;
  nextInvoice: string;
  isReviewed: boolean;
  jobCompletion: {status: "PENDING" | "ACCEPTED" | "REJECTED" | string}[]
};

export const DEFAULT_ACTIVE_JOB_DETAILS: ActiveJobDetails = {
  title: "Active job",
  company: "Employer",
  statusBadge: "Active",
  location: "Location not available",
  team: "Workers not set",
  duration: "Dates not set",
  contactName: "Employer",
  contactTitle: "Employer",
  contactEmail: "Email not available",
  contactPhone: "Phone not available",
  startDate: "Not set",
  endDate: "Not set",
  hours: "Not set",
  daysPerWeek: "Not set",
  nextInvoice: "Not set",
  isReviewed: false,
  jobCompletion: [],
};

const formatDate = (value?: string) => {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTrade = (trade: string) =>
  trade
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getWorkingHoursLabel = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return "Not set";
  }

  const firstSchedule = workingHours[0];
  if (!firstSchedule?.startTime || !firstSchedule?.endTime) {
    return "Not set";
  }

  return `${firstSchedule.startTime} - ${firstSchedule.endTime}`;
};

const getDaysPerWeekLabel = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return "Not set";
  }

  return `${workingHours.length} ${workingHours.length === 1 ? "Day" : "Days"}`;
};

const getLocationLabel = (job: any) => {
  const coordinates = job?.location?.coordinates;

  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return `${Number(coordinates[1]).toFixed(4)}, ${Number(
      coordinates[0],
    ).toFixed(4)}`;
  }

  return "Location not available";
};

export const mapSingleJobToActiveJobDetails = (
  job: any,
): ActiveJobDetails => {
  const trades = Array.isArray(job?.trades) ? job.trades.map(formatTrade) : [];
  const employerProfile = job?.employerAuth?.profile;

  return {
    title: job?.title ?? DEFAULT_ACTIVE_JOB_DETAILS.title,
    company: employerProfile?.name ?? DEFAULT_ACTIVE_JOB_DETAILS.company,
    statusBadge: job?.status ?? DEFAULT_ACTIVE_JOB_DETAILS.statusBadge,
    location: getLocationLabel(job),
    team: `${job?.workersNeeded?.[0]?.howMany ?? "No"} workers needed`,
    duration: `${formatDate(job?.startDate)} - ${formatDate(job?.endDate)}`,
    contactName: employerProfile?.name ?? DEFAULT_ACTIVE_JOB_DETAILS.contactName,
    contactTitle: trades.length ? trades.join(", ") : "Employer",
    contactEmail: job?.employerAuth?.email ?? DEFAULT_ACTIVE_JOB_DETAILS.contactEmail,
    contactPhone: DEFAULT_ACTIVE_JOB_DETAILS.contactPhone,
    startDate: formatDate(job?.startDate),
    endDate: formatDate(job?.endDate),
    hours: getWorkingHoursLabel(job?.workingHours),
    daysPerWeek: getDaysPerWeekLabel(job?.workingHours),
    nextInvoice: DEFAULT_ACTIVE_JOB_DETAILS.nextInvoice,
    isReviewed: job?.isReviewed ?? false,
    jobCompletion: job?.jobCompletion,
  };
};
