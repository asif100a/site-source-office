import { Colors } from "@/constants/Colors";
import {
  formatDistance,
  formatHourlyRate,
  formatNeeded,
} from "@/constants/workerHome";
import { WorkerHomeJob } from "@/types";
import { Briefcase } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function WebJobCard({
  job,
  onDetails,
  onApply,
}: {
  job: WorkerHomeJob;
  onDetails: (job: WorkerHomeJob) => void;
  onApply: (job: WorkerHomeJob) => void;
}) {
  const closingSoon =
    new Date(job.closingAt).getTime() - Date.now() < 1000 * 60 * 60 * 30;

  return (
    <View className="mb-4 rounded-xl bg-white px-6 py-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
            <Briefcase size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-neutral-950">
              {job.title}
            </Text>
            <Text className="text-base font-medium text-neutral-500">
              {job.company}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xl font-bold text-neutral-950">
            {formatHourlyRate(job.hourlyRate)}
          </Text>
          <Text className="mt-1 text-sm font-medium text-neutral-500">
            {job.duration}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row flex-wrap gap-2">
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {job.area} - {formatDistance(job.distanceMiles)}
          </Text>
        </View>
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {formatNeeded((job as any).workersNeeded?.[0]?.howMany ?? 0)}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1.5"
          style={{ backgroundColor: closingSoon ? "#FFF0E8" : "#F4F4F4" }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: closingSoon ? Colors.common.BRAND : "#5A5A5A" }}
          >
            {closingSoon ? "Closing soon" : job.startLabel}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-neutral-400">
          {job.posted}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onDetails(job)}
            className="rounded-xl bg-[#F5F3F3] px-5 py-3"
          >
            <Text className="text-sm font-bold text-neutral-700">Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onApply(job)}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: "#111111" }}
          >
            <Text className="text-sm font-bold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
