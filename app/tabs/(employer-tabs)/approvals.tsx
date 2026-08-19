import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import ApprovalTabs from "@/components/modules/employer/approvals/ApprovalTabs";
import TimesheetApprovalList from "@/components/modules/employer/approvals/TimesheetApprovalList";
import { ApprovalTab, TimesheetApproval } from "@/types";

const TIMESHEET_APPROVALS: TimesheetApproval[] = [
  {
    id: "timesheet-1",
    workerId: "1",
    workerName: "James Mitchell",
    role: "Groundworker",
    location: "Shoreditch - 2.4 mi away",
    submittedAt: "Submitted today",
    weekLabel: "Week 1 - August 17 to August 21, 2026",
    totalHours: "45 hrs approved time",
  },
  {
    id: "timesheet-2",
    workerId: "2",
    workerName: "Michael Turner",
    role: "Labour",
    location: "Bethnal Green - 3.1 mi away",
    submittedAt: "Scheduled for review on August 24, 2026",
    weekLabel: "Week 2 - August 24 to August 28, 2026",
    totalHours: "40 hrs approved time",
  },
];

const WEEK_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EmployerApprovalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ApprovalTab>("timesheets");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("Select Week");

  const timesheetItems = useMemo(() => TIMESHEET_APPROVALS, []);
  const pendingCount = TIMESHEET_APPROVALS.length + 2;

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleApproveTimesheet = (item: TimesheetApproval) => {
    const matchedWeek =
      WEEK_OPTIONS.find((weekDay) => item.weekLabel.includes(weekDay)) ??
      "Select Week";
    setSelectedWeek(matchedWeek);
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

          <ApprovalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>

        {activeTab === "timesheets" ? (
          <View className="mt-6">
            <TimesheetApprovalList
              items={timesheetItems}
              onApprove={handleApproveTimesheet}
              openWorkerDetails={openWorkerDetails}
            />
          </View>
        ) : (
          <JobRequests
            openWorkerDetails={openWorkerDetails}
            containerStyle={{ marginTop: 24}}
          />
        )}
      </ScrollView>

      <WorkerApproveModal
        visible={showApprovalModal}
        selectedWeek={selectedWeek}
        isWeekDropdownOpen={isWeekDropdownOpen}
        onToggleWeekDropdown={() =>
          setIsWeekDropdownOpen((current) => !current)
        }
        onSelectWeek={(weekDay) => {
          setSelectedWeek(weekDay);
          setIsWeekDropdownOpen(false);
        }}
        onClose={handleCloseApprovalModal}
      />
    </ScreenWrapper>
  );
}
