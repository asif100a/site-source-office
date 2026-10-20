import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";
import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  AppliedJobApplication,
  formatAppliedJobDate,
  ReceivedJobOffer,
} from "@/utils/jobApplications";

type AppliedJobsListProps = {
  applications: AppliedJobApplication[];
  offers?: ReceivedJobOffer[];
  activeTab: string;
  searchQuery: string;
  onOpenJobDetails: (id: string, status: string) => void;
  onAcceptOffer?: (offerId: string) => void;
  acceptingOfferIds?: string[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

const getWorkersCount = (workersNeeded?: number | { howMany?: number }[]) =>
  Array.isArray(workersNeeded)
    ? workersNeeded.reduce(
        (total, item) => total + Number(item?.howMany ?? 0),
        0,
      )
    : Number(workersNeeded ?? 0);

function matchesTab(application: AppliedJobApplication, activeTab: string) {
  const applicationStatus = application.status?.toUpperCase();
  const jobStatus = application.job?.status?.toUpperCase();

  if (activeTab === "My Offers") return applicationStatus === "PENDING";
  if (activeTab === "My Applications") {
    return applicationStatus === "ACCEPTED" || applicationStatus === "REJECTED";
  }
  if (activeTab === "Active Jobs") return applicationStatus === "ACCEPTED";
  if (activeTab === "Completed") {
    return applicationStatus === "COMPLETED" || jobStatus === "COMPLETED";
  }

  return true;
}

export default function AppliedJobsList({
  applications,
  offers = [],
  activeTab,
  searchQuery,
  onOpenJobDetails,
  onAcceptOffer,
  acceptingOfferIds = [],
  isLoading,
  isError,
  isFetching,
  hasNextPage,
  onLoadMore,
}: AppliedJobsListProps) {
  const router = useRouter();
  const query = searchQuery.trim().toLowerCase();
  const visibleOffers = offers.filter((offer) => {
    if (activeTab !== "My Offers") return false;
    if (!query) return true;

    const job = offer.job;
    return [
      job?.title,
      job?.trades?.join(" "),
      job?.employerAuth?.profile?.name,
      offer.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  const visibleApplications = applications.filter((application) => {
    if (!matchesTab(application, activeTab)) return false;
    if (!query) return true;

    const job = application.job;
    return [
      job?.title,
      job?.trades?.join(" "),
      job?.employerAuth?.profile?.name,
      application.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (isLoading) {
    return (
      <View className="items-center rounded-2xl bg-white px-5 py-8">
        <Text className="text-sm font-semibold text-neutral-500">
          Loading applied jobs...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="rounded-2xl bg-red-50 px-5 py-8">
        <Text className="text-center text-sm font-semibold text-red-700">
          Unable to load your applied jobs. Please try again.
        </Text>
      </View>
    );
  }

  if (activeTab === "My Offers") {
    return (
      <FlatList
        data={visibleOffers}
        keyExtractor={(offer) => offer.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item: offer }) => {
          const job = offer.job;
          const status = offer.status?.toUpperCase() ?? "PENDING";
          const isPending = status === "PENDING";
          const isAccepting = acceptingOfferIds.includes(offer.id);
          const workersCount = getWorkersCount(job?.workersNeeded);

          return (
            <TouchableOpacity
              onPress={() => onOpenJobDetails(job?.id ?? offer.jobId, "offer")}
              activeOpacity={0.9}
              className="rounded-xl border border-neutral-100/80 bg-white p-5"
            >
              <View className="mb-4 flex-row items-start justify-between gap-3">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <Briefcase size={22} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-neutral-950">
                      {job?.title ?? "Job offer"}
                    </Text>
                    <Text className="text-xs font-semibold text-neutral-500">
                      {job?.employerAuth?.profile?.name ?? "Employer"}
                    </Text>
                  </View>
                </View>

                <View
                  className="rounded-full px-2.5 py-1"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                >
                  <Text
                    className="text-[10px] font-extrabold"
                    style={{ color: Colors.common.BRAND }}
                  >
                    {status}
                  </Text>
                </View>
              </View>

              <View className="gap-2.5 border-t border-neutral-50 pt-3">
                <View className="flex-row items-center gap-2">
                  <MapPin size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {job?.location?.coordinates?.length === 2
                      ? `${job.location.coordinates[1].toFixed(4)}, ${job.location.coordinates[0].toFixed(4)}`
                      : "Location not available"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Users size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {workersCount} worker{workersCount === 1 ? "" : "s"} needed
                    {job?.hourlyRate != null
                      ? ` · £${job.hourlyRate}/hour`
                      : ""}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Calendar size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {formatAppliedJobDate(job?.startDate)} -{" "}
                    {formatAppliedJobDate(job?.endDate)}
                  </Text>
                </View>
              </View>

              {isPending ? (
                <View className="mt-0 flex-row justify-end">
                  <TouchableOpacity
                    disabled={isAccepting}
                    onPress={() => onAcceptOffer?.(offer.id)}
                    className="mt-4 items-center rounded-md bg-slate-900 px-4 py-2.5 disabled:opacity-60"
                  >
                    <Text className="text-xs font-bold text-white">
                      {isAccepting ? "Accepting..." : "Accept Offer"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8">
            <Text className="text-base font-bold text-neutral-900">
              No offers found
            </Text>
            <Text className="mt-2 text-center text-sm text-neutral-500">
              New job offers will appear here.
            </Text>
          </View>
        }
        ListFooterComponent={
          hasNextPage ? (
            <TouchableOpacity
              disabled={isFetching}
              onPress={onLoadMore}
              className="mt-4 items-center rounded-xl bg-white px-4 py-3"
            >
              <Text className="text-xs font-bold text-neutral-900">
                {isFetching ? "Loading..." : "Load more offers"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 4 }}
      />
    );
  }

  const renderApplication = ({
    item: application,
  }: {
    item: AppliedJobApplication;
  }) => {
    const job = application.job;
    const jobId = job?.id ?? application.jobId;
    const applicationStatus = application.status?.toUpperCase() ?? "PENDING";
    const isCompleted = job?.status?.toUpperCase() === "COMPLETED";
    const workersCount = getWorkersCount(job?.workersNeeded);

    return (
      <TouchableOpacity
        onPress={() =>
          onOpenJobDetails(
            jobId,
            isCompleted ? "completed" : applicationStatus.toLowerCase(),
          )
        }
        activeOpacity={0.9}
        className="rounded-xl border border-neutral-100/80 bg-white p-5"
      >
        <View className="mb-4 flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <Briefcase size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-extrabold text-neutral-950">
                {job?.title ?? "Applied job"}
              </Text>
              <Text className="text-xs font-semibold text-neutral-500">
                {job?.employerAuth?.profile?.name ?? "Employer"}
              </Text>
            </View>
          </View>

          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
          >
            <Text
              className="text-[10px] font-extrabold"
              style={{ color: Colors.common.BRAND }}
            >
              {applicationStatus}
            </Text>
          </View>
        </View>

        <View className="gap-2.5 border-t border-neutral-50 pt-3">
          <View className="flex-row items-center gap-2">
            <MapPin size={15} color="#858585" />
            <Text className="text-xs font-semibold text-neutral-500">
              {job?.location?.coordinates?.length === 2
                ? `${job.location.coordinates[1].toFixed(4)}, ${job.location.coordinates[0].toFixed(4)}`
                : "Location not available"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Users size={15} color="#858585" />
            <Text className="text-xs font-semibold text-neutral-500">
              {workersCount} worker{workersCount === 1 ? "" : "s"} needed
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Calendar size={15} color="#858585" />
            <Text className="text-xs font-semibold text-neutral-500">
              {formatAppliedJobDate(job?.startDate)} -{" "}
              {formatAppliedJobDate(job?.endDate)}
            </Text>
          </View>
        </View>

        {activeTab === "Active Jobs" ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/chats/chats",
                params: { jobId, origin: "worker" },
              })
            }
            activeOpacity={0.8}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-4 py-2.5"
          >
            <MessageCircle size={16} color="#C2410C" />
            <Text className="text-xs font-bold text-orange-700">Send message</Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={visibleApplications}
      renderItem={renderApplication}
      keyExtractor={(application) => application.id}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={
        <View className="items-center rounded-2xl border border-neutral-100 bg-white px-5 py-8">
          <Text className="text-base font-bold text-neutral-900">
            No applied jobs found
          </Text>
          <Text className="mt-2 text-center text-sm text-neutral-500">
            Apply for a job to see it here.
          </Text>
        </View>
      }
      ListFooterComponent={
        hasNextPage ? (
          <TouchableOpacity
            disabled={isFetching}
            onPress={onLoadMore}
            className="mt-4 items-center rounded-xl bg-white px-4 py-3"
          >
            <Text className="text-xs font-bold text-neutral-900">
              {isFetching ? "Loading..." : "Load more jobs"}
            </Text>
          </TouchableOpacity>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 4 }}
    />
  );
}
