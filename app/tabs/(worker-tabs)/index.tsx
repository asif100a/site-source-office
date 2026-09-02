import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import type { Region } from "react-native-maps";
import { Briefcase, Filter, MapPin, Navigation } from "lucide-react-native";

import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { Colors } from "@/constants/Colors";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import {
  DEFAULT_HOME_LOCATION,
  formatDistance,
  formatNeeded,
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
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import { getAllJobsHasNextPage, getAllJobItems, mapApiJobToWorkerHomeJob } from "@/utils/workerJobs";
import ScreenLoader from "@/components/ui/screen-loader";
import { getWorkerJobFilter, getWorkerJobTrade } from "@/utils/workerJobFilters";

const MAP_REGION: Region = {
  latitude: 51.5295,
  longitude: -0.056,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function WorkerHomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WorkerHomeFilter>("All");
  const [locationQuery, setLocationQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(50);
  const [minRatePerDay, setMinRatePerDay] = useState(120);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<WorkerHomeJob[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const apiFilter = getWorkerJobFilter(activeFilter);
  const apiTrade = getWorkerJobTrade(selectedTrade);
  const locationFilter = locationQuery.trim();
  const jobsQuery = useGetAllJobsQuery({
    page,
    limit: 10,
    ...(locationFilter ? { searchTerm: locationFilter } : {}),
    ...(minRatePerDay !== 120
      ? { hourlyRate: Math.ceil(minRatePerDay / 9) }
      : {}),
    ...(apiFilter ? { filter: apiFilter } : {}),
    ...(apiTrade ? { trade: apiTrade } : {}),
    ...(maxDistanceMiles !== 50 ? { radius: maxDistanceMiles } : {}),
  });
  console.log("jobsQuery: ", jobsQuery);
  const isAuthenticated = useIsAuthenticated();

  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;

  const filteredJobs = jobs;
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {
    setPage(1);
    setJobs([]);
  }, [activeFilter, locationQuery, maxDistanceMiles, minRatePerDay, selectedTrade]);

  useEffect(() => {
    if (!jobsQuery.data || (page > 1 && jobsQuery.isFetching)) return;
    const nextJobs = getAllJobItems(jobsQuery.data).map((job, index) =>
      mapApiJobToWorkerHomeJob(job, index),
    );
    setJobs((current) => (page === 1 ? nextJobs : [...current, ...nextJobs]));
    setHasNextPage(getAllJobsHasNextPage(jobsQuery.data, nextJobs.length, 20));
  }, [jobsQuery.data, jobsQuery.isFetching, page]);

  const refreshJobs = async () => {
    setRefreshing(true);
    setPage(1);
    setJobs([]);
    await jobsQuery.refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!filteredJobs.length) {
      return;
    }

    const hasSelectedJob = filteredJobs.some((job) => job.id === selectedJobId);

    if (!hasSelectedJob) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  const featuredJob =
    filteredJobs.find((job) => job.id === selectedJobId) ??
    filteredJobs[0];

  const promptLoginIfNeeded = (returnTo: string) => {
    if (isAuthenticated) {
      return false;
    }

    router.push(getWorkerLoginRoute(returnTo) as any);
    return true;
  };

  const handleViewDetails = (job: WorkerHomeJob) => {
    const detailsRoute = `/screens/employer-details/${job.id}`;

    if (promptLoginIfNeeded(detailsRoute)) {
      return;
    }

    router.push(detailsRoute as any);
  };

  const handleApply = (job: WorkerHomeJob) => {
    const detailsRoute = `/screens/employer-details/${job.id}`;

    if (promptLoginIfNeeded(detailsRoute)) {
      return;
    }

    router.push(detailsRoute as any);
  };

  if(jobsQuery.isLoading) {
    return (
      <ScreenWrapper style={{ backgroundColor: "#F3F3F3" }}>
        <ScreenHeader />
        <ScreenLoader />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper style={{ backgroundColor: "#F3F3F3" }}>
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
                  initialRegion={MAP_REGION}
                  mapType="standard"
                  loadingEnabled
                  showsCompass={false}
                  toolbarEnabled={false}
                  showsMyLocationButton={false}
                  moveOnMarkerPress={false}
                >
                  {filteredJobs.map((job) => (
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
                  <View className="flex-1 flex-row items-center rounded-lg bg-white px-4 shadow-sm">
                    <MapPin size={17} color={Colors.common.BRAND} />
                    <TextInput
                      className="ml-2 flex-1 text-xs font-semibold text-neutral-800"
                      placeholder="Enter a location"
                      placeholderTextColor="#9CA3AF"
                      value={locationQuery}
                      onChangeText={setLocationQuery}
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
                      {jobs.length} live sites nearby
                    </Text>
                  </View>
                </View>
              </View>

              <View className="absolute bottom-4 right-4 z-10 items-end gap-2">
                <View className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <Navigation size={18} color={Colors.common.BRAND} />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => featuredJob && handleViewDetails(featuredJob)}
                className="absolute bottom-4 left-4 right-4 z-10 rounded-[24px] bg-white px-4 py-4 shadow-lg"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                      <Briefcase size={21} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[18px] font-extrabold text-neutral-950">
                        {featuredJob?.title ?? "No jobs available"}
                      </Text>
                      <Text className="text-xs font-medium text-neutral-500">
                        {featuredJob
                          ? `${featuredJob.company} - ${formatDistance(featuredJob.distanceMiles)} - ${featuredJob.startLabel}`
                          : "Check back soon for new jobs"}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base font-extrabold text-neutral-950">
                      {featuredJob ? formatPayRate(featuredJob.payRatePerDay) : "--"}
                    </Text>
                    <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.8px] text-neutral-400">
                      Tap to view details
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6 flex-row items-end justify-between">
            <View>
              <Text className="text-[22px] font-extrabold text-neutral-950">
                All Jobs
              </Text>
              <Text className="mt-1 text-xs font-medium text-neutral-500">
                {filteredJobs.length} within {maxDistanceMiles} mi of{" "}
                {locationQuery || DEFAULT_HOME_LOCATION}
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
                onPress={() => setActiveFilter(filter)}
              />
            ))}
          </ScrollView>

          <View className="mt-5">
            {jobsQuery.isError ? (
              <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                <Text className="text-xs font-semibold text-red-700">
                  Unable to load jobs. {String((jobsQuery.error as any)?.data?.message ?? "Please try again.")}
                </Text>
              </View>
            ) : null}
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
            {jobsQuery.isLoading ? (
              <ActivityIndicator color={Colors.common.BRAND} />
            ) : null}
            {hasNextPage && !jobsQuery.isFetching ? (
              <TouchableOpacity
                onPress={() => setPage((current) => current + 1)}
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
        resultCount={filteredJobs.length}
        onReset={() => {
          setSelectedTrade("");
          setMaxDistanceMiles(5);
          setMinRatePerDay(120);
        }}
      />
    </ScreenWrapper>
  );
}
