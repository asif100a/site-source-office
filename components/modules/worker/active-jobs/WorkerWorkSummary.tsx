import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useGetWorkerTimesheetQuery } from "@/store/api/timesheetApi";

type WorkerTimesheet = {
  id: string;
  week: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | string;
};

const getWorkerTimesheets = (response: any): WorkerTimesheet[] => {
  const timesheets = response?.data?.data ?? response?.data ?? [];

  return Array.isArray(timesheets) ? timesheets : [];
};

const formatWeekLabel = (week?: number) =>
  typeof week === "number" ? `Week ${week}` : "Week";

const getStatusStyles = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approved",
        containerClassName: "bg-green-50",
        textClassName: "text-green-600",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        containerClassName: "bg-red-50",
        textClassName: "text-red-600",
      };
    default:
      return {
        label: "Pending",
        containerClassName: "bg-orange-50",
        textClassName: "text-orange-600",
      };
  }
};

export default function WorkerWorkSummary({
  setShowApprovalModal,
  jobId,
}: {
  setShowApprovalModal: (show: boolean) => void;
  jobId: string;
}) {
  const workerTimesheetQuery = useGetWorkerTimesheetQuery(
    { id: jobId },
    { skip: !jobId },
  );
  console.log("workerTimesheetQuery from the worker work summary component: ", workerTimesheetQuery);
  const timesheets = getWorkerTimesheets(workerTimesheetQuery.data);

  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-900 font-extrabold text-base">
          Timesheet
        </Text>
        <TouchableOpacity
          onPress={() => setShowApprovalModal(true)}
          style={{ borderColor: Colors.common.BRAND }}
          className="border px-3 py-1 rounded-full active:opacity-75 bg-white"
        >
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-[10px] font-extrabold"
          >
            Submit Timesheet
          </Text>
        </TouchableOpacity>
      </View>

      <View className="border border-neutral-200/80 rounded-2xl bg-white overflow-hidden divide-y divide-neutral-50">
        {workerTimesheetQuery.isLoading ? (
          <View className="p-4">
            <Text className="text-neutral-400 text-xs font-semibold">
              Loading timesheets...
            </Text>
          </View>
        ) : null}

        {workerTimesheetQuery.isError ? (
          <View className="p-4">
            <Text className="text-red-600 text-xs font-semibold">
              Unable to load timesheets. Please pull to refresh and try again.
            </Text>
          </View>
        ) : null}

        {!workerTimesheetQuery.isLoading &&
        !workerTimesheetQuery.isError &&
        timesheets.length === 0 ? (
          <View className="flex-row justify-between items-center p-4">
            <View className="flex-1">
              <Text className="text-neutral-800 font-extrabold text-sm">
                No timesheet submitted
              </Text>
              <Text className="text-neutral-400 text-xs font-semibold mt-0.5">
                Submit your hours for approval.
              </Text>
            </View>
          </View>
        ) : null}

        {timesheets.map((item) => {
          const statusStyle = getStatusStyles(item.status);

          return (
            <View
              key={item.id}
              className="flex-row justify-between items-center p-4"
            >
              <View>
                <Text className="text-neutral-800 font-extrabold text-sm">
                  {formatWeekLabel(item.week)}
                </Text>
                <Text className="text-neutral-400 text-xs font-semibold mt-0.5">
                  Timesheet submitted
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${statusStyle.containerClassName}`}
              >
                <Text
                  className={`text-[10px] font-extrabold ${statusStyle.textClassName}`}
                >
                  {statusStyle.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
