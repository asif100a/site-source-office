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
import LogoWhite from "@/assets/icons/LogoWhite";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";
import {
  useGetAllJobsQuery,
  useGetSingleJobQuery,
  useGetWorkersMapsJobsQuery,
} from "@/store/api/jobApi";
import {
  useCreateJobBookmarkMutation,
  useGetBookmarkJobsQuery,
} from "@/store/api/bookmarkApi";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { getWorkerLoginRoute } from "@/constants/authState";
import Toast from "react-native-toast-message";
import {
  getAllJobsHasNextPage,
  getAllJobItems,
  getBookmarkedJobItems,
  getSingleJobData,
  mapApiJobToWorkerHomeJob,
  mapApiJobToWorkerJobItem,
} from "@/utils/workerJobs";
import WorkerHomeFilterModal from "@/components/modules/worker/worker-home/WorkerHomeFilterModal";
import { getWorkerJobTrade } from "@/utils/workerJobFilters";
import { getWorkerMapRegion } from "@/utils/workerMapJobs";
import type { WorkerHomeJob } from "@/types";
import {
  getAddressFromCoordinates,
  type AddressDetails,
} from "@/utils/googlePlaces";

const JOBS_LIMIT = 10;
const MAP_JOBS_LIMIT = 100;

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
  const [mapJobs, setMapJobs] = useState<WorkerHomeJob[]>([]);
  const [mapLocationAddress, setMapLocationAddress] = useState("");
  const [mapLocationCoordinates, setMapLocationCoordinates] = useState<
    [number, number] | null
  >(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMapJobId, setSelectedMapJobId] = useState("");
  const [selectedMapJobAddress, setSelectedMapJobAddress] = useState("");
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);
  const [bookmarkingJobIds, setBookmarkingJobIds] = useState<string[]>([]);
  const [createJobBookmark] = useCreateJobBookmarkMutation();
  const isAuthenticated = useIsAuthenticated();

  // The map filter state mirrors the worker home map filter controls.
  const [tradeSkill, setTradeSkill] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(50);
  const [debouncedMaxDistanceMiles, setDebouncedMaxDistanceMiles] = useState(50);
  const [minRatePerDay, setMinRatePerDay] = useState(120);
  const trimmedSearchQuery = searchQuery.trim();
  const isWaitingForSearch = trimmedSearchQuery !== debouncedSearchQuery;
  const apiTrade = getWorkerJobTrade(tradeSkill);
  const selectedMapLocation = useMemo(
    () =>
      mapLocationCoordinates
        ? {
          latitude: mapLocationCoordinates[1],
          longitude: mapLocationCoordinates[0],
        }
        : null,
    [mapLocationCoordinates],
  );
  const hasSelectedMapLocation = Boolean(selectedMapLocation);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(trimmedSearchQuery);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [trimmedSearchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedMaxDistanceMiles(maxDistanceMiles);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [maxDistanceMiles]);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: JOBS_LIMIT,
      status: "POSTED" as const,
      ...(selectedMapLocation
        ? {
          latitude: selectedMapLocation.latitude,
          longitude: selectedMapLocation.longitude,
          radius: debouncedMaxDistanceMiles,
        }
        : {}),
      ...(debouncedSearchQuery ? { searchTerm: debouncedSearchQuery } : {}),
      ...(minRatePerDay !== 120
        ? { hourlyRate: Math.ceil(minRatePerDay / 9) }
        : {}),
      ...(apiTrade ? { trade: apiTrade } : {}),
    }),
    [
      apiTrade,
      debouncedMaxDistanceMiles,
      debouncedSearchQuery,
      minRatePerDay,
      page,
      selectedMapLocation,
    ],
  );

  const allJobsQuery = useGetAllJobsQuery(queryArgs);
  const bookmarkedJobsQuery = useGetBookmarkJobsQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated },
  );
  // console.log('allJobsQuery: ', allJobsQuery)

  // Map search follows the worker home screen and queries nearby jobs by coordinates.
  const mapJobsQuery = useGetWorkersMapsJobsQuery(
    {
      page: 1,
      limit: MAP_JOBS_LIMIT,
      status: "POSTED",
      ...(selectedMapLocation
        ? {
          latitude: selectedMapLocation.latitude,
          longitude: selectedMapLocation.longitude,
          radius: debouncedMaxDistanceMiles,
        }
        : {}),
      ...(minRatePerDay !== 120
        ? { hourlyRate: Math.ceil(minRatePerDay / 9) }
        : {}),
      ...(apiTrade ? { trade: apiTrade } : {}),
    },
  );

  useEffect(() => {
    const fromSearch = getAllJobItems(allJobsQuery.data)
      .filter((job: any) => Boolean(job?.hasBookmarked))
      .map((job: any) => String(job.id ?? job._id));
    const fromBookmarks = getBookmarkedJobItems(bookmarkedJobsQuery.data)
      .map((job: any) => String(job.id ?? job._id));

    setFavoriteJobIds(Array.from(new Set([...fromSearch, ...fromBookmarks])));
  }, [allJobsQuery.data, bookmarkedJobsQuery.data]);

  const toggleFavoriteJob = (id: string) => {
    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute("/screens/search/SearchJobs") as any);
      return;
    }
    if (bookmarkingJobIds.includes(id)) return;

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
        void allJobsQuery.refetch();
        void bookmarkedJobsQuery.refetch();
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
  // console.log("mapJobsQuery: ", mapJobsQuery?.data);
  const selectedMapJobQuery = useGetSingleJobQuery(selectedMapJobId, {
    skip: !selectedMapJobId,
  });
  const selectedMapJob = mapJobs.find((job) => job.id === selectedMapJobId);
  const mapRegion = useMemo(
    () => getWorkerMapRegion(selectedMapLocation, mapJobs),
    [mapJobs, selectedMapLocation],
  );

  const featuredMapJob = useMemo(() => {
    const singleJob = getSingleJobData(
      selectedMapJobQuery.currentData ?? selectedMapJobQuery.data,
    );

    if (!singleJob) {
      return selectedMapJob ?? mapJobs[0];
    }

    const mappedJob = mapApiJobToWorkerHomeJob(singleJob, 0);

    return {
      ...mappedJob,
      distanceMiles: selectedMapJob?.distanceMiles ?? mappedJob.distanceMiles,
      mapPosition: selectedMapJob?.mapPosition ?? mappedJob.mapPosition,
    };
  }, [
    mapJobs,
    selectedMapJob,
    selectedMapJobQuery.currentData,
    selectedMapJobQuery.data,
  ]);

  const featuredMapJobWithAddress = useMemo(() => {
    if (!featuredMapJob || !selectedMapJobAddress) {
      return featuredMapJob;
    }

    return {
      ...featuredMapJob,
      area: selectedMapJobAddress,
    };
  }, [featuredMapJob, selectedMapJobAddress]);

  useEffect(() => {
    setSelectedMapJobAddress("");

    if (!featuredMapJob?.coordinate) return;

    const coordinates: [number, number] = [
      featuredMapJob.coordinate.longitude,
      featuredMapJob.coordinate.latitude,
    ];
    let cancelled = false;

    getAddressFromCoordinates(coordinates)
      .then((address) => {
        if (!cancelled) setSelectedMapJobAddress(address);
      })
      .catch(() => {
        if (!cancelled) setSelectedMapJobAddress(featuredMapJob.area);
      });

    return () => {
      cancelled = true;
    };
  }, [featuredMapJob?.area, featuredMapJob?.coordinate]);

  useEffect(() => {
    setPage(1);
    setJobs([]);
  }, [debouncedSearchQuery, debouncedMaxDistanceMiles, minRatePerDay, tradeSkill]);

  useEffect(() => {
    setSelectedMapJobId("");
  }, [mapLocationCoordinates, debouncedMaxDistanceMiles, minRatePerDay, tradeSkill]);

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

  useEffect(() => {
    if (!mapJobsQuery.currentData && mapJobsQuery.isFetching) {
      return;
    }

    const response = mapJobsQuery.currentData ?? mapJobsQuery.data;

    if (!response) {
      return;
    }

    const nextJobs = getAllJobItems(response).map((job, index) =>
      mapApiJobToWorkerHomeJob(job, index),
    );

    // Keep map card/marker data in the same WorkerHomeJob shape used on the home map.
    setMapJobs(nextJobs);
  }, [mapJobsQuery.currentData, mapJobsQuery.data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setJobs([]);

    try {
      const refetches = [allJobsQuery.refetch()];

      refetches.push(mapJobsQuery.refetch());

      await Promise.all(refetches);
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

  const handleMapLocationChange = (details: AddressDetails) => {
    setMapLocationAddress(details.description);
    setMapLocationCoordinates(details.coordinates);
    setMapJobs([]);
    setSelectedMapJobId("");
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
  const isMapLoading =
    mapJobs.length === 0 && (mapJobsQuery.isLoading || mapJobsQuery.isFetching);

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}`);
  };

  const handleViewMapJobDetails = (job: WorkerHomeJob) => {
    router.push(`/screens/job/${job.id}` as any);
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
        <View className="z-10 flex-row items-center gap-2.5 bg-neutral-50 px-5 pb-2 pt-3">
          <View className="flex-1 h-10 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-3.5">
            <Search size={16} color="#A3A3A3" className="mr-2" />
            <TextInput
              className="flex-1 h-full py-0 text-sm font-medium text-neutral-800 focus:outline-none"
              placeholder="Search Jobs"
              placeholderTextColor="#A3A3A3"
              value={searchQuery}
              onChangeText={handleChangeSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="w-10 h-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white active:opacity-80"
          >
            <SlidersHorizontal size={16} color="#333333" />
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
          favoriteJobIds={favoriteJobIds}
          onToggleFavorite={toggleFavoriteJob}
          bookmarkingJobIds={bookmarkingJobIds}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
        />
      ) : (
        /* MAP VIEW */
        <SearchEmployerMapView
          jobs={mapJobs}
          featuredJob={featuredMapJobWithAddress}
          isLoading={isMapLoading}
          isError={mapJobsQuery.isError}
          isSelectedJobLoading={selectedMapJobQuery.isFetching}
          mapRegion={mapRegion}
          hasWorkerLocation={hasSelectedMapLocation}
          handleViewDetails={handleViewMapJobDetails}
          locationAddress={mapLocationAddress}
          onLocationChange={handleMapLocationChange}
          onLocationValidityChange={(valid) => {
            if (!valid) {
              setMapLocationCoordinates(null);
            }
          }}
          onOpenFilters={() => setShowFilters(true)}
          onSelectJob={setSelectedMapJobId}
        />
      )}

      <WorkerHomeFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        selectedTrade={tradeSkill}
        onSelectedTradeChange={setTradeSkill}
        maxDistanceMiles={maxDistanceMiles}
        onMaxDistanceMilesChange={setMaxDistanceMiles}
        minRatePerDay={minRatePerDay}
        onMinRatePerDayChange={setMinRatePerDay}
        resultCount={mapJobs.length}
        onReset={() => {
          setTradeSkill("");
          setMaxDistanceMiles(50);
          setDebouncedMaxDistanceMiles(50);
          setMinRatePerDay(120);
        }}
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
