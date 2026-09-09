import { View, Text } from "react-native";
import React from "react";

const formatDate = (value?: string) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const getRows = (jobDetails: any) => {
  const weeks = Array.isArray(jobDetails?.timeSheetWeeks)
    ? jobDetails.timeSheetWeeks
    : [];
  const timesheets = Array.isArray(jobDetails?.timeSheets)
    ? jobDetails.timeSheets
    : [];

  if (!weeks.length && !timesheets.length) {
    return [];
  }

  const source = weeks.length ? weeks : timesheets;

  return source.map((item: any, index: number) => {
    const week = item.week ?? index + 1;
    const timesheet = timesheets.find((entry: any) => entry.week === week);

    return {
      week: `Week ${week}`,
      dates:
        item.startDate || item.endDate
          ? `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
          : "Dates not set",
      status: timesheet?.status ?? "Completed",
    };
  });
};

export default function CompletedWorkSummary({ jobDetails }: { jobDetails?: any }) {
  const rows = getRows(jobDetails);

  return (
    <View>
      <Text className="text-neutral-900 font-extrabold text-base mb-4">
        Work Summary
      </Text>
      <View className="border border-neutral-200/80 rounded-xl bg-white overflow-hidden divide-y divide-neutral-50">
        {rows.length === 0 ? (
          <View className="p-4">
            <Text className="text-neutral-400 text-xs font-semibold">
              No work summary available.
            </Text>
          </View>
        ) : null}

        {rows.map((item: any, idx: number) => (
          <View key={idx} className="flex-row justify-between items-center p-4">
            <View>
              <Text className="text-neutral-800 font-extrabold text-sm">
                {item.week}
              </Text>
              <Text className="text-neutral-400 text-xs font-semibold mt-0.5">
                {item.dates}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${item.status === "Approved" ? "bg-green-50" : "bg-neutral-100"}`}
            >
              <Text
                className={`text-[10px] font-extrabold ${item.status === "Approved" ? "text-green-600" : "text-neutral-500"}`}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
