import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/worker/my-jobs/MyJobToggleChips";
import JobsList from "@/components/modules/worker/my-jobs/JobsList";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Headphones } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import ScreenHeader from "@/components/layout/ScreenHeader";

export default function MyJobsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  // Support Modal State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (
      requestedTab === "active" ||
      requestedTab === "completed" ||
      requestedTab === "cancelled"
    ) {
      setActiveTab(requestedTab === "cancelled" ? "completed" : requestedTab);
    }
  }, [tab]);

  const handleOpenJobDetails = (id: string, status: string) => {
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
        className="flex-1 px-5 pt-6"
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
        <MyJobToggleChips activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Jobs List */}
        <JobsList
          handleOpenJobDetails={handleOpenJobDetails}
          activeTab={activeTab}
        />
      </ScrollView>

      {/* <TouchableOpacity
        onPress={() => {
          setSupportModalState("form");
          setShowSupportModal(true);
        }}
        style={{ backgroundColor: Colors.common.BRAND }}
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full items-center justify-center active:opacity-90 z-20"
      >
        <Headphones size={24} color="#FFFFFF" />
      </TouchableOpacity> */}

      {/* Message Support Modal */}
      {/* <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
      /> */}
    </ScreenWrapper>
  );
}
