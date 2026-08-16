import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Briefcase,
  CalendarClock,
  Filter,
  MapPin,
  Navigation,
} from "lucide-react-native";

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { Colors } from "@/constants/Colors";
import {
  getWorkerLoginRoute,
  isUserAuthenticated,
} from "@/constants/authState";
import {
  DEFAULT_HOME_LOCATION,
  formatDistance,
  formatNeeded,
  formatPayRate,
  sortWorkerHomeJobs,
  WORKER_HOME_FILTERS,
  WORKER_HOME_JOBS,
  type WorkerHomeFilter,
  type WorkerHomeJob,
} from "@/constants/workerHome";

function MarkerPill({
  label,
  dark = false,
}: {
  label: string;
  dark?: boolean;
}) {
  return (
    <View
      className="rounded-full px-4 py-2 shadow-sm"
      style={{
        backgroundColor: dark ? "#111111" : "#FFFFFF",
        borderWidth: dark ? 0 : 1,
        borderColor: "#E8E8E8",
      }}
    >
      <Text
        className="text-sm font-extrabold"
        style={{ color: dark ? "#FFFFFF" : "#111111" }}
      >
        {label}
      </Text>
    </View>
  );
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
      className="mr-3 rounded-full px-5 py-3"
      style={{
        backgroundColor: active ? "#111111" : "#FFFFFF",
        borderWidth: active ? 0 : 1,
        borderColor: "#E7E7E7",
      }}
    >
      <Text
        className="text-sm font-bold"
        style={{ color: active ? "#FFFFFF" : "#4B4B4B" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
    <View className="rounded-[28px] bg-white px-6 py-5 shadow-sm">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
            <Briefcase size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-neutral-950">
              {job.title}
            </Text>
            <Text className="text-base font-medium text-neutral-500">
              {job.company}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xl font-extrabold text-neutral-950">
            {formatPayRate(job.payRatePerDay)}
          </Text>
          <Text className="mt-1 text-sm font-medium text-neutral-500">
            {job.duration}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row flex-wrap gap-2">
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {job.area} - {formatDistance(job.distanceMiles)}
          </Text>
        </View>
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {formatNeeded(job.workersNeeded)}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1.5"
          style={{ backgroundColor: closingSoon ? "#FFF0E8" : "#F4F4F4" }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: closingSoon ? Colors.common.BRAND : "#5A5A5A" }}
          >
            {closingSoon ? "Closing soon" : job.startLabel}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-neutral-400">{job.posted}</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onDetails(job)}
            className="rounded-xl bg-[#F5F3F3] px-5 py-3"
          >
            <Text className="text-sm font-bold text-neutral-700">Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onApply(job)}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: "#111111" }}
          >
            <Text className="text-sm font-bold text-white">Apply</Text>
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

  const filteredJobs = useMemo(
    () => sortWorkerHomeJobs(WORKER_HOME_JOBS, activeFilter),
    [activeFilter],
  );

  const featuredJob = filteredJobs[0] ?? WORKER_HOME_JOBS[0];

  const promptLoginIfNeeded = (returnTo: string) => {
    if (isUserAuthenticated()) {
      return false;
    }

    router.push(getWorkerLoginRoute(returnTo));
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 72 }}
      >
        <View className="px-6 py-6 xl:px-10">
          <View className="mx-auto w-full max-w-[1260px]">
            <View className="overflow-hidden rounded-[36px] bg-white shadow-sm">
              <View className="relative h-[430px]">
                <MapFallback />

                {filteredJobs.map((job, index) => (
                  <View
                    key={job.id}
                    className="absolute"
                    style={{
                      top: job.mapPosition.top,
                      left: job.mapPosition.left as any,
                      transform: [{ translateX: -24 }],
                    }}
                  >
                    <MarkerPill
                      label={`GBP ${job.payRatePerDay}`}
                      dark={index === 0}
                    />
                  </View>
                ))}

                <View className="absolute inset-x-0 top-0 bg-black/10 px-6 pb-5 pt-6">
                  <View className="flex-row items-center gap-4">
                    <View className="flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                      <MapPin size={18} color={Colors.common.BRAND} />
                      <TextInput
                        className="ml-2 flex-1 text-sm font-semibold text-neutral-800"
                        placeholder="Enter a location"
                        placeholderTextColor="#9CA3AF"
                        value={locationQuery}
                        onChangeText={setLocationQuery}
                      />
                    </View>

                    <TouchableOpacity className="rounded-2xl bg-[#111111] px-5 py-3.5 shadow-sm">
                      <View className="flex-row items-center gap-2">
                        <Filter size={18} color="#FFFFFF" />
                        <Text className="text-sm font-bold text-white">Filters</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <View className="rounded-full bg-[#111111] px-4 py-2.5">
                      <Text className="text-sm font-extrabold text-white">
                        {WORKER_HOME_JOBS.length} live sites nearby
                      </Text>
                    </View>
                    <View className="rounded-full bg-white/95 px-4 py-2.5">
                      <Text className="text-sm font-bold text-neutral-800">
                        Search from {locationQuery || DEFAULT_HOME_LOCATION}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="absolute bottom-5 right-5 rounded-2xl bg-white px-3 py-3 shadow-sm">
                  <Navigation size={18} color={Colors.common.BRAND} />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => handleViewDetails(featuredJob)}
                className="mx-5 mb-5 mt-[-26px] rounded-[28px] bg-white px-5 py-5 shadow-lg"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 flex-row items-center gap-4">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                      <Briefcase size={24} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-2xl font-extrabold text-neutral-950">
                        {featuredJob.title}
                      </Text>
                      <Text className="text-base font-medium text-neutral-500">
                        {featuredJob.company} - {formatDistance(featuredJob.distanceMiles)} -{" "}
                        {featuredJob.startLabel}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-xl font-extrabold text-neutral-950">
                      {formatPayRate(featuredJob.payRatePerDay)}
                    </Text>
                    <Text className="mt-1 text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                      Tap to view
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-[34px] font-extrabold text-neutral-950">
                  Nearby Jobs
                </Text>
                <Text className="mt-1 text-base font-medium text-neutral-500">
                  {filteredJobs.length} within 5 mi of {locationQuery || DEFAULT_HOME_LOCATION}
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

            <View className="mt-5 rounded-[28px] bg-[#111111] px-5 py-4">
              <View className="flex-row items-center gap-3">
                <CalendarClock size={18} color="#FFFFFF" />
                <Text className="flex-1 text-sm font-semibold text-white/92">
                  Sort by closing soon to surface jobs expiring first, highest
                  paid to rank by day rate, or nearby to move from nearest to
                  furthest.
                </Text>
              </View>
            </View>

            <View className="mt-6 gap-4">
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
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
