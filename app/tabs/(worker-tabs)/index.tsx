import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Briefcase, Filter } from "lucide-react-native";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { Colors } from "@/constants/Colors";
import {
  formatDistance,
  formatPayRate,
  WORKER_HOME_FILTERS,
} from "@/constants/workerHome";
import WorkerHomeFilterModal from "@/components/modules/worker/worker-home/WorkerHomeFilterModal";
import {
  WorkerHomeFilter,
  WorkerHomeJob,
} from "@/types";
import JobCard from "@/components/card/JobCard";
import { FilterChip, getNativeMapComponents, MarkerBubble } from "@/components/modules/worker/home/_ui";
import { useGetAllJobsQuery, useGetSingleJobQuery, useGetWorkersMapsJobsQuery } from "@/store/api/jobApi";
import { getAllJobsHasNextPage, getAllJobItems, getSingleJobData, mapApiJobToWorkerHomeJob } from "@/utils/workerJobs";
import ScreenLoader from "@/components/ui/screen-loader";
import { getWorkerJobFilter, getWorkerJobTrade } from "@/utils/workerJobFilters";
import { useCreateJobApplicationMutation } from "@/store/api/jobApplicationApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { getWorkerMapRegion } from "@/utils/workerMapJobs";
import JobLocationPicker from "@/components/modules/employer/home/JobLocationPicker";
import type { AddressDetails } from "@/utils/googlePlaces";
import { type DateRangeValue } from "@/components/modules/common/DateRangeCalendar";

const formatQueryDate = (
  date?: Date,
  bound: "start" | "end" = "start",
): string | undefined => {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return undefined;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if (bound === "start") {
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).toISOString();
  }
  return new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).toISOString();
};

const MAP_JOBS_LIMIT = 100;
const ALL_JOBS_LIMIT = 10;

type WorkerLocation = {
  latitude: number;
  longitude: number;
};

type LocationPermissionState = "checking" | "granted" | "denied";

export default function WorkerHomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WorkerHomeFilter>("All");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<
    [number, number] | null
  >(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showBestMatchLoginModal, setShowBestMatchLoginModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(50);
  const [debouncedMaxDistanceMiles, setDebouncedMaxDistanceMiles] = useState(50);
  const [minRatePerDay, setMinRatePerDay] = useState(120);

  // Date and price filter states
  const [startDateRange, setStartDateRange] = useState<DateRangeValue>({});
  const [endDateRange, setEndDateRange] = useState<DateRangeValue>({});
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState<number | null>(null);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number | null>(null);
  const [allJobsPage, setAllJobsPage] = useState(1);
  const [allJobs, setAllJobs] = useState<WorkerHomeJob[]>([]);
  const [mapJobs, setMapJobs] = useState<WorkerHomeJob[]>([]);
  const [allJobsHasNextPage, setAllJobsHasNextPage] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [workerLocation, setWorkerLocation] = useState<WorkerLocation | null>(
    null,
  );
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionState>("checking");
  const [createJobApplication, { isLoading: isApplying }] =
    useCreateJobApplicationMutation();
  const apiFilter = getWorkerJobFilter(activeFilter);
  const apiTrade = getWorkerJobTrade(selectedTrade);
  const isAuthenticated = useIsAuthenticated();
  const selectedLocation = locationCoordinates
    ? {
      latitude: locationCoordinates[1],
      longitude: locationCoordinates[0],
    }
    : workerLocation;
  const selectedSearchLocation = locationCoordinates
    ? {
      latitude: locationCoordinates[1],
      longitude: locationCoordinates[0],
    }
    : null;
  const hasWorkerLocation = Boolean(selectedLocation);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedMaxDistanceMiles(maxDistanceMiles);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [maxDistanceMiles]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [minPrice]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [maxPrice]);

  const startDateFrom = useMemo(
    () => formatQueryDate(startDateRange.from, "start"),
    [startDateRange.from],
  );
  const startDateTo = useMemo(
    () => formatQueryDate(startDateRange.to, "end"),
    [startDateRange.to],
  );
  const endDateFrom = useMemo(
    () => formatQueryDate(endDateRange.from, "start"),
    [endDateRange.from],
  );
  const endDateTo = useMemo(
    () => formatQueryDate(endDateRange.to, "end"),
    [endDateRange.to],
  );

  // Location search uses selected coordinates from Google Places, not text search.
  const mapJobsQuery = useGetWorkersMapsJobsQuery(
    {
      page: 1,
      limit: MAP_JOBS_LIMIT,
      status: "POSTED",
      ...(selectedLocation
        ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          radius: debouncedMaxDistanceMiles,
        }
        : {}),
      ...(debouncedMinPrice != null && debouncedMinPrice > 0
        ? { minPrice: debouncedMinPrice }
        : {}),
      ...(debouncedMaxPrice != null && debouncedMaxPrice > 0
        ? { maxPrice: debouncedMaxPrice }
        : {}),
      ...(startDateFrom ? { startDateFrom } : {}),
      ...(startDateTo ? { startDateTo } : {}),
      ...(endDateFrom ? { endDateFrom } : {}),
      ...(endDateTo ? { endDateTo } : {}),
      ...(apiTrade ? { trade: apiTrade } : {}),
    },
    { skip: locationPermission === "checking" },
  );
  const allJobsQuery = useGetAllJobsQuery({
    page: allJobsPage,
    limit: ALL_JOBS_LIMIT,
    status: "POSTED",
    ...(selectedSearchLocation
      ? {
        latitude: selectedSearchLocation.latitude,
        longitude: selectedSearchLocation.longitude,
        radius: debouncedMaxDistanceMiles,
      }
      : {}),
    ...(apiFilter ? { filter: apiFilter } : {}),
  });
  console.log("allJobsQuery: ", allJobsQuery);
  const selectedJobQuery = useGetSingleJobQuery(selectedJobId, {
    skip: !selectedJobId,
  });
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;

  const filteredMapJobs = mapJobs;
  const visibleAllJobs = allJobs;
  const selectedMapJob = filteredMapJobs.find((job) => job.id === selectedJobId);
  const mapRegion = useMemo(
    () => getWorkerMapRegion(selectedLocation, filteredMapJobs),
    [filteredMapJobs, selectedLocation],
  );

  useEffect(() => {
    let mounted = true;

    const loadWorkerLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!mounted) return;

        if (permission.status !== Location.PermissionStatus.GRANTED) {
          setLocationPermission("denied");
          setWorkerLocation(null);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!mounted) return;

        setWorkerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPermission("granted");
      } catch (error) {
        console.error("Unable to get worker location:", error);
        if (!mounted) return;
        setWorkerLocation(null);
        setLocationPermission("denied");
      }
    };

    void loadWorkerLocation();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setMapJobs([]);
    setSelectedJobId("");
  }, [locationCoordinates, debouncedMaxDistanceMiles, minRatePerDay, selectedTrade]);

  useEffect(() => {
    setAllJobsPage(1);
    setAllJobs([]);
  }, [activeFilter, locationCoordinates, debouncedMaxDistanceMiles]);

  useEffect(() => {
    if (!mapJobsQuery.currentData && mapJobsQuery.isFetching) return;
    const response = mapJobsQuery.currentData ?? mapJobsQuery.data;
    if (!response) return;
    const nextJobs = getAllJobItems(response).map((job, index) =>
      mapApiJobToWorkerHomeJob(job, index),
    );
    // Server location results are kept as-is; no client-side search filtering.
    setMapJobs(nextJobs);
  }, [
    mapJobsQuery.currentData,
    mapJobsQuery.data,
    mapJobsQuery.isFetching,
  ]);

  useEffect(() => {
    if (!allJobsQuery.currentData && allJobsQuery.isFetching) return;
    const response = allJobsQuery.currentData ?? allJobsQuery.data;
    if (!response || (allJobsPage > 1 && allJobsQuery.isFetching)) return;
    const nextJobs = getAllJobItems(response).map((job, index) =>
      mapApiJobToWorkerHomeJob(job, index),
    );
    setAllJobs((current) =>
      allJobsPage === 1 ? nextJobs : [...current, ...nextJobs],
    );
    setAllJobsHasNextPage(
      getAllJobsHasNextPage(response, nextJobs.length, ALL_JOBS_LIMIT),
    );
  }, [
    allJobsPage,
    allJobsQuery.currentData,
    allJobsQuery.data,
    allJobsQuery.isFetching,
  ]);

  const refreshJobs = async () => {
    setRefreshing(true);
    setAllJobsPage(1);
    setAllJobs([]);
    await Promise.all([mapJobsQuery.refetch(), allJobsQuery.refetch()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!selectedJobId) {
      return;
    }

    const hasSelectedJob = filteredMapJobs.some((job) => job.id === selectedJobId);

    if (!hasSelectedJob) {
      setSelectedJobId("");
    }
  }, [filteredMapJobs, selectedJobId]);

  const featuredJob = useMemo(() => {
    const singleJob = getSingleJobData(selectedJobQuery.currentData);

    if (!singleJob) {
      return selectedMapJob;
    }

    const mappedJob = mapApiJobToWorkerHomeJob(singleJob, 0);

    return {
      ...mappedJob,
      distanceMiles: selectedMapJob?.distanceMiles ?? mappedJob.distanceMiles,
      mapPosition: selectedMapJob?.mapPosition ?? mappedJob.mapPosition,
    };
  }, [selectedJobQuery.currentData, selectedMapJob]);

  const handleViewDetails = (job: WorkerHomeJob) => {
    const detailsRoute = `/screens/job/${job.id}`;
    router.push(detailsRoute as any);
  };

  const handleAllJobsFilterPress = (filter: WorkerHomeFilter) => {
    if (filter === "Best Match" && !isAuthenticated) {
      setShowBestMatchLoginModal(true);
      return;
    }

    setActiveFilter(filter);
  };

  const handleLocationChange = (details: AddressDetails) => {
    setLocationAddress(details.description);
    setLocationCoordinates(details.coordinates);
  };

  const handleApply = (job: WorkerHomeJob) => {
    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/screens/job/${job.id}`) as any);
      return;
    }

    if (isApplying) return;

    void createJobApplication(job.id)
      .unwrap()
      .then((response) => {
        console.log("Job application response: ", response);
        Toast.show({
          type: "success",
          text1: "Application submitted",
          text2: "Your application was sent successfully.",
        });
        mapJobsQuery.refetch();
        allJobsQuery.refetch();
      })
      .catch((error) => {
        console.error("Job application error: ", error);
        Toast.show({
          type: "error",
          text1: "Application failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      });
  };

  if (allJobsQuery.isLoading && allJobs.length === 0) {
    return (
      <ScreenWrapper>
        <ScreenHeader />
        <ScreenLoader />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />}
      >
        <View className="px-4 pb-8 pt-4">
          <View className="overflow-hidden rounded-lg bg-white">
            <View className="relative h-[340px]">
              {NativeMapView && NativeMarker ? (
                <NativeMapView
                  style={{ flex: 1 }}
                  provider={NativeProviderGoogle}
                  region={mapRegion}
                  initialRegion={mapRegion}
                  mapType="standard"
                  loadingEnabled
                  showsCompass={false}
                  toolbarEnabled={false}
                  showsUserLocation={hasWorkerLocation}
                  showsMyLocationButton={hasWorkerLocation}
                  moveOnMarkerPress={false}
                >
                  {filteredMapJobs.map((job) => (
                    <NativeMarker
                      key={job.id}
                      coordinate={job.coordinate}
                      title={job.title}
                      description={job.company}
                      onPress={() => setSelectedJobId(job.id)}
                    >
                      <MarkerBubble dark={job.id === featuredJob?.id} />
                    </NativeMarker>
                  ))}
                </NativeMapView>
              ) : (
                <MapFallback />
              )}

              <View className="absolute inset-x-0 top-0 bg-black/10 px-4 pb-4 pt-4">
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <JobLocationPicker
                      address={locationAddress}
                      onChange={handleLocationChange}
                      onValidityChange={(valid) => {
                        if (!valid) {
                          setLocationCoordinates(null);
                        }
                      }}
                      onlyField
                    />
                  </View>

                  <TouchableOpacity
                    className="rounded-2xl bg-[#111111] px-4 py-3 shadow-sm"
                    onPress={() => setShowFilterModal(true)}
                  >
                    <View className="flex-row items-center gap-2">
                      <Filter size={16} color="#FFFFFF" />
                      <Text className="text-xs font-bold text-white">
                        Filters
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                  <View className="rounded-full bg-[#111111] px-4 py-2">
                    <Text className="text-[10px] font-extrabold text-white">
                      {mapJobs.length} live sites {hasWorkerLocation ? "nearby" : "available"}
                    </Text>
                  </View>
                </View>
              </View>

              {featuredJob ? (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => handleViewDetails(featuredJob)}
                  className="absolute bottom-4 left-4 right-4 z-10 rounded-[24px] bg-white px-4 py-4 shadow-lg"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                        <Briefcase size={21} color="#FFFFFF" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[18px] font-extrabold text-neutral-950">
                          {selectedJobQuery.isFetching ? "Loading job..." : featuredJob.title}
                        </Text>
                        <Text className="text-xs font-medium text-neutral-500">
                          {`${featuredJob.company} - ${formatDistance(featuredJob.distanceMiles)} - ${featuredJob.startLabel}`}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-base font-extrabold text-neutral-950">
                        {selectedJobQuery.isFetching ? "--" : formatPayRate(featuredJob.payRatePerDay)}
                      </Text>
                      <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.8px] text-neutral-400">
                        Tap to view details
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View className="mt-6 flex-row items-end justify-between">
            <View>
              <Text className="text-[22px] font-extrabold text-neutral-950">
                All Jobs
              </Text>
              <Text className="mt-1 text-xs font-medium text-neutral-500">
                {activeFilter === "All"
                  ? `${visibleAllJobs.length} jobs available`
                  : `${visibleAllJobs.length} jobs matching ${activeFilter}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/tabs/(worker-tabs)/jobs" as any)}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: Colors.common.BRAND }}
              >
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
          >
            {WORKER_HOME_FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                active={activeFilter === filter}
                onPress={() => handleAllJobsFilterPress(filter)}
              />
            ))}
          </ScrollView>

          <View className="mt-5">
            {allJobsQuery.isError ? (
              <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                <Text className="text-xs font-semibold text-red-700">
                  Unable to load jobs. {String((allJobsQuery.error as any)?.data?.message ?? "Please try again.")}
                </Text>
              </View>
            ) : null}
            {visibleAllJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
            {!allJobsQuery.isFetching && !visibleAllJobs.length ? (
              <View className="items-center rounded-xl bg-white px-5 py-8">
                <Briefcase size={24} color={Colors.common.BRAND} />
                <Text className="mt-3 text-base font-extrabold text-neutral-950">
                  No jobs available
                </Text>
                <Text className="mt-1 text-center text-xs font-medium text-neutral-500">
                  Try changing your filters or search location.
                </Text>
              </View>
            ) : null}
            {allJobsQuery.isLoading ? (
              <ActivityIndicator color={Colors.common.BRAND} />
            ) : null}
            {allJobsHasNextPage && !allJobsQuery.isFetching ? (
              <TouchableOpacity
                onPress={() => setAllJobsPage((current) => current + 1)}
                className="mt-2 items-center rounded-xl bg-white px-4 py-3"
              >
                <Text className="text-xs font-bold text-neutral-900">
                  Load more jobs
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <WorkerHomeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedTrade={selectedTrade}
        onSelectedTradeChange={setSelectedTrade}
        maxDistanceMiles={maxDistanceMiles}
        onMaxDistanceMilesChange={setMaxDistanceMiles}
        minRatePerDay={minRatePerDay}
        onMinRatePerDayChange={setMinRatePerDay}
        startDateRange={startDateRange}
        onStartDateRangeChange={setStartDateRange}
        endDateRange={endDateRange}
        onEndDateRangeChange={setEndDateRange}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        resultCount={filteredMapJobs.length}
        onReset={() => {
          setSelectedTrade("");
          setMaxDistanceMiles(5);
          setMinRatePerDay(120);
          setStartDateRange({});
          setEndDateRange({});
          setMinPrice(null);
          setMaxPrice(null);
          setDebouncedMinPrice(null);
          setDebouncedMaxPrice(null);
        }}
      />

      <Modal
        visible={showBestMatchLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBestMatchLoginModal(false)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowBestMatchLoginModal(false)}
          />
          <View className="w-full max-w-sm rounded-2xl bg-white px-5 py-5 shadow-lg">
            <Text className="text-lg font-extrabold text-neutral-950">
              You need to login to see the best match
            </Text>

            <View className="mt-5 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl bg-[#111111] px-4 py-3"
                onPress={() => {
                  setShowBestMatchLoginModal(false);
                  router.push(getWorkerLoginRoute("/tabs/(worker-tabs)") as any);
                }}
              >
                <Text className="text-center text-sm font-bold text-white">
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-xl bg-neutral-100 px-4 py-3"
                onPress={() => setShowBestMatchLoginModal(false)}
              >
                <Text className="text-center text-sm font-bold text-neutral-900">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
