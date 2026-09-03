import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import TappableSearchTriggerBar from "@/components/modules/worker/offers/TappableSearchTriggerBar";
import CategoryToggles from "@/components/modules/worker/offers/CategoryToggles";
import VerticalJobListings, {
  type WorkerJobItem,
} from "@/components/modules/worker/offers/VerticalJobListings";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import {
  getAllJobItems,
  getBookmarkedJobItems,
  mapApiJobToWorkerJobItem,
} from "@/utils/workerJobs";
import {
  useCreateJobBookmarkMutation,
  useGetBookmarkJobsQuery,
} from "@/store/api/bookmarkApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";

export default function WorkerJobsTabLanding() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"browse" | "offers">(
    "browse",
  );
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);
  const [bookmarkingJobIds, setBookmarkingJobIds] = useState<string[]>([]);
  const [createJobBookmark] = useCreateJobBookmarkMutation();
  const isAuthenticated = useIsAuthenticated();
  const allJobsQuery = useGetAllJobsQuery({
    page: 1,
    limit: 10,
    status: "POSTED",
  });
  const bookmarkedJobsQuery = useGetBookmarkJobsQuery(
    {
      page: 1,
      limit: 10,
    },
    { skip: !isAuthenticated },
  );
  const browseJobs = getAllJobItems(allJobsQuery.data).map(
    mapApiJobToWorkerJobItem,
  );
  const favoriteJobs = getBookmarkedJobItems(bookmarkedJobsQuery.data).map(
    mapApiJobToWorkerJobItem,
  );
  const bookmarkedJobIdsFromAllJobs = getAllJobItems(allJobsQuery.data)
    .filter((job) => Boolean(job?.hasBookmarked))
    .map((job) => String(job.id ?? job._id));
  const bookmarkedJobIdsFromBookmarks = getBookmarkedJobItems(
    bookmarkedJobsQuery.data,
  ).map((job) => String(job.id ?? job._id));

  useEffect(() => {
    setFavoriteJobIds(
      Array.from(
        new Set([...bookmarkedJobIdsFromAllJobs, ...bookmarkedJobIdsFromBookmarks]),
      ),
    );
  }, [allJobsQuery.data, bookmarkedJobsQuery.data]);

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

  const toggleFavoriteJob = (id: string) => {
    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/tabs/(worker-tabs)/jobs`) as any);
      return;
    }

    if (bookmarkingJobIds.includes(id)) {
      return;
    }

    const wasFavorite = favoriteJobIds.includes(id);

    setFavoriteJobIds((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id],
    );
    setBookmarkingJobIds((current) => [...current, id]);

    void createJobBookmark({ jobId: id })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: wasFavorite ? "Bookmark updated" : "Job bookmarked",
        });
        allJobsQuery.refetch();
        bookmarkedJobsQuery.refetch();
      })
      .catch((error) => {
        setFavoriteJobIds((current) =>
          wasFavorite
            ? Array.from(new Set([...current, id]))
            : current.filter((jobId) => jobId !== id),
        );
        Toast.show({
          type: "error",
          text1: "Bookmark failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      })
      .finally(() => {
        setBookmarkingJobIds((current) =>
          current.filter((jobId) => jobId !== id),
        );
      });
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
          !isAuthenticated ? (
            <View className="rounded-2xl border border-neutral-100 bg-white px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                Login to view your favourite jobs.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(getWorkerLoginRoute(`/tabs/(worker-tabs)/jobs`) as any)
                }
                style={{ backgroundColor: Colors.common.GRAY_DARK }}
                className="mt-4 items-center justify-center rounded-xl px-4 py-3 active:opacity-90"
              >
                <Text className="text-sm font-extrabold text-white">
                  Go to Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : bookmarkedJobsQuery.isLoading ? (
            <View className="rounded-2xl border border-neutral-100 bg-white px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                Loading favourites...
              </Text>
            </View>
          ) : bookmarkedJobsQuery.isError ? (
            <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load favourite jobs. Please try again.
              </Text>
            </View>
          ) : favoriteJobs.length ? (
            <VerticalJobListings
              jobs={favoriteJobs}
              handleViewDetails={handleViewDetails}
              handleApply={handleApply}
              favoriteJobIds={favoriteJobIds}
              onToggleFavorite={toggleFavoriteJob}
              onOpenDetails={handleOpenDetailsModal}
            />
          ) : (
            <View className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                No favourite jobs found.
              </Text>
            </View>
          )
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
