import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Bookmark,
  Clock3,
  Filter,
  MapPin,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
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
  rating: string;
  status: "Available" | "Busy" | "Shortlisted";
  distance: string;
  skills: string[];
};

const FILTERS = ["All", "Available", "Shortlisted", "Busy"] as const;

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

const mapBookmarkToWorker = (item: any): SavedWorker | null => {
  const workerAuth = item?.workerAuth ?? item?.worker ?? item;
  const profile = workerAuth?.profile ?? item?.profile ?? workerAuth;
  const workerProfile = workerAuth?.workerProfile ?? item?.workerProfile ?? {};
  const id = item?.workerAuthId ?? workerAuth?.id ?? workerAuth?._id ?? profile?.id;

  if (!id || !profile) return null;

  const trades = profile?.trades ?? workerProfile?.trades ?? [];
  const skills = Array.isArray(trades) ? trades : [];
  const distance = Number(profile?.distance ?? item?.distance);
  const avgRating = Number(profile?.avgRating ?? item?.avgRating);

  return {
    id: String(id),
    name: profile?.name ?? "Worker",
    role: skills.length > 0 ? skills.join(", ") : "Worker",
    location: "Location not available",
    availability: "Available for job offers",
    experience: `${profile?.experience ?? workerProfile?.experience ?? 0} Years Experience`,
    image: getImageUrl(profile?.image),
    rating: Number.isFinite(avgRating) ? `${avgRating.toFixed(1)}/5` : "0/5",
    status: "Available",
    distance: Number.isFinite(distance)
      ? `${distance.toFixed(1)} km away`
      : "Distance unavailable",
    skills: skills.length > 0 ? skills : ["Worker"],
  };
};

function statusTone(status: SavedWorker["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700";
    case "Shortlisted":
      return "bg-orange-50 text-orange-700";
    case "Busy":
      return "bg-neutral-100 text-neutral-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <View className="flex-1 min-w-[180px] rounded-[22px] border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
          {icon}
        </View>
        <Text className="text-xs font-semibold text-emerald-600">{note}</Text>
      </View>
      <Text className="mt-4 text-2xl font-black tracking-tight text-neutral-950">
        {value}
      </Text>
      <Text className="mt-1 text-sm font-medium text-neutral-500">{label}</Text>
    </View>
  );
}

function WorkerCard({
  worker,
  onOpenDetails,
  onToggleFavorite,
  isBookmarking,
}: {
  worker: SavedWorker;
  onOpenDetails: (workerId: string) => void;
  onToggleFavorite: (workerId: string) => void;
  isBookmarking: boolean;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row flex-1 items-center gap-4">
          <ProfileAvatar uri={worker.image} name={worker.name} size={56} />
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-lg font-bold text-neutral-950">
                {worker.name}
              </Text>
              <View className={`rounded-full px-2.5 py-1 ${statusTone(worker.status)}`}>
                <Text className="text-[11px] font-bold uppercase tracking-[0px]">
                  {worker.status}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-sm font-medium text-neutral-500">
              {worker.role}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isBookmarking}
          onPress={() => onToggleFavorite(worker.id)}
          className="p-2 disabled:opacity-60"
        >
          <Bookmark
            size={18}
            color={Colors.common.BRAND}
            fill={Colors.common.BRAND}
          />
        </TouchableOpacity>
      </View>

      <View className="mt-5 grid gap-3 md:grid-cols-3">
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <MapPin size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.location} - {worker.distance}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <Clock3 size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.availability}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <Star size={15} color={Colors.common.BRAND} />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.rating} - {worker.experience}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {worker.skills.map((skill) => (
          <View key={skill} className="rounded-full bg-orange-50 px-3 py-1.5">
            <Text className="text-xs font-semibold text-orange-700">
              {skill}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-5 flex-row flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <TouchableOpacity
          onPress={() => onOpenDetails(worker.id)}
          activeOpacity={0.9}
          className="flex-row items-center gap-1.5"
        >
          <Text className="text-sm font-semibold text-neutral-700">
            View details
          </Text>
          <ArrowRight size={16} color="#737373" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-neutral-900">
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl bg-neutral-950 px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-white">
              Hire again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function SavedWorkersWebScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const [removedWorkerIds, setRemovedWorkerIds] = useState<string[]>([]);
  const [bookmarkingWorkerIds, setBookmarkingWorkerIds] = useState<string[]>([]);
  const [createWorkerBookmark] = useCreateWorkerBookmarkMutation();
  const bookmarkedWorkersQuery = useGetBookmarkWorkersQuery({ page: 1, limit: 100 });

  const savedWorkers = useMemo(
    () =>
      getBookmarkItems(bookmarkedWorkersQuery.data)
        .map(mapBookmarkToWorker)
        .filter(Boolean)
        .filter((worker) => !removedWorkerIds.includes(worker.id)) as SavedWorker[],
    [bookmarkedWorkersQuery.data, removedWorkerIds],
  );

  const filteredWorkers = useMemo(() => {
    return savedWorkers.filter((worker) => {
      const matchesQuery =
        query.trim().length === 0 ||
        [worker.name, worker.role, worker.location, ...worker.skills]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      const matchesFilter =
        activeFilter === "All" || worker.status === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query, savedWorkers]);

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
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
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-10">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <View className="flex-col xl:flex-row">
                <View className="flex-1 p-6 md:p-8 xl:p-10">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Bookmark size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Saved workers
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {savedWorkers.length} workers saved
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Keep your best workers close.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Search, filter, and reopen trusted workers from a desktop
                      layout that keeps your hiring shortlist easy to scan.
                    </Text>
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Users size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Browse workers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/my-jobs" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <Zap size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Review jobs
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      icon={<Bookmark size={18} color={Colors.common.BRAND} />}
                      label="Saved workers"
                      value={String(savedWorkers.length)}
                      note="Bookmarked"
                    />
                    <StatCard
                      icon={<Star size={18} color={Colors.common.BRAND} />}
                      label="Average rating"
                      value={
                        savedWorkers.length
                          ? `${(
                              savedWorkers.reduce(
                                (total, worker) =>
                                  total + Number(worker.rating.replace("/5", "")),
                                0,
                              ) / savedWorkers.length
                            ).toFixed(1)}/5`
                          : "0/5"
                      }
                      note="Saved pool"
                    />
                    <StatCard
                      icon={<Clock3 size={18} color={Colors.common.BRAND} />}
                      label="Fastest response"
                      value="-"
                      note="Not tracked"
                    />
                    <StatCard
                      icon={<Filter size={18} color={Colors.common.BRAND} />}
                      label="Shortlisted"
                      value={String(savedWorkers.length)}
                      note="Ready to view"
                    />
                  </View>
                </View>

                <View className="w-full xl:w-[410px] border-t xl:border-t-0 xl:border-l border-neutral-200 bg-neutral-50 p-6 md:p-8">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Search and filter
                    </Text>

                    <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <Search size={18} color="#A3A3A3" />
                      <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search saved workers"
                        placeholderTextColor="#A3A3A3"
                        className="flex-1 text-sm text-neutral-900 outline-none"
                      />
                    </View>

                    <View className="mt-4">
                      <View className="flex-row items-center gap-2">
                        <Filter size={16} color="#737373" />
                        <Text className="text-sm font-semibold text-neutral-700">
                          Status
                        </Text>
                      </View>

                      <View className="mt-3 flex-row flex-wrap gap-2">
                        {FILTERS.map((filter) => {
                          const active = filter === activeFilter;

                          return (
                            <Pressable
                              key={filter}
                              onPress={() => setActiveFilter(filter)}
                              className={`rounded-full px-4 py-2 ${
                                active ? "bg-neutral-950" : "bg-neutral-100"
                              }`}
                            >
                              <Text
                                className={`text-sm font-semibold ${
                                  active ? "text-white" : "text-neutral-700"
                                }`}
                              >
                                {filter}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <View className="mt-5 rounded-2xl bg-orange-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Shortlist tip
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-neutral-700">
                        Keep your most reliable workers saved here so they are
                        ready when a new job opens up.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.5] gap-4">
                <View className="flex-row items-center justify-between gap-3">
                  <View>
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Saved list
                    </Text>
                    <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                      {filteredWorkers.length} workers ready
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-neutral-900">
                      Sort by rating
                    </Text>
                    <ArrowRight size={16} color="#737373" />
                  </TouchableOpacity>
                </View>

                <View className="gap-4">
                  {bookmarkedWorkersQuery.isLoading ? (
                    <View className="items-center rounded-[24px] border border-neutral-200 bg-white px-6 py-10">
                      <ActivityIndicator color={Colors.common.BRAND} />
                      <Text className="mt-3 text-sm font-semibold text-neutral-500">
                        Loading saved workers...
                      </Text>
                    </View>
                  ) : bookmarkedWorkersQuery.isError ? (
                    <View className="items-center rounded-[24px] border border-red-100 bg-red-50 px-6 py-10">
                      <Text className="text-sm font-semibold text-red-700">
                        Unable to load saved workers. Please try again.
                      </Text>
                    </View>
                  ) : filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onOpenDetails={openWorkerDetails}
                      onToggleFavorite={toggleFavoriteWorker}
                      isBookmarking={bookmarkingWorkerIds.includes(worker.id)}
                    />
                  ))}

                  {filteredWorkers.length === 0 ? (
                    <View className="items-center rounded-[24px] border border-dashed border-neutral-300 bg-white px-6 py-10">
                      <Text className="text-base font-bold text-neutral-900">
                        No saved workers found
                      </Text>
                      <Text className="mt-2 max-w-md text-center text-sm text-neutral-500">
                        Try a different name, skill, or status filter.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                    Shortlist summary
                  </Text>
                  <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                    Your trusted pool is ready
                  </Text>

                  <View className="mt-4 gap-3">
                    {[
                      {
                        title: "Fast access",
                        note: "Jump back into workers you have already reviewed.",
                      },
                      {
                        title: "Better matching",
                        note: "Use saved workers first when a new job needs to move quickly.",
                      },
                      {
                        title: "Clear follow-up",
                        note: "Message or reopen details without searching again.",
                      },
                    ].map((item) => (
                      <View
                        key={item.title}
                        className="rounded-2xl bg-neutral-100 p-4"
                      >
                        <Text className="text-sm font-semibold text-neutral-900">
                          {item.title}
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-neutral-600">
                          {item.note}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-neutral-950 p-5">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                    Need support?
                  </Text>
                  <Text className="mt-1 text-2xl font-black tracking-tight text-white">
                    Open a support ticket
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="mt-4 flex-row items-center justify-between rounded-2xl bg-white px-4 py-3.5"
                  >
                    <Text className="text-sm font-semibold text-neutral-950">
                      Message support
                    </Text>
                    <ArrowRight size={16} color="#111827" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
