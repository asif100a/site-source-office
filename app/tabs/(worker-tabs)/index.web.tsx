import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Modal, Pressable } from "react-native";
import { Briefcase, Filter } from "lucide-react-native";

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenLoader from "@/components/ui/screen-loader";
import { Colors } from "@/constants/Colors";
import {
  formatDistance,
  formatPayRate,
  WORKER_HOME_FILTERS,
} from "@/constants/workerHome";
import WorkerHomeFilterModal from "@/components/modules/worker/worker-home/WorkerHomeFilterModal";
import {
  MapRegion,
  WorkerHomeFilter,
  WorkerHomeJob,
} from "@/types";
import {
  FilterChip,
  MarkerBubble,
} from "@/components/modules/worker/home/_ui";
import WebJobCard from "@/components/modules/worker/home/WebJobCard";
import { useGetAllJobsQuery, useGetSingleJobQuery, useGetWorkersMapsJobsQuery } from "@/store/api/jobApi";
import { getAllJobsHasNextPage, getAllJobItems, getSingleJobData, mapApiJobToWorkerHomeJob } from "@/utils/workerJobs";
import { ActivityIndicator, RefreshControl } from "react-native";
import { getWorkerJobFilter, getWorkerJobTrade } from "@/utils/workerJobFilters";
import { useCreateJobApplicationMutation } from "@/store/api/jobApplicationApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { getWorkerMapPosition, getWorkerMapRegion } from "@/utils/workerMapJobs";
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

const getMapZoom = (region: MapRegion) => {
  const delta = Math.max(region.latitudeDelta, region.longitudeDelta);

  if (delta >= 5) return 6;
  if (delta >= 2) return 8;
  if (delta >= 1) return 9;
  if (delta >= 0.5) return 10;
  if (delta >= 0.2) return 11;
  if (delta >= 0.1) return 12;

  return 14;
};

const getGoogleMapEmbedUrl = (region: MapRegion) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=${getMapZoom(region)}&output=embed`;
};

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
  // console.log("WorkerHomeScreen: mapJobsQuery = ", mapJobsQuery);
  // console.log("WorkerHomeScreen: allJobsQuery = ", allJobsQuery);
  const selectedJobQuery = useGetSingleJobQuery(selectedJobId, {
    skip: !selectedJobId,
  });
  const filteredMapJobs = mapJobs;
  const visibleAllJobs = allJobs;
  const selectedMapJob = filteredMapJobs.find((job) => job.id === selectedJobId);
  const mapRegion = useMemo(
    () => getWorkerMapRegion(selectedLocation, filteredMapJobs),
    [filteredMapJobs, selectedLocation],
  );
  const mapEmbedUrl = useMemo(
    () => getGoogleMapEmbedUrl(mapRegion),
    [mapRegion],
  );

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationPermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setWorkerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPermission("granted");
      },
      (error) => {
        console.error("Unable to get worker location:", error);
        setWorkerLocation(null);
        setLocationPermission("denied");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
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
        <ScreenLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 72 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-lg">
              <View className="relative h-[430px]">
                <WebGoogleMap sourceUrl={mapEmbedUrl} />

                {filteredMapJobs.map((job) => (
                  <TouchableOpacity
                    key={job.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedJobId(job.id)}
                    className="absolute z-10"
                    style={{
                      ...getWorkerMapPosition(job.coordinate, mapRegion),
                      transform: [{ translateX: -18 }],
                    } as StyleProp<ViewStyle>}
                  >
                    <MarkerBubble dark={job.id === featuredJob?.id} />
                  </TouchableOpacity>
                ))}

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
                      className="rounded-2xl bg-[#111111] px-5 py-3.5 shadow-sm"
                      onPress={() => setShowFilterModal(true)}
                    >
                      <View className="flex-row items-center gap-2">
                        <Filter size={18} color="#FFFFFF" />
                        <Text className="text-sm font-bold text-white">
                          Filters
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <View className="rounded-full bg-[#111111] px-4 py-2.5">
                      <Text className="text-sm font-bold text-white">
                        {mapJobs.length} live sites {hasWorkerLocation ? "nearby" : "available"}
                      </Text>
                    </View>
                  </View>
                </View>

                {featuredJob ? (
                  <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => handleViewDetails(featuredJob)}
                    className="absolute bottom-5 left-5 right-5 z-10 rounded-[28px] bg-white px-5 py-5 shadow-lg"
                  >
                    <View className="flex-row items-center justify-between gap-4">
                      <View className="flex-1 flex-row items-center gap-4">
                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                          <Briefcase size={24} color="#FFFFFF" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-2xl font-bold text-neutral-950">
                            {selectedJobQuery.isFetching ? "Loading job..." : featuredJob.title}
                          </Text>
                          <Text className="text-base font-medium text-neutral-500">
                            {`${featuredJob.company} - ${formatDistance(featuredJob.distanceMiles)} - ${featuredJob.startLabel}`}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end">
                        <Text className="text-xl font-bold text-neutral-950">
                          {selectedJobQuery.isFetching ? "--" : formatPayRate(featuredJob.payRatePerDay)}
                        </Text>
                        <Text className="mt-1 text-xs font-bold uppercase tracking-[0.8px] text-neutral-400">
                          Tap to view details
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-[34px] font-bold text-neutral-950">
                  All Jobs
                </Text>
                <Text className="mt-1 text-base font-medium text-neutral-500">
                  {activeFilter === "All"
                    ? `${visibleAllJobs.length} jobs available`
                    : `${visibleAllJobs.length} jobs matching ${activeFilter}`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/tabs/(worker-tabs)/jobs" as any)}
              >
                <Text
                  className="text-base font-bold"
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

            <View className="mt-6 gap-4">
              {allJobsQuery.isError ? (
                <View className="rounded-xl bg-red-50 px-4 py-3">
                  <Text className="text-sm font-semibold text-red-700">
                    Unable to load jobs. {String((allJobsQuery.error as any)?.data?.message ?? "Please try again.")}
                  </Text>
                </View>
              ) : null}
              {visibleAllJobs.map((job) => (
                <WebJobCard
                  key={job.id}
                  job={job}
                  onDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))}
              {!allJobsQuery.isFetching && !visibleAllJobs.length ? (
                <View className="items-center rounded-xl bg-white px-5 py-8">
                  <Briefcase size={28} color={Colors.common.BRAND} />
                  <Text className="mt-3 text-lg font-extrabold text-neutral-950">
                    No jobs available
                  </Text>
                  <Text className="mt-1 text-center text-sm font-medium text-neutral-500">
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
                  className="items-center rounded-xl bg-white px-4 py-3"
                >
                  <Text className="text-xs font-bold text-neutral-900">
                    Load more jobs
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
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
          className="flex-1 items-center justify-center px-6 py-8"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowBestMatchLoginModal(false)}
          />
          <View className="w-full max-w-sm rounded-2xl bg-white px-5 py-5 shadow-2xl">
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

function WebGoogleMap({ sourceUrl }: { sourceUrl: string }) {
  return React.createElement("iframe", {
    title: "Nearby jobs map",
    src: sourceUrl,
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
    style: {
      width: "100%",
      height: "100%",
      border: 0,
      display: "block",
    },
  });
}
