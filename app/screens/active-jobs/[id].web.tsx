import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ChevronDown,
  Clock3,
  Headphones,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react-native";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import {
  useCompleteJobMutation,
  useChangeCompletionStatusMutation,
  useGetSingleJobQuery,
} from "@/store/api/jobApi";
import { getSingleJobData } from "@/utils/workerJobs";
import {
  DEFAULT_ACTIVE_JOB_DETAILS,
  mapSingleJobToActiveJobDetails,
} from "@/utils/activeJobDetails";
import WorkerJobDetails from "@/components/modules/worker/active-jobs/WorkerJobDetails";
import WorkerEmployerContact from "@/components/modules/worker/active-jobs/WorkerEmployerContact";
import WorkerToggleChips from "@/components/modules/worker/active-jobs/WorkerToggleChips";
import WorkerProjectSchedule from "@/components/modules/worker/active-jobs/WorkerProjectSchedule";
import WorkerWorkSummary from "@/components/modules/worker/active-jobs/WorkerWorkSummary";
import WorkerWorkPolicy from "@/components/modules/worker/active-jobs/WorkerWorkPolicy";

type WorkerTab = "schedule" | "timesheet" | "policy";

type JobDetails = {
  title: string;
  company: string;
  statusBadge: string;
  location: string;
  team: string;
  duration: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  startDate: string;
  endDate: string;
  hours: string;
  daysPerWeek: string;
  nextInvoice: string;
};

const JOB_DETAILS: JobDetails = DEFAULT_ACTIVE_JOB_DETAILS;

const EMPLOYER_WORKERS = [
  { id: "1", name: "James Hartley", progress: "Day 3 of 20" },
  { id: "2", name: "James Hartley", progress: "Day 3 of 20" },
  { id: "3", name: "James Hartley", progress: "Day 3 of 20" },
];

const EMPLOYER_APPLICANTS = [
  {
    id: "1",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch - 1.2 mi away",
    availability: "Available 8am - 5pm",
    experience: "8 Years Experience",
  },
  {
    id: "2",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch - 1.2 mi away",
    availability: "Available 8am - 5pm",
    experience: "8 Years Experience",
  },
  {
    id: "3",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch - 1.2 mi away",
    availability: "Available 8am - 5pm",
    experience: "8 Years Experience",
  },
];

const WORK_SUMMARY_ROWS = [
  { week: "Week 1", dates: "12th - 16th July", status: "Completed" },
  { week: "Week 2", dates: "19th - 23rd July", status: "Approved" },
  { week: "Week 3", dates: "26th - 30th July", status: "Approved" },
  { week: "Week 4", dates: "2nd - 6th August", status: "Approved" },
];

function SectionTitle({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-4">
      <Text className="text-base font-extrabold text-neutral-900">{title}</Text>
      {detail ? (
        <Text className="text-xs font-medium text-neutral-400">{detail}</Text>
      ) : null}
    </View>
  );
}

function Hero({
  title,
  subtitle,
  statusLabel,
  onBack,
  onMessage,
}: {
  title: string;
  subtitle: string;
  statusLabel: string;
  onBack: () => void;
  onMessage: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Sparkles size={14} color={Colors.common.BRAND} />
              <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                Active jobs
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

        <View className="flex-row flex-wrap gap-3">
        <TouchableOpacity
          onPress={onMessage}
          activeOpacity={0.88}
          className="flex-row items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3.5"
        >
          <MessageCircle size={18} color="#C2410C" />
          <Text className="text-sm font-semibold text-orange-700">Send message</Text>
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

function JobSummaryCard({
  jobDetails = JOB_DETAILS,
  showRate,
  statusRoute,
}: {
  jobDetails?: JobDetails;
  showRate: boolean;
  statusRoute?: string;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Briefcase size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-base font-extrabold text-neutral-950">
              {jobDetails.title}
            </Text>
            <Text className="text-xs font-semibold text-neutral-500">
              {jobDetails.company}
            </Text>
          </View>
        </View>

        {showRate ? (
          <View className="items-end">
            <Text className="text-sm font-extrabold text-neutral-900">
              GBP 80 - 120/hour
            </Text>
            <Text
              style={{ color: Colors.common.BRAND }}
              className="mt-0.5 text-xs font-medium"
            >
              Market Rate
            </Text>
          </View>
        ) : (
          <View className="rounded-lg bg-orange-50 px-2.5 py-1">
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-[10px] font-bold"
            >
              {statusRoute === "upcoming" ? "Upcoming" : jobDetails.statusBadge}
            </Text>
          </View>
        )}
      </View>

      <View className="gap-2.5 border-t border-neutral-100 pt-3">
        <View className="flex-row items-center gap-2">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-xs text-neutral-500">{jobDetails.location}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={14} color="#737373" />
          <Text className="text-xs text-neutral-500">{jobDetails.team}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color="#737373" />
          <Text className="text-xs text-neutral-500">{jobDetails.duration}</Text>
        </View>
      </View>
    </View>
  );
}

function EmployerWorkersCard({
  openWorkerDetails,
  rawJob,
}: {
  openWorkerDetails: (workerId: string) => void;
  rawJob?: any;
}) {
  const workers = Array.isArray(rawJob?.jobApplications)
    ? rawJob.jobApplications
        .filter((application: any) => application?.status === "ACCEPTED")
        .map((application: any) => ({
          id: application?.auth?.id ?? application?.authId ?? application?.id,
          name: application?.auth?.profile?.name ?? "Worker",
          progress: `Week ${rawJob?.timeSheetWeeks?.length ?? 0} scheduled`,
        }))
    : [];
  const visibleWorkers = workers.length ? workers : EMPLOYER_WORKERS;

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Workers" />
      <View className="gap-3">
        {visibleWorkers.map((worker: any) => (
          <TouchableOpacity
            key={worker.id}
            onPress={() => openWorkerDetails(worker.id)}
            activeOpacity={0.9}
            className="rounded-xl border border-neutral-200/80 bg-white px-3 py-3.5"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                  <Text className="text-xs font-bold text-neutral-700">JH</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-neutral-900">
                    {worker.name}
                  </Text>
                  <Text className="mt-0.5 text-xs text-neutral-400">
                    {worker.progress}
                  </Text>
                </View>
              </View>

              <Text className="text-xs font-medium text-neutral-500">
                Update Timesheet
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function EmployerUpcomingApplicantsCard({
  openWorkerDetails,
}: {
  openWorkerDetails: (workerId: string) => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Applicants" detail="Upcoming job" />
      <View className="gap-4">
        {EMPLOYER_APPLICANTS.map((applicant) => (
          <View
            key={applicant.id}
            className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white"
          >
            <View className="px-4 pb-3 pt-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 flex-row items-center gap-3 pr-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
                    <Text className="text-xs font-bold text-neutral-700">MT</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-neutral-950">
                      {applicant.name}
                    </Text>
                    <Text className="text-sm text-neutral-500">
                      {applicant.role}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-4 gap-2.5 border-t border-neutral-100 pt-4">
                <View className="flex-row items-center gap-2">
                  <MapPin size={14} color="#C81E1E" />
                  <Text className="text-xs text-neutral-500">
                    {applicant.location}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock3 size={14} color="#737373" />
                  <Text className="text-xs text-neutral-500">
                    {applicant.availability}
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
                  {applicant.experience}
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => openWorkerDetails(applicant.id)}>
                  <Text className="text-xs font-medium text-neutral-700">
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openWorkerDetails(applicant.id)}
                  style={{ backgroundColor: Colors.common.GRAY_DARK }}
                  className="rounded-md px-4 py-2 active:opacity-90"
                >
                  <Text className="text-xs font-medium text-white">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProjectScheduleCard({
  jobDetails = JOB_DETAILS,
}: {
  jobDetails?: JobDetails;
}) {
  const rows = [
    { label: "Start Date", value: jobDetails.startDate },
    { label: "End date", value: jobDetails.endDate },
    { label: "Hours", value: jobDetails.hours },
    { label: "Per Week", value: jobDetails.daysPerWeek },
  ];

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Project Schedule" />
      <View className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
        {rows.map((item, index) => (
          <View
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index < rows.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <Text className="text-sm text-neutral-600">{item.label}</Text>
            <Text className="text-sm font-medium text-neutral-700">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkerEmployerContactCard({
  jobDetails,
}: {
  jobDetails: JobDetails;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Employer" />
      <View className="mb-4 flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
          <Text className="text-sm font-extrabold text-slate-700">JH</Text>
        </View>
        <View>
          <Text className="text-sm font-extrabold text-neutral-900">
            {jobDetails.contactName}
          </Text>
          <Text className="text-xs font-semibold text-neutral-400">
            {jobDetails.contactTitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

function WorkerTabs({
  activeSubTab,
  setActiveSubTab,
}: {
  activeSubTab: WorkerTab;
  setActiveSubTab: (tab: WorkerTab) => void;
}) {
  const tabs = [
    { key: "schedule" as const, label: "Schedule" },
    { key: "timesheet" as const, label: "Timesheet" },
    { key: "policy" as const, label: "Worker Policy" },
  ];

  return (
    <View className="flex-row flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeSubTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveSubTab(tab.key)}
            activeOpacity={0.88}
            className={`rounded-lg px-4 py-2 ${
              isActive ? "bg-neutral-900" : "border border-neutral-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isActive ? "text-white" : "text-neutral-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function WorkerScheduleCard({
  jobDetails,
}: {
  jobDetails: JobDetails;
}) {
  const rows = [
    { label: "Start Date", value: jobDetails.startDate },
    { label: "End date", value: jobDetails.endDate },
    { label: "Hours", value: jobDetails.hours },
    { label: "Per Week", value: jobDetails.daysPerWeek },
    { label: "Next invoice", value: jobDetails.nextInvoice },
  ];

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Project Schedule" />
      <View className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
        {rows.map((item, index) => (
          <View
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index < rows.length - 1 ? "border-b border-neutral-50" : ""
            }`}
          >
            <Text className="text-sm font-semibold text-neutral-400">
              {item.label}
            </Text>
            <Text className="text-sm font-extrabold text-neutral-800">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkerTimesheetCard({
  onShowApproval,
  jobId,
  onCompletionRequested,
}: {
  onShowApproval: () => void;
  jobId: string;
  onCompletionRequested?: () => void | Promise<void>;
}) {
  const [completeJob, { isLoading: isCompletingJob }] =
    useCompleteJobMutation();
  const canRequestCompletion = WORK_SUMMARY_ROWS.every(
    (item) => item.status === "Approved" || item.status === "Completed"
  );

  const handleRequestCompletion = async () => {
    if (!canRequestCompletion) {
      Alert.alert(
        "Timesheets pending",
        "You cannot request completion until all timesheets are approved or completed."
      );
      return;
    }

    if (!jobId) {
      Alert.alert("Job unavailable", "Unable to find this job.");
      return;
    }

    try {
      await completeJob({ jobId }).unwrap();
      await onCompletionRequested?.();
      Alert.alert(
        "Completion requested",
        "Your job completion request has been submitted."
      );
    } catch (error) {
      Alert.alert(
        "Request failed",
        "Unable to request job completion. Please try again."
      );
    }
  };

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Timesheet" />
      <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        {WORK_SUMMARY_ROWS.map((item, index) => (
          <View
            key={`${item.week}-${index}`}
            className={`flex-row items-center justify-between p-4 ${
              index < WORK_SUMMARY_ROWS.length - 1 ? "border-b border-neutral-50" : ""
            }`}
          >
            <View>
              <Text className="text-sm font-extrabold text-neutral-800">
                {item.week}
              </Text>
              <Text className="mt-0.5 text-xs font-semibold text-neutral-400">
                {item.dates}
              </Text>
            </View>

            {item.status === "Approved" ? (
              <View className="rounded-full bg-green-50 px-3 py-1">
                <Text className="text-[10px] font-extrabold text-green-600">
                  Approved
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={onShowApproval}
                style={{ borderColor: Colors.common.BRAND }}
                className="rounded-full border bg-white px-3 py-1 active:opacity-75"
              >
                <Text
                  style={{ color: Colors.common.BRAND }}
                  className="text-[10px] font-extrabold"
                >
                  Submit Timesheet
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => void handleRequestCompletion()}
        disabled={!canRequestCompletion || isCompletingJob}
        className="mt-4 items-center justify-center rounded-2xl px-4 py-4 disabled:opacity-70"
        style={{
          backgroundColor:
            canRequestCompletion && !isCompletingJob
              ? Colors.common.BRAND
              : "#FFAA66",
        }}
      >
        <Text className="text-sm font-extrabold text-white">
          {isCompletingJob ? "Requesting..." : "Request for Completion"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function WorkerPolicyCard() {
  const policies = [
    {
      title: "Free cancellation",
      detail: "More than 48 hours before start",
      classes: "bg-emerald-50/60 border-emerald-100/55",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      subtext: "text-emerald-600",
    },
    {
      title: "50% charge",
      detail: "Between 48-24 hours before start",
      classes: "bg-amber-50/60 border-amber-100/55",
      dot: "bg-amber-500",
      text: "text-amber-700",
      subtext: "text-amber-600",
    },
    {
      title: "Full charge",
      detail: "Within 24 hours of start",
      classes: "bg-red-50/60 border-red-100/55",
      dot: "bg-red-500",
      text: "text-red-700",
      subtext: "text-red-600",
    },
  ];

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Work Policy" />
      <View className="gap-3.5">
        {policies.map((policy) => (
          <View
            key={policy.title}
            className={`flex-row items-start gap-3 rounded-2xl border p-4 ${policy.classes}`}
          >
            <View className={`mt-1.5 h-2.5 w-2.5 rounded-full ${policy.dot}`} />
            <View>
              <Text className={`text-sm font-extrabold ${policy.text}`}>
                {policy.title}
              </Text>
              <Text className={`mt-0.5 text-xs font-semibold ${policy.subtext}`}>
                {policy.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ActionCard({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
        Quick actions
      </Text>
      <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
        {title}
      </Text>
      <Text className="mt-2 text-sm leading-6 text-neutral-600">
        {description}
      </Text>

      <View className="mt-5 gap-3">
        <TouchableOpacity
          onPress={onPrimary}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-semibold text-white">{primaryLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSecondary}
          className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4 active:opacity-75"
        >
          <Text className="text-sm font-medium text-neutral-700">
            {secondaryLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmployerCompletionRequestCard({
  jobId,
  status,
  onUpdated,
}: {
  jobId: string;
  status?: string;
  onUpdated: () => void | Promise<void>;
}) {
  const [changeCompletionStatus, { isLoading }] =
    useChangeCompletionStatusMutation();

  if (!status) return null;

  const updateCompletionStatus = async (nextStatus: "COMPLETED" | "REJECTED") => {
    if (!jobId) {
      Alert.alert("Job unavailable", "Unable to find this job.");
      return;
    }

    try {
      await changeCompletionStatus({ jobId, status: nextStatus }).unwrap();
      await onUpdated();
      Alert.alert(
        "Completion request updated",
        nextStatus === "COMPLETED"
          ? "The job completion request has been approved."
          : "The job completion request has been rejected."
      );
    } catch (error) {
      Alert.alert(
        "Update failed",
        "Unable to update this completion request. Please try again."
      );
    }
  };

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-5 flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
            Completion request
          </Text>
          <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
            Worker requested completion
          </Text>
          <Text className="mt-2 text-sm leading-6 text-neutral-600">
            Review and update the worker's job completion request.
          </Text>
        </View>
        <View className="rounded-full bg-orange-50 px-3 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-[10px] font-extrabold"
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => void updateCompletionStatus("COMPLETED")}
          disabled={isLoading || status === "COMPLETED"}
          style={{ backgroundColor: Colors.common.BRAND }}
          className="flex-1 items-center justify-center rounded-2xl px-4 py-4 disabled:opacity-60"
        >
          <Text className="text-sm font-extrabold text-white">
            {isLoading ? "Updating..." : "Approve"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => void updateCompletionStatus("REJECTED")}
          disabled={isLoading || status === "REJECTED"}
          className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-4 disabled:opacity-60"
        >
          <Text className="text-sm font-extrabold text-neutral-700">
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ApprovalPanel({
  scheduleStartDate,
  onClose,
}: {
  scheduleStartDate: string;
  onClose: () => void;
}) {
  const weekOptions = useMemo(() => {
    const addDays = (date: Date, days: number) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + days);
      return nextDate;
    };

    const parseScheduleDate = (dateLabel: string) => {
      const parsedDate = new Date(dateLabel);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }

      return new Date();
    };

    const getOrdinalSuffix = (day: number) => {
      if (day >= 11 && day <= 13) return "th";

      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const parsedScheduleDate = parseScheduleDate(scheduleStartDate);
    const weekStart = addDays(
      parsedScheduleDate,
      -parsedScheduleDate.getDay(),
    );

    return Array.from({ length: 3 }, (_, index) => {
      const nextWeekStart = addDays(weekStart, index * 7);
      const day = nextWeekStart.getDate();
      const month = nextWeekStart.toLocaleDateString("en-US", {
        month: "long",
      });

      return {
        id: `week-${index + 1}`,
        label: `Week ${index + 1} - ${day}${getOrdinalSuffix(day)} ${month}`,
        startDate: nextWeekStart,
      };
    });
  }, [scheduleStartDate]);
  const [selectedWeekId, setSelectedWeekId] = useState(weekOptions[0]?.id);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const selectedWeek =
    weekOptions.find((week) => week.id === selectedWeekId) ?? weekOptions[0];
  const weekFields = useMemo(() => {
    const addDays = (date: Date, days: number) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + days);
      return nextDate;
    };

    const formatWeekdayLabel = (date: Date) => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });

      return `${dayName} - ${dayNumber} ${month}`;
    };

    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].map((day, index) => ({
      key: day,
      date: addDays(selectedWeek?.startDate ?? new Date(), index),
      label: formatWeekdayLabel(
        addDays(selectedWeek?.startDate ?? new Date(), index),
      ),
    }));
  }, [selectedWeek]);

  const [dailyHours, setDailyHours] = useState<Record<string, string>>({
    Sunday: "",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  });

  const totalHours = Object.values(dailyHours).reduce((sum, value) => {
    const hours = Number.parseFloat(value);
    return sum + (Number.isFinite(hours) ? hours : 0);
  }, 0);

  useEffect(() => {
    setSelectedWeekId(weekOptions[0]?.id);
    setIsWeekDropdownOpen(false);
    setDailyHours({
      Sunday: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
    });
  }, [weekOptions]);

  return (
    <View className="max-h-[90vh] overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
      <ScrollView
        className="max-h-[90vh]"
        contentContainerStyle={{ padding: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator
      >
      <View className="mb-5 flex-row items-center justify-between gap-4">
        <Text className="text-base font-extrabold text-neutral-900">
          Submit Timesheet
        </Text>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.8}
          className="rounded-xl border border-neutral-200 px-3 py-2"
        >
          <Text className="text-xs font-bold text-neutral-600">Cancel</Text>
        </TouchableOpacity>
      </View>
      <View className="gap-4">
        <View>
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            Week
          </Text>
          <TouchableOpacity
            onPress={() => setIsWeekDropdownOpen((current) => !current)}
            className="rounded-2xl border border-neutral-200/70 bg-white px-4 py-4 active:opacity-85"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-neutral-950">
                  {selectedWeek?.label}
                </Text>
                <Text className="mt-1 text-[11px] font-medium text-neutral-400">
                  Fill in the hours worked for each day of the week.
                </Text>
              </View>
              <ChevronDown
                size={18}
                color="#737373"
                style={{
                  transform: [
                    { rotate: isWeekDropdownOpen ? "180deg" : "0deg" },
                  ],
                }}
              />
            </View>
          </TouchableOpacity>
          {isWeekDropdownOpen ? (
            <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white">
              {weekOptions.map((week) => {
                const isSelected = week.id === selectedWeekId;

                return (
                  <TouchableOpacity
                    key={week.id}
                    onPress={() => {
                      setSelectedWeekId(week.id);
                      setIsWeekDropdownOpen(false);
                    }}
                    className={`px-4 py-3 active:opacity-80 ${
                      isSelected ? "bg-orange-50" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? "text-neutral-950" : "text-neutral-600"
                      }`}
                    >
                      {week.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
          <View className="mt-3 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white">
            {weekFields.map((field, index) => (
              <View
                key={field.key}
                className={`px-4 py-3 ${
                  index === 0 ? "pt-4" : ""
                } ${index < weekFields.length - 1 ? "border-b border-neutral-100" : ""}`}
              >
                <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  {field.label}
                </Text>
                <View className="flex-row items-center rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3">
                  <TextInput
                    className="flex-1 py-0 text-sm font-semibold text-neutral-800"
                    placeholder="Enter hours"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    value={dailyHours[field.key]}
                    onChangeText={(value) =>
                      setDailyHours((current) => ({
                        ...current,
                        [field.key]: value,
                      }))
                    }
                  />
                  <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    hrs
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            Total working hours
          </Text>
          <View className="flex-row items-center justify-between rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3">
            <Text className="text-sm font-semibold text-neutral-800">
              Weekly total
            </Text>
            <Text className="text-sm font-bold text-neutral-950">
              {totalHours.toFixed(1)} hrs
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.9}
          className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
        >
          <Text className="text-sm font-extrabold text-neutral-700">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClose}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="flex-1 items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-extrabold text-white">Submit</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

export default function ActiveJobDetailWebScreen() {
  const router = useRouter();
  const { id, origin, status } = useLocalSearchParams<{
    id?: string;
    origin?: string;
    status?: string;
  }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const statusRoute = Array.isArray(status) ? status[0] : status;
  const employerJobStatus = statusRoute === "upcoming" ? "upcoming" : "active";
  const jobId = Array.isArray(id) ? id[0] : id;
  const singleJobQuery = useGetSingleJobQuery(jobId ?? "", {
    skip: !jobId,
  });
  const rawJob = getSingleJobData(singleJobQuery.data);
  const jobDetails = rawJob
    ? mapSingleJobToActiveJobDetails(rawJob)
    : JOB_DETAILS;

  const [activeSubTab, setActiveSubTab] = useState<WorkerTab>("schedule");
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<"form" | "submitted">(
    "form",
  );

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleNavigateBack = () => {
    router.back();
  };

  const refreshJob = async () => {
    if (!jobId) return;

    await singleJobQuery.refetch();
  };

  if (originRoute === "employer") {
    if (singleJobQuery.isLoading) {
      return (
        <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
          <Text className="text-sm font-semibold text-neutral-500">
            Loading job details...
          </Text>
        </View>
      );
    }

    if (singleJobQuery.isError || !rawJob) {
      return (
        <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
          <Text className="text-center text-sm font-semibold text-red-700">
            Unable to load this job. Please try again.
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-neutral-50">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 64 }}
        >
          <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
            <View className="mx-auto w-full max-w-7xl gap-6">
              <Hero
                title={
                  employerJobStatus === "upcoming" ? "Upcoming Job" : "Active Job"
                }
                subtitle={
                  employerJobStatus === "upcoming"
                    ? "Review the upcoming role and current applicants from a desktop layout."
                    : "Manage the active role, assigned workers, and schedule in a wider employer-focused layout."
                }
                statusLabel={
                  employerJobStatus === "upcoming" ? "Upcoming role" : "In progress"
                }
                onBack={handleNavigateBack}
                onMessage={() => router.push({ pathname: "/screens/chats/chats", params: { jobId, origin: originRoute } })}
              />

              <View className="flex-col gap-6 xl:flex-row">
                <View className="flex-[1.45] gap-4">
                  <JobSummaryCard
                    jobDetails={jobDetails}
                    showRate={employerJobStatus === "upcoming"}
                    statusRoute={statusRoute}
                  />
                  {employerJobStatus === "active" ? (
                    <>
                      <EmployerWorkersCard
                        openWorkerDetails={openWorkerDetails}
                        rawJob={rawJob}
                      />
                      <ProjectScheduleCard jobDetails={jobDetails} />
                    </>
                  ) : (
                    <EmployerUpcomingApplicantsCard
                      openWorkerDetails={openWorkerDetails}
                    />
                  )}
                </View>

                <View className="flex-1 gap-4">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                    <View className="flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                        <ShieldCheck size={18} color={Colors.common.BRAND} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-neutral-900">
                          Employer dashboard view
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-neutral-600">
                          This web page keeps the job state and the most relevant
                          people around it visible at the same time.
                        </Text>
                      </View>
                    </View>
                  </View>

                  {employerJobStatus === "active" ? (
                    <EmployerCompletionRequestCard
                      jobId={jobId ?? ""}
                      status={rawJob?.jobCompletion?.status}
                      onUpdated={refreshJob}
                    />
                  ) : (
                    <ActionCard
                      title="Review applicants"
                      description="Use the applicant list to inspect profiles and accept candidates."
                      primaryLabel="Back"
                      secondaryLabel="Open Maps"
                      onPrimary={handleNavigateBack}
                      onSecondary={() => {
                        void Linking.openURL(
                          "https://www.google.com/maps/search/?api=1&query=Shoreditch",
                        );
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (singleJobQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-sm font-semibold text-neutral-500">
          Loading active job...
        </Text>
      </View>
    );
  }

  if (singleJobQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-center text-sm font-semibold text-red-700">
          Unable to load this active job. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <Hero
              title="Active Job"
              subtitle="Track the current role, employer contact, schedule, timesheets, and policy from a web layout that keeps the mobile route untouched."
              statusLabel={jobDetails.statusBadge}
              onBack={handleNavigateBack}
              onMessage={() => router.push({ pathname: "/screens/chats/chats", params: { jobId, origin: originRoute } })}
            />

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.45] gap-4">
                <WorkerJobDetails jobDetails={jobDetails} />
                <WorkerEmployerContact jobDetails={jobDetails} />
                <WorkerToggleChips
                  activeSubTab={activeSubTab}
                  setActiveSubTab={setActiveSubTab}
                />
                {activeSubTab === "schedule" && (
                  <WorkerProjectSchedule jobDetails={jobDetails} />
                )}
                {activeSubTab === "timesheet" && (
                  <WorkerWorkSummary
                    setShowApprovalModal={setShowApprovalPanel}
                    jobId={jobId ?? ""}
                    onCompletionRequested={() => void refreshJob()}
                    isAppliedForJobCompletion={Boolean(rawJob?.jobCompletion?.status)}
                  />
                )}
                {activeSubTab === "policy" && <WorkerWorkPolicy />}
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <ShieldCheck size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Worker view
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        The schedule, timesheet, and policy stay in the main
                        column while support and next actions stay visible here.
                      </Text>
                    </View>
                  </View>
                </View>

                <ActionCard
                  title="Support and next steps"
                  description="Open support or go back without relying on the floating controls from mobile."
                  primaryLabel="Message Support"
                  secondaryLabel="Back"
                  onPrimary={() => {
                    setSupportModalState("form");
                    setShowSupportModal(true);
                  }}
                  onSecondary={handleNavigateBack}
                />

                <TouchableOpacity
                  onPress={() => {
                    setSupportModalState("form");
                    setShowSupportModal(true);
                  }}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-between rounded-[24px] bg-neutral-950 px-5 py-5"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-white/60">
                      Need support?
                    </Text>
                    <Text className="mt-2 text-lg font-black tracking-tight text-white">
                      Open a support ticket
                    </Text>
                  </View>
                  <Headphones size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
        presentation="dialog"
      />

      {showApprovalPanel ? (
        <View className="absolute inset-0 items-center justify-center bg-black/40 px-6">
          <View className="w-full max-w-2xl">
            <ApprovalPanel
              scheduleStartDate={jobDetails.startDate}
              onClose={() => setShowApprovalPanel(false)}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
