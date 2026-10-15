import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
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
import {
  JobCard,
  JobStatus,
  JobTab,
  ProjectCard,
  ProjectForm,
  ProjectJob,
  ProjectJobDateRange,
  ProjectJobForm,
} from "@/types";
import { useDeleteJobMutation, useGetMyJobsQuery } from "@/store/api/jobApi";
import { getHasNextPage, getJobItems, mapJobToCard } from "@/utils/jobList";
import { useGetEmployerProfileQuery } from "@/store/api/employerProfileApi";

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

export default function EmployerMyJobsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<JobTab>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const trimmedSearchQuery = searchQuery.trim();
  const requestedStatus =
    activeTab === "upcoming"
      ? "POSTED"
      : (activeTab.toUpperCase() as "ACTIVE" | "COMPLETED");
  const jobsQuery = useGetMyJobsQuery({
    page,
    limit: 10,
    status: requestedStatus,
    ...(trimmedSearchQuery ? { searchTerm: trimmedSearchQuery } : {}),
  });
  const [deleteJob] = useDeleteJobMutation();
  const {
    data: GetEmployerProfile,
    isLoading,
    isError,
    error,
  } = useGetEmployerProfileQuery();
  const employer = GetEmployerProfile?.data;
  const employerProfileName = employer?.profile?.name;

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

  useEffect(() => {
    setPage(1);
    setJobs([]);
  }, [activeTab, trimmedSearchQuery]);

  // console.log("jobsQuery: ", jobsQuery);

  useEffect(() => {
    if (!jobsQuery.data || (page > 1 && jobsQuery.isFetching)) return;
    // console.log("Jobs data: ", jobsQuery.data);
    const nextJobs = getJobItems(jobsQuery.data).map(mapJobToCard);
    setJobs((current) => (page === 1 ? nextJobs : [...current, ...nextJobs]));
    setHasNextPage(getHasNextPage(jobsQuery.data, nextJobs.length, 10));
  }, [jobsQuery.data, page]);

  const refreshJobs = async () => {
    setRefreshing(true);

    try {
      if (page !== 1) {
        setPage(1);
        return;
      }

      await jobsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const openJobDetails = (jobId: string, status: JobStatus = activeTab) => {
    if (status === "upcoming") {
      router.push({
        pathname: "/screens/new-jobs/[id]",
        params: { id: jobId, origin: "employer" },
      });
      return;
    }
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

  const editJob = (jobId: string) => router.push({ pathname: "/screens/job/UpdateJobPost", params: { id: jobId, mode: "edit" } } as any);
  const removeJob = async (jobId: string) => {
    if (!globalThis.confirm?.("Delete this job posting?")) return;
    await deleteJob(jobId).unwrap();
    void jobsQuery.refetch();
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

  const renderListHeader = () => (
    <View>
      <SearchAndFilterInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shouldHideFilters
      />

      <MyJobToggleChips activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );

  const renderJobCard = ({ item }: { item: JobCard }) => {
    console.log("item: ", item);
    if (activeTab === "upcoming") {
      return (
        <MyJobUpcomingCards
          job={item}
          openJobDetails={openJobDetails}
          onEdit={editJob}
          onDelete={removeJob}
          user={employerProfileName}
        />
      );
    }

    if (activeTab === "active") {
      return (
        <MyJobActiveCards
          job={item}
          openJobDetails={openJobDetails}
          user={employerProfileName}
        />
      );
    }

    return (
      <MyJobCompletedOrCanceledCards
        job={item}
        openJobDetails={openJobDetails}
        user={employerProfileName}
      />
    );
  };

  const renderEmptyState = () => {
    if (jobsQuery.isFetching) {
      return (
        <View className="mt-6 items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-sm">
          <ActivityIndicator color="#FF5500" />
        </View>
      );
    }

    return (
      <View className="mt-6 bg-white rounded-2xl border border-neutral-100 shadow-sm px-5 py-8 items-center">
        <Text className="text-neutral-900 text-base font-bold">
          No jobs found
        </Text>
        <Text className="text-neutral-500 text-sm mt-2 text-center">
          Try a different search or switch tabs.
        </Text>
      </View>
    );
  };

  const renderListFooter = () => (
    <View className="mt-4">
      {hasNextPage && !jobsQuery.isFetching && (
        <TouchableOpacity
          onPress={() => setPage((current) => current + 1)}
          className="items-center rounded-xl bg-white px-5 py-4"
        >
          <Text className="font-bold text-neutral-900">Load more jobs</Text>
        </TouchableOpacity>
      )}
      {jobsQuery.isFetching && jobs.length > 0 ? (
        <ActivityIndicator color="#FF5500" />
      ) : null}
    </View>
  );

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <FlatList
        className="flex-1 px-5 pt-5"
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshJobs}
        onEndReached={() => {
          if (hasNextPage && !jobsQuery.isFetching) {
            setPage((current) => current + 1);
          }
        }}
        onEndReachedThreshold={0.35}
      />

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
