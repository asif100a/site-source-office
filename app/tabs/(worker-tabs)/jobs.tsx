import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import TappableSearchTriggerBar from "@/components/modules/worker/offers/TappableSearchTriggerBar";
import CategoryToggles from "@/components/modules/worker/offers/CategoryToggles";
import VerticalJobListings, {
  type WorkerJobItem,
} from "@/components/modules/worker/offers/VerticalJobListings";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import VerticalOfferListings from "@/components/modules/worker/offers/VerticalOfferListings";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import { getAllJobItems, mapApiJobToWorkerJobItem } from "@/utils/workerJobs";

export default function WorkerJobsTabLanding() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"browse" | "offers">(
    "browse",
  );
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);
  const allJobsQuery = useGetAllJobsQuery({
    page: 1,
    limit: 10,
    status: "POSTED",
  });
  const browseJobs = getAllJobItems(allJobsQuery.data).map(
    mapApiJobToWorkerJobItem,
  );

  const handleOpenSearch = () => {
    router.push({
      pathname: "/screens/search/SearchEmployer",
      params: { origin: "worker" },
    } as any);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  const handleOpenDetailsModal = (job: WorkerJobItem) => {
    setSelectedJob(job);
  };

  const handleCloseDetailsModal = () => {
    setSelectedJob(null);
  };

  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const handleAcceptOffer = (id: string) => {
    console.log("Accepting offer:", id);
  };

  const toggleFavoriteJob = (id: string) => {
    setFavoriteJobIds((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id],
    );
  };

  return (
    <ScreenWrapper>
      {/* Screen Header */}
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Tappable Search Trigger Bar */}
        <TappableSearchTriggerBar handleOpenSearch={handleOpenSearch} />

        {/* Category Toggles (navigates/triggers search view) */}
        <CategoryToggles
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Featured Listings Header */}
        <View className="flex-row justify-between items-center mt-8 mb-4">
          <Text className="flex-1 text-neutral-900 font-extrabold text-lg tracking-tight">
            Local Jobs
          </Text>
          <TouchableOpacity
            onPress={handleOpenSearch}
            className="flex-row items-center"
          >
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-extrabold mr-1"
            >
              See All
            </Text>
            <ChevronRight size={16} color={Colors.common.BRAND} />
          </TouchableOpacity>
        </View>

        {/* Vertical Job Listings */}
        {activeCategory === "browse" ? (
          allJobsQuery.isLoading ? (
            <View className="rounded-2xl border border-neutral-100 bg-white px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                Loading jobs...
              </Text>
            </View>
          ) : allJobsQuery.isError ? (
            <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load jobs. Please try again.
              </Text>
            </View>
          ) : browseJobs.length ? (
            <VerticalJobListings
              jobs={browseJobs}
              handleViewDetails={handleViewDetails}
              handleApply={handleApply}
              favoriteJobIds={favoriteJobIds}
              onToggleFavorite={toggleFavoriteJob}
              onOpenDetails={handleOpenDetailsModal}
            />
          ) : (
            <View className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                No jobs found.
              </Text>
            </View>
          )
        ) : (
          <VerticalOfferListings
            handleViewDetails={handleViewDetails}
            handleAcceptOffer={handleAcceptOffer}
            favoriteJobIds={favoriteJobIds}
            onToggleFavorite={toggleFavoriteJob}
            onOpenDetails={handleOpenDetailsModal}
          />
        )}
      </ScrollView>
      <JobDetailsBottomSheet
        job={selectedJob}
        visible={!!selectedJob}
        onClose={handleCloseDetailsModal}
        onPrimaryAction={() => {
          handleCloseDetailsModal();
          handleApply();
        }}
      />
    </ScreenWrapper>
  );
}
