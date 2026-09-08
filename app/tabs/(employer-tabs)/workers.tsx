import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bookmark,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useGetAllWorkersQuery } from "@/store/api/workerProfileApi";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";

type Worker = {
  id: string;
  image?: string | null;
  name: string;
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

export default function EmployerWorkersScreen() {
  const router = useRouter();
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

  const handleSearchWorkers = () => {
    router.push({
      pathname: "/screens/search/SearchWorker",
      params: { origin: "employer" },
    });
  };

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

  const refreshWorkers = async () => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    await workersQuery.refetch();
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl
            refreshing={workersQuery.isFetching && page === 1}
            onRefresh={() => void refreshWorkers()}
          />
        }
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleSearchWorkers}
            activeOpacity={0.9}
            className="flex-1 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-4 py-3"
          >
            <Search size={18} color="#A3A3A3" className="mr-2" />
            <Text className="flex-1 text-neutral-400 text-sm font-medium">
              Search workers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearchWorkers}
            className="w-12 h-12 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-85"
          >
            <SlidersHorizontal size={18} color="#333333" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-4 mb-4">
          <Text className="text-neutral-950 text-[18px] font-semibold">
            Search Result
          </Text>
          <View className="bg-orange-50 px-2.5 py-1.5 rounded-md">
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
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-sm font-semibold text-neutral-500">
                Loading workers...
              </Text>
            </View>
          ) : workersQuery.isError ? (
            <View className="items-center rounded-xl bg-red-50 p-6">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load workers. Please try again.
              </Text>
            </View>
          ) : workers.length === 0 ? (
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-sm font-semibold text-neutral-500">
                No workers found.
              </Text>
            </View>
          ) : (
            workers.map((worker) => (
              <View
                key={worker.id}
                className="bg-white rounded-xl overflow-hidden"
              >
                <View className="px-4 pt-4 pb-3">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-center gap-3 flex-1 pr-3">
                      <ProfileAvatar
                        uri={getImageUrl(worker.image)}
                        name={worker.name}
                        size={44}
                      />
                      <View className="flex-1">
                        <Text className="text-neutral-950 text-base font-bold">
                          {worker.name}
                        </Text>
                        <Text className="text-neutral-500 text-sm">
                          {worker.avgRating?.toFixed(1) ?? "0.0"} rating -{" "}
                          {worker.totalReviews ?? 0} reviews
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity className="p-1.5">
                      <Bookmark size={20} color="#737373" />
                    </TouchableOpacity>
                  </View>

                  <View className="pt-4 mt-4 border-t border-neutral-100 gap-2.5">
                    <View className="flex-row items-center gap-2">
                      <MapPin size={14} color="#C81E1E" />
                      <Text className="text-neutral-500 text-xs">
                        {addressByWorkerId[worker.id] ??
                          getCoordinateLabel(worker.location?.coordinates)}
                        {worker.distance
                          ? ` - ${getDistanceLabel(worker.distance)}`
                          : ""}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={14} color="#737373" />
                      <Text className="text-neutral-500 text-xs">
                        Available for job offers
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between px-4 pb-4">
                  <View className="bg-orange-50 px-3 py-1.5 rounded-md">
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
                      <Text
                        className="text-neutral-700 text-xs font-medium"
                        numberOfLines={1}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-slate-900 px-4 py-2 rounded-md active:opacity-90"
                      style={{ minWidth: 92, flexShrink: 0 }}
                    >
                      <Text
                        className="text-white text-xs font-medium text-center"
                        numberOfLines={1}
                      >
                        Send Offer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}

          {hasNextPage && workers.length > 0 ? (
            <TouchableOpacity
              disabled={workersQuery.isFetching}
              onPress={() => setPage((current) => current + 1)}
              className="items-center rounded-xl bg-white px-4 py-3 disabled:opacity-60"
            >
              <Text className="text-xs font-bold text-neutral-900">
                {workersQuery.isFetching ? "Loading..." : "Load more workers"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
