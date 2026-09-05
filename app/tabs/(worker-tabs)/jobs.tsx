import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import TappableSearchTriggerBar from "@/components/modules/worker/offers/TappableSearchTriggerBar";
import CategoryToggles from "@/components/modules/worker/offers/CategoryToggles";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import {
  getAllJobsHasNextPage,
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
import LabourerCard from "@/components/card/LabourerCard";

const JOBS_LIMIT = 10;

export default function WorkerJobsTabLanding() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"browse" | "offers">(
    "browse",
  );
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);
  const [bookmarkingJobIds, setBookmarkingJobIds] = useState<string[]>([]);
  const [browsePage, setBrowsePage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [browseJobs, setBrowseJobs] = useState<WorkerJobItem[]>([]);
  const [favoriteJobs, setFavoriteJobs] = useState<WorkerJobItem[]>([]);
  const [browseHasNextPage, setBrowseHasNextPage] = useState(false);
  const [favoriteHasNextPage, setFavoriteHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [createJobBookmark] = useCreateJobBookmarkMutation();
  const isAuthenticated = useIsAuthenticated();
  const allJobsQuery = useGetAllJobsQuery({
    page: browsePage,
    limit: JOBS_LIMIT,
    status: "POSTED",
  });
  const bookmarkedJobsQuery = useGetBookmarkJobsQuery(
    {
      page: favoritePage,
      limit: JOBS_LIMIT,
    },
    { skip: !isAuthenticated },
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
        new Set([
          ...bookmarkedJobIdsFromAllJobs,
          ...bookmarkedJobIdsFromBookmarks,
        ]),
      ),
    );
  }, [allJobsQuery.data, bookmarkedJobsQuery.data]);

  useEffect(() => {
    if (!allJobsQuery.data || (browsePage > 1 && allJobsQuery.isFetching)) {
      return;
    }

    const nextJobs = getAllJobItems(allJobsQuery.data).map(
      mapApiJobToWorkerJobItem,
    );

    setBrowseJobs((current) =>
      browsePage === 1 ? nextJobs : [...current, ...nextJobs],
    );
    setBrowseHasNextPage(
      getAllJobsHasNextPage(allJobsQuery.data, nextJobs.length, JOBS_LIMIT),
    );
  }, [allJobsQuery.data, allJobsQuery.isFetching, browsePage]);

  useEffect(() => {
    if (
      !bookmarkedJobsQuery.data ||
      (favoritePage > 1 && bookmarkedJobsQuery.isFetching)
    ) {
      return;
    }

    const nextJobs = getBookmarkedJobItems(bookmarkedJobsQuery.data).map(
      mapApiJobToWorkerJobItem,
    );

    setFavoriteJobs((current) =>
      favoritePage === 1 ? nextJobs : [...current, ...nextJobs],
    );
    setFavoriteHasNextPage(
      getAllJobsHasNextPage(
        bookmarkedJobsQuery.data,
        nextJobs.length,
        JOBS_LIMIT,
      ),
    );
  }, [bookmarkedJobsQuery.data, bookmarkedJobsQuery.isFetching, favoritePage]);

  const handleOpenSearch = () => {
    router.push({
      pathname: "/screens/search/SearchJobs",
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
    if (activeCategory === "offers" && wasFavorite) {
      setFavoriteJobs((current) => current.filter((job) => job.id !== id));
    }
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
        if (activeCategory === "offers" && wasFavorite) {
          const restoredJob = browseJobs.find((job) => job.id === id);

          if (restoredJob) {
            setFavoriteJobs((current) =>
              current.some((job) => job.id === id)
                ? current
                : [restoredJob, ...current],
            );
          }
        }
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

  const handleRefresh = async () => {
    setRefreshing(true);
    setBrowsePage(1);
    setFavoritePage(1);
    setBrowseJobs([]);
    setFavoriteJobs([]);

    try {
      const refetches = [allJobsQuery.refetch()];

      if (isAuthenticated) {
        refetches.push(bookmarkedJobsQuery.refetch());
      }

      await Promise.all(refetches);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (activeCategory === "browse") {
      if (!browseHasNextPage || allJobsQuery.isFetching) return;
      setBrowsePage((current) => current + 1);
      return;
    }

    if (
      !isAuthenticated ||
      !favoriteHasNextPage ||
      bookmarkedJobsQuery.isFetching
    ) {
      return;
    }

    setFavoritePage((current) => current + 1);
  };

  const listJobs = activeCategory === "browse" ? browseJobs : favoriteJobs;
  const isInitialLoading =
    activeCategory === "browse"
      ? allJobsQuery.isLoading && browseJobs.length === 0
      : bookmarkedJobsQuery.isLoading && favoriteJobs.length === 0;
  const isLoadingMore =
    activeCategory === "browse"
      ? allJobsQuery.isFetching && browseJobs.length > 0
      : bookmarkedJobsQuery.isFetching && favoriteJobs.length > 0;
  const hasListError =
    activeCategory === "browse"
      ? allJobsQuery.isError
      : bookmarkedJobsQuery.isError;

  const renderListHeader = () => (
    <View>
      <TappableSearchTriggerBar handleOpenSearch={handleOpenSearch} />

      <CategoryToggles
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <View className="mt-8 mb-4 flex-row items-center justify-between">
        <Text className="flex-1 text-lg font-extrabold tracking-tight text-neutral-900">
          {activeCategory === "browse" ? "Local Jobs" : "Favourite Jobs"}
        </Text>
        <TouchableOpacity
          onPress={handleOpenSearch}
          className="flex-row items-center"
        >
          <Text
            style={{ color: Colors.common.BRAND }}
            className="mr-1 text-xs font-extrabold"
          >
            See All
          </Text>
          <ChevronRight size={16} color={Colors.common.BRAND} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (isInitialLoading) {
      return (
        <View className="rounded-2xl border border-neutral-100 bg-white px-5 py-8">
          <Text className="text-center text-sm font-semibold text-neutral-500">
            {activeCategory === "browse"
              ? "Loading jobs..."
              : "Loading favourites..."}
          </Text>
        </View>
      );
    }

    if (activeCategory === "offers" && !isAuthenticated) {
      return (
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
      );
    }

    if (hasListError) {
      return (
        <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8">
          <Text className="text-center text-sm font-semibold text-red-700">
            {activeCategory === "browse"
              ? "Unable to load jobs. Please try again."
              : "Unable to load favourite jobs. Please try again."}
          </Text>
        </View>
      );
    }

    return (
      <View className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8">
        <Text className="text-center text-sm font-semibold text-neutral-500">
          {activeCategory === "browse"
            ? "No jobs found."
            : "No favourite jobs found."}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <FlatList
        className="flex-1 px-5"
        data={listJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LabourerCard
            job={item}
            handleViewDetails={handleViewDetails}
            handleApply={handleApply}
            isFavorite={favoriteJobIds.includes(item.id)}
            onToggleFavorite={toggleFavoriteJob}
            onOpenDetails={handleOpenDetailsModal}
            isBookmarking={bookmarkingJobIds.includes(item.id)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          isLoadingMore ? (
            <View className="py-5">
              <ActivityIndicator color={Colors.common.BRAND} />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
      />
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
