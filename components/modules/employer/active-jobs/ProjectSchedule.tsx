import { View, Text } from "react-native";
import React from "react";

const EMPLOYER_SCHEDULE = [
  { label: "Start Date", value: "3 Jun 2026" },
  { label: "End date", value: "28 Jun 2026" },
  { label: "Hours", value: "07:30 - 17:00" },
  { label: "Per Week", value: "5 Days" },
];

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
  if (!Array.isArray(workingHours) || !workingHours.length) return "Not set";

  const firstSchedule = workingHours[0];
  if (!firstSchedule?.startTime || !firstSchedule?.endTime) return "Not set";

  return `${firstSchedule.startTime} - ${firstSchedule.endTime}`;
};

const getDaysPerWeekLabel = (workingHours: any[]) => {
  if (!Array.isArray(workingHours) || !workingHours.length) return "Not set";

  return `${workingHours.length} ${workingHours.length === 1 ? "Day" : "Days"}`;
};

const getSchedule = (jobDetails: any) => {
  if (!jobDetails) return EMPLOYER_SCHEDULE;

  return [
    { label: "Start Date", value: formatDate(jobDetails.startDate) },
    { label: "End date", value: formatDate(jobDetails.endDate) },
    { label: "Hours", value: getWorkingHoursLabel(jobDetails.workingHours) },
    { label: "Per Week", value: getDaysPerWeekLabel(jobDetails.workingHours) },
  ];
};

export default function ProjectSchedule({ jobDetails }: { jobDetails?: any }) {
  const schedule = getSchedule(jobDetails);

  return (
    <View className="mt-5">
      <Text className="text-neutral-900 text-sm font-extrabold mb-3">
        Project Schedule
      </Text>
      <View className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
        {schedule.map((item, index) => (
          <View 
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${index < schedule.length - 1 ? "border-b border-neutral-100" : ""}`}
          >
            <Text className="text-neutral-600 text-sm">{item.label}</Text>
            <Text className="text-neutral-700 text-sm font-medium">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
