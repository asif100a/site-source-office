import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, BriefcaseBusiness } from "lucide-react-native";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/employer/my-jobs/MyJobToggleChips";
import MyJobActiveCards from "@/components/modules/employer/my-jobs/MyJobActiveCards";
import MyJobUpcomingCards from "@/components/modules/employer/my-jobs/MyJobUpcomingCards";
import MyJobCompletedOrCanceledCards from "@/components/modules/employer/my-jobs/MyJobCompletedOrCanceledCards";
import { Colors } from "@/constants/Colors";
import { JobStatus, JobTab } from "@/types";
import { useGetMyJobsQuery } from "@/store/api/jobApi";
import { getHasNextPage, getJobItems, mapJobToCard } from "@/utils/jobList";

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

export default function EmployerMyJobsScreenWeb() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<JobTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const requestedStatus = activeTab === "upcoming" ? "POSTED" : activeTab.toUpperCase() as "ACTIVE" | "COMPLETED";
  const jobsQuery = useGetMyJobsQuery({ page, limit: 10, status: requestedStatus });

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
  }, [activeTab]);

  useEffect(() => {
    if (!jobsQuery.data || (page > 1 && jobsQuery.isFetching)) return;
    const nextJobs = getJobItems(jobsQuery.data)
      .map(mapJobToCard)
      .filter((job) =>
        activeTab === "upcoming"
          ? job.status === "upcoming"
          : activeTab === "completed"
            ? job.status === "completed" || job.status === "cancelled"
            : job.status === "active",
      );
    setJobs((current) => (page === 1 ? nextJobs : [...current, ...nextJobs]));
    setHasNextPage(getHasNextPage(jobsQuery.data, nextJobs.length, 10));
  }, [activeTab, jobsQuery.data, page]);

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

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
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
  }, [jobs, searchQuery]);

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

  const pageTitle =
    activeTab === "active"
      ? "Active jobs"
      : activeTab === "upcoming"
      ? "New jobs"
        : "Completed jobs";

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-14 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <View className="max-w-3xl gap-3">
                    <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                      <Text className="text-xs font-bold uppercase text-neutral-900">
                        My jobs
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Manage active, upcoming, and completed jobs in one place.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        The same employer job management flow as mobile, arranged
                        in a cleaner desktop layout for faster review and follow-up.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push("/tabs/(employer-tabs)/workers" as any)}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 self-start rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 lg:self-auto"
                  >
                    <BriefcaseBusiness size={18} color="#111827" />
                    <Text className="text-sm font-bold text-neutral-900">
                      Browse workers
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <SearchAndFilterInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                shouldHideFilters
                searchContainerStyle={{
                  paddingVertical: 16
                }}
              />

              <MyJobToggleChips
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mb-5 flex-row items-center justify-between gap-4">
                <Text className="text-lg font-bold tracking-tight text-neutral-900">
                  {pageTitle}
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/tabs/(employer-tabs)/workers" as any)}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-1.5"
                >
                  <Text className="text-sm font-medium text-neutral-500">
                    Back to workers
                  </Text>
                  <ArrowRight size={16} color="#737373" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
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

                {filteredJobs.length === 0 && !jobsQuery.isFetching && (
                  <View className="items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-sm">
                    <Text className="text-base font-bold text-neutral-900">
                      No jobs found
                    </Text>
                    <Text className="mt-2 text-center text-sm text-neutral-500">
                      Try a different search or switch tabs.
                    </Text>
                  </View>
                )}
                {hasNextPage && !jobsQuery.isFetching && (
                  <TouchableOpacity
                    onPress={() => setPage((current) => current + 1)}
                    className="items-center rounded-xl bg-neutral-50 px-5 py-4"
                  >
                    <Text className="font-bold text-neutral-900">Load more jobs</Text>
                  </TouchableOpacity>
                )}
                {jobsQuery.isFetching && jobs.length > 0 ? (
                  <ActivityIndicator color="#FF5500" />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
