import { View, Text } from "react-native";
import React from "react";

const formatDate = (value: unknown) => {
  if (!value) return "Not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getWorkingHoursLabel = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return ["Not set"];
  }

  const groupedSchedules = workingHours.reduce<Record<string, string[]>>(
    (groups, schedule) => {
      if (!schedule?.day || !schedule?.startTime || !schedule?.endTime) {
        return groups;
      }

      const timeLabel = `${schedule.startTime} - ${schedule.endTime}`;
      groups[timeLabel] = [...(groups[timeLabel] ?? []), schedule.day];

      return groups;
    },
    {},
  );

  const labels = Object.entries(groupedSchedules).map(
    ([timeLabel, days]) => `${days.join(", ")} · ${timeLabel}`,
  );

  return labels.length ? labels : ["Not set"];
};

const getDaysPerWeekLabel = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return "Not set";
  }

  return `${workingHours.length} ${workingHours.length === 1 ? "Day" : "Days"}`;
};

export default function WorkerProjectSchedule({jobDetails}: {jobDetails: any}) {
  const workingHoursLabels = getWorkingHoursLabel(jobDetails?.workingHours);

  return (
    <View>
      <Text className="text-neutral-900 font-extrabold text-base mb-3.5">
        Project Schedule
      </Text>
      <View className="border border-neutral-200/80 rounded-xl bg-white overflow-hidden">
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            Start Date
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {formatDate(jobDetails?.startDate)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            End date
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {formatDate(jobDetails?.endDate)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">Hours</Text>
          <View className="ml-4 flex-1 items-end gap-1">
            {workingHoursLabels.map((label) => (
              <Text
                key={label}
                className="text-right text-sm font-extrabold text-neutral-800"
              >
                {label}
              </Text>
            ))}
          </View>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            Per Week
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {getDaysPerWeekLabel(jobDetails?.workingHours)}
          </Text>
        </View>
        {/* <View className="flex-row justify-between items-center p-4">
          <Text className="text-neutral-400 text-sm font-semibold">
            Next invoice
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            Not set
          </Text>
        </View> */}
      </View>
    </View>
  );
}
