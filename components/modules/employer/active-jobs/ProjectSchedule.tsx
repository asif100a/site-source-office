import React from "react";
import { Text, View } from "react-native";

const formatDate = (value: unknown) => {
  if (!value) return "Not set";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

const formatDay = (day?: string) => {
  if (!day) return "";

  return day
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getWorkingHoursLabels = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return ["Not set"];
  }

  const groupedSchedules = workingHours.reduce<Record<string, string[]>>(
    (groups, schedule) => {
      if (!schedule?.day || !schedule?.startTime || !schedule?.endTime) {
        return groups;
      }

      const timeLabel = `${schedule.startTime} - ${schedule.endTime}`;
      groups[timeLabel] = [
        ...(groups[timeLabel] ?? []),
        formatDay(schedule.day),
      ].filter(Boolean);

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

  const days = workingHours
    .map((schedule) => formatDay(schedule?.day))
    .filter(Boolean);
  const uniqueDays = Array.from(new Set(days));

  if (!uniqueDays.length) {
    return "Not set";
  }

  return `${uniqueDays.length} ${uniqueDays.length === 1 ? "Day" : "Days"}`;
};

const getDateRangeDayCountLabel = (startValue: unknown, endValue: unknown) => {
  if (!startValue || !endValue) return "Not set";

  const start = new Date(String(startValue));
  const end = new Date(String(endValue));

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Not set";
  }

  const startDay = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const endDay = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  if (startDay > endDay) return "Not set";

  const count = Math.round((endDay - startDay) / (24 * 60 * 60 * 1000)) + 1;

  return `${count} ${count === 1 ? "Date" : "Dates"}`;
};

export default function ProjectSchedule({ jobDetails }: { jobDetails?: any }) {
  const workingHoursLabels = getWorkingHoursLabels(jobDetails?.workingHours);
  const dayCountLabel = getDateRangeDayCountLabel(
    jobDetails?.startDate,
    jobDetails?.endDate,
  );

  return (
    <View className="mt-5">
      <Text className="mb-3 text-sm font-extrabold text-neutral-900">
        Project Schedule
      </Text>
      <View className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
        <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-4">
          <Text className="text-sm text-neutral-600">Start Date</Text>
          <Text className="text-sm font-medium text-neutral-700">
            {formatDate(jobDetails?.startDate)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-4">
          <Text className="text-sm text-neutral-600">End date</Text>
          <Text className="text-sm font-medium text-neutral-700">
            {formatDate(jobDetails?.endDate)}
          </Text>
        </View>

         <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-600 text-sm font-semibold">Hours</Text>
          <View className="ml-4 flex-1 items-end gap-1">
            {workingHoursLabels.map((label) => (
              <Text
                key={label}
                className="text-right text-sm font-medium text-neutral-700"
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-4">
          <Text className="text-sm text-neutral-600">Per Week</Text>
          <Text className="text-sm font-medium text-neutral-700">
            {getDaysPerWeekLabel(jobDetails?.workingHours)}
          </Text>
        </View>
      </View>
    </View>
  );
}
