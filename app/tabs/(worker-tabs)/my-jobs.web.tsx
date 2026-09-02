import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, BriefcaseBusiness } from "lucide-react-native";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/worker/my-jobs/MyJobToggleChips";
import AppliedJobsList from "@/components/modules/worker/my-jobs/AppliedJobsList";
import { Colors } from "@/constants/Colors";
import { useGetAppliedJobsQuery } from "@/store/api/jobApplicationApi";
import {
  AppliedJobApplication,
  getAppliedJobApplications,
  getAppliedJobsHasNextPage,
} from "@/utils/jobApplications";

const tabOptions = ["My Offers", "My Applications", "Active Jobs", "Completed"];
const tabByQueryParam: Record<string, string> = {
  offers: "My Offers",
  offer: "My Offers",
  applications: "My Applications",
  application: "My Applications",
  confirmed: "Active Jobs",
  active: "Active Jobs",
  completed: "Completed",
  cancelled: "Completed",
};

export default function MyJobsWebScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<string>(tabOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<AppliedJobApplication[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const appliedJobsQuery = useGetAppliedJobsQuery({ page, limit: 10 });

  useEffect(() => {
    if (!appliedJobsQuery.data || (page > 1 && appliedJobsQuery.isFetching)) {
      return;
    }

    const nextApplications = getAppliedJobApplications(appliedJobsQuery.data);
    setApplications((current) => {
      if (page === 1) return nextApplications;

      const existingIds = new Set(current.map((application) => application.id));
      return [
        ...current,
        ...nextApplications.filter((application) => !existingIds.has(application.id)),
      ];
    });
    setHasNextPage(getAppliedJobsHasNextPage(appliedJobsQuery.data, nextApplications.length, 10));
  }, [appliedJobsQuery.data, appliedJobsQuery.isFetching, page]);

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (requestedTab && tabByQueryParam[requestedTab]) {
      setActiveTab(tabByQueryParam[requestedTab]);
    }
  }, [tab]);

  const handleOpenJobDetails = (id: string, status: string) => {
    router.push({
      pathname: "/screens/job/[id]",
      params: { id, applicationStatus: status },
    } as any);
  };

  const refreshAppliedJobs = async () => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    await appliedJobsQuery.refetch();
  };

  const browseJobs = () => {
    router.push("/tabs/(worker-tabs)/jobs" as any);
  };

  const pageTitle = useMemo(
    () =>
      activeTab === "My Offers"
        ? "Job offers"
        : activeTab === "My Applications"
          ? "My applications"
          : activeTab === "Active Jobs"
            ? "Confirmed jobs"
            : "Completed jobs",
    [activeTab],
  );

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 108 }}
        refreshControl={
          <RefreshControl
            refreshing={appliedJobsQuery.isFetching}
            onRefresh={() => void refreshAppliedJobs()}
          />
        }
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
                        Track your work from one desktop-ready page.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        Review active jobs, completed work, and cancellations in
                        the same flow as mobile, with a cleaner layout for web.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={browseJobs}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 self-start rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 lg:self-auto"
                  >
                    <BriefcaseBusiness size={18} color="#111827" />
                    <Text className="text-sm font-bold text-neutral-900">
                      Browse jobs
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

              <MyJobToggleChips
                tabOptions={tabOptions}
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
                  onPress={browseJobs}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-1.5"
                >
                  <Text className="text-sm font-medium text-neutral-500">
                    Back to jobs
                  </Text>
                  <ArrowRight size={16} color="#737373" />
                </TouchableOpacity>
              </View>

              <AppliedJobsList
                applications={applications}
                activeTab={activeTab}
                searchQuery={searchQuery}
                onOpenJobDetails={handleOpenJobDetails}
                isLoading={appliedJobsQuery.isLoading || (appliedJobsQuery.isFetching && applications.length === 0)}
                isError={appliedJobsQuery.isError}
                isFetching={appliedJobsQuery.isFetching}
                hasNextPage={hasNextPage}
                onLoadMore={() => setPage((current) => current + 1)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
