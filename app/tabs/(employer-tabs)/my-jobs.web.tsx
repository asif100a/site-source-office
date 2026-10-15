import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, BriefcaseBusiness } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/employer/my-jobs/MyJobToggleChips";
import MyJobActiveCards from "@/components/modules/employer/my-jobs/MyJobActiveCards";
import MyJobUpcomingCards from "@/components/modules/employer/my-jobs/MyJobUpcomingCards";
import MyJobCompletedOrCanceledCards from "@/components/modules/employer/my-jobs/MyJobCompletedOrCanceledCards";
import { Colors } from "@/constants/Colors";
import { JobStatus, JobTab } from "@/types";
import { useDeleteJobMutation, useGetMyJobsQuery } from "@/store/api/jobApi";
import { getHasNextPage, getJobItems, mapJobToCard } from "@/utils/jobList";
import { useGetEmployerProfileQuery } from "@/store/api/employerProfileApi";

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

export default function EmployerMyJobsScreenWeb() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<JobTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const trimmedSearchQuery = searchQuery.trim();
  const requestedStatus =
    activeTab === "upcoming"
      ? "POSTED"
      : activeTab === "active"
        ? "ACTIVE"
        : "COMPLETED";
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

  useEffect(() => {
    if (!jobsQuery.data || (page > 1 && jobsQuery.isFetching)) return;
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

  const pageTitle =
    activeTab === "active"
      ? "Active jobs"
      : activeTab === "upcoming"
        ? "New jobs"
        : "Completed jobs";

  const renderListHeader = () => (
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
                    The same employer job management flow as mobile, arranged in
                    a cleaner desktop layout for faster review and follow-up.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push("/tabs/(employer-tabs)/workers" as any)
                }
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
              paddingVertical: 16,
            }}
          />

          <MyJobToggleChips activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>

        <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-lg font-bold tracking-tight text-neutral-900">
              {pageTitle}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push("/tabs/(employer-tabs)/workers" as any)
              }
              activeOpacity={0.85}
              className="flex-row items-center gap-1.5"
            >
              <Text className="text-sm font-medium text-neutral-500">
                Back to workers
              </Text>
              <ArrowRight size={16} color="#737373" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderJobCard = ({ item }: { item: JobCard }) => {
    let card: React.ReactNode;

    if (activeTab === "active") {
      card = (
        <MyJobActiveCards
          job={item}
          openJobDetails={openJobDetails}
          user={employerProfileName}
        />
      );
    } else if (activeTab === "upcoming") {
      card = (
        <MyJobUpcomingCards
          job={item}
          openJobDetails={openJobDetails}
          onEdit={editJob}
          onDelete={removeJob}
          user={employerProfileName}
        />
      );
    } else {
      card = (
        <MyJobCompletedOrCanceledCards
          job={item}
          openJobDetails={openJobDetails}
          user={employerProfileName}
        />
      );
    }

    return (
      <View className="mx-5 md:mx-8 xl:mx-12">
        <View className="mx-auto w-full max-w-7xl">{card}</View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (jobsQuery.isFetching) {
      return (
        <View className="mx-5 items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-sm md:mx-8 xl:mx-12">
          <View className="mx-auto w-full max-w-7xl items-center">
            <ActivityIndicator color="#FF5500" />
          </View>
        </View>
      );
    }

    return (
      <View className="mx-5 items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-sm md:mx-8 xl:mx-12">
        <View className="mx-auto w-full max-w-7xl items-center">
          <Text className="text-base font-bold text-neutral-900">
            No jobs found
          </Text>
          <Text className="mt-2 text-center text-sm text-neutral-500">
            Try a different search or switch tabs.
          </Text>
        </View>
      </View>
    );
  };

  const renderListFooter = () => (
    <View className="mx-5 mt-4 md:mx-8 xl:mx-12">
      <View className="mx-auto w-full max-w-7xl">
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
  );

  return (
    <ScreenWrapper>
      <FlatList
        className="flex-1"
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshing={refreshing}
        onRefresh={refreshJobs}
        onEndReached={() => {
          if (hasNextPage && !jobsQuery.isFetching) {
            setPage((current) => current + 1);
          }
        }}
        onEndReachedThreshold={0.35}
      />
    </ScreenWrapper>
  );
}
