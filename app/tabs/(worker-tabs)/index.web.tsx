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
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import {
  DEFAULT_HOME_LOCATION,
  filterWorkerHomeJobs,
  formatDistance,
  formatPayRate,
  WORKER_HOME_FILTERS,
  WORKER_HOME_JOBS,
} from "@/constants/workerHome";
import WorkerHomeFilterModal from "@/components/modules/worker/worker-home/WorkerHomeFilterModal";
import {
  MapRegion,
  WorkerHomeDateRange,
  WorkerHomeFilter,
  WorkerHomeJob,
} from "@/types";
import {
  FilterChip,
  MarkerBubble,
} from "@/components/modules/worker/home/_ui";
import WebJobCard from "@/components/modules/worker/home/WebJobCard";

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
  const [locationQuery, setLocationQuery] = useState(DEFAULT_HOME_LOCATION);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(5);
  const [minRatePerDay, setMinRatePerDay] = useState(120);
  const [dateRange, setDateRange] = useState<WorkerHomeDateRange>({});
  const mapEmbedUrl = useMemo(() => getGoogleMapEmbedUrl(MAP_REGION), []);
  const isAuthenticated = useIsAuthenticated();

  const filteredJobs = useMemo(
    () =>
      filterWorkerHomeJobs(WORKER_HOME_JOBS, {
        trades: selectedTrade ? [selectedTrade] : [],
        maxDistanceMiles,
        minRatePerDay,
        dateRange,
        sortBy: activeFilter,
      }),
    [activeFilter, dateRange, maxDistanceMiles, minRatePerDay, selectedTrade],
  );
  const [selectedJobId, setSelectedJobId] = useState(
    WORKER_HOME_JOBS[0]?.id ?? "",
  );

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
    filteredJobs[0] ??
    WORKER_HOME_JOBS[0];

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

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 72 }}
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
                        {WORKER_HOME_JOBS.length} live sites nearby
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="absolute bottom-5 right-5 rounded-2xl bg-white px-3 py-3 shadow-sm">
                  <Navigation size={18} color={Colors.common.BRAND} />
                </View>

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
                          {featuredJob.title}
                        </Text>
                        <Text className="text-base font-medium text-neutral-500">
                          {featuredJob.company} -{" "}
                          {formatDistance(featuredJob.distanceMiles)} -{" "}
                          {featuredJob.startLabel}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xl font-bold text-neutral-950">
                        {formatPayRate(featuredJob.payRatePerDay)}
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
              {filteredJobs.map((job) => (
                <WebJobCard
                  key={job.id}
                  job={job}
                  onDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))}
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
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        resultCount={filteredJobs.length}
        onReset={() => {
          setSelectedTrade("");
          setMaxDistanceMiles(5);
          setMinRatePerDay(120);
          setDateRange({});
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
