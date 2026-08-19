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
  | "Closing soon"
  | "Highest paid"
  | "Nearby";

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