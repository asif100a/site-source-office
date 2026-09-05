import { View, Text } from "react-native";
import React from "react";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

const formatDate = (value: unknown) => {
  if (!value) return "Date not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const formatStatus = (value: unknown) => {
  const status = String(value ?? "Active").replace(/_/g, " ").toLowerCase();
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getCompanyName = (jobDetails: any) =>
  jobDetails?.employerAuth?.profile?.name ??
  jobDetails?.employer?.name ??
  "Employer";

const getLocationLabel = (jobDetails: any) => {
  const coordinates = jobDetails?.location?.coordinates;

  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return `${Number(coordinates[1]).toFixed(4)}, ${Number(
      coordinates[0],
    ).toFixed(4)}`;
  }

  return jobDetails?.location?.address ?? "Location not available";
};

export default function WorkerJobDetails({jobDetails}: {jobDetails: any}) {
  const workersNeeded = Number(jobDetails?.workersNeeded ?? 0);
  const teamLabel = `${workersNeeded} worker${workersNeeded === 1 ? "" : "s"} needed`;
  const durationLabel = `${formatDate(jobDetails?.startDate)} - ${formatDate(
    jobDetails?.endDate,
  )}`;

  return (
    <View className="bg-white rounded-xl p-5 border border-neutral-200/80 mb-6">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
            <Briefcase size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-neutral-950 font-extrabold text-base">
              {jobDetails?.title ?? "Active job"}
            </Text>
            <Text className="text-neutral-500 text-xs font-semibold">
              {getCompanyName(jobDetails)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <View
            style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
            className="px-2.5 py-1 rounded-md"
          >
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-[10px] font-extrabold"
            >
              {formatStatus(jobDetails?.status)}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-2.5 pt-3 border-t border-neutral-50">
        <View className="flex-row items-center gap-2">
          <MapPin size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {getLocationLabel(jobDetails)}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {teamLabel}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {durationLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
