import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Briefcase, Filter, MapPin, Navigation } from "lucide-react-native";

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import {
  DEFAULT_HOME_LOCATION,
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
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import { getAllJobsHasNextPage, getAllJobItems, mapApiJobToWorkerHomeJob } from "@/utils/workerJobs";
import { ActivityIndicator, RefreshControl } from "react-native";
import { getWorkerJobFilter, getWorkerJobTrade } from "@/utils/workerJobFilters";

const MAP_REGION: MapRegion = {
  latitude: 51.5295,
  longitude: -0.056,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const getGoogleMapEmbedUrl = (region: MapRegion) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=14&output=embed`;
};

export default function WorkerHomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WorkerHomeFilter>("All");
  const [locationQuery, setLocationQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(5);
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
    limit: 20,
    status: "POSTED",
    ...(locationFilter ? { searchTerm: locationFilter } : {}),
    ...(minRatePerDay !== 120
      ? { hourlyRate: Math.ceil(minRatePerDay / 9) }
      : {}),
    ...(apiFilter ? { filter: apiFilter } : {}),
    ...(apiTrade ? { trade: apiTrade } : {}),
    ...(maxDistanceMiles !== 5 ? { radius: maxDistanceMiles } : {}),
  });
  const mapEmbedUrl = useMemo(() => getGoogleMapEmbedUrl(MAP_REGION), []);
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

  const handleViewDetails = (job: WorkerHomeJob) => {
    const detailsRoute = `/screens/job/${job.id}`;
    router.push(detailsRoute as any);
  };

  const handleApply = (job: WorkerHomeJob) => {
    const detailsRoute = `/screens/job/${job.id}`;
    router.push(detailsRoute as any);
  };

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

                {filteredJobs.map((job) => (
                  <TouchableOpacity
                    key={job.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedJobId(job.id)}
                    className="absolute z-10"
                    style={{
                      top: job.mapPosition.top,
                      left: job.mapPosition.left,
                      transform: [{ translateX: -18 }],
                    } as StyleProp<ViewStyle>}
                  >
                    <MarkerBubble dark={job.id === featuredJob?.id} />
                  </TouchableOpacity>
                ))}

                <View className="absolute inset-x-0 top-0 bg-black/10 px-4 pb-4 pt-4">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <MapPin size={18} color={Colors.common.BRAND} />
                      <TextInput
                        className="ml-2 flex-1 text-sm font-semibold text-neutral-800"
                        placeholder="Enter a location"
                        placeholderTextColor="#9CA3AF"
                        value={locationQuery}
                        onChangeText={setLocationQuery}
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
                        {jobs.length} live sites nearby
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="absolute bottom-5 right-5 rounded-2xl bg-white px-3 py-3 shadow-sm">
                  <Navigation size={18} color={Colors.common.BRAND} />
                </View>

                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => featuredJob && handleViewDetails(featuredJob)}
                  className="absolute bottom-5 left-5 right-5 z-10 rounded-[28px] bg-white px-5 py-5 shadow-lg"
                >
                  <View className="flex-row items-center justify-between gap-4">
                    <View className="flex-1 flex-row items-center gap-4">
                      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                        <Briefcase size={24} color="#FFFFFF" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-2xl font-bold text-neutral-950">
                          {featuredJob?.title ?? "No jobs available"}
                        </Text>
                        <Text className="text-base font-medium text-neutral-500">
                          {featuredJob
                            ? `${featuredJob.company} - ${formatDistance(featuredJob.distanceMiles)} - ${featuredJob.startLabel}`
                            : "Check back soon for new jobs"}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xl font-bold text-neutral-950">
                        {featuredJob ? formatPayRate(featuredJob.payRatePerDay) : "--"}
                      </Text>
                      <Text className="mt-1 text-xs font-bold uppercase tracking-[0.8px] text-neutral-400">
                        Tap to view details
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-[34px] font-bold text-neutral-950">
                  All Jobs
                </Text>
                <Text className="mt-1 text-base font-medium text-neutral-500">
                  {filteredJobs.length} within {maxDistanceMiles} mi of{" "}
                  {locationQuery || DEFAULT_HOME_LOCATION}
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
                  onPress={() => setActiveFilter(filter)}
                />
              ))}
            </ScrollView>

            <View className="mt-6 gap-4">
              {jobsQuery.isError ? (
                <View className="rounded-xl bg-red-50 px-4 py-3">
                  <Text className="text-sm font-semibold text-red-700">
                    Unable to load jobs. {String((jobsQuery.error as any)?.data?.message ?? "Please try again.")}
                  </Text>
                </View>
              ) : null}
              {filteredJobs.map((job) => (
                <WebJobCard
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
