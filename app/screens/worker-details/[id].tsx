import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import WorkerDetailsHeader from "@/components/modules/worker/worker-details/WorkerDetailsHeader";
import WorkerInfo from "@/components/modules/worker/worker-details/WorkerInfo";
import WorkerDetailsStats from "@/components/modules/worker/worker-details/WorkerDetailsStats";
import WorkerDetailsDocuments from "@/components/modules/worker/worker-details/WorkerDetailsDocuments";
import WorkerDetailsWorkHistory from "@/components/modules/worker/worker-details/WorkerDetailsWorkHistory";
import WorkerDetailsReviews from "@/components/modules/worker/worker-details/WorkerDetailsReviews";
import WorkerRatingStars from "@/components/modules/worker/worker-details/_ui/WorkerRatingStars";
import { useGetSingleWorkerQuery } from "@/store/api/workerProfileApi";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";

const getWorkerData = (response: any) => response?.data?.data ?? response?.data ?? response;

const getImageUrl = (value?: string | null) => {
  if (!value) return null;
  return value.match(/\]\((https?:\/\/[^)]+)\)/)?.[1] ?? value;
};

const formatTrade = (value?: string | null) => {
  if (!value) return "Worker";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

const getLocationCoordinates = (value: any): [number, number] | undefined => {
  const coordinates = value?.coordinates ?? value;

  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    Number.isFinite(Number(coordinates[0])) &&
    Number.isFinite(Number(coordinates[1]))
  ) {
    return [Number(coordinates[0]), Number(coordinates[1])];
  }

  return undefined;
};

const formatLocation = (value: any) => {
  if (!value) return "Location not available";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    if (typeof value.address === "string") return value.address;
    if (typeof value.label === "string") return value.label;
    if (typeof value.name === "string") return value.name;
    if (typeof value.formattedAddress === "string") return value.formattedAddress;
  }

  return getCoordinateLabel(getLocationCoordinates(value));
};

const mapCertificate = (certificate: any, index: number) => {
  if (typeof certificate === "string") {
    return {
      id: certificate || `certificate-${index}`,
      name: certificate.split("/").pop() || `Certificate ${index + 1}`,
      size: "Uploaded",
    };
  }

  return {
    id: certificate?.id ?? certificate?.url ?? `certificate-${index}`,
    name:
      certificate?.name ??
      certificate?.title ??
      certificate?.url?.split("/").pop() ??
      `Certificate ${index + 1}`,
    size: certificate?.size ?? "Uploaded",
  };
};

const mapServerWorkerToDetails = (response: any) => {
  const worker = getWorkerData(response);
  const profile = worker?.profile ?? {};
  const workerProfile = worker?.workerProfile ?? {};
  const trades = Array.isArray(workerProfile?.trades) ? workerProfile.trades : [];
  const role = trades.length > 0 ? trades.map(formatTrade).join(", ") : "Worker";
  const certificates = Array.isArray(workerProfile?.certificates)
    ? workerProfile.certificates
    : [];

  return {
    name: profile?.name ?? worker?.name ?? worker?.email ?? "Worker",
    role,
    status: worker?.status === "ACTIVE" ? "Available" : worker?.status ?? "Worker",
    rating: String(worker?.rating ?? workerProfile?.rating ?? "0.0"),
    reviews: `${worker?.totalReviews ?? worker?.reviewsCount ?? 0} reviews`,
    location: formatLocation(
      workerProfile?.address ?? workerProfile?.location ?? worker?.location,
    ),
    locationCoordinates: getLocationCoordinates(
      workerProfile?.address ?? workerProfile?.location ?? worker?.location,
    ),
    distance: worker?.distance ?? workerProfile?.distance,
    image: getImageUrl(profile?.image),
    stats: [
      {
        label: "Jobs Completed",
        value: String(workerProfile?.jobsCompleted ?? worker?.jobsCompleted ?? 0),
      },
      {
        label: "Experience",
        value:
          workerProfile?.experience != null
            ? `${workerProfile.experience}`
            : "N/A",
      },
      {
        label: "Certificates",
        value: String(certificates.length),
      },
    ],
    about:
      workerProfile?.about ??
      workerProfile?.bio ??
      `${profile?.name ?? "This worker"} is registered as ${role}.`,
    documents: certificates.map(mapCertificate),
    workHistory: Array.isArray(workerProfile?.workHistory)
      ? workerProfile.workHistory
      : [],
    feedback: Array.isArray(workerProfile?.feedback)
      ? workerProfile.feedback
      : [],
    memberSince: formatDate(worker?.createdAt),
    lastUpdated: formatDate(workerProfile?.updatedAt ?? worker?.updatedAt),
    email: worker?.email,
  };
};

function StaticRatingCard({ worker }: { worker: any }) {

  return (
    <View className="mt-6">
      <Text className="mb-3 text-base font-extrabold text-neutral-900">
        Rating & Feedback
      </Text>

      <View className="rounded-xl border border-neutral-200/80 bg-white p-4">
        <View className="flex-row items-center gap-4">
          <View className="items-center">
            <Text className="text-4xl font-extrabold text-neutral-900">
              {worker.rating}
            </Text>
            <Text className="text-xs text-neutral-400">/5</Text>
            <View className="mt-2">
              <WorkerRatingStars rating={worker.rating} />
            </View>
            <Text className="mt-2 text-xs text-neutral-400">
              {worker.reviews}
            </Text>
          </View>

          <View className="flex-1 gap-2">
            {[200, 40, 32, 19, 7].map((value, index) => (
              <View
                key={`${value}-${index}`}
                className="flex-row items-center gap-2"
              >
                <Text className="w-4 text-right text-xs text-neutral-400">
                  {5 - index}
                </Text>
                <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <View
                    className="h-full rounded-full bg-slate-500"
                    style={{ width: `${Math.max(15, value / 2)}%` }}
                  />
                </View>
                <Text className="w-8 text-right text-xs text-neutral-400">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function StaticTimesheetCard() {
  const weeks = [
    { id: "week-1", title: "Week 1", range: "12 Jul - 16 Jul" },
    { id: "week-2", title: "Week 2", range: "19 Jul - 23 Jul" },
    { id: "week-3", title: "Week 3", range: "26 Jul - 30 Jul" },
    { id: "week-4", title: "Week 4", range: "2 Aug - 6 Aug" },
  ];

  return (
    <View className="mt-4 rounded-2xl bg-white px-4 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-medium text-neutral-900">
          Update Timesheet
        </Text>
        <View className="rounded-full bg-[#FFF1E9] px-2.5 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-xs font-medium"
          >
            Day 3 of 20
          </Text>
        </View>
      </View>

      {weeks.map((week, index) => (
        <View
          key={week.id}
          className={`flex-row items-center justify-between py-3 ${
            index < weeks.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-neutral-900">
              {week.title}
            </Text>
            <Text className="mt-0.5 text-sm text-neutral-500">
              {week.range}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="px-1 py-2 active:opacity-70">
              <Text className="text-sm font-medium text-neutral-600">View</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-xl border border-neutral-200 bg-white px-4 py-2 active:opacity-80">
              <Text className="text-xs font-medium text-neutral-500">
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function WorkerDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const workerQuery = useGetSingleWorkerQuery(
    { id: id as string },
    { skip: !id },
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const worker = React.useMemo(
    () => mapServerWorkerToDetails(workerQuery.data),
    [workerQuery.data],
  );
  const [resolvedLocation, setResolvedLocation] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const coordinates = worker.locationCoordinates;

    setResolvedLocation(null);
    if (!coordinates) return;

    let cancelled = false;

    getAddressFromCoordinates(coordinates)
      .then((address) => {
        if (!cancelled) setResolvedLocation(address);
      })
      .catch(() => {
        if (!cancelled) setResolvedLocation(getCoordinateLabel(coordinates));
      });

    return () => {
      cancelled = true;
    };
  }, [worker.locationCoordinates]);

  const displayWorker = React.useMemo(
    () => ({
      ...worker,
      location: `${resolvedLocation ?? worker.location}${
        worker.distance ? ` - ${getDistanceLabel(worker.distance)}` : ""
      }`,
    }),
    [resolvedLocation, worker],
  );

  const refreshWorker = React.useCallback(async () => {
    if (!id) return;

    setRefreshing(true);
    try {
      await workerQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [id, workerQuery]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      <WorkerDetailsHeader handleHeaderBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshWorker()}
            tintColor={Colors.common.BRAND}
            colors={[Colors.common.BRAND]}
          />
        }
      >
        <View className="pb-32 pt-6">
          {workerQuery.isLoading ? (
            <View className="items-center justify-center px-5 py-12">
              <ActivityIndicator color={Colors.common.BRAND} />
              <Text className="mt-3 text-sm font-semibold text-neutral-500">
                Loading worker details...
              </Text>
            </View>
          ) : workerQuery.isError ? (
            <View className="mx-5 rounded-xl border border-red-100 bg-white p-5">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load worker details. Please try again.
              </Text>
            </View>
          ) : (
            <>
              <WorkerInfo worker={displayWorker} />

              <View className="px-5">
                <WorkerDetailsStats worker={displayWorker} />

                <View className="mt-4 rounded-xl border border-neutral-200/80 bg-white p-4">
                  <Text className="mb-3 text-base font-extrabold text-neutral-900">
                    About
                  </Text>
                  <Text className="text-sm leading-6 text-neutral-600">
                    {displayWorker.about}
                  </Text>
                  <Text className="mt-3 text-xs font-semibold text-neutral-400">
                    Member since {displayWorker.memberSince} • Updated {displayWorker.lastUpdated}
                  </Text>
                </View>

                {displayWorker.documents.length > 0 ? (
                  <WorkerDetailsDocuments worker={displayWorker} />
                ) : null}
                {displayWorker.workHistory.length > 0 ? (
                  <WorkerDetailsWorkHistory worker={displayWorker} />
                ) : null}
                <StaticRatingCard worker={displayWorker} />

                <Text className="mb-3 mt-6 text-base font-extrabold text-neutral-900">
                  Reviews
                </Text>
                {displayWorker.feedback.length > 0 ? (
                  <WorkerDetailsReviews worker={displayWorker} />
                ) : (
                  <View className="rounded-2xl border border-neutral-200/80 bg-white p-4">
                    <Text className="text-center text-sm font-semibold text-neutral-500">
                      No reviews yet.
                    </Text>
                  </View>
                )}

                {/* <StaticTimesheetCard /> */}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
