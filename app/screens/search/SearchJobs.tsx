import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Search,
  Map,
  List,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchEmployerListView from "@/components/modules/employer/search-employer/SearchEmployerListView";
import SearchEmployerMapView from "@/components/modules/employer/search-employer/SearchEmployerMapView";
import SearchEmployerFilterModal from "@/components/modules/employer/search-employer/SearchEmployerFilterModal";
import LogoWhite from "@/assets/icons/LogoWhite";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import {
  getAllJobsHasNextPage,
  getAllJobItems,
  mapApiJobToWorkerJobItem,
} from "@/utils/workerJobs";

const JOBS_LIMIT = 10;

type SearchJobItem = WorkerJobItem & {
  coordinate?: {
    latitude: number;
    longitude: number;
  };
};

const MAP_FALLBACK_COORDINATES = [
  { latitude: 51.5444, longitude: -0.0031 },
  { latitude: 51.5382, longitude: -0.012 },
  { latitude: 51.551, longitude: 0.0048 },
  { latitude: 51.5326, longitude: -0.0014 },
];

const getJobCoordinate = (job: any, index: number) => {
  const [longitude, latitude] = job.location?.coordinates ?? [];

  if (Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))) {
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  return MAP_FALLBACK_COORDINATES[index % MAP_FALLBACK_COORDINATES.length];
};

const mapApiJobToSearchJobItem = (job: any, index: number): SearchJobItem => ({
  ...mapApiJobToWorkerJobItem(job),
  coordinate: getJobCoordinate(job, index),
});

export default function WorkerSearchScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<SearchJobItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [rateRange, setRateRange] = useState("");
  const [tradeSkill, setTradeSkill] = useState("");
  const [radius, setRadius] = useState("");
  const trimmedSearchQuery = searchQuery.trim();
  const isWaitingForSearch = trimmedSearchQuery !== debouncedSearchQuery;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(trimmedSearchQuery);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [trimmedSearchQuery]);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: JOBS_LIMIT,
      status: "POSTED" as const,
      ...(debouncedSearchQuery ? { searchTerm: debouncedSearchQuery } : {}),
    }),
    [debouncedSearchQuery, page],
  );

  const allJobsQuery = useGetAllJobsQuery(queryArgs);

  useEffect(() => {
    setPage(1);
    setJobs([]);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (
      !allJobsQuery.currentData &&
      (allJobsQuery.isFetching || isWaitingForSearch)
    ) {
      return;
    }

    const response = allJobsQuery.currentData ?? allJobsQuery.data;

    if (!response || (page > 1 && allJobsQuery.isFetching)) {
      return;
    }

    const nextJobs = getAllJobItems(response).map(
      mapApiJobToSearchJobItem,
    );

    setJobs((current) => (page === 1 ? nextJobs : [...current, ...nextJobs]));
    setHasNextPage(
      getAllJobsHasNextPage(response, nextJobs.length, JOBS_LIMIT),
    );
  }, [
    allJobsQuery.currentData,
    allJobsQuery.data,
    allJobsQuery.isFetching,
    isWaitingForSearch,
    page,
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setJobs([]);

    try {
      await allJobsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasNextPage || allJobsQuery.isFetching) {
      return;
    }

    setPage((current) => current + 1);
  };

  const handleChangeSearchQuery = (value: string) => {
    setSearchQuery(value);
    setPage(1);
    setJobs([]);
  };

  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const isInitialLoading =
    jobs.length === 0 &&
    (isWaitingForSearch || allJobsQuery.isLoading || allJobsQuery.isFetching);
  const isLoadingMore = allJobsQuery.isFetching && jobs.length > 0;

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}`);
  };

  const handleOpenDetailsModal = (job: WorkerJobItem) => {
    setSelectedJob(job);
  };

  const handleCloseDetailsModal = () => {
    setSelectedJob(null);
  };

  const handleSendRequest = () => {
    handleCloseDetailsModal();
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const goBackToOrigin = () => {
    void originRoute;
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={[]}>
      {/* Search Header */}
      <View
        style={{ backgroundColor: Colors.common.BRAND }}
        className="pb-3 pt-8 px-6 z-10"
      >
        <View className="flex-row justify-between items-end">
          {/* Back button and title */}
          <TouchableOpacity
            onPress={goBackToOrigin}
            className="flex-row items-center gap-1 active:opacity-75"
          >
            <ChevronLeft size={20} color="#FFFFFF" />
            <Text className="text-white text-xl font-extrabold tracking-tight">
              Search Jobs
            </Text>
          </TouchableOpacity>

          <View
            className="-mb-3 mr-0"
            style={
              { minWidth: "100", minHeight: "72", position: "relative" } as any
            }
          >
            <View
              style={{
                position: "absolute",
                right: "37%",
              }}
            >
              <LogoWhite size={{ width: "100", height: "72" }} />
            </View>
          </View>

          {/* Map/List View Toggle */}
          <TouchableOpacity
            onPress={() => setViewType(viewType === "list" ? "map" : "list")}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/25 active:opacity-75"
          >
            {viewType === "list" ? (
              <Map color="#FFFFFF" size={18} />
            ) : (
              <List color="#FFFFFF" size={18} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {viewType === "list" ? (
        <View className="z-10 flex-row items-center gap-3 bg-neutral-50 px-5 pb-2 pt-4">
          <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-1">
            <Search size={18} color="#A3A3A3" className="mr-2" />
            <TextInput
              className="flex-1 py-0 text-sm font-medium text-neutral-800"
              placeholder="Search Jobs"
              placeholderTextColor="#A3A3A3"
              value={searchQuery}
              onChangeText={handleChangeSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-4 active:opacity-80"
          >
            <SlidersHorizontal size={18} color="#333333" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Content render based on toggle */}
      {viewType === "list" ? (
        /* LIST VIEW */
        <SearchEmployerListView
          jobs={jobs}
          isLoading={isInitialLoading}
          isLoadingMore={isLoadingMore}
          isError={allJobsQuery.isError}
          refreshing={refreshing}
          handleViewDetails={handleViewDetails}
          handleApply={handleApply}
          onOpenDetails={handleOpenDetailsModal}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
        />
      ) : (
        /* MAP VIEW */
        <SearchEmployerMapView
          jobs={jobs}
          isLoading={isInitialLoading}
          isError={allJobsQuery.isError}
          handleViewDetails={handleViewDetails}
          searchQuery={searchQuery}
          onChangeSearchQuery={handleChangeSearchQuery}
          onOpenFilters={() => setShowFilters(true)}
          onOpenDetails={handleOpenDetailsModal}
        />
      )}

      {/* FILTERS MODAL (Bottom Sheet style) */}
      <SearchEmployerFilterModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        rateRange={rateRange}
        setRateRange={setRateRange}
        radius={radius}
        setRadius={setRadius}
        tradeSkill={tradeSkill}
        setTradeSkill={setTradeSkill}
      />

      <JobDetailsBottomSheet
        job={selectedJob}
        visible={!!selectedJob}
        primaryActionLabel="Send Request"
        onClose={handleCloseDetailsModal}
        onPrimaryAction={handleSendRequest}
      />
    </SafeAreaView>
  );
}
