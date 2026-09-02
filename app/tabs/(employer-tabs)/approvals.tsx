import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import ApprovalTabs from "@/components/modules/employer/approvals/ApprovalTabs";
import TimesheetApprovalList from "@/components/modules/employer/approvals/TimesheetApprovalList";
import { ApprovalTab, TimesheetApproval } from "@/types";
import { useGetAppliedJobsQuery } from "@/store/api/jobApplicationApi";
import AppliedJobList from "@/components/modules/employer/approvals/AppliedJobList";
import {
  AppliedJobApplication,
  getAppliedJobApplications,
  getAppliedJobsHasNextPage,
} from "@/utils/jobApplications";

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

const TIMESHEET_APPROVALS: TimesheetApproval[] = [
  {
    id: "timesheet-1",
    workerId: "1",
    workerName: "James Mitchell",
    role: "Groundworker",
    location: "Shoreditch - 2.4 mi away",
    submittedAt: "Submitted today",
    weekLabel: "Week 1 - 17th Aug",
    totalHours: "45 hrs approved time",
  },
  {
    id: "timesheet-2",
    workerId: "2",
    workerName: "Michael Turner",
    role: "Labour",
    location: "Bethnal Green - 3.1 mi away",
    submittedAt: "Scheduled for review on August 24, 2026",
    weekLabel: "Week 2 - 24th Aug",
    totalHours: "40 hrs approved time",
  },
];

export default function EmployerApprovalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ApprovalTab>("timesheets");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("Select Week");
  const [applicationPage, setApplicationPage] = useState(1);
  const [applications, setApplications] = useState<AppliedJobApplication[]>([]);
  const [hasMoreApplications, setHasMoreApplications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const appliedJobsQuery = useGetAppliedJobsQuery({
    page: applicationPage,
    limit: 10,
  });
  console.log("Applied jobs query: ", appliedJobsQuery);

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
      await appliedJobsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const timesheetItems = useMemo(() => TIMESHEET_APPROVALS, []);
  const weekOptions = useMemo(
    () => timesheetItems.map((item) => formatWeekOptionLabel(item.weekLabel)),
    [timesheetItems],
  );
  const pendingCount = TIMESHEET_APPROVALS.length + 2;

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleApproveTimesheet = (item: TimesheetApproval) => {
    setSelectedWeek(formatWeekOptionLabel(item.weekLabel));
    setIsWeekDropdownOpen(false);
    setShowApprovalModal(true);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setIsWeekDropdownOpen(false);
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

        <View className="mt-6">
          <AppliedJobList
            applications={applications}
            isLoading={appliedJobsQuery.isLoading}
            isFetching={appliedJobsQuery.isFetching}
            isError={appliedJobsQuery.isError}
            hasNextPage={hasMoreApplications}
            onLoadMore={() => setApplicationPage((current) => current + 1)}
          />
        </View>

        {/* {activeTab === "timesheets" ? ( */}
          <View className="mt-6">
            <TimesheetApprovalList
              items={timesheetItems}
              onApprove={handleApproveTimesheet}
              openWorkerDetails={openWorkerDetails}
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
        weekOptions={weekOptions}
        isWeekDropdownOpen={isWeekDropdownOpen}
        onToggleWeekDropdown={() =>
          setIsWeekDropdownOpen((current) => !current)
        }
        onSelectWeek={(weekLabel) => {
          setSelectedWeek(weekLabel);
          setIsWeekDropdownOpen(false);
        }}
        onClose={handleCloseApprovalModal}
      />
    </ScreenWrapper>
  );
}
