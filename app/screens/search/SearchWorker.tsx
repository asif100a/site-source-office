import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchWorkerHeader from "@/components/modules/worker/search-workers/SearchWorkerHeader";
import WorkerSearchCardRow from "@/components/modules/worker/search-workers/WorkerSearchCardRow";
import SearchWorkerSearchBar from "@/components/modules/worker/search-workers/SearchWorkerSearchBar";
import SearchWorkerMapView from "@/components/modules/worker/search-workers/SearchWorkerMapView";
import SearchWorkerModal from "@/components/modules/worker/search-workers/SearchWorkerModal";
import { useGetAllWorkersQuery } from "@/store/api/workerProfileApi";
import { getAddressDetails, getAddressSuggestions } from "@/utils/googlePlaces";

type WorkerCard = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  image?: string | null;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type FilterValues = {
  project: string;
  jobPosting: string;
  tradeSkill: string;
  experience: string;
  radius: string;
  availableTime: string;
};

const WORKERS_LIMIT = 10;
const MAP_WORKERS_LIMIT = 100;
const DEFAULT_MAP_COORDINATE = { latitude: 51.5295, longitude: -0.056 };

const getWorkerItems = (response: any): any[] => {
  const data = response?.data ?? response;
  const workers = data?.workers ?? data?.data?.workers ?? data?.items ?? [];

  return Array.isArray(workers) ? workers : [];
};

const getWorkersTotal = (response: any, fallback: number) => {
  const data = response?.data ?? response;
  return data?.meta?.total ?? data?.data?.meta?.total ?? fallback;
};

const getRadiusMiles = (value?: string) => {
  if (!value || value === "all") return undefined;
  if (value === "1-10") return 10;
  if (value === "11-20") return 20;
  if (value === "21-50") return 50;
  return undefined;
};

const getTradeFilter = (value?: string) => {
  if (!value || value === "all") return undefined;
  return value;
};

const getExperienceFilter = (value?: string) => {
  if (!value || value === "all") return undefined;
  return value;
};

const getAvailabilityLabel = (value?: string) => {
  if (value === "8-5") return "Available 8am - 5pm";
  if (value === "9-6") return "Available 9am - 6pm";
  if (value === "night") return "Available for night shift";
  return "Available for job offers";
};

const getImageUrl = (value?: string | null) => {
  if (!value) return null;
  return value.match(/\]\((https?:\/\/[^)]+)\)/)?.[1] ?? value;
};

const getWorkerCoordinate = (worker: any, index: number) => {
  const [longitude, latitude] = worker.location?.coordinates ?? [];

  if (Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))) {
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  return {
    latitude: DEFAULT_MAP_COORDINATE.latitude + index * 0.002,
    longitude: DEFAULT_MAP_COORDINATE.longitude - index * 0.002,
  };
};

const parseCoordinateSearch = (value: string) => {
  const match = value.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return { latitude, longitude };
};

const mapWorkerToCard = (
  worker: any,
  index: number,
  availableTime?: string,
): WorkerCard => {
  const trades = worker.trades ?? worker.workerProfile?.trades ?? [];
  const role =
    Array.isArray(trades) && trades.length > 0 ? trades.join(", ") : "Worker";
  const distance = Number(worker.distance);

  return {
    id: String(worker.authId ?? worker.id ?? worker._id),
    name: worker.name ?? worker.profile?.name ?? "Worker",
    role,
    location: Number.isFinite(distance)
      ? `${distance.toFixed(1)} km away`
      : "Location not available",
    availability: getAvailabilityLabel(availableTime),
    experience: `${
      worker.experience ?? worker.workerProfile?.experience ?? 0
    } Years Experience`,
    image: getImageUrl(worker.image ?? worker.profile?.image),
    coordinate: getWorkerCoordinate(worker, index),
  };
};

export default function SearchWorkerScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [mapWorkers, setMapWorkers] = useState<WorkerCard[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { control } = useForm<FilterValues>({
    defaultValues: {
      project: "",
      jobPosting: "",
      tradeSkill: "all",
      experience: "all",
      radius: "all",
      availableTime: "",
    },
  });
  const filterValues = useWatch({ control });
  const trimmedSearchQuery = searchQuery.trim();
  const radius = getRadiusMiles(filterValues.radius);
  const trade = getTradeFilter(filterValues.tradeSkill);
  const experience = getExperienceFilter(filterValues.experience);
  const isWaitingForSearch = trimmedSearchQuery !== debouncedSearchQuery;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(trimmedSearchQuery);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [trimmedSearchQuery]);

  useEffect(() => {
    setPage(1);
    setWorkers([]);
  }, [
    debouncedSearchQuery,
    filterValues.availableTime,
    filterValues.experience,
    filterValues.radius,
    filterValues.tradeSkill,
  ]);

  useEffect(() => {
    let isMounted = true;

    if (viewType !== "map") {
      return () => {
        isMounted = false;
      };
    }

    if (debouncedSearchQuery.length < 3) {
      setMapCoordinates(DEFAULT_MAP_COORDINATE);
      return () => {
        isMounted = false;
      };
    }

    const parsedCoordinates = parseCoordinateSearch(debouncedSearchQuery);
    if (parsedCoordinates) {
      setMapCoordinates(parsedCoordinates);
      return () => {
        isMounted = false;
      };
    }

    getAddressSuggestions(debouncedSearchQuery)
      .then((suggestions) => {
        const suggestion = suggestions[0];
        if (!suggestion) return null;
        return getAddressDetails(suggestion.placeId, suggestion.description);
      })
      .then((details) => {
        if (!isMounted || !details) return;

        setMapCoordinates({
          latitude: details.coordinates[1],
          longitude: details.coordinates[0],
        });
      })
      .catch(() => {
        if (isMounted) setMapCoordinates(DEFAULT_MAP_COORDINATE);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery, viewType]);

  const listWorkersQuery = useGetAllWorkersQuery({
    page,
    limit: WORKERS_LIMIT,
    ...(debouncedSearchQuery ? { searchTerm: debouncedSearchQuery } : {}),
    ...(radius ? { radius } : {}),
    ...(trade ? { trade } : {}),
    // ...(experience ? { experience } : {}),
  });

  const mapWorkersQuery = useGetAllWorkersQuery({
    page: 1,
    limit: MAP_WORKERS_LIMIT,
    lat: mapCoordinates?.latitude ?? DEFAULT_MAP_COORDINATE.latitude,
    long: mapCoordinates?.longitude ?? DEFAULT_MAP_COORDINATE.longitude,
    ...(radius ? { radius } : {}),
    ...(trade ? { trade } : {}),
    // ...(experience ? { experience } : {}),
  }, { skip: viewType !== "map" });

  useEffect(() => {
    if (
      !listWorkersQuery.currentData &&
      (listWorkersQuery.isFetching || isWaitingForSearch)
    ) {
      return;
    }

    const response = listWorkersQuery.currentData ?? listWorkersQuery.data;
    if (!response || (page > 1 && listWorkersQuery.isFetching)) return;

    const nextWorkers = getWorkerItems(response).map((worker, index) =>
      mapWorkerToCard(worker, index, filterValues.availableTime),
    );

    setWorkers((current) => {
      if (page === 1) return nextWorkers;

      const existingIds = new Set(current.map((worker) => worker.id));
      return [
        ...current,
        ...nextWorkers.filter((worker) => !existingIds.has(worker.id)),
      ];
    });
    setHasNextPage(
      page * WORKERS_LIMIT < getWorkersTotal(response, nextWorkers.length),
    );
  }, [
    filterValues.availableTime,
    isWaitingForSearch,
    listWorkersQuery.currentData,
    listWorkersQuery.data,
    listWorkersQuery.isFetching,
    page,
  ]);

  useEffect(() => {
    const response = mapWorkersQuery.currentData ?? mapWorkersQuery.data;
    if (!response || mapWorkersQuery.isFetching) return;

    setMapWorkers(
      getWorkerItems(response).map((worker, index) =>
        mapWorkerToCard(worker, index, filterValues.availableTime),
      ),
    );
  }, [
    filterValues.availableTime,
    mapWorkersQuery.currentData,
    mapWorkersQuery.data,
    mapWorkersQuery.isFetching,
  ]);

  const openWorkerDetails = (id: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id, origin: "employer" },
    });
  };

  const goBackToOrigin = () => {
    void originRoute;
    router.back();
  };

  const handleChangeSearchQuery = (value: string) => {
    setSearchQuery(value);
    setPage(1);
    setWorkers([]);
  };

  const refreshWorkers = async () => {
    setRefreshing(true);

    try {
      if (viewType === "map") {
        await mapWorkersQuery.refetch();
        return;
      }

      if (page !== 1) {
        setPage(1);
        return;
      }

      await listWorkersQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const isInitialLoading =
    workers.length === 0 &&
    (isWaitingForSearch ||
      listWorkersQuery.isLoading ||
      listWorkersQuery.isFetching);
  const isLoadingMore = listWorkersQuery.isFetching && workers.length > 0;
  const isMapLoading =
    mapWorkers.length === 0 &&
    (isWaitingForSearch || mapWorkersQuery.isLoading || mapWorkersQuery.isFetching);

  return (
    <ScreenWrapper>
      <SearchWorkerHeader
        goBackToOrigin={goBackToOrigin}
        setViewType={setViewType}
        viewType={viewType}
      />

      {viewType === "list" && (
        <SearchWorkerSearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleChangeSearchQuery}
          setShowFilters={setShowFilters}
        />
      )}

      {viewType === "list" ? (
        <ScrollView
          className="flex-1 bg-neutral-50 px-5 pt-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refreshWorkers()}
            />
          }
        >
          <View className="my-4 flex-row items-center justify-between">
            <Text className="text-base font-extrabold tracking-tight text-neutral-900">
              Search Result
            </Text>
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-extrabold"
            >
              {getWorkersTotal(listWorkersQuery.data, workers.length)} Results
            </Text>
          </View>

          <View className="gap-4">
            {isInitialLoading ? (
              <View className="items-center rounded-2xl bg-white px-5 py-8">
                <ActivityIndicator color={Colors.common.BRAND} />
                <Text className="mt-3 text-sm font-semibold text-neutral-500">
                  Loading workers...
                </Text>
              </View>
            ) : listWorkersQuery.isError ? (
              <View className="rounded-2xl bg-red-50 px-5 py-8">
                <Text className="text-center text-sm font-semibold text-red-700">
                  Unable to load workers. Please try again.
                </Text>
              </View>
            ) : workers.length === 0 ? (
              <View className="items-center rounded-2xl bg-white px-5 py-8">
                <Text className="text-sm font-semibold text-neutral-500">
                  No workers found.
                </Text>
              </View>
            ) : (
              workers.map((worker) => (
                <WorkerSearchCardRow
                  key={worker.id}
                  worker={worker}
                  onPress={() => openWorkerDetails(worker.id)}
                />
              ))
            )}

            {hasNextPage && workers.length > 0 ? (
              <TouchableOpacity
                disabled={listWorkersQuery.isFetching}
                onPress={() => setPage((current) => current + 1)}
                className="items-center rounded-xl bg-white px-4 py-3 disabled:opacity-60"
              >
                <Text className="text-xs font-bold text-neutral-900">
                  {isLoadingMore ? "Loading..." : "Load more workers"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      ) : (
        <View className="relative flex-1">
          <SearchWorkerMapView
            WORKERS={mapWorkers}
            isLoading={isMapLoading}
            isError={mapWorkersQuery.isError}
            openWorkerDetails={openWorkerDetails}
          />

          <View className="absolute top-0 w-full">
            <SearchWorkerSearchBar
              searchQuery={searchQuery}
              setSearchQuery={handleChangeSearchQuery}
              setShowFilters={setShowFilters}
            />
          </View>
        </View>
      )}

      <SearchWorkerModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        control={control}
      />
    </ScreenWrapper>
  );
}
