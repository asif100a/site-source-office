import React, { useState } from "react";
import Toast from "react-native-toast-message";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Star } from "lucide-react-native";
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import {
  useGetJobApplicationQuery,
  useUpdatedJobApplicationStatusMutation,
} from "@/store/api/jobApplicationApi";
import JobLocationLabel from "@/components/modules/employer/my-jobs/JobLocationLabel";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenLoader from "@/components/ui/screen-loader";
import {
  getJobApplications,
  getJobApplicationsHasNextPage,
  formatAppliedJobDate,
} from "@/utils/jobApplications";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

type JobReview = {
  id: string;
  rating: number;
  feedback: string;
  givenAt?: string;
};

const getJobReviews = (reviews: unknown): JobReview[] =>
  Array.isArray(reviews) ? reviews : [];

export default function NewJobDetails({
  jobId,
  showApplications = false,
  showApplyButton = false,
  isApplying = false,
  onApply,
}: {
  jobId: string;
  showApplications?: boolean;
  showApplyButton?: boolean;
  isApplying?: boolean;
  onApply?: () => void;
}) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching: isJobFetching,
  } = useGetSingleJobQuery(jobId);
  // console.log("data --------> ", data);
  const [applicationPage, setApplicationPage] = useState(1);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [updateJobApplicationStatus, { isLoading: isUpdating }] =
    useUpdatedJobApplicationStatusMutation();
  const applicationsQuery = useGetJobApplicationQuery(
    { id: jobId, page: applicationPage, limit: 10 },
    { skip: !showApplications },
  );
  const job = data?.data?.data ?? data?.data;
  const reviews = getJobReviews(job?.reviews);
  const applications = showApplications
    ? getJobApplications(applicationsQuery.data)
    : [];
  const hasMoreApplications = showApplications
    ? getJobApplicationsHasNextPage(
        applicationsQuery.data,
        applications.length,
        10,
      )
    : false;
  const refreshing = isJobFetching || applicationsQuery.isFetching;
  // console.log("error", isError, error);
  // console.log("applicationsQuery: ", applicationsQuery);
  // console.log("Applications: ", applications);

  const refreshJob = async () => {
    await Promise.all([
      refetch(),
      showApplications ? applicationsQuery.refetch() : Promise.resolve(),
    ]);
  };

  const handleApplicationStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setIsAccepting(status === "ACCEPTED");
    setIsRejecting(status === "REJECTED");
    try {
      const response = await updateJobApplicationStatus({
        id: applicationId,
        status,
      }).unwrap();
      // console.log("updateJobApplicationStatus response:", response);
      await applicationsQuery.refetch();
      Toast.show({
        type: "success",
        text1: `Application ${status === "ACCEPTED" ? "accepted" : "rejected"}`,
        text2: "The job request status was updated successfully.",
      });
    } catch (statusError) {
      // console.error("updateJobApplicationStatus error:", statusError);
      Toast.show({
        type: "error",
        text1: "Could not update application",
        text2: (statusError as any)?.data?.message ?? "Please try again.",
      });
    } finally {
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <ScreenLoader />
      </ScreenWrapper>
    );
  }

  if (isError || !job) {
    return (
      <View className="rounded-2xl bg-white p-6">
        <Text className="text-base font-bold text-neutral-900">
          {(error as any)?.message ||
            (error as any)?.data?.message ||
            "Unable to load this job"}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Please go back and try again.
        </Text>
      </View>
    );
  }

  const coordinates = Array.isArray(job.location?.coordinates)
    ? ([
        Number(job.location.coordinates[0]),
        Number(job.location.coordinates[1]),
      ] as [number, number])
    : undefined;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshJob} />
      }
    >
      <View className="rounded-3xl bg-white p-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-orange-600">
          New Job
        </Text>
        <Text className="mt-2 text-2xl font-bold text-neutral-950">
          {job.title}
        </Text>
        <Text className="mt-2 text-sm font-semibold text-neutral-500">
          {job.status}
        </Text>

        <View className="mt-6 gap-4">
          <Detail
            label="Trade"
            value={(job.trades ?? []).join(", ") || "Not set"}
          />
          <Detail
            label="Hourly rate"
            value={
              job.hourlyRate != null ? `$${job.hourlyRate}/hour` : "Not set"
            }
          />
          <Detail
            label="Workers needed"
            value={String(job.workersNeeded ?? "Not set")}
          />
          <Detail label="Start date" value={formatDate(job.startDate)} />
          <Detail label="End date" value={formatDate(job.endDate)} />
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Location
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <JobLocationLabel
              location={job.location?.address}
              coordinates={coordinates}
            />
          </View>
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Working hours
          </Text>
          <View className="mt-3 gap-3">
            {(job.workingHours ?? []).map((hour: any) => (
              <View
                key={hour.day}
                className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-3 py-3"
              >
                <Text className="text-sm font-bold text-neutral-900">
                  {hour.day}
                </Text>
                <Text className="text-sm text-neutral-600">
                  {hour.startTime} - {hour.endTime}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Must have
          </Text>
          <Text className="mt-2 text-sm text-neutral-700">
            {(job.mustHave ?? []).join(", ") || "None"}
          </Text>
          <Text className="mt-5 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Notes
          </Text>
          <Text className="mt-2 text-sm leading-6 text-neutral-700">
            {job.note || "No notes"}
          </Text>
        </View>

        {showApplyButton ? (
          <TouchableOpacity
            disabled={isApplying || data?.data?.isApplied}
            onPress={onApply}
            className="mt-6 rounded-2xl bg-neutral-950 px-4 py-4 disabled:bg-neutral-400"
          >
            <Text className="text-center text-sm font-bold text-white">
              {isApplying
                ? "Applying..."
                : data?.data?.isApplied
                  ? "Applied"
                  : "Apply for this job"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {showApplications ? (
        <View className="mt-5 rounded-3xl bg-white p-5">
          <Text className="text-lg font-extrabold text-neutral-950">
            Job Requests
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Workers who have applied for this job.
          </Text>

          {applicationsQuery.isLoading ? (
            <ActivityIndicator className="mt-6" color="#FF5500" />
          ) : null}

          {applicationsQuery.isError ? (
            <Text className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Unable to load job requests. Please try again.
            </Text>
          ) : null}

          {!applicationsQuery.isLoading &&
          !applicationsQuery.isError &&
          applications.length === 0 ? (
            <Text className="mt-5 text-sm text-neutral-500">
              No workers have applied yet.
            </Text>
          ) : null}

          <View className="mt-4 gap-3">
            {applications.map((application) => {
              const worker = application.auth;
              const profile = worker?.profile;
              const workerProfile = worker?.workerProfile;

              return (
                <View
                  key={application.id}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-neutral-950">
                        {profile?.name ?? "Worker"}
                      </Text>
                      <Text className="mt-1 text-xs text-neutral-500">
                        {worker?.email ?? "Email not available"}
                      </Text>
                    </View>
                    <Text className="rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-bold uppercase text-orange-700">
                      {application.status ?? "PENDING"}
                    </Text>
                  </View>

                  <View className="mt-3 flex-row flex-wrap gap-2">
                    <Text className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-600">
                      {workerProfile?.trades?.join(", ") || "Trade not set"}
                    </Text>
                    {workerProfile?.experience ? (
                      <Text className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-600">
                        {workerProfile.experience}
                      </Text>
                    ) : null}
                  </View>

                  <Text className="mt-3 text-xs text-neutral-400">
                    Applied {formatAppliedJobDate(application.appliedAt)}
                  </Text>

                  <View className="mt-4 flex-row gap-2">
                    <TouchableOpacity
                      disabled={
                        isUpdating ||
                        application.status === "ACCEPTED" ||
                        application.status === "REJECTED"
                      }
                      onPress={() =>
                        handleApplicationStatus(application.id, "ACCEPTED")
                      }
                      className="flex-1 items-center rounded-xl bg-emerald-600 disabled:bg-emerald-200 px-3 py-3"
                    >
                      <Text className="text-xs font-bold text-white">
                        {isUpdating && isAccepting
                          ? "Accepting..."
                          : application.status === "ACCEPTED"
                            ? "Accepted"
                            : "Accept"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        isUpdating ||
                        application.status === "ACCEPTED" ||
                        application.status === "REJECTED"
                      }
                      onPress={() =>
                        handleApplicationStatus(application.id, "REJECTED")
                      }
                      className="flex-1 items-center rounded-xl bg-red-600 disabled:bg-red-200 px-3 py-3"
                    >
                      <Text className="text-xs font-bold text-white">
                        {isUpdating && isRejecting
                          ? "Rejecting..."
                          : application.status === "REJECTED"
                            ? "Rejected"
                            : "Reject"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {hasMoreApplications ? (
            <TouchableOpacity
              disabled={applicationsQuery.isFetching}
              onPress={() => setApplicationPage((current) => current + 1)}
              className="mt-4 items-center rounded-xl bg-neutral-950 px-4 py-3"
            >
              {applicationsQuery.isFetching ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-xs font-bold text-white">
                  Load more requests
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {reviews.length > 0 ? (
        <View className="mt-5 rounded-3xl bg-white p-5">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-lg font-extrabold text-neutral-950">
              Reviews
            </Text>
            <Text className="text-xs font-bold text-neutral-400">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </Text>
          </View>

          <View className="mt-4 gap-3">
            {reviews.map((review) => (
              <View
                key={review.id}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((rating) => {
                      const isActive = rating <= Number(review.rating ?? 0);

                      return (
                        <Star
                          key={rating}
                          size={15}
                          color={isActive ? "#FBBF24" : "#D1D5DB"}
                          fill={isActive ? "#FBBF24" : "transparent"}
                        />
                      );
                    })}
                    <Text className="ml-1 text-xs font-bold text-neutral-900">
                      {Number(review.rating ?? 0).toFixed(1)}
                    </Text>
                  </View>

                  <Text className="text-xs text-neutral-400">
                    {formatDate(review.givenAt)}
                  </Text>
                </View>

                <Text className="mt-3 text-sm leading-6 text-neutral-700">
                  {review.feedback}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className="text-right text-sm font-bold text-neutral-900">
        {value}
      </Text>
    </View>
  );
}
