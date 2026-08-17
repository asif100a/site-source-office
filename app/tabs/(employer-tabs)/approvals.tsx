import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, MapPin } from "lucide-react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import { Colors } from "@/constants/Colors";

type ApprovalTab = "timesheets" | "requests";

type TimesheetApproval = {
  id: string;
  workerId: string;
  workerName: string;
  role: string;
  location: string;
  submittedAt: string;
  weekLabel: string;
  totalHours: string;
};

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

function ApprovalTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ApprovalTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ApprovalTab>>;
}) {
  return (
    <View className="mt-5 flex-row rounded-2xl bg-neutral-100 p-1">
      {[
        { id: "timesheets" as const, label: "Approve Timesheet" },
        { id: "requests" as const, label: "Approve Job Request" },
      ].map((tab) => {
        const active = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.9}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-[14px] px-3 py-3 ${
              active ? "bg-white" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-xs font-extrabold ${
                active ? "text-neutral-950" : "text-neutral-500"
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

function TimesheetApprovalList({
  items,
  onApprove,
}: {
  items: TimesheetApproval[];
  onApprove: (item: TimesheetApproval) => void;
}) {
  return (
    <View className="rounded-[24px] bg-white px-4 py-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-base font-extrabold text-neutral-950">
          Pending Timesheets
        </Text>
        <ChevronRight size={18} color="#1F2937" />
      </View>

      {items.map((item, index) => (
        <View
          key={item.id}
          className={`py-4 ${
            index < items.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 pr-2">
              <Text className="text-sm font-bold text-neutral-950">
                {item.workerName}
              </Text>
              <Text className="mt-1 text-xs text-neutral-500">{item.role}</Text>
            </View>

            <View className="rounded-full bg-orange-50 px-3 py-1.5">
              <Text
                style={{ color: Colors.common.BRAND }}
                className="text-[10px] font-extrabold"
              >
                Pending
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-sm font-semibold text-neutral-900">
            {item.weekLabel}
          </Text>
          <Text className="mt-1 text-xs text-neutral-400">{item.submittedAt}</Text>

          <View className="mt-3 flex-row items-center gap-2">
            <MapPin size={14} color="#C81E1E" />
            <Text className="flex-1 text-xs text-neutral-500">
              {item.location}
            </Text>
          </View>

          <Text className="mt-2 text-xs text-neutral-500">{item.totalHours}</Text>

          <View className="mt-4 flex-row items-center justify-end gap-3">
            <TouchableOpacity onPress={() => onApprove(item)} activeOpacity={0.85}>
              <Text className="text-xs font-bold text-neutral-700">View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onApprove(item)}
              activeOpacity={0.9}
              className="rounded-xl border border-neutral-200 px-4 py-2.5"
            >
              <Text className="text-xs font-bold text-neutral-700">Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

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
