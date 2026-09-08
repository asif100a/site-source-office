import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bookmark,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import { Card, ScreenShell } from "./_components";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import {
  useCreateWorkerBookmarkMutation,
  useGetBookmarkWorkersQuery,
} from "@/store/api/bookmarkApi";

type SavedWorker = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  image?: string | null;
};

const getImageUrl = (value?: string | null) => {
  if (!value) return null;
  return value.match(/\]\((https?:\/\/[^)]+)\)/)?.[1] ?? value;
};

const getBookmarkItems = (response: any): any[] => {
  const data = response?.data ?? response;
  const items =
    data?.workers ?? data?.data?.workers ?? data?.bookmarks ?? data?.items ?? [];

  return Array.isArray(items) ? items : [];
};

const getTotalWorkers = (response: any, fallback: number) => {
  const data = response?.data ?? response;
  return data?.meta?.total ?? data?.data?.meta?.total ?? fallback;
};

const mapBookmarkToWorker = (item: any): SavedWorker | null => {
  const workerAuth = item?.workerAuth ?? item?.worker ?? item;
  const profile = workerAuth?.profile ?? item?.profile ?? workerAuth;
  const workerProfile = workerAuth?.workerProfile ?? item?.workerProfile ?? {};
  const id = item?.workerAuthId ?? workerAuth?.id ?? workerAuth?._id ?? profile?.id;

  if (!id || !profile) return null;

  const trades = profile?.trades ?? workerProfile?.trades ?? [];
  const role = Array.isArray(trades) && trades.length > 0 ? trades.join(", ") : "Worker";
  const distance = Number(profile?.distance ?? item?.distance);

  return {
    id: String(id),
    name: profile?.name ?? "Worker",
    role,
    location: Number.isFinite(distance)
      ? `${distance.toFixed(1)} km away`
      : "Location not available",
    availability: "Available for job offers",
    experience: `${profile?.experience ?? workerProfile?.experience ?? 0} Years Experience`,
    image: getImageUrl(profile?.image),
  };
};

export default function SavedWorkers() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [removedWorkerIds, setRemovedWorkerIds] = useState<string[]>([]);
  const [bookmarkingWorkerIds, setBookmarkingWorkerIds] = useState<string[]>([]);
  const [createWorkerBookmark] = useCreateWorkerBookmarkMutation();
  const bookmarkedWorkersQuery = useGetBookmarkWorkersQuery({ page: 1, limit: 100 });

  const savedWorkers = useMemo(
    () =>
      getBookmarkItems(bookmarkedWorkersQuery.data)
        .map(mapBookmarkToWorker)
        .filter(Boolean)
        .filter((worker) => !removedWorkerIds.includes(worker?.id!)),
    [bookmarkedWorkersQuery.data, removedWorkerIds],
  ) as SavedWorker[];

  const filteredWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return savedWorkers;

    return savedWorkers.filter((worker) =>
      [worker.name, worker.role, worker.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, savedWorkers]);

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const refreshWorkers = async () => {
    setRefreshing(true);
    try {
      await bookmarkedWorkersQuery.refetch();
      setRemovedWorkerIds([]);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleFavoriteWorker = (workerId: string) => {
    if (bookmarkingWorkerIds.includes(workerId)) return;

    setRemovedWorkerIds((current) =>
      current.includes(workerId) ? current : [...current, workerId],
    );
    setBookmarkingWorkerIds((current) => [...current, workerId]);

    void createWorkerBookmark({ workerAuthId: workerId })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Favorite updated",
        });
        bookmarkedWorkersQuery.refetch();
      })
      .catch((error) => {
        setRemovedWorkerIds((current) => current.filter((id) => id !== workerId));
        Toast.show({
          type: "error",
          text1: "Favorite failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      })
      .finally(() => {
        setBookmarkingWorkerIds((current) =>
          current.filter((id) => id !== workerId),
        );
      });
  };

  return (
    <ScreenShell title="Saved Worker">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 52 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void refreshWorkers()} />
        }
      >
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 h-12 rounded-xl bg-white border border-neutral-200/80 px-4 flex-row items-center">
            <Search size={18} color="#7B8794" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search saved workers"
              placeholderTextColor="#A3A3A3"
              className="ml-2 flex-1 text-sm text-neutral-900 font-medium"
            />
          </View>

          {/* <TouchableOpacity className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 items-center justify-center active:opacity-80">
            <SlidersHorizontal size={18} color="#1F2937" />
          </TouchableOpacity> */}
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-neutral-950 text-[20px] font-extrabold tracking-tight">
            Saved Workers
          </Text>
          <View className="rounded-xl bg-orange-50 px-3 py-2">
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-extrabold"
            >
              {getTotalWorkers(bookmarkedWorkersQuery.data, savedWorkers.length)} Results
            </Text>
          </View>
        </View>

        <View className="gap-4">
          {bookmarkedWorkersQuery.isLoading ? (
            <Card className="items-center p-6">
              <ActivityIndicator color={Colors.common.BRAND} />
              <Text className="mt-3 text-sm font-semibold text-neutral-500">
                Loading saved workers...
              </Text>
            </Card>
          ) : bookmarkedWorkersQuery.isError ? (
            <Card className="p-6">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load saved workers. Please try again.
              </Text>
            </Card>
          ) : filteredWorkers.length === 0 ? (
            <Card className="p-6">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                No saved workers found.
              </Text>
            </Card>
          ) : filteredWorkers.map((worker) => (
            <Card key={worker.id} className="p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <ProfileAvatar uri={worker.image} name={worker.name} size={42} />
                  <View className="flex-1">
                    <Text className="text-neutral-950 text-[16px] font-extrabold leading-6">
                      {worker.name}
                    </Text>
                    <Text className="text-neutral-500 text-xs mt-1">
                      {worker.role}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={bookmarkingWorkerIds.includes(worker.id)}
                  onPress={() => toggleFavoriteWorker(worker.id)}
                  className="p-1.5 disabled:opacity-60"
                >
                  <Bookmark
                    size={20}
                    color={Colors.common.BRAND}
                    fill={Colors.common.BRAND}
                  />
                </TouchableOpacity>
              </View>

              <View className="mt-4 pt-4 border-t border-neutral-100 gap-3">
                <View className="flex-row items-center gap-2">
                  <MapPin size={14} color="#DC2626" />
                  <Text className="text-neutral-500 text-sm">
                    {worker.location}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Clock3 size={14} color="#6B7280" />
                  <Text className="text-neutral-500 text-sm">
                    {worker.availability}
                  </Text>
                </View>
              </View>

              <View className="mt-5 flex-row items-center justify-between">
                <View className="rounded-xl bg-orange-50 px-3 py-2">
                  <Text
                    style={{ color: Colors.common.BRAND }}
                    className="text-xs font-bold"
                  >
                    {worker.experience}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => openWorkerDetails(worker.id)}
                  style={{ backgroundColor: Colors.common.GRAY_DARK }}
                  className="rounded-xl px-5 py-3 active:opacity-90"
                >
                  <Text className="text-white text-xs font-bold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
