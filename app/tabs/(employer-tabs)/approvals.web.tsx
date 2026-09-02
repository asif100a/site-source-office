import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import WebApprovalTabs from "@/components/modules/employer/approvals/WebApprovalTabs";
import WebTimesheetApprovalList from "@/components/modules/employer/approvals/WebTimesheetApprovalList";
import { TimesheetApproval } from "@/types";
import { useGetAppliedJobsQuery } from "@/store/api/jobApplicationApi";
import AppliedJobList from "@/components/modules/employer/approvals/AppliedJobList";
import {
  AppliedJobApplication,
  getAppliedJobApplications,
  getAppliedJobsHasNextPage,
} from "@/utils/jobApplications";

type ApprovalTab = "timesheets" | "requests";

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
    submittedAt: "Submitted on August 17, 2026",
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

export default function EmployerApprovalsScreenWeb() {
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
  const weekOptions = TIMESHEET_APPROVALS.map((item) =>
    formatWeekOptionLabel(item.weekLabel),
  );

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: `/screens/worker-details/${workerId}` as any,
      params: { origin: "employer" },
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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshApplications} />
        }
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-14 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <View className="max-w-3xl gap-3">
                    <View className="self-start rounded-full bg-orange-50 px-3 py-1.5">
                      <Text className="text-xs font-bold uppercase text-neutral-900">
                        Approvals
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Review timesheets and job requests from one place.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        Switch between worker time approvals and incoming job
                        requests without leaving the employer workspace.
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-[22px] border border-neutral-200 bg-white px-4 py-4">
                    <View className="flex-row items-center gap-3">
                      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
                        <ShieldCheck size={18} color={Colors.common.BRAND} />
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-neutral-900">
                          Employer queue
                        </Text>
                        <Text className="mt-1 text-xs text-neutral-500">
                          4 approvals pending
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <AppliedJobList
              applications={applications}
              isLoading={appliedJobsQuery.isLoading}
              isFetching={appliedJobsQuery.isFetching}
              isError={appliedJobsQuery.isError}
              hasNextPage={hasMoreApplications}
              onLoadMore={() => setApplicationPage((current) => current + 1)}
            />

            {/* <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <WebApprovalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </View> */}

            {/* {activeTab === "timesheets" ? ( */}
              <WebTimesheetApprovalList
                items={TIMESHEET_APPROVALS}
                onApprove={handleApproveTimesheet}
                openWorkerDetails={openWorkerDetails}
              />
            {/* ) : ( */}
              <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
                <JobRequests
                  openWorkerDetails={openWorkerDetails}
                  containerStyle={{ marginTop: 0, paddingHorizontal: 0 }}
                />
              </View>
            {/* )} */}
          </View>
        </View>
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
