import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
  X,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import {
  useCreateWorkerBookmarkMutation,
  useGetBookmarkWorkersQuery,
} from "@/store/api/bookmarkApi";
import { useGetAllWorkersQuery } from "@/store/api/workerProfileApi";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";
import { useGetMyJobsQuery } from "@/store/api/jobApi";
import { useCreateJobOfferMutation, useGetSentJobOffersQuery } from "@/store/api/jobOfferApi";

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

type WorkerTab = "all" | "favorite" | "sent";

type OfferJob = {
  id: string;
  title: string;
  workersNeeded?: number;
  hourlyRate?: number;
  startDate?: string;
  endDate?: string;
};

type SentJobOffer = {
  id: string;
  jobId: string;
  workerAuthId: string;
  status?: string;
  offeredAt?: string;
  job?: OfferJob & {
    location?: {
      coordinates?: [number, number];
    };
    trades?: string[];
  };
  workerAuth?: {
    profile?: Worker;
    workerProfile?: {
      trades?: string[];
      experience?: number | null;
    };
  };
};

const getWorkers = (response: any): Worker[] => {
  const data = response?.data ?? response;
  const workers =
    data?.workers ?? data?.data?.workers ?? data?.bookmarks ?? data?.items ?? [];

  return Array.isArray(workers) ? workers : [];
};

const getBookmarkedWorkers = (response: any): Worker[] =>
  getWorkers(response)
    .map((item: any) => {
      const worker = item?.workerAuth ?? item?.worker ?? item;
      const profile = worker?.profile ?? item?.profile ?? worker;
      const id = item?.workerAuthId ?? worker?.id ?? worker?._id ?? profile?.id;

      return profile ? { ...profile, id } : null;
    })
    .filter(Boolean);

const getTotalWorkers = (response: any, fallback: number) => {
  const data = response?.data ?? response;
  return data?.meta?.total ?? data?.data?.meta?.total ?? fallback;
};

const getMyJobs = (response: any): OfferJob[] => {
  const data = response?.data ?? response;
  const jobs = data?.jobs ?? data?.data?.jobs ?? data?.items ?? [];

  return Array.isArray(jobs) ? jobs : [];
};

const getSentJobOffers = (response: any): SentJobOffer[] => {
  const data = response?.data ?? response;
  const offers = data?.offers ?? data?.data?.offers ?? data?.items ?? [];

  return Array.isArray(offers) ? offers : [];
};

const getTotalSentOffers = (response: any, fallback: number) => {
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

const getWorkerId = (worker: Worker) =>
  String((worker as any).authId ?? worker.id);

const workerTabs: { key: WorkerTab; label: string }[] = [
  { key: "all", label: "All Worker" },
  { key: "favorite", label: "Favorite" },
  { key: "sent", label: "Sent Offers" },
];

const formatJobDate = (value?: string) => {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function SendOfferModal({
  visible,
  worker,
  jobs,
  isLoadingJobs,
  isSending,
  onClose,
  onSendOffer,
}: {
  visible: boolean;
  worker: Worker | null;
  jobs: OfferJob[];
  isLoadingJobs: boolean;
  isSending: boolean;
  onClose: () => void;
  onSendOffer: (jobId: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="max-h-[78%] rounded-t-3xl bg-white px-5 pb-6 pt-5">
          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-lg font-bold text-neutral-950">
                Send job offer
              </Text>
              <Text className="mt-1 text-sm text-neutral-500">
                Select a posted job for {worker?.name ?? "this worker"}.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="px-2 py-1">
              <X size={20} color={Colors.common.BRAND || "#737373"} />
            </TouchableOpacity>
          </View>

          {isLoadingJobs ? (
            <View className="items-center rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-8">
              <ActivityIndicator color={Colors.common.BRAND} />
              <Text className="mt-3 text-sm font-semibold text-neutral-500">
                Loading jobs...
              </Text>
            </View>
          ) : jobs.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-8">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                No posted jobs available.
              </Text>
            </View>
          ) : (
            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                {jobs.map((job) => (
                  <TouchableOpacity
                    key={job.id}
                    disabled={isSending}
                    onPress={() => onSendOffer(job.id)}
                    activeOpacity={0.88}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 disabled:opacity-60"
                  >
                    <Text className="text-base font-bold text-neutral-950">
                      {job.title}
                    </Text>
                    <Text className="mt-1 text-xs text-neutral-500">
                      {job.workersNeeded ?? 0} worker
                      {job.workersNeeded === 1 ? "" : "s"} needed
                      {job.hourlyRate != null
                        ? ` - GBP ${job.hourlyRate}/hour`
                        : ""}
                    </Text>
                    <Text className="mt-1 text-xs text-neutral-500">
                      {formatJobDate(job.startDate)} - {formatJobDate(job.endDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function EmployerWorkersScreen() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState<WorkerTab>("all");
  const [page, setPage] = useState(1);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedOfferWorker, setSelectedOfferWorker] = useState<Worker | null>(
    null
  );
  const [favoriteWorkerIds, setFavoriteWorkerIds] = useState<string[]>([]);
  const [bookmarkingWorkerIds, setBookmarkingWorkerIds] = useState<string[]>([]);
  const [addressByWorkerId, setAddressByWorkerId] = useState<
    Record<string, string>
  >({});
  const [createWorkerBookmark] = useCreateWorkerBookmarkMutation();
  const [createJobOffer, { isLoading: isSendingOffer }] =
    useCreateJobOfferMutation();
  const workersQuery = useGetAllWorkersQuery({ page, limit: 10 });
  console.log("workersQuery: ", workersQuery);
  const bookmarkedWorkersQuery = useGetBookmarkWorkersQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated }
  );
  const myJobsQuery = useGetMyJobsQuery(
    { page: 1, limit: 100, status: "POSTED" },
    { skip: !isAuthenticated }
  );
  const sentOffersQuery = useGetSentJobOffersQuery({
    page: 1,
    limit: 10,
  }, { skip: !isAuthenticated });
  const pageWorkers = useMemo(
    () => getWorkers(workersQuery.data),
    [workersQuery.data]
  );
  const favoriteWorkers = useMemo(
    () => getBookmarkedWorkers(bookmarkedWorkersQuery.data),
    [bookmarkedWorkersQuery.data]
  );
  const myJobs = useMemo(() => getMyJobs(myJobsQuery.data), [myJobsQuery.data]);
  const sentOffers = useMemo(
    () => getSentJobOffers(sentOffersQuery.data),
    [sentOffersQuery.data]
  );
  const totalSentOffers = getTotalSentOffers(
    sentOffersQuery.data,
    sentOffers.length
  );
  const totalWorkers = getTotalWorkers(workersQuery.data, workers.length);
  const visibleFavoriteWorkers = favoriteWorkers.filter((worker) =>
    favoriteWorkerIds.includes(getWorkerId(worker))
  );
  const listWorkers = activeTab === "all" ? workers : visibleFavoriteWorkers;
  const hasNextPage = activeTab === "all" && workers.length < totalWorkers;
  const isListLoading =
    activeTab === "all"
      ? workersQuery.isLoading
      : activeTab === "favorite"
        ? bookmarkedWorkersQuery.isLoading
        : sentOffersQuery.isLoading;
  const isListError =
    activeTab === "all"
      ? workersQuery.isError
      : activeTab === "favorite"
        ? bookmarkedWorkersQuery.isError
        : sentOffersQuery.isError;

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
    const idsFromAllWorkers = workers
      .filter((worker) => Boolean((worker as any).hasBookmarked))
      .map(getWorkerId);
    const idsFromBookmarks = favoriteWorkers.map(getWorkerId);

    setFavoriteWorkerIds(
      Array.from(new Set([...idsFromAllWorkers, ...idsFromBookmarks]))
    );
  }, [favoriteWorkers, workers]);

  useEffect(() => {
    listWorkers.forEach((worker) => {
      const coordinates = worker.location?.coordinates;
      const workerId = getWorkerId(worker);
      if (!coordinates || addressByWorkerId[workerId]) return;

      getAddressFromCoordinates(coordinates)
        .then((address) => {
          setAddressByWorkerId((current) => ({
            ...current,
            [workerId]: address,
          }));
        })
        .catch(() => {
          setAddressByWorkerId((current) => ({
            ...current,
            [workerId]: getCoordinateLabel(coordinates),
          }));
        });
    });
  }, [addressByWorkerId, listWorkers]);

  const toggleFavoriteWorker = (worker: Worker) => {
    if (!isAuthenticated) {
      router.push({
        pathname: "/auth",
        params: {
          step: "login",
          role: "employer",
          returnTo: "/tabs/(employer-tabs)/workers",
        },
      } as any);
      return;
    }

    const workerId = getWorkerId(worker);
    if (bookmarkingWorkerIds.includes(workerId)) return;

    const wasFavorite = favoriteWorkerIds.includes(workerId);

    setFavoriteWorkerIds((current) =>
      current.includes(workerId)
        ? current.filter((id) => id !== workerId)
        : [...current, workerId]
    );
    setBookmarkingWorkerIds((current) => [...current, workerId]);

    void createWorkerBookmark({ workerAuthId: workerId })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: wasFavorite ? "Favorite updated" : "Worker added to favorites",
        });
        bookmarkedWorkersQuery.refetch();
        workersQuery.refetch();
      })
      .catch((error) => {
        setFavoriteWorkerIds((current) =>
          wasFavorite
            ? Array.from(new Set([...current, workerId]))
            : current.filter((id) => id !== workerId)
        );
        Toast.show({
          type: "error",
          text1: "Favorite failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      })
      .finally(() => {
        setBookmarkingWorkerIds((current) =>
          current.filter((id) => id !== workerId)
        );
      });
  };

  const refreshWorkers = async () => {
    if (activeTab === "favorite" || activeTab === "sent") {
      if (activeTab === "sent" && isAuthenticated) {
        await sentOffersQuery.refetch();
        return;
      }

      if (isAuthenticated) await bookmarkedWorkersQuery.refetch();
      return;
    }

    if (page !== 1) {
      setPage(1);
      return;
    }

    await workersQuery.refetch();
  };

  const openSendOfferModal = (worker: Worker) => {
    if (!isAuthenticated) {
      router.push({
        pathname: "/auth",
        params: {
          step: "login",
          role: "employer",
          returnTo: "/tabs/(employer-tabs)/workers",
        },
      } as any);
      return;
    }

    setSelectedOfferWorker(worker);
  };

  const sendOffer = (jobId: string) => {
    if (!selectedOfferWorker || isSendingOffer) return;

    const workerAuthId = getWorkerId(selectedOfferWorker);

    void createJobOffer({ jobId, workerAuthId })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Offer sent",
          text2: "Your job offer was sent successfully.",
        });
        setSelectedOfferWorker(null);
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Offer failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      });
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
            refreshing={
              activeTab === "all"
                ? workersQuery.isFetching && page === 1
                : activeTab === "favorite"
                  ? bookmarkedWorkersQuery.isFetching
                  : sentOffersQuery.isFetching
            }
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
            {activeTab === "all"
              ? "Search Result"
              : activeTab === "favorite"
                ? "Favorite Workers"
                : "Sent Offers"}
          </Text>
          <View className="bg-orange-50 px-2.5 py-1.5 rounded-md">
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-medium"
            >
              {activeTab === "all"
                ? totalWorkers
                : activeTab === "favorite"
                  ? favoriteWorkers.length
                  : totalSentOffers} Results
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-2.5">
          {workerTabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.9}
                style={
                  isActive
                    ? { backgroundColor: Colors.common.GRAY_DARK }
                    : { backgroundColor: "#FFFFFF" }
                }
                className={`rounded-lg px-4 py-2.5 ${
                  isActive ? "" : "border border-neutral-200/80"
                }`}
              >
                <Text
                  className={`min-w-18 text-center text-xs font-bold ${
                    isActive ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="gap-4">
          {activeTab !== "all" && !isAuthenticated ? (
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-center text-sm font-semibold text-neutral-500">
                Login to view your {activeTab === "favorite" ? "favorite workers" : "sent offers"}.
              </Text>
            </View>
          ) : isListLoading ? (
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-sm font-semibold text-neutral-500">
                {activeTab === "all"
                  ? "Loading workers..."
                  : activeTab === "favorite"
                    ? "Loading favorite workers..."
                    : "Loading sent offers..."}
              </Text>
            </View>
          ) : isListError ? (
            <View className="items-center rounded-xl bg-red-50 p-6">
              <Text className="text-center text-sm font-semibold text-red-700">
                {activeTab === "all"
                  ? "Unable to load workers. Please try again."
                  : activeTab === "favorite"
                    ? "Unable to load favorite workers. Please try again."
                    : "Unable to load sent offers. Please try again."}
              </Text>
            </View>
          ) : activeTab === "sent" && sentOffers.length > 0 ? (
            sentOffers.map((offer) => {
              const worker = offer.workerAuth?.profile;
              const workerProfile = offer.workerAuth?.workerProfile;
              const job = offer.job;

              return (
                <View
                  key={offer.id}
                  className="overflow-hidden rounded-xl bg-white"
                >
                  <View className="px-4 pt-4 pb-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 flex-row items-center gap-3">
                        <ProfileAvatar
                          uri={getImageUrl(worker?.image)}
                          name={worker?.name}
                          size={44}
                        />
                        <View className="flex-1">
                          <Text className="text-base font-bold text-neutral-950">
                            {worker?.name ?? "Worker"}
                          </Text>
                          <Text className="text-sm text-neutral-500">
                            {job?.title ?? "Job offer"}
                          </Text>
                        </View>
                      </View>

                      <View className="rounded-full bg-orange-50 px-2.5 py-1">
                        <Text
                          style={{ color: Colors.common.BRAND }}
                          className="text-[10px] font-bold"
                        >
                          {offer.status ?? "PENDING"}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-4 gap-2.5 border-t border-neutral-100 pt-4">
                      <View className="flex-row items-center gap-2">
                        <MapPin size={14} color="#C81E1E" />
                        <Text className="text-xs text-neutral-500">
                          {job?.location?.coordinates
                            ? getCoordinateLabel(job.location.coordinates)
                            : "Location not available"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Clock size={14} color="#737373" />
                        <Text className="text-xs text-neutral-500">
                          Offered {formatJobDate(offer.offeredAt)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between px-4 pb-4">
                    <View className="rounded-md bg-orange-50 px-3 py-1.5">
                      <Text
                        style={{ color: Colors.common.BRAND }}
                        className="text-xs font-medium"
                      >
                        {job?.hourlyRate != null
                          ? `GBP ${job.hourlyRate}/hour`
                          : "Rate not set"}
                      </Text>
                    </View>
                    <Text className="text-xs font-medium text-neutral-500">
                      {workerProfile?.experience ?? 0} Years Experience
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (activeTab === "sent"
            ? sentOffers.length === 0
            : listWorkers.length === 0) ? (
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-sm font-semibold text-neutral-500">
                {activeTab === "all"
                  ? "No workers found."
                  : activeTab === "favorite"
                    ? "No favorite workers found."
                    : "No sent offers found."}
              </Text>
            </View>
          ) : activeTab !== "sent" ? (
            listWorkers.map((worker) => {
              const workerId = getWorkerId(worker);
              const isFavorite = favoriteWorkerIds.includes(workerId);

              return (
              <View
                key={workerId}
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

                    <TouchableOpacity
                      disabled={bookmarkingWorkerIds.includes(workerId)}
                      onPress={() => toggleFavoriteWorker(worker)}
                      className="p-1.5 disabled:opacity-60"
                    >
                      <Bookmark
                        size={20}
                        color={isFavorite ? Colors.common.BRAND : "#737373"}
                        fill={isFavorite ? Colors.common.BRAND : "transparent"}
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="pt-4 mt-4 border-t border-neutral-100 gap-2.5">
                    <View className="flex-row items-center gap-2">
                      <MapPin size={14} color="#C81E1E" />
                      <Text className="text-neutral-500 text-xs">
                        {addressByWorkerId[workerId] ??
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
                      onPress={() => openWorkerDetails(workerId)}
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
                      onPress={() => openSendOfferModal(worker)}
                      disabled={isSendingOffer}
                      className="bg-slate-900 px-4 py-2 rounded-md active:opacity-90"
                      style={{ minWidth: 92, flexShrink: 0 }}
                    >
                      <Text
                        className="text-white text-xs font-medium text-center"
                        numberOfLines={1}
                      >
                        {isSendingOffer ? "Sending..." : "Send Offer"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              );
            })
          ) : null}

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
      <SendOfferModal
        visible={Boolean(selectedOfferWorker)}
        worker={selectedOfferWorker}
        jobs={myJobs}
        isLoadingJobs={myJobsQuery.isFetching}
        isSending={isSendingOffer}
        onClose={() => setSelectedOfferWorker(null)}
        onSendOffer={sendOffer}
      />
    </ScreenWrapper>
  );
}
