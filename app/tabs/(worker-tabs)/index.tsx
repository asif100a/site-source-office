import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
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
import {
  getWorkerLoginRoute,
  isUserAuthenticated,
} from "@/constants/authState";
import {
  DEFAULT_HOME_LOCATION,
  filterWorkerHomeJobs,
  formatDistance,
  formatNeeded,
  formatPayRate,
  WORKER_HOME_FILTERS,
  WORKER_HOME_JOBS,
} from "@/constants/workerHome";
import WorkerHomeFilterModal from "@/components/modules/worker/worker-home/WorkerHomeFilterModal";
import {
  WorkerHomeDateRange,
  WorkerHomeFilter,
  WorkerHomeJob,
} from "@/types";

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

const MAP_REGION: Region = {
  latitude: 51.5295,
  longitude: -0.056,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function getNativeMapComponents(): NativeMapComponents | null {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    const maps =
      require("react-native-maps") as typeof import("react-native-maps");
    return {
      MapView: maps.default,
      Marker: maps.Marker,
      ProviderGoogle: maps.PROVIDER_GOOGLE,
    };
  } catch {
    return null;
  }
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: WorkerHomeFilter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3 rounded-xl px-4 py-2.5"
      style={{
        backgroundColor: active ? "#111111" : "#FFFFFF",
        borderWidth: active ? 0 : 1,
        borderColor: "#E7E7E7",
      }}
    >
      <Text
        className="text-[10px] font-bold"
        style={{ color: active ? "#FFFFFF" : "#4B4B4B" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MarkerBubble({ dark = false }: { dark?: boolean }) {
  return (
    <View
      className="items-center justify-center rounded-full p-2.5 shadow-sm"
      style={{
        backgroundColor: dark ? "#111111" : "#FFFFFF",
        borderWidth: dark ? 0 : 1,
        borderColor: "#ECECEC",
      }}
    >
      <MapPin size={16} color={dark ? "#FFFFFF" : Colors.common.BRAND} />
    </View>
  );
}

function JobCard({
  job,
  onDetails,
  onApply,
}: {
  job: WorkerHomeJob;
  onDetails: (job: WorkerHomeJob) => void;
  onApply: (job: WorkerHomeJob) => void;
}) {
  const closingSoon =
    new Date(job.closingAt).getTime() - Date.now() < 1000 * 60 * 60 * 30;

  return (
    <View className="mb-4 rounded-xl bg-white px-4 py-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2F5BFF]">
            <Briefcase size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-extrabold text-neutral-950">
              {job.title}
            </Text>
            <Text className="text-xs font-medium text-neutral-500">
              {job.company}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-sm font-extrabold text-neutral-950">
            {formatPayRate(job.payRatePerDay)}
          </Text>
          <Text className="mt-1 text-[10px] font-medium text-neutral-500">
            {job.duration}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-[10px] font-semibold text-neutral-600">
            {job.area} - {formatDistance(job.distanceMiles)}
          </Text>
        </View>
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-[10px] font-semibold text-neutral-600">
            {formatNeeded(job.workersNeeded)}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1.5"
          style={{
            backgroundColor: closingSoon ? "#FFF0E8" : "#F4F4F4",
          }}
        >
          <Text
            className="text-[10px] font-bold"
            style={{
              color: closingSoon ? Colors.common.BRAND : "#5A5A5A",
            }}
          >
            {closingSoon ? "Closing soon" : job.startLabel}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-[10px] font-medium text-neutral-400">
          {job.posted}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onDetails(job)}
            className="rounded-xl bg-[#F5F3F3] px-4 py-2.5"
          >
            <Text className="text-xs font-bold text-neutral-700">Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onApply(job)}
            className="rounded-xl px-5 py-2.5"
            style={{ backgroundColor: "#111111" }}
          >
            <Text className="text-xs font-bold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function WorkerHomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WorkerHomeFilter>("All");
  const [locationQuery, setLocationQuery] = useState(DEFAULT_HOME_LOCATION);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(5);
  const [minRatePerDay, setMinRatePerDay] = useState(120);
  const [dateRange, setDateRange] = useState<WorkerHomeDateRange>({});

  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;

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
    if (isUserAuthenticated()) {
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
    <ScreenWrapper style={{ backgroundColor: "#F3F3F3" }}>
      <ScreenHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
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
                      {WORKER_HOME_JOBS.length} live sites nearby
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
                        {featuredJob.title}
                      </Text>
                      <Text className="text-xs font-medium text-neutral-500">
                        {featuredJob.company} -{" "}
                        {formatDistance(featuredJob.distanceMiles)} -{" "}
                        {featuredJob.startLabel}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base font-extrabold text-neutral-950">
                      {formatPayRate(featuredJob.payRatePerDay)}
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
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
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
