import { useState, type ComponentType } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react-native";
import JobLocationLabel from "@/components/modules/employer/my-jobs/JobLocationLabel";
import ScreenLoader from "@/components/ui/screen-loader";
import { Colors } from "@/constants/Colors";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import {
  useCreateJobApplicationMutation,
  useGetJobApplicationQuery,
  useUpdatedJobApplicationStatusMutation,
} from "@/store/api/jobApplicationApi";
import {
  formatAppliedJobDate,
  getJobApplications,
  getJobApplicationsHasNextPage,
} from "@/utils/jobApplications";

const APPLICATION_LIMIT = 10;

type JobReview = {
  id: string;
  rating: number;
  feedback: string;
  givenAt?: string;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

const getJobReviews = (reviews: unknown): JobReview[] =>
  Array.isArray(reviews) ? reviews : [];

function Hero({
  title,
  subtitle,
  statusLabel,
  onBack,
}: {
  title: string;
  subtitle: string;
  statusLabel: string;
  onBack: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Sparkles size={14} color={Colors.common.BRAND} />
              <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                New job
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-neutral-600">
                {statusLabel}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
              {title}
            </Text>
            <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
              {subtitle}
            </Text>
          </View>
        </View>

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
  );
}

export default function NewJobDetailsWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const isAuthenticated = useIsAuthenticated();
  const [applicationPage, setApplicationPage] = useState(1);
  const [activeActionId, setActiveActionId] = useState("");
  const jobQuery = useGetSingleJobQuery(jobId ?? "", { skip: !jobId });
  const applicationsQuery = useGetJobApplicationQuery(
    { id: jobId ?? "", page: applicationPage, limit: APPLICATION_LIMIT },
    { skip: !jobId },
  );
  const [createJobApplication, { isLoading: isApplying }] =
    useCreateJobApplicationMutation();
  const [updateJobApplicationStatus, { isLoading: isUpdating }] =
    useUpdatedJobApplicationStatusMutation();

  const job = jobQuery.data?.data?.data ?? jobQuery.data?.data;
  const isApplied = Boolean(jobQuery.data?.data?.isApplied);
  const applications = getJobApplications(applicationsQuery.data);
  const hasMoreApplications = getJobApplicationsHasNextPage(
    applicationsQuery.data,
    applications.length,
    APPLICATION_LIMIT,
  );
  const reviews = getJobReviews(job?.reviews);
  const refreshing = jobQuery.isFetching || applicationsQuery.isFetching;
  const coordinates = Array.isArray(job?.location?.coordinates)
    ? ([
        Number(job.location.coordinates[0]),
        Number(job.location.coordinates[1]),
      ] as [number, number])
    : undefined;

  const refreshJob = async () => {
    await Promise.all([
      jobQuery.refetch(),
      jobId ? applicationsQuery.refetch() : Promise.resolve(),
    ]);
  };

  const handleApply = () => {
    if (!jobId) return;

    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/screens/new-jobs/${jobId}`) as any);
      return;
    }

    if (isApplying || isApplied) return;

    void createJobApplication(jobId)
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Application submitted",
          text2: "Your application was sent successfully.",
        });
        void jobQuery.refetch();
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Application failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      });
  };

  const handleApplicationStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setActiveActionId(`${applicationId}-${status}`);
    try {
      await updateJobApplicationStatus({ id: applicationId, status }).unwrap();
      await applicationsQuery.refetch();
      Toast.show({
        type: "success",
        text1: `Application ${status === "ACCEPTED" ? "accepted" : "rejected"}`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Could not update application",
        text2: (error as any)?.data?.message ?? "Please try again.",
      });
    } finally {
      setActiveActionId("");
    }
  };

  if (jobQuery.isLoading) {
    return (
      <View className="flex-1 bg-neutral-50">
        <ScreenLoader />
      </View>
    );
  }

  if (jobQuery.isError || !job) {
    return (
      <View className="flex-1 bg-neutral-50">
        <View className="mx-auto w-full max-w-3xl px-6 py-8">
          <Hero
            title="New Job"
            subtitle="Review the role details and current worker requests from a desktop layout."
            statusLabel="Unable to load"
            onBack={() => router.back()}
          />
          <View className="rounded-2xl bg-white p-6">
            <Text className="text-base font-bold text-neutral-900">
              {(jobQuery.error as any)?.data?.message ?? "Unable to load this job"}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              Please go back and try again.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJob} />}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <Hero
              title="New Job"
              subtitle="Review the posted role, schedule, requirements, and worker requests from a desktop layout."
              statusLabel={job.status ?? "POSTED"}
              onBack={() => router.back()}
            />

            <View className="flex-col gap-6 lg:flex-row">
              <View className="flex-1 rounded-2xl bg-white p-6">
              <Text className="text-xs font-bold uppercase tracking-[0px] text-orange-600">
                New Job
              </Text>
              <View className="mt-3 flex-row flex-wrap items-start justify-between gap-4">
                <View className="min-w-0 flex-1">
                  <Text className="text-4xl font-bold text-neutral-950">
                    {job.title}
                  </Text>
                  <View className="mt-4 flex-row flex-wrap gap-2">
                    <Pill label={job.status ?? "POSTED"} tone="dark" />
                    {(job.trades ?? []).map((trade: string) => (
                      <Pill key={trade} label={trade.replace(/_/g, " ")} />
                    ))}
                  </View>
                </View>
                <View className="rounded-2xl bg-neutral-950 px-5 py-4">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-white/60">
                    Hourly rate
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-white">
                    {job.hourlyRate != null ? `$${job.hourlyRate}/hour` : "Not set"}
                  </Text>
                </View>
              </View>

              <View className="mt-8 flex-col gap-3 md:flex-row">
                <Summary
                  icon={Users}
                  label="Workers needed"
                  value={String(job.workersNeeded ?? "Not set")}
                />
                <Summary
                  icon={CalendarDays}
                  label="Start date"
                  value={formatDate(job.startDate)}
                />
                <Summary
                  icon={CalendarDays}
                  label="End date"
                  value={formatDate(job.endDate)}
                />
              </View>
            </View>

            <View className="w-full rounded-2xl bg-white p-6 lg:w-[360px]">
              <Text className="text-lg font-bold text-neutral-950">Application</Text>
              <Text className="mt-2 text-sm leading-6 text-neutral-500">
                Apply to this job or review worker requests for this posting.
              </Text>
              <TouchableOpacity
                disabled={isApplying || isApplied}
                onPress={handleApply}
                className="mt-6 flex-row items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-4 disabled:bg-neutral-400"
              >
                {isApplying ? <ActivityIndicator color="#FFFFFF" /> : null}
                <Text className="text-sm font-bold text-white">
                  {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply for this job"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6 flex-col gap-6 lg:flex-row">
            <View className="flex-1 rounded-2xl bg-white p-6">
              <SectionTitle title="Working hours" />
              <View className="mt-4 gap-3">
                {(job.workingHours ?? []).length ? (
                  (job.workingHours ?? []).map((hour: any) => (
                    <View
                      key={hour.day}
                      className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
                    >
                      <View className="flex-row items-center gap-3">
                        <Clock size={16} color={Colors.common.BRAND} />
                        <Text className="text-sm font-bold text-neutral-900">
                          {hour.day}
                        </Text>
                      </View>
                      <Text className="text-sm font-semibold text-neutral-600">
                        {hour.startTime} - {hour.endTime}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm text-neutral-500">No working hours set.</Text>
                )}
              </View>
            </View>

            <View className="w-full rounded-2xl bg-white p-6 lg:w-[420px]">
              <SectionTitle title="Location" />
              <View className="mt-4 flex-row items-start gap-3 rounded-xl bg-neutral-50 p-4">
                <MapPin size={18} color={Colors.common.BRAND} />
                <View className="flex-1">
                  <JobLocationLabel
                    location={job.location?.address}
                    coordinates={coordinates}
                  />
                </View>
              </View>

              <View className="mt-6 border-t border-neutral-100 pt-5">
                <SectionTitle title="Must have" />
                <Text className="mt-3 text-sm leading-6 text-neutral-600">
                  {(job.mustHave ?? []).join(", ") || "None"}
                </Text>
              </View>

              <View className="mt-6 border-t border-neutral-100 pt-5">
                <SectionTitle title="Notes" />
                <Text className="mt-3 text-sm leading-6 text-neutral-600">
                  {job.note || "No notes"}
                </Text>
              </View>
            </View>
          </View>

          <Applications
            applications={applications}
            isLoading={applicationsQuery.isLoading}
            isError={applicationsQuery.isError}
            isFetching={applicationsQuery.isFetching}
            isUpdating={isUpdating}
            activeActionId={activeActionId}
            hasMore={hasMoreApplications}
            onLoadMore={() => setApplicationPage((current) => current + 1)}
            onStatusChange={handleApplicationStatus}
          />

          {reviews.length ? (
            <View className="mt-6 rounded-2xl bg-white p-6">
              <SectionTitle title="Reviews" />
              <View className="mt-4 flex-col gap-3 md:flex-row md:flex-wrap">
                {reviews.map((review) => (
                  <View
                    key={review.id}
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                    style={{ flex: 1, minWidth: 320 }}
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
      {title}
    </Text>
  );
}

function Pill({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <View
      className={
        tone === "dark"
          ? "rounded-full bg-neutral-950 px-3 py-1.5"
          : "rounded-full bg-orange-50 px-3 py-1.5"
      }
    >
      <Text
        className={
          tone === "dark"
            ? "text-xs font-bold text-white"
            : "text-xs font-bold text-orange-700"
        }
      >
        {label}
      </Text>
    </View>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-xl bg-neutral-50 p-4">
      <Icon size={18} color={Colors.common.BRAND} />
      <Text className="mt-3 text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
        {label}
      </Text>
      <Text className="mt-1 text-base font-bold text-neutral-950">
        {value}
      </Text>
    </View>
  );
}

function Applications({
  applications,
  isLoading,
  isError,
  isFetching,
  isUpdating,
  activeActionId,
  hasMore,
  onLoadMore,
  onStatusChange,
}: {
  applications: ReturnType<typeof getJobApplications>;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isUpdating: boolean;
  activeActionId: string;
  hasMore: boolean;
  onLoadMore: () => void;
  onStatusChange: (id: string, status: "ACCEPTED" | "REJECTED") => void;
}) {
  return (
    <View className="mt-6 rounded-2xl bg-white p-6">
      <View className="flex-row items-center justify-between gap-4">
        <View>
          <Text className="text-xl font-bold text-neutral-950">Job Requests</Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Workers who have applied for this job.
          </Text>
        </View>
        <Text className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-600">
          {applications.length} requests
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-6" color={Colors.common.BRAND} />
      ) : null}

      {isError ? (
        <View className="mt-4 rounded-xl bg-red-50 px-4 py-3">
          <Text className="text-sm font-semibold text-red-700">
            Unable to load job requests. Please try again.
          </Text>
        </View>
      ) : null}

      {!isLoading && !isError && applications.length === 0 ? (
        <Text className="mt-5 text-sm text-neutral-500">
          No workers have applied yet.
        </Text>
      ) : null}

      <View className="mt-5 flex-col gap-4 lg:flex-row lg:flex-wrap">
        {applications.map((application) => {
          const worker = application.auth;
          const profile = worker?.profile;
          const workerProfile = worker?.workerProfile;
          const disabled =
            isUpdating ||
            application.status === "ACCEPTED" ||
            application.status === "REJECTED";

          return (
            <View
              key={application.id}
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50 p-4"
              style={{ flex: 1, minWidth: 360 }}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-bold text-neutral-950">
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

              <View className="mt-4 flex-row flex-wrap gap-2">
                <Text className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-600">
                  {workerProfile?.trades?.join(", ") || "Trade not set"}
                </Text>
                {workerProfile?.experience ? (
                  <Text className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-600">
                    {workerProfile.experience}
                  </Text>
                ) : null}
              </View>

              <Text className="mt-4 text-xs text-neutral-400">
                Applied {formatAppliedJobDate(application.appliedAt)}
              </Text>

              <View className="mt-4 flex-row gap-2">
                <ActionButton
                  label="Accept"
                  loading={activeActionId === `${application.id}-ACCEPTED`}
                  disabled={disabled}
                  icon={Check}
                  className="bg-emerald-600 disabled:bg-emerald-200"
                  onPress={() => onStatusChange(application.id, "ACCEPTED")}
                />
                <ActionButton
                  label="Reject"
                  loading={activeActionId === `${application.id}-REJECTED`}
                  disabled={disabled}
                  icon={X}
                  className="bg-red-600 disabled:bg-red-200"
                  onPress={() => onStatusChange(application.id, "REJECTED")}
                />
              </View>
            </View>
          );
        })}
      </View>

      {hasMore ? (
        <TouchableOpacity
          disabled={isFetching}
          onPress={onLoadMore}
          className="mt-5 items-center rounded-xl bg-neutral-950 px-4 py-3 disabled:bg-neutral-400"
        >
          {isFetching ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-xs font-bold text-white">Load more requests</Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function ActionButton({
  label,
  loading,
  disabled,
  icon: Icon,
  className,
  onPress,
}: {
  label: string;
  loading: boolean;
  disabled: boolean;
  icon: ComponentType<{ size?: number; color?: string }>;
  className: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl px-3 py-3 ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Icon size={14} color="#FFFFFF" />
      )}
      <Text className="text-xs font-bold text-white">{label}</Text>
    </TouchableOpacity>
  );
}
