import { View, Text } from "react-native";
import React from "react";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

const DEFAULT_EMPLOYER_JOB_DETAILS = {
  title: "Labourer",
  company: "Tech Innovators Inc.",
  statusBadge: "Day 3 of 20",
  location: "Shoreditch - 1.2 mi away",
  team: "2 developers, 1 designer",
  duration: "12 Jun - 1 month",
};

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

const getLocationLabel = (jobDetails: any) => {
  const coordinates = jobDetails?.location?.coordinates;

  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return `${Number(coordinates[1]).toFixed(4)}, ${Number(coordinates[0]).toFixed(4)}`;
  }

  return DEFAULT_EMPLOYER_JOB_DETAILS.location;
};

const getEmployerJobDetails = (jobDetails: any) => ({
  title: jobDetails?.title ?? DEFAULT_EMPLOYER_JOB_DETAILS.title,
  company:
    jobDetails?.employerAuth?.profile?.name ??
    DEFAULT_EMPLOYER_JOB_DETAILS.company,
  statusBadge: jobDetails?.status ?? DEFAULT_EMPLOYER_JOB_DETAILS.statusBadge,
  location: getLocationLabel(jobDetails),
  team: `${jobDetails?.workersNeeded ?? "No"} workers needed`,
  duration: `${formatDate(jobDetails?.startDate)} - ${formatDate(jobDetails?.endDate)}`,
});

export default function EmployerJobDetails({ jobDetails }: { jobDetails?: any }) {
  const details = getEmployerJobDetails(jobDetails);

  return (
    <View className="bg-white rounded-2xl p-4 border border-neutral-200/80">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center">
            <Briefcase size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-neutral-900 text-base font-extrabold">
              {details.title}
            </Text>
            <Text className="text-neutral-500 text-xs font-medium">
              {details.company}
            </Text>
          </View>
        </View>

        <View className="bg-orange-50 px-2.5 py-1 rounded-lg">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-[10px] font-bold"
          >
            {details.statusBadge}
          </Text>
        </View>
      </View>

      <View className="pt-3 border-t border-neutral-100 gap-2.5">
        <View className="flex-row items-center gap-2">
          <MapPin size={13} color="#C81E1E" />
          <Text className="text-neutral-500 text-xs">
            {details.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={13} color="#737373" />
          <Text className="text-neutral-500 text-xs">
            {details.team}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={13} color="#737373" />
          <Text className="text-neutral-500 text-xs">
            {details.duration}
          </Text>
        </View>
      </View>
    </View>
  );
}
