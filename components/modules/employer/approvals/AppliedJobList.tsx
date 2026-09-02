import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppliedJobApplication, formatAppliedJobDate } from "@/utils/jobApplications";

type AppliedJobListProps = {
  applications: AppliedJobApplication[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

export default function AppliedJobList({
  applications,
  isLoading,
  isFetching,
  isError,
  hasNextPage,
  onLoadMore,
}: AppliedJobListProps) {
  if (isLoading) {
    return <ActivityIndicator className="mt-8" color="#FF5500" />;
  }

  return (
    <View className="gap-3">
      <Text className="text-lg font-extrabold text-neutral-950">
        Applied Jobs
      </Text>

      {isError ? (
        <Text className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Unable to load applied jobs. Please try again.
        </Text>
      ) : null}

      {!isError && applications.length === 0 ? (
        <View className="rounded-2xl bg-white p-5">
          <Text className="text-sm font-semibold text-neutral-700">
            No applied jobs found.
          </Text>
        </View>
      ) : null}

      {applications.map((application) => {
        const job = application.job;

        return (
          <View key={application.id} className="rounded-2xl bg-white p-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-extrabold text-neutral-950">
                  {job?.title ?? "Job application"}
                </Text>
                <Text className="mt-1 text-xs font-medium text-neutral-500">
                  {job?.employerAuth?.profile?.name ?? "Employer"}
                </Text>
              </View>
              <Text className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase text-orange-700">
                {application.status ?? "PENDING"}
              </Text>
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2">
              <Text className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                {job?.trades?.join(", ") || "Trade not set"}
              </Text>
              <Text className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                {job?.hourlyRate != null ? `$${job.hourlyRate}/hour` : "Rate not set"}
              </Text>
            </View>

            <Text className="mt-3 text-xs text-neutral-500">
              {formatAppliedJobDate(job?.startDate)} - {formatAppliedJobDate(job?.endDate)}
            </Text>
            <Text className="mt-1 text-xs text-neutral-400">
              Applied {formatAppliedJobDate(application.appliedAt)}
            </Text>
          </View>
        );
      })}

      {hasNextPage ? (
        <TouchableOpacity
          disabled={isFetching}
          onPress={onLoadMore}
          className="items-center rounded-xl bg-white px-4 py-3"
        >
          {isFetching ? (
            <ActivityIndicator color="#FF5500" />
          ) : (
            <Text className="text-xs font-bold text-neutral-900">
              Load more applications
            </Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
