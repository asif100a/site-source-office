import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import ApprovalTabs from "@/components/modules/employer/approvals/ApprovalTabs";
import TimesheetApprovalList from "@/components/modules/employer/approvals/TimesheetApprovalList";
import TimesheetDetailsModal from "@/components/modules/employer/approvals/TimesheetDetailsModal";
import { ApprovalTab, TimesheetApproval } from "@/types";
import { useGetAppliedJobsQuery } from "@/store/api/jobApplicationApi";
import AppliedJobList from "@/components/modules/employer/approvals/AppliedJobList";
import {
  AppliedJobApplication,
  getAppliedJobApplications,
  getAppliedJobsHasNextPage,
} from "@/utils/jobApplications";
import { useGetEmployerTimesheetQuery } from "@/store/api/timesheetApi";

type EmployerTimesheetDay = {
  id: string;
  day: string;
  hours: number;
  status: string;
};

type EmployerTimesheet = {
  id: string;
  workerAuthId: string;
  week: number;
  createdAt: string;
  workerAuth?: {
    profile?: {
      name?: string;
    } | null;
    workerProfile?: {
      trades?: string[];
    } | null;
  } | null;
  job?: {
    title?: string;
    location?: {
      address?: string;
      coordinates?: number[];
    } | null;
  } | null;
  timeSheetDays?: EmployerTimesheetDay[];
};

const getEmployerTimesheets = (response: any): EmployerTimesheet[] => {
  const timesheets = response?.data?.timeSheets ?? response?.data?.data?.timeSheets ?? [];

  return Array.isArray(timesheets) ? timesheets : [];
};

const getEmployerTimesheetTotal = (response: any) =>
  response?.data?.meta?.total ?? response?.data?.data?.meta?.total ?? 0;

const getAppliedJobsTotal = (response: any) =>
  response?.data?.meta?.total ?? response?.meta?.total ?? 0;

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

const formatWeekOptionLabel = (weekLabel: string) => {
  const match = weekLabel.match(/^Week\s+(\d+)\s+-\s+([A-Za-z]+)\s+(\d{1,2})/);

  if (!match) {
    return weekLabel;
  }

  const [, weekNumber, monthName, dayValue] = match;
  const day = Number(dayValue);
  const parsedDate = new Date(`${monthName} ${day}, 2026`);

  if (Number.isNaN(parsedDate.getTime())) {
    return weekLabel;
  }

  const month = parsedDate.toLocaleDateString("en-US", { month: "short" });
  return `Week ${weekNumber} - ${day}${getOrdinalSuffix(day)} ${month}`;
};

const formatSubmittedAt = (value?: string) => {
  if (!value) return "Submitted date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submitted date unavailable";

  return `Submitted ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const formatLocation = (timesheet: EmployerTimesheet) => {
  const address = timesheet.job?.location?.address;
  if (address) return address;

  const coordinates = timesheet.job?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
  }

  return timesheet.job?.title ?? "Location unavailable";
};

const formatTotalHours = (days?: EmployerTimesheetDay[]) => {
  const totalHours = (days ?? []).reduce((sum, day) => {
    const hours = Number(day.hours);
    return sum + (Number.isFinite(hours) ? hours : 0);
  }, 0);

  return `${totalHours} hrs submitted time`;
};

const mapTimesheetApproval = (
  timesheet: EmployerTimesheet,
): TimesheetApproval => ({
  id: timesheet.id,
  workerId: timesheet.workerAuthId,
  workerName: timesheet.workerAuth?.profile?.name ?? "Worker",
  role:
    timesheet.workerAuth?.workerProfile?.trades?.join(", ") ||
    timesheet.job?.title ||
    "Trade not set",
  location: formatLocation(timesheet),
  submittedAt: formatSubmittedAt(timesheet.createdAt),
  weekLabel: `Week ${timesheet.week}`,
  totalHours: formatTotalHours(timesheet.timeSheetDays),
  days: timesheet.timeSheetDays ?? [],
});

export default function EmployerApprovalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ApprovalTab>("timesheets");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("Select Week");
  const [selectedTimesheet, setSelectedTimesheet] =
    useState<TimesheetApproval | null>(null);
  const [selectedTimesheetDetails, setSelectedTimesheetDetails] =
    useState<TimesheetApproval | null>(null);
  const [applicationPage, setApplicationPage] = useState(1);
  const [applications, setApplications] = useState<AppliedJobApplication[]>([]);
  const [hasMoreApplications, setHasMoreApplications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const timesheetQuery = useGetEmployerTimesheetQuery({ page: 1, limit: 10 });
  const appliedJobsQuery = useGetAppliedJobsQuery({
    page: applicationPage,
    limit: 10,
  });
  // console.log("Applied jobs query: ", appliedJobsQuery);

  useEffect(() => {
    if (!appliedJobsQuery.data || (applicationPage > 1 && appliedJobsQuery.isFetching)) {
      return;
    }

    const nextApplications = getAppliedJobApplications(appliedJobsQuery.data);
    setApplications((current) =>
      applicationPage === 1 ? nextApplications : [...current, ...nextApplications],
    );
    setHasMoreApplications(
      getAppliedJobsHasNextPage(appliedJobsQuery.data, nextApplications.length, 10),
    );
  }, [appliedJobsQuery.data, appliedJobsQuery.isFetching, applicationPage]);

  const refreshApplications = async () => {
    setRefreshing(true);
    setApplicationPage(1);
    setApplications([]);

    try {
      await Promise.all([appliedJobsQuery.refetch(), timesheetQuery.refetch()]);
    } finally {
      setRefreshing(false);
    }
  };

  const timesheetItems = useMemo(
    () => getEmployerTimesheets(timesheetQuery.data).map(mapTimesheetApproval),
    [timesheetQuery.data],
  );
  console.log("Timesheet items: ", timesheetItems);
  const pendingCount =
    getEmployerTimesheetTotal(timesheetQuery.data) +
    getAppliedJobsTotal(appliedJobsQuery.data);

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleApproveTimesheet = (item: TimesheetApproval) => {
    setSelectedWeek(formatWeekOptionLabel(item.weekLabel));
    setSelectedTimesheet(item);
    setShowApprovalModal(true);
  };

  const openTimesheetDetails = (item: TimesheetApproval) => {
    setSelectedTimesheetDetails(item);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedTimesheet(null);
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshApplications} />
        }
      >
        <View className="rounded-xl bg-white px-5 py-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-[22px] font-black text-neutral-950">
                Approvals
              </Text>
              <Text className="mt-2 text-sm leading-6 text-neutral-500">
                Review timesheets and incoming job requests from one place.
              </Text>
            </View>

            <View className="rounded-full bg-neutral-100 px-3 py-2">
              <Text className="text-[10px] font-extrabold text-neutral-700">
                {pendingCount} pending
              </Text>
            </View>
          </View>

          {/* <ApprovalTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
        </View>

        {/* <View className="mt-6">
          <AppliedJobList
            applications={applications}
            isLoading={appliedJobsQuery.isLoading}
            isFetching={appliedJobsQuery.isFetching}
            isError={appliedJobsQuery.isError}
            hasNextPage={hasMoreApplications}
            onLoadMore={() => setApplicationPage((current) => current + 1)}
          />
        </View> */}

        {/* {activeTab === "timesheets" ? ( */}
          <View className="mt-6">
            <TimesheetApprovalList
              items={timesheetItems}
              onApprove={handleApproveTimesheet}
              onViewDetails={openTimesheetDetails}
              isLoading={timesheetQuery.isLoading}
              isError={timesheetQuery.isError}
            />
          </View>
        {/* ) : ( */}
          <JobRequests
            openWorkerDetails={openWorkerDetails}
            containerStyle={{ marginTop: 32}}
          />
        {/* )} */}
      </ScrollView>

      <WorkerApproveModal
        visible={showApprovalModal}
        selectedWeek={selectedWeek}
        timesheetId={selectedTimesheet?.id}
        approvalDays={selectedTimesheet?.days ?? []}
        onClose={handleCloseApprovalModal}
      />

      <TimesheetDetailsModal
        visible={!!selectedTimesheetDetails}
        timesheet={selectedTimesheetDetails}
        onClose={() => setSelectedTimesheetDetails(null)}
      />
    </ScreenWrapper>
  );
}
