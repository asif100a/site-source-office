import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Bookmark,
} from "lucide-react-native";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import WorkerRatingStars from "@/components/modules/worker/worker-details/_ui/WorkerRatingStars";
import PLACEHOLDER_USER from "@/assets/images/placeholder/placeholder-user.png";
import { useGetSingleWorkerQuery } from "@/store/api/workerProfileApi";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";
import { useCreateWorkerBookmarkMutation } from "@/store/api/bookmarkApi";

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
    hasBookmarked: Boolean(worker?.isBookmarked),
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

function SectionTitle({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-4">
      <Text className="text-base font-bold text-neutral-900">{title}</Text>
      {detail ? (
        <Text className="text-xs font-medium text-neutral-400">{detail}</Text>
      ) : null}
    </View>
  );
}

function HeroCard({ worker, onBack, isFavorite, onToggleFavorite }: { worker: any; onBack: () => void; isFavorite: boolean; onToggleFavorite: () => void }) {
  return (
    <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Sparkles size={14} color={Colors.common.BRAND} />
              <Text className="text-xs font-bold uppercase text-neutral-900">
                Worker details
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-neutral-600">
                {worker.status}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              {worker.name}
            </Text>
            <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
              {worker.role} profile with verified account details, documents,
              feedback, and activity from the server.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onToggleFavorite}
          activeOpacity={0.88}
          className="flex-row items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3.5"
        >
          <Bookmark size={18} color={isFavorite ? Colors.common.BRAND : "#111827"} fill={isFavorite ? Colors.common.BRAND : "transparent"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.88}
          className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
        >
          <ArrowLeft size={18} color="#111827" />
          <Text className="text-sm font-semibold text-neutral-900">Back</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ProfileCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="items-center">
        <View className="relative">
          <Image
            source={worker.image ? { uri: worker.image } : PLACEHOLDER_USER}
            style={{ width: 96, height: 96 }}
            className="rounded-full"
          />
          <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1">
            <Text className="text-[10px] font-bold text-emerald-700">
              {worker.status}
            </Text>
          </View>
        </View>

        <Text className="mt-6 text-center text-[28px] font-bold text-neutral-900">
          {worker.name}
        </Text>
        <Text className="mt-1 text-base text-neutral-500">
          {worker.role}
        </Text>

        <View className="mt-3 flex-row items-center gap-2">
          <WorkerRatingStars rating={worker.rating} />
          <Text className="text-sm font-medium text-neutral-700">
            <Text className="font-bold">{worker.rating}</Text> (
            {worker.reviews})
          </Text>
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-sm font-medium text-neutral-500">
            {worker.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatsCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="flex-row">
        {worker.stats.map((item: any, index: number) => (
          <View
            key={item.label}
            className={`flex-1 items-center py-2 ${
              index < worker.stats.length - 1
                ? "border-r border-neutral-100"
                : ""
            }`}
          >
            <Text className="text-3xl font-bold text-neutral-900">
              {item.value}
            </Text>
            <Text className="mt-1 text-center text-[11px] text-neutral-500">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AboutCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="About" />
      <Text className="text-sm leading-6 text-neutral-600">
        {worker.about}
      </Text>
      <Text className="mt-3 text-xs font-semibold text-neutral-400">
        Member since {worker.memberSince} - Updated {worker.lastUpdated}
      </Text>
    </View>
  );
}

function DocumentsCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Documents" />
      <View className="flex-row flex-wrap gap-3">
        {worker.documents.map((document: any) => (
          <View
            key={document.id}
            className="min-w-[170px] flex-1 rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <Text className="text-sm font-bold text-rose-500">PDF</Text>
            </View>
            <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
              {document.name}
            </Text>
            <Text className="mt-1 text-[11px] text-neutral-400">
              {document.size}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkHistoryCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Work History" detail="Recent roles" />
      <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        {worker.workHistory.map((item: any, index: number) => (
          <View
            key={item.id}
            className={`flex-row items-start justify-between px-4 py-4 ${
              index < worker.workHistory.length - 1
                ? "border-b border-neutral-100"
                : ""
            }`}
          >
            <View className="flex-1 flex-row items-start gap-3 pr-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Briefcase size={18} color="#64748B" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-900">
                  {item.title}
                </Text>
                <Text className="mt-0.5 text-xs text-neutral-500">
                  {item.company} - {item.duration}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text className="text-sm font-bold text-neutral-900">
                {item.rating}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RatingCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Rating & Feedback" />
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          <Text className="text-4xl font-bold text-neutral-900">
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
  );
}

function ReviewsCard({ worker }: { worker: any }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle
        title="Reviews"
        detail={`${worker.feedback.length} entries`}
      />
      <View className="gap-3">
        {worker.feedback.map((item: any) => (
          <View
            key={item.id}
            className="rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
                  <Text className="text-xs font-bold text-neutral-700">
                    {item.name
                      .split(" ")
                      .map((part: any) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-neutral-900">
                    {item.name}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Star size={13} color="#FBBF24" fill="#FBBF24" />
                    <Text className="text-xs font-bold text-neutral-900">
                      {item.rating}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xs text-neutral-400">{item.date}</Text>
            </View>
            <Text className="mt-3 text-sm leading-6 text-neutral-600">
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SummaryCard({ worker, onBack }: { worker: any; onBack: () => void }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
          <ShieldCheck size={18} color={Colors.common.BRAND} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-900">
            Worker summary
          </Text>
          <Text className="mt-1 text-sm leading-6 text-neutral-600">
            {worker.email ? `${worker.email} - ` : ""}
            {worker.role} - {worker.location}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.88}
        className="mt-5 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-4"
      >
        <Text className="text-sm font-semibold text-neutral-900">Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkerDetailsWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const workerQuery = useGetSingleWorkerQuery(
    { id: id as string },
    { skip: !id },
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [createWorkerBookmark] = useCreateWorkerBookmarkMutation();
  const worker = React.useMemo(
    () => mapServerWorkerToDetails(workerQuery.data),
    [workerQuery.data],
  );

  React.useEffect(() => {
    setIsFavorite(Boolean(worker.hasBookmarked));
  }, [worker.hasBookmarked]);
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

  const toggleFavorite = async () => {
    if (!id) return;
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await createWorkerBookmark({ workerAuthId: String(id) }).unwrap();
    } catch {
      setIsFavorite(!next);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshWorker()}
            tintColor={Colors.common.BRAND}
            colors={[Colors.common.BRAND]}
          />
        }
      >
        <View className="px-6 pt-6 md:px-10 md:pt-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            {workerQuery.isLoading ? (
              <View className="items-center justify-center rounded-[28px] border border-neutral-200 bg-white px-6 py-16">
                <ActivityIndicator color={Colors.common.BRAND} />
                <Text className="mt-3 text-sm font-semibold text-neutral-500">
                  Loading worker details...
                </Text>
              </View>
            ) : workerQuery.isError ? (
              <View className="rounded-[28px] border border-red-100 bg-white px-6 py-10">
                <Text className="text-center text-sm font-semibold text-red-700">
                  Unable to load worker details. Please try again.
                </Text>
              </View>
            ) : (
              <>
                <HeroCard worker={displayWorker} onBack={() => router.back()} isFavorite={isFavorite} onToggleFavorite={() => void toggleFavorite()} />

                <View className="flex-col gap-6 xl:flex-row">
                  <View className="flex-[1.45] gap-4">
                    <ProfileCard worker={displayWorker} />
                    <StatsCard worker={displayWorker} />
                    <AboutCard worker={displayWorker} />
                    {displayWorker.documents.length > 0 ? (
                      <DocumentsCard worker={displayWorker} />
                    ) : null}
                    {displayWorker.workHistory.length > 0 ? (
                      <WorkHistoryCard worker={displayWorker} />
                    ) : null}
                    <RatingCard worker={displayWorker} />
                    {displayWorker.feedback.length > 0 ? (
                      <ReviewsCard worker={displayWorker} />
                    ) : (
                      <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                        <SectionTitle title="Reviews" detail="0 entries" />
                        <Text className="text-center text-sm font-semibold text-neutral-500">
                          No reviews yet.
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-1 gap-4">
                    <SummaryCard worker={displayWorker} onBack={() => router.back()} />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
