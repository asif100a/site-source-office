import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import WorkerApproveModal from "@/components/modules/employer/worker-details/WorkerApproveModal";
import TimesheetApprovalList from "@/components/modules/employer/approvals/TimesheetApprovalList";
import TimesheetDetailsModal from "@/components/modules/employer/approvals/TimesheetDetailsModal";
import { EmployerTimesheet } from "@/types";
import { useGetEmployerTimesheetQuery } from "@/store/api/timesheetApi";

export default function EmployerApprovalsScreenWeb() {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("Select Week");
  const [selectedTimesheet, setSelectedTimesheet] =
    useState<EmployerTimesheet | null>(null);
  const [selectedTimesheetDetails, setSelectedTimesheetDetails] =
    useState<EmployerTimesheet | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const timesheetQuery = useGetEmployerTimesheetQuery({ page: 1, limit: 10 });

  const refreshTimesheets = async () => {
    setRefreshing(true);
    try {
      await timesheetQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const timesheetItems = useMemo(
    () => timesheetQuery.data?.data?.timeSheets ?? [],
    [timesheetQuery.data],
  );
  const pendingCount = timesheetQuery.data?.data?.meta?.total ?? 0;

  const handleApproveTimesheet = (item: EmployerTimesheet) => {
    setSelectedWeek(`Week ${item.week}`);
    setSelectedTimesheet(item);
    setShowApprovalModal(true);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedTimesheet(null);
  };

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshTimesheets} />
        }
      >
        <View className="mx-auto w-full max-w-7xl">
          <View className="rounded-[28px] border border-neutral-200 bg-white px-5 py-5 md:px-8 md:py-7">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[22px] font-black text-neutral-950">
                  Approvals
                </Text>
                <Text className="mt-2 text-sm leading-6 text-neutral-500">
                  Review submitted worker timesheets from one place.
                </Text>
              </View>
              <View className="rounded-full bg-neutral-100 px-3 py-2">
                <Text className="text-[10px] font-extrabold text-neutral-700">
                  {pendingCount} pending
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <TimesheetApprovalList
              items={timesheetItems}
              onApprove={handleApproveTimesheet}
              onViewDetails={setSelectedTimesheetDetails}
              isLoading={timesheetQuery.isLoading}
              isError={timesheetQuery.isError}
            />
          </View>
        </View>
      </ScrollView>

      <WorkerApproveModal
        visible={showApprovalModal}
        selectedWeek={selectedWeek}
        timesheetId={selectedTimesheet?.id}
        approvalDays={selectedTimesheet?.timeSheetDays ?? []}
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
