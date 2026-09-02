import { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/worker/my-jobs/MyJobToggleChips";
import AppliedJobsList from "@/components/modules/worker/my-jobs/AppliedJobsList";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
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

export default function MyJobsScreen() {
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

  return (
    <ScreenWrapper>
      {/* Header */}
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={appliedJobsQuery.isFetching}
            onRefresh={() => void refreshAppliedJobs()}
          />
        }
      >
        {/* Search / Filter Input */}
        <SearchAndFilterInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          shouldHideFilters
        />

        {/* Toggle Chips */}
        <MyJobToggleChips
          tabOptions={tabOptions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Jobs List */}
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
      </ScrollView>
    </ScreenWrapper>
  );
}
