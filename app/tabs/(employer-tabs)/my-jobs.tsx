import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  MapPin,
  Plus,
  X,
} from "lucide-react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import StandardDateInput from "@/components/standard_ui/form_fields/StandardDateInput";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/employer/my-jobs/MyJobToggleChips";
import MyJobActiveCards from "@/components/modules/employer/my-jobs/MyJobActiveCards";
import MyJobUpcomingCards from "@/components/modules/employer/my-jobs/MyJobUpcomingCards";
import MyJobCompletedOrCanceledCards from "@/components/modules/employer/my-jobs/MyJobCompletedOrCanceledCards";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { Colors } from "@/constants/Colors";

type JobStatus = "active" | "upcoming" | "completed" | "cancelled";
type JobTab = "active" | "upcoming" | "completed";

type JobCard = {
  id: string;
  title: string;
  company: string;
  badge: string;
  location: string;
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

type ProjectJob = {
  id: string;
  tradeSkill: string;
  daysRequired: string;
  hourlyRate: string;
  workBrief: string;
};

type ProjectCard = {
  id: string;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  jobs: ProjectJob[];
};

type ProjectForm = {
  name: string;
  address: string;
  startDate: Date | null;
  endDate: Date | null;
};

type ProjectJobForm = {
  tradeSkill: string;
  hourlyRate: string;
  workBrief: string;
};

type ProjectJobDateRange = {
  from?: Date;
  to?: Date;
};

const EMPTY_PROJECT_FORM: ProjectForm = {
  name: "",
  address: "",
  startDate: null,
  endDate: null,
};

const EMPTY_PROJECT_JOB_FORM: ProjectJobForm = {
  tradeSkill: "",
  hourlyRate: "",
  workBrief: "",
};

const TRADE_OPTIONS = [
  { label: "Groundworker", value: "Groundworker" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Bricklayer", value: "Bricklayer" },
  { label: "Painter", value: "Painter" },
  { label: "Scaffolder", value: "Scaffolder" },
];

const formatProjectDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatProjectJobDateRange = (range: ProjectJobDateRange) => {
  if (!range.from && !range.to) {
    return "Select required days";
  }

  if (range.from && !range.to) {
    return formatProjectDate(range.from);
  }

  if (!range.from && range.to) {
    return formatProjectDate(range.to);
  }

  return `${formatProjectDate(range.from as Date)} - ${formatProjectDate(
    range.to as Date,
  )}`;
};

const ACTIVE_JOBS: JobCard[] = [
  {
    id: "active-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 Application",
  },
  {
    id: "active-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 Application",
  },
  {
    id: "active-3",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 Application",
  },
];

const UPCOMING_JOBS: JobCard[] = [
  {
    id: "upcoming-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "120",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "upcoming",
    rate: "Market Rate",
    applicants: [
      {
        id: "1",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "2",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "3",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
    ],
  },
  {
    id: "upcoming-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "80",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "upcoming",
    rate: "Market Rate",
    applicants: [
      {
        id: "1",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "2",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "3",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
    ],
  },
];

const COMPLETED_JOBS: JobCard[] = [
  {
    id: "completed-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 20 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "completed",
  },
  {
    id: "completed-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 20 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "completed",
  },
];

const CANCELLED_JOBS: JobCard[] = [
  {
    id: "cancelled-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Cancelled",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "cancelled",
  },
];

export default function EmployerMyJobsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<JobTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showProjectJobModal, setShowProjectJobModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [projectForm, setProjectForm] =
    useState<ProjectForm>(EMPTY_PROJECT_FORM);
  const [projectJobForm, setProjectJobForm] = useState<ProjectJobForm>(
    EMPTY_PROJECT_JOB_FORM,
  );
  const [projectJobDateRange, setProjectJobDateRange] =
    useState<ProjectJobDateRange>({});

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (
      requestedTab === "active" ||
      requestedTab === "upcoming" ||
      requestedTab === "completed" ||
      requestedTab === "cancelled"
    ) {
      setActiveTab(requestedTab === "cancelled" ? "completed" : requestedTab);
    }
  }, [tab]);

  const jobsByTab: Record<JobTab, JobCard[]> = {
    active: ACTIVE_JOBS,
    upcoming: UPCOMING_JOBS,
    completed: [...COMPLETED_JOBS, ...CANCELLED_JOBS],
  };

  const filteredJobs = jobsByTab[activeTab].filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const haystack = [
      job.title,
      job.company,
      job.location,
      job.team,
      job.duration,
      job.badge,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const openJobDetails = (jobId: string, status: JobStatus = activeTab) => {
    if (status === "completed") {
      router.push({
        pathname: "/screens/completed-jobs/[id]",
        params: { id: jobId, origin: "employer", status },
      });
      return;
    }

    if (status === "cancelled") {
      router.push({
        pathname: "/screens/cancelled-jobs/[id]",
        params: { id: jobId, origin: "employer", status },
      });
      return;
    }

    router.push({
      pathname: "/screens/active-jobs/[id]",
      params: { id: jobId, origin: "employer", status },
    });
  };

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );

  const openProjectDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowProjectDetail(true);
  };

  const resetProjectForm = () => {
    setProjectForm(EMPTY_PROJECT_FORM);
  };

  const resetProjectJobForm = () => {
    setProjectJobForm(EMPTY_PROJECT_JOB_FORM);
    setProjectJobDateRange({});
  };

  const createProject = () => {
    const name = projectForm.name.trim();
    const address = projectForm.address.trim();
    const startDate = projectForm.startDate;
    const endDate = projectForm.endDate;

    if (!name || !address || !startDate || !endDate) {
      return;
    }

    const project: ProjectCard = {
      id: `project-${Date.now()}`,
      name,
      address,
      startDate: formatProjectDate(startDate),
      endDate: formatProjectDate(endDate),
      jobs: [],
    };

    setProjects((current) => [project, ...current]);
    setSelectedProjectId(project.id);
    setShowProjectModal(false);
    setShowProjectDetail(true);
    resetProjectForm();
  };

  const createProjectJob = () => {
    if (!selectedProjectId) {
      return;
    }

    const tradeSkill = projectJobForm.tradeSkill.trim();
    const hourlyRate = projectJobForm.hourlyRate.trim();
    const workBrief = projectJobForm.workBrief.trim();

    if (
      !tradeSkill ||
      !hourlyRate ||
      !workBrief ||
      !projectJobDateRange.from ||
      !projectJobDateRange.to
    ) {
      return;
    }

    const job: ProjectJob = {
      id: `project-job-${Date.now()}`,
      tradeSkill,
      hourlyRate,
      workBrief,
      daysRequired: formatProjectJobDateRange(projectJobDateRange),
    };

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProjectId
          ? { ...project, jobs: [job, ...project.jobs] }
          : project,
      ),
    );
    setShowProjectJobModal(false);
    resetProjectJobForm();
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Search & Filter Input */}
        <SearchAndFilterInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          shouldHideFilters
        />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowProjectModal(true)}
          className="mb-6 flex-row items-center justify-center gap-2 rounded-2xl py-4"
          style={{ backgroundColor: '#202020' }}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text className="text-sm font-extrabold text-white">
            Start a project
          </Text>
        </TouchableOpacity>

        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-neutral-950 text-base font-extrabold">
              My Projects
            </Text>
            <Text className="text-neutral-400 text-xs font-bold">
              Company &gt; Project &gt; Job
            </Text>
          </View>

          {projects.length > 0 ? (
            <View className="gap-3">
              {projects.map((project) => (
                <ProjectSummaryCard
                  key={project.id}
                  project={project}
                  onPress={() => openProjectDetail(project.id)}
                />
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-5">
              <Text className="text-sm font-bold text-neutral-900">
                No projects yet
              </Text>
              <Text className="mt-1 text-xs leading-5 text-neutral-500">
                Start a project first, then create job postings inside it.
              </Text>
            </View>
          )}
        </View>

        <MyJobToggleChips activeTab={activeTab} setActiveTab={setActiveTab} />

        <View className="mt-6 gap-4">
          {activeTab === "active" && (
            <MyJobActiveCards
              filteredJobs={filteredJobs}
              openJobDetails={openJobDetails}
            />
          )}

          {activeTab === "upcoming" && (
            <MyJobUpcomingCards
              filteredJobs={filteredJobs}
              openJobDetails={openJobDetails}
            />
          )}

          {activeTab === "completed" && (
            <MyJobCompletedOrCanceledCards
              filteredJobs={filteredJobs}
              openJobDetails={openJobDetails}
            />
          )}

          {filteredJobs.length === 0 && (
            <View className="bg-white rounded-2xl border border-neutral-100 shadow-sm px-5 py-8 items-center">
              <Text className="text-neutral-900 text-base font-bold">
                No jobs found
              </Text>
              <Text className="text-neutral-500 text-sm mt-2 text-center">
                Try a different search or switch tabs.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <StartProjectModal
        visible={showProjectModal}
        projectForm={projectForm}
        setProjectForm={setProjectForm}
        onClose={() => {
          setShowProjectModal(false);
          resetProjectForm();
        }}
        onCreate={createProject}
      />

      <ProjectDetailModal
        visible={showProjectDetail}
        project={selectedProject}
        onClose={() => setShowProjectDetail(false)}
        onCreateJob={() => {
          setShowProjectDetail(false);
          setShowProjectJobModal(true);
        }}
      />

      <ProjectJobModal
        visible={showProjectJobModal}
        project={selectedProject}
        jobForm={projectJobForm}
        setJobForm={setProjectJobForm}
        dateRange={projectJobDateRange}
        setDateRange={setProjectJobDateRange}
        onClose={() => {
          setShowProjectJobModal(false);
          resetProjectJobForm();
        }}
        onCreate={createProjectJob}
      />
    </ScreenWrapper>
  );
}

function ProjectSummaryCard({
  project,
  onPress,
}: {
  project: ProjectCard;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
    >
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
          <BriefcaseBusiness size={18} color={Colors.common.BRAND} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-extrabold text-neutral-950">
                {project.name}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-neutral-500">
                {project.startDate} - {project.endDate}
              </Text>
            </View>

            <View className="rounded-full bg-neutral-100 px-3 py-1">
              <Text className="text-[10px] font-bold text-neutral-600">
                {project.jobs.length} jobs
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <MapPin size={14} color="#737373" />
            <Text className="flex-1 text-xs font-medium text-neutral-600">
              {project.address}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StartProjectModal({
  visible,
  projectForm,
  setProjectForm,
  onClose,
  onCreate,
}: {
  visible: boolean;
  projectForm: ProjectForm;
  setProjectForm: React.Dispatch<React.SetStateAction<ProjectForm>>;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title="Start a project" onClose={onClose} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            <ProjectInput
              label="Project name"
              placeholder="e.g. Hoxton Street Refurb"
              value={projectForm.name}
              onChangeText={(name) =>
                setProjectForm((current) => ({ ...current, name }))
              }
            />
            <ProjectInput
              label="Address"
              placeholder="Site address"
              value={projectForm.address}
              onChangeText={(address) =>
                setProjectForm((current) => ({ ...current, address }))
              }
            />
            <View className="flex-row gap-3">
              <ProjectDateInput
                label="Start date"
                placeholder="10 Aug"
                date={projectForm.startDate}
                onDateChange={(startDate) =>
                  setProjectForm((current) => ({ ...current, startDate }))
                }
                containerClassName="flex-1"
              />
              <ProjectDateInput
                label="End date"
                placeholder="21 Aug"
                date={projectForm.endDate}
                onDateChange={(endDate) =>
                  setProjectForm((current) => ({ ...current, endDate }))
                }
                containerClassName="flex-1"
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreate}
          className="mt-6 items-center justify-center rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
        >
          <Text className="text-sm font-extrabold text-white">
            Create project
          </Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}

function ProjectDetailModal({
  visible,
  project,
  onClose,
  onCreateJob,
}: {
  visible: boolean;
  project?: ProjectCard;
  onClose: () => void;
  onCreateJob: () => void;
}) {
  if (!project) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title={project.name} onClose={onClose} />

        <View className="rounded-2xl bg-neutral-50 p-4">
          <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-neutral-400">
            Company
          </Text>
          <Text className="mt-1 text-sm font-bold text-neutral-950">
            Tech Innovators Inc.
          </Text>
          <Text className="mt-4 text-[10px] font-extrabold uppercase tracking-[1px] text-neutral-400">
            Project
          </Text>
          <Text className="mt-1 text-sm font-semibold text-neutral-600">
            {project.address}
          </Text>
          <Text className="mt-1 text-xs font-medium text-neutral-500">
            {project.startDate} - {project.endDate}
          </Text>
        </View>

        <View className="mt-5">
          <Text className="mb-3 text-sm font-extrabold text-neutral-950">
            Job postings
          </Text>

          {project.jobs.length > 0 ? (
            <View className="gap-3">
              {project.jobs.map((job) => (
                <View
                  key={job.id}
                  className="rounded-2xl border border-neutral-100 bg-white p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-extrabold text-neutral-950">
                        {job.tradeSkill}
                      </Text>
                      <Text className="mt-1 text-xs text-neutral-500">
                        {job.daysRequired}
                      </Text>
                    </View>
                    <Text className="text-sm font-extrabold text-neutral-950">
                      GBP {job.hourlyRate}/hr
                    </Text>
                  </View>
                  <Text className="mt-3 text-xs leading-5 text-neutral-600">
                    {job.workBrief}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="rounded-2xl border border-dashed border-neutral-200 p-4 text-xs leading-5 text-neutral-500">
              No job postings yet. Create one under this project.
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreateJob}
          className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.BRAND }}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text className="text-sm font-extrabold text-white">
            Create job posting
          </Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}

function ProjectJobModal({
  visible,
  project,
  jobForm,
  setJobForm,
  dateRange,
  setDateRange,
  onClose,
  onCreate,
}: {
  visible: boolean;
  project?: ProjectCard;
  jobForm: ProjectJobForm;
  setJobForm: React.Dispatch<React.SetStateAction<ProjectJobForm>>;
  dateRange: ProjectJobDateRange;
  setDateRange: React.Dispatch<React.SetStateAction<ProjectJobDateRange>>;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const calendarStyles = useDefaultStyles();

  if (!project) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title="Create job posting" onClose={onClose} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="mb-4 text-xs font-semibold text-neutral-500">
            {project.name} &gt; Job
          </Text>

          <View className="gap-4">
            <TradeSkillDropdown
              value={jobForm.tradeSkill}
              open={tradeMenuOpen}
              setOpen={setTradeMenuOpen}
              onSelect={(tradeSkill) =>
                setJobForm((current) => ({ ...current, tradeSkill }))
              }
            />

            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <CalendarDays size={15} color="#737373" />
                <Text className="text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
                  Days required
                </Text>
              </View>
              <View className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3">
                <View className="mb-3 flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {formatProjectJobDateRange(dateRange)}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setDateRange({})}
                  >
                    <Text className="text-xs font-bold text-[#FF5500]">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  mode="range"
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  onChange={({ startDate, endDate }) =>
                    setDateRange({
                      from: startDate ? new Date(startDate as any) : undefined,
                      to: endDate ? new Date(endDate as any) : undefined,
                    })
                  }
                  containerStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  className="w-full rounded-2xl bg-neutral-50"
                  minDate={new Date()}
                  firstDayOfWeek={1}
                  showOutsideDays
                  calendar="gregory"
                  containerHeight={300}
                  navigationPosition="around"
                  styles={{
                    ...calendarStyles,
                    header: {
                      marginBottom: 12,
                    },
                    month_selector_label: {
                      color: "#111827",
                      fontSize: 15,
                      fontWeight: "800",
                    },
                    year_selector_label: {
                      color: "#111827",
                      fontSize: 15,
                      fontWeight: "800",
                    },
                    button_prev: {
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.common.BRAND_LIGHT,
                    },
                    button_next: {
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.common.BRAND_LIGHT,
                    },
                    button_prev_image: {
                      tintColor: Colors.common.BRAND,
                      width: 15,
                      height: 15,
                    },
                    button_next_image: {
                      tintColor: Colors.common.BRAND,
                      width: 15,
                      height: 15,
                    },
                    day_cell: {
                      minHeight: 44,
                    },
                    day_label: {
                      color: "#262626",
                      fontWeight: "600",
                    },
                    outside_label: {
                      color: "#A3A3A3",
                    },
                    disabled_label: {
                      color: "#D4D4D4",
                    },
                    weekday_label: {
                      color: "#8A8A8A",
                      fontSize: 11,
                      fontWeight: "700",
                    },
                    selected: {
                      backgroundColor: Colors.common.BRAND,
                      borderRadius: 12,
                    },
                    selected_label: { color: "#FFFFFF", fontWeight: "800" },
                    range_start: {
                      backgroundColor: Colors.common.BRAND,
                      borderRadius: 12,
                    },
                    range_start_label: {
                      color: "#FFFFFF",
                      fontWeight: "800",
                    },
                    range_end: {
                      backgroundColor: Colors.common.BRAND,
                      borderRadius: 12,
                    },
                    range_end_label: {
                      color: "#FFFFFF",
                      fontWeight: "800",
                    },
                    range_middle: {
                      backgroundColor: "transparent",
                      borderRadius: 0,
                    },
                    range_middle_label: {
                      color: Colors.common.BRAND,
                      fontWeight: "700",
                    },
                    range_fill: {
                      backgroundColor: "#FFE4D6",
                    },
                    range_fill_weekstart: {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    range_fill_weekend: {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                    today: {
                      borderColor: Colors.common.BRAND,
                      borderWidth: 1,
                    },
                    today_label: {
                      color: Colors.common.BRAND,
                      fontWeight: "800",
                    },
                  }}
                />
              </View>
            </View>

            <ProjectInput
              label="Hourly rate"
              placeholder="24"
              value={jobForm.hourlyRate}
              onChangeText={(hourlyRate) =>
                setJobForm((current) => ({ ...current, hourlyRate }))
              }
              keyboardType="numeric"
            />
            <ProjectInput
              label="Work brief"
              placeholder="Describe the work needed"
              value={jobForm.workBrief}
              onChangeText={(workBrief) =>
                setJobForm((current) => ({ ...current, workBrief }))
              }
              multiline
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreate}
          className="mt-6 items-center justify-center rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
        >
          <Text className="text-sm font-extrabold text-white">Post job</Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}

function ModalFrame({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <View
      className="flex-1 justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      <Pressable className="flex-1" onPress={onClose} />
      <View className="max-h-[86%] rounded-t-[28px] bg-white p-5 pb-8 shadow-2xl">
        {children}
      </View>
    </View>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <View className="mb-5 flex-row items-center justify-between gap-4">
      <Text className="flex-1 text-lg font-extrabold text-neutral-950">
        {title}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
      >
        <X size={17} color="#333333" />
      </TouchableOpacity>
    </View>
  );
}

function ProjectInput({
  label,
  placeholder,
  value,
  onChangeText,
  containerClassName = "",
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  containerClassName?: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
}) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
        {label}
      </Text>
      <View className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          className={`text-sm font-semibold text-neutral-900 ${
            multiline ? "min-h-[90px]" : "py-0"
          }`}
        />
      </View>
    </View>
  );
}

function ProjectDateInput({
  label,
  placeholder,
  date,
  onDateChange,
  containerClassName = "",
}: {
  label: string;
  placeholder: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  containerClassName?: string;
}) {
  return (
    <View className={containerClassName}>
      <StandardDateInput
        label={label}
        date={date}
        onDateChange={
          ((nextDate) => {
            onDateChange(
              typeof nextDate === "function" ? nextDate(date) : nextDate,
            );
          }) as React.Dispatch<React.SetStateAction<Date | null>>
        }
        placeholder={placeholder}
        inputContainerStyle={{ marginBottom: 0 }}
        inputStyle={{
          backgroundColor: "#FAFAFA",
          borderRadius: 16,
          borderColor: "#E5E5E5",
          fontSize: 14,
          fontWeight: "600",
          paddingHorizontal: 12
        }}
      />
    </View>
  );
}

function TradeSkillDropdown({
  value,
  open,
  setOpen,
  onSelect,
}: {
  value: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (tradeSkill: string) => void;
}) {
  return (
    <View>
      <Text className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
        Trade / Skill
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen((current) => !current)}
        className="h-[50px] flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4"
      >
        <Text
          className={`text-sm font-semibold ${
            value ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          {value || "Select trade / skill"}
        </Text>
        <ChevronDown size={18} color="#999999" />
      </TouchableOpacity>

      {open ? (
        <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {TRADE_OPTIONS.map((option) => {
            const selected = value === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`min-h-[48px] justify-center px-4 ${
                  selected ? "bg-[#FFF5F2]" : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected
                      ? "font-bold text-[#FF5500]"
                      : "font-medium text-neutral-800"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
