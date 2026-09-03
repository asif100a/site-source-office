export interface EmployerJobDetails {
  title: string;
  company: string;
  payRate: string;
  tag: string;
  location: string;
  team: string;
  duration: string;
  time: string;
  tradeSkill: string;
  tradeCount: string;
  employmentType: string;
  jobDuration: string;
  requirements: string;
}

export type ChatOrigin = "worker" | "employer";

export type Message = {
  id: string;
  body: string;
  time: string;
  mine: boolean;
};

export interface ChatThread {
  id: string;
  name: string;
  role: string;
  job: string;
  status: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  messages: Message[];
}

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type WorkerHomeFilter =
  | "All"
  | "Best Match"
  | "Nearby"
  | "Closing Soon"

export type WorkerHomeDateRange = {
  from?: Date;
  to?: Date;
};

export interface WorkerHomeJob {
  id: string;
  title: string;
  company: string;
  area: string;
  distanceMiles: number;
  workersNeeded: number;
  startLabel: string;
  startDate: string;
  posted: string;
  payRatePerDay: number;
  duration: string;
  closingAt: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  mapPosition: {
    top: number;
    left: string;
  };
}

export type WorkerHomeModalFilters = {
  trades: string[];
  maxDistanceMiles: number;
  minRatePerDay: number;
  dateRange: WorkerHomeDateRange;
  sortBy: WorkerHomeFilter;
};

export type ApprovalTab = "timesheets" | "requests";

export interface TimesheetApproval {
  id: string;
  workerId: string;
  workerName: string;
  role: string;
  location: string;
  submittedAt: string;
  weekLabel: string;
  totalHours: string;
};

export type JobStatus = "active" | "upcoming" | "completed" | "cancelled";
export type JobTab = "active" | "upcoming" | "completed";

export interface JobCard {
  id: string;
  title: string;
  company: string;
  badge: string;
  location: string;
  coordinates?: [number, number];
  team: string;
  duration: string;
  status: JobStatus;
  rate?: string;
  applications?: string;
  applicants?: Array<{
    id: string;
    name: string;
    role: string;
    location: string;
    availability: string;
    experience: string;
  }>;
};

export type ProjectJob = {
  id: string;
  tradeSkill: string;
  daysRequired: string;
  hourlyRate: string;
  workBrief: string;
};

export type ProjectCard = {
  id: string;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  jobs: ProjectJob[];
};

export type ProjectForm = {
  name: string;
  address: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ProjectJobForm = {
  tradeSkill: string;
  hourlyRate: string;
  workBrief: string;
};

export type ProjectJobDateRange = {
  from?: Date;
  to?: Date;
};
