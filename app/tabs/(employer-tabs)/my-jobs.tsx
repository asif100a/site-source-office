import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/employer/my-jobs/MyJobToggleChips";
import MyJobActiveCards from "@/components/modules/employer/my-jobs/MyJobActiveCards";
import MyJobUpcomingCards from "@/components/modules/employer/my-jobs/MyJobUpcomingCards";
import MyJobCompletedOrCanceledCards from "@/components/modules/employer/my-jobs/MyJobCompletedOrCanceledCards";
import ScreenHeader from "@/components/layout/ScreenHeader";
import StartProjectModal from "@/components/modules/employer/my-jobs/StartProjectModal";
import ProjectDetailModal from "@/components/modules/employer/my-jobs/ProjectDetailModal";
import ProjectJobModal from "@/components/modules/employer/my-jobs/ProjectJobModal";
import { JobCard, JobStatus, JobTab, ProjectCard, ProjectForm, ProjectJob, ProjectJobDateRange, ProjectJobForm } from "@/types";

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

const formatProjectDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatProjectJobDateRange = (range: ProjectJobDateRange) => {
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

        {/* <TouchableOpacity
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
        </View> */}

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
