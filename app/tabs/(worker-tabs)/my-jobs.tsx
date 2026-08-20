import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/worker/my-jobs/MyJobToggleChips";
import JobsList from "@/components/modules/worker/my-jobs/JobsList";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";

const tabOptions = ["Job Offers", "Confirmed Jobs", "Completed"];

export default function MyJobsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<string>(tabOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (
      requestedTab === "confirmed" ||
      requestedTab === "offers" ||
      requestedTab === "completed" ||
      requestedTab === "cancelled" ||
      requestedTab === "active"
    ) {
      if (requestedTab === "offers") {
        setActiveTab("Job Offers");
        return;
      }

      if (requestedTab === "confirmed" || requestedTab === "active") {
        setActiveTab("Confirmed");
        return;
      }

      setActiveTab("Completed");
    }
  }, [tab]);

  const handleOpenJobDetails = (id: string, status: string) => {
    if (status === "offer") {
      router.push(`/screens/employer-details/${id}` as any);
      return;
    }

    if (status === "completed") {
      router.push({
        pathname: "/screens/completed-jobs/[id]",
        params: { id, origin: "worker", status },
      });
    } else if (status === "cancelled") {
      router.push({
        pathname: "/screens/cancelled-jobs/[id]",
        params: { id, origin: "worker", status },
      });
    } else {
      router.push({
        pathname: "/screens/active-jobs/[id]",
        params: { id, origin: "worker", status },
      });
    }
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
        <JobsList
          handleOpenJobDetails={handleOpenJobDetails}
          activeTab={activeTab}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
