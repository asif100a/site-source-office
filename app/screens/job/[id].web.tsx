import { useLocalSearchParams, useRouter } from "expo-router";
import type React from "react";
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
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import JobLocationLabel from "@/components/modules/employer/my-jobs/JobLocationLabel";
import ScreenLoader from "@/components/ui/screen-loader";
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import { useCreateJobApplicationMutation } from "@/store/api/jobApplicationApi";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

const formatList = (items?: string[]) =>
  Array.isArray(items) && items.length ? items.join(", ") : "Not set";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-b-0">
      <Text className="text-sm font-medium text-neutral-500">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm font-extrabold text-neutral-950">
        {value}
      </Text>
    </View>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
          {icon}
        </View>
        <Text className="text-base font-extrabold text-neutral-950">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function WorkingHours({ hours }: { hours?: any[] }) {
  if (!Array.isArray(hours) || hours.length === 0) {
    return <Text className="text-sm font-medium text-neutral-500">Not set</Text>;
  }

  return (
    <View className="gap-2">
      {hours.map((hour) => (
        <View
          key={`${hour.day}-${hour.startTime}-${hour.endTime}`}
          className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
        >
          <Text className="text-sm font-extrabold text-neutral-900">
            {hour.day}
          </Text>
          <Text className="text-sm font-semibold text-neutral-600">
            {hour.startTime} - {hour.endTime}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function JobDetailsWebScreen() {
  const router = useRouter();
  const { id, applicationStatus } = useLocalSearchParams<{
    id?: string;
    applicationStatus?: string;
  }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const resolvedApplicationStatus = Array.isArray(applicationStatus)
    ? applicationStatus[0]
    : applicationStatus;
  const canApply = !resolvedApplicationStatus;
  const isAuthenticated = useIsAuthenticated();
  const [createJobApplication, { isLoading: isApplying }] =
    useCreateJobApplicationMutation();
  const singleJobQuery = useGetSingleJobQuery(jobId ?? "", { skip: !jobId });
  const job = singleJobQuery.data?.data?.data ?? singleJobQuery.data?.data;
  const isApplied = Boolean(singleJobQuery.data?.data?.isApplied);

  const coordinates = Array.isArray(job?.location?.coordinates)
    ? ([
        Number(job.location.coordinates[0]),
        Number(job.location.coordinates[1]),
      ] as [number, number])
    : undefined;

  const handleApply = () => {
    if (!jobId) return;

    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/screens/job/${jobId}`) as any);
      return;
    }

    if (isApplying) return;

    void createJobApplication(jobId)
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Application submitted",
          text2: "Your application was sent successfully.",
        });
        void singleJobQuery.refetch();
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Application failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      });
  };

  if (!jobId || singleJobQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ScreenLoader />
      </View>
    );
  }

  if (singleJobQuery.isError || !job) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <View className="w-full max-w-md rounded-[24px] border border-red-100 bg-white p-6">
          <Text className="text-center text-base font-extrabold text-neutral-950">
            Unable to load this job
          </Text>
          <Text className="mt-2 text-center text-sm leading-6 text-neutral-500">
            Please go back and try again.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-5 items-center rounded-2xl bg-neutral-950 px-4 py-3"
          >
            <Text className="text-sm font-bold text-white">Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={singleJobQuery.isFetching}
            onRefresh={() => void singleJobQuery.refetch()}
            tintColor={Colors.common.BRAND}
          />
        }
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="px-6 pt-6 md:px-10 md:pt-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <BriefcaseBusiness size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        New job
                      </Text>
                    </View>
                    <View className="rounded-full bg-neutral-100 px-3 py-1.5">
                      <Text className="text-xs font-semibold text-neutral-600">
                        {job.status ?? "Posted"}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
                      {job.title}
                    </Text>
                    <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                      Review the role, schedule, rate, requirements, and location
                      before applying.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.88}
                  className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                >
                  <ArrowLeft size={18} color="#111827" />
                  <Text className="text-sm font-semibold text-neutral-900">
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.45] gap-4">
                <Section
                  title="Job Overview"
                  icon={<BriefcaseBusiness size={18} color="#525252" />}
                >
                  <View className="rounded-2xl border border-neutral-100 px-4">
                    <DetailRow label="Trade" value={formatList(job.trades)} />
                    <DetailRow
                      label="Hourly rate"
                      value={
                        job.hourlyRate != null
                          ? `$${job.hourlyRate}/hour`
                          : "Not set"
                      }
                    />
                    <DetailRow
                      label="Workers needed"
                      value={String(job.workersNeeded ?? "Not set")}
                    />
                  </View>
                </Section>

                <Section title="Schedule" icon={<Calendar size={18} color="#525252" />}>
                  <View className="grid gap-3 md:grid-cols-2">
                    <View className="rounded-2xl bg-neutral-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                        Start date
                      </Text>
                      <Text className="mt-2 text-base font-extrabold text-neutral-950">
                        {formatDate(job.startDate)}
                      </Text>
                    </View>
                    <View className="rounded-2xl bg-neutral-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                        End date
                      </Text>
                      <Text className="mt-2 text-base font-extrabold text-neutral-950">
                        {formatDate(job.endDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5">
                    <View className="mb-3 flex-row items-center gap-2">
                      <Clock3 size={16} color="#737373" />
                      <Text className="text-sm font-extrabold text-neutral-900">
                        Working hours
                      </Text>
                    </View>
                    <WorkingHours hours={job.workingHours} />
                  </View>
                </Section>

                <Section title="Requirements" icon={<FileText size={18} color="#525252" />}>
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                    Must have
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-neutral-700">
                    {Array.isArray(job.mustHave) && job.mustHave.length
                      ? job.mustHave.join(", ")
                      : "None"}
                  </Text>

                  <View className="mt-5 border-t border-neutral-100 pt-5">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                      Notes
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-neutral-700">
                      {job.note || "No notes"}
                    </Text>
                  </View>
                </Section>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <ShieldCheck size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-neutral-950">
                        Ready to apply?
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-500">
                        Your application will be sent to the employer for review.
                      </Text>
                    </View>
                  </View>

                  {canApply ? (
                    <TouchableOpacity
                      disabled={isApplying || isApplied}
                      onPress={handleApply}
                      activeOpacity={0.9}
                      className="mt-5 items-center justify-center rounded-2xl bg-neutral-950 px-4 py-4 disabled:bg-neutral-400"
                    >
                      {isApplying ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text className="text-sm font-extrabold text-white">
                          {isApplied ? "Applied" : "Apply for this job"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View className="mt-5 flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
                      <CheckCircle2 size={16} color="#16A34A" />
                      <Text className="text-sm font-semibold text-neutral-600">
                        Application status already exists.
                      </Text>
                    </View>
                  )}
                </View>

                <Section title="Location" icon={<MapPin size={18} color="#C81E1E" />}>
                  <View className="rounded-2xl bg-neutral-50 p-4">
                    <JobLocationLabel
                      location={job.location?.address}
                      coordinates={coordinates}
                    />
                  </View>
                </Section>

                <Section title="Team" icon={<Users size={18} color="#525252" />}>
                  <View className="rounded-2xl bg-neutral-50 p-4">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                      Open positions
                    </Text>
                    <Text className="mt-2 text-2xl font-black text-neutral-950">
                      {job.workersNeeded ?? "Not set"}
                    </Text>
                  </View>
                </Section>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
