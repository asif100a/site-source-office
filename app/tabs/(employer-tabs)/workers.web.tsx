import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  Bookmark,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import { useGetAllWorkersQuery } from "@/store/api/workerProfileApi";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";

type Worker = {
  id: string;
  name: string;
  image?: string | null;
  avgRating?: number;
  totalReviews?: number;
  location?: {
    coordinates?: [number, number];
  };
  experience?: number | null;
  distance?: number | null;
};

const getWorkers = (response: any): Worker[] => {
  const data = response?.data ?? response;
  const workers = data?.workers ?? data?.data?.workers ?? data?.items ?? [];

  return Array.isArray(workers) ? workers : [];
};

const getTotalWorkers = (response: any, fallback: number) => {
  const data = response?.data ?? response;
  return data?.meta?.total ?? data?.data?.meta?.total ?? fallback;
};

const getImageUrl = (value?: string | null) => {
  if (!value) return null;
  return value.match(/\]\((https?:\/\/[^)]+)\)/)?.[1] ?? value;
};

const getDistanceLabel = (distance?: number | null) => {
  const value = Number(distance);
  if (!Number.isFinite(value)) return "";

  return `${(value / 1000).toFixed(1)} km away`;
};

const getCoordinateLabel = (coordinates?: [number, number]) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return "Location not available";
  }

  return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
};

const TRADE_OPTIONS = [
  "All trades",
  "Groundworker",
  "Labour",
  "Electrician",
  "Carpenter",
];

const RADIUS_OPTIONS = [
  "Any radius",
  "1 - 10 miles",
  "11 - 20 miles",
  "21 - 50 miles",
];

const TIME_OPTIONS = [
  "Any time",
  "8am - 5pm",
  "9am - 6pm",
  "Night shift",
];

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            activeOpacity={0.85}
            className={`rounded-full px-4 py-2 ${
              value === option ? "bg-neutral-950" : "bg-neutral-100"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                value === option ? "text-white" : "text-neutral-700"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function EmployerWorkersScreenWeb() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tradeSkill, setTradeSkill] = useState("All trades");
  const [radius, setRadius] = useState("Any radius");
  const [availableTime, setAvailableTime] = useState("Any time");
  const [page, setPage] = useState(1);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [addressByWorkerId, setAddressByWorkerId] = useState<
    Record<string, string>
  >({});
  const workersQuery = useGetAllWorkersQuery({ page, limit: 10 });
  const pageWorkers = useMemo(
    () => getWorkers(workersQuery.data),
    [workersQuery.data]
  );
  const totalWorkers = getTotalWorkers(workersQuery.data, workers.length);
  const hasNextPage = workers.length < totalWorkers;

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const filteredWorkers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return workers.filter((worker) => {
      const address =
        addressByWorkerId[worker.id] ??
        getCoordinateLabel(worker.location?.coordinates);
      const distanceLabel = getDistanceLabel(worker.distance);
      const matchesQuery =
        !normalizedQuery ||
        [
          worker.name,
          address,
          distanceLabel,
          `${worker.experience ?? 0} Years Experience`,
          `${worker.avgRating ?? 0} rating`,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesTrade = tradeSkill === "All trades";

      const distance = Number(worker.distance ?? 0) / 1000;
      const matchesRadius =
        radius === "Any radius" ||
        (radius === "1 - 10 miles" && distance <= 16.09) ||
        (radius === "11 - 20 miles" && distance > 16.09 && distance <= 32.19) ||
        (radius === "21 - 50 miles" && distance > 32.19 && distance <= 80.47);

      const matchesTime = availableTime === "Any time";

      return matchesQuery && matchesTrade && matchesRadius && matchesTime;
    });
  }, [addressByWorkerId, availableTime, radius, searchQuery, tradeSkill, workers]);

  useEffect(() => {
    if (!workersQuery.data || (page > 1 && workersQuery.isFetching)) return;

    setWorkers((current) => {
      if (page === 1) return pageWorkers;

      const existingIds = new Set(current.map((worker) => worker.id));
      return [
        ...current,
        ...pageWorkers.filter((worker) => !existingIds.has(worker.id)),
      ];
    });
  }, [page, pageWorkers, workersQuery.data, workersQuery.isFetching]);

  useEffect(() => {
    workers.forEach((worker) => {
      const coordinates = worker.location?.coordinates;
      if (!coordinates || addressByWorkerId[worker.id]) return;

      getAddressFromCoordinates(coordinates)
        .then((address) => {
          setAddressByWorkerId((current) => ({
            ...current,
            [worker.id]: address,
          }));
        })
        .catch(() => {
          setAddressByWorkerId((current) => ({
            ...current,
            [worker.id]: getCoordinateLabel(coordinates),
          }));
        });
    });
  }, [addressByWorkerId, workers]);

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-14 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative gap-4">
                  <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                    <Text className="text-xs font-bold uppercase text-neutral-900">
                      Workers
                    </Text>
                  </View>

                  <View className="gap-2">
                    <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                      Review and hire workers from this platform.
                    </Text>
                    <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                      Search, filter, and shortlist worker profiles in one
                      organized place built for faster hiring decisions.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="flex-row items-center gap-3">
                <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-3">
                  <Search size={18} color="#A3A3A3" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search workers"
                    placeholderTextColor="#A3A3A3"
                    className="flex-1 px-3 text-sm font-medium text-neutral-800"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowFilters((current) => !current)}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-4 py-3"
                >
                  <SlidersHorizontal size={16} color="#333333" />
                  <Text className="text-sm font-bold text-neutral-700">
                    Filters
                  </Text>
                  <ChevronDown
                    size={16}
                    color="#525252"
                    style={{
                      transform: [{ rotate: showFilters ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
              </View>

              {showFilters ? (
                <View className="mt-5 gap-5 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 md:p-5">
                  <FilterGroup
                    label="Trade / Skill"
                    options={TRADE_OPTIONS}
                    value={tradeSkill}
                    onChange={setTradeSkill}
                  />
                  <FilterGroup
                    label="Radius"
                    options={RADIUS_OPTIONS}
                    value={radius}
                    onChange={setRadius}
                  />
                  <FilterGroup
                    label="Available time"
                    options={TIME_OPTIONS}
                    value={availableTime}
                    onChange={setAvailableTime}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setTradeSkill("All trades");
                      setRadius("Any radius");
                      setAvailableTime("Any time");
                    }}
                    activeOpacity={0.85}
                    className="self-start rounded-xl bg-white px-4 py-2.5"
                  >
                    <Text className="text-sm font-bold text-neutral-700">
                      Reset filters
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mb-5 flex-row items-center justify-between gap-4">
                <Text className="text-lg font-bold tracking-tight text-neutral-900">
                  Search Result
                </Text>
                <View className="rounded-md bg-orange-50 px-2.5 py-1.5">
                  <Text
                    style={{ color: Colors.common.BRAND }}
                    className="text-xs font-medium"
                  >
                    {totalWorkers} Results
                  </Text>
                </View>
              </View>

              <View className="gap-4">
                {workersQuery.isLoading ? (
                  <View className="rounded-2xl border border-neutral-200 bg-white px-5 py-10">
                    <Text className="text-center text-sm font-semibold text-neutral-500">
                      Loading workers...
                    </Text>
                  </View>
                ) : workersQuery.isError ? (
                  <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-10">
                    <Text className="text-center text-sm font-semibold text-red-700">
                      Unable to load workers. Please try again.
                    </Text>
                  </View>
                ) : null}

                {!workersQuery.isLoading &&
                  !workersQuery.isError &&
                  filteredWorkers.map((worker) => (
                  <View
                    key={worker.id}
                    className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white"
                  >
                    <View className="px-5 pt-5 pb-4">
                      <View className="flex-row items-start justify-between gap-4">
                        <View className="flex-1 flex-row items-center gap-3 pr-3">
                          <ProfileAvatar
                            uri={getImageUrl(worker.image)}
                            name={worker.name}
                            size={48}
                          />
                          <View className="flex-1">
                            <Text className="text-base font-bold text-neutral-950">
                              {worker.name}
                            </Text>
                            <Text className="text-sm text-neutral-500">
                              {worker.avgRating?.toFixed(1) ?? "0.0"} rating -{" "}
                              {worker.totalReviews ?? 0} reviews
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity className="p-1.5" activeOpacity={0.85}>
                          <Bookmark size={20} color="#737373" />
                        </TouchableOpacity>
                      </View>

                      <View className="mt-4 gap-2.5 border-t border-neutral-100 pt-4">
                        <View className="flex-row items-center gap-2">
                          <MapPin size={14} color="#C81E1E" />
                          <Text className="text-xs text-neutral-500">
                            {addressByWorkerId[worker.id] ??
                              getCoordinateLabel(worker.location?.coordinates)}
                            {worker.distance
                              ? ` - ${getDistanceLabel(worker.distance)}`
                              : ""}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Clock size={14} color="#737373" />
                          <Text className="text-xs text-neutral-500">
                            Available for job offers
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between px-5 pb-5">
                      <View className="rounded-md bg-orange-50 px-3 py-1.5">
                        <Text
                          style={{ color: Colors.common.BRAND }}
                          className="text-xs font-medium"
                        >
                          {worker.experience ?? 0} Years Experience
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                          onPress={() => openWorkerDetails(worker.id)}
                          activeOpacity={0.9}
                        >
                          <Text className="text-xs font-medium text-neutral-700">
                            View Details
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          className="rounded-md bg-slate-900 px-4 py-2"
                          style={{ minWidth: 92, flexShrink: 0 }}
                        >
                          <Text className="text-center text-xs font-medium text-white">
                            Send Offer
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  ))}

                {!workersQuery.isLoading &&
                !workersQuery.isError &&
                filteredWorkers.length === 0 ? (
                  <View className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10">
                    <Text className="text-base font-bold text-neutral-900">
                      No matching workers found
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-neutral-600">
                      Try a different search term or reset the current filters to
                      see more worker profiles.
                    </Text>
                  </View>
                ) : null}

                {hasNextPage && workers.length > 0 ? (
                  <TouchableOpacity
                    disabled={workersQuery.isFetching}
                    onPress={() => setPage((current) => current + 1)}
                    className="items-center rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 disabled:opacity-60"
                    activeOpacity={0.9}
                  >
                    <Text className="text-sm font-semibold text-neutral-950">
                      {workersQuery.isFetching
                        ? "Loading..."
                        : "Load more workers"}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
