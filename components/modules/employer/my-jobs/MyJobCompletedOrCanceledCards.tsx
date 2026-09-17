import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import JobLocationLabel from "./JobLocationLabel";

export default function MyJobCompletedOrCanceledCards({
  job,
  openJobDetails,
}: {
  job: any;
  openJobDetails: (id: string, status: "completed" | "cancelled") => void;
}) {
  const isCompleted = job.status === "completed";
  const isCancelled = job.status === "cancelled";

  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
              <Briefcase size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-950 text-base font-bold">
                {job.title}
              </Text>
              <Text className="text-neutral-500 text-sm">{job.company}</Text>
            </View>
          </View>

          <View className="items-end">
            <View
              className={`px-2.5 py-1 rounded-md border ${
                isCompleted
                  ? "bg-emerald-50 border-emerald-100"
                  : isCancelled
                    ? "bg-red-50 border-red-100"
                    : "bg-orange-50 border-orange-100"
              }`}
            >
              <Text
                className={`text-[10px] font-extrabold ${
                  isCompleted
                    ? "text-emerald-500"
                    : isCancelled
                      ? "text-red-500"
                      : "text-orange-500"
                }`}
              >
                {job.badge}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-end justify-between pt-4 mt-4 border-t border-neutral-100">
          <View className="gap-2.5">
            <View className="flex-row items-center gap-2">
              <MapPin size={14} color="#C81E1E" />
              <JobLocationLabel
                location={job.location}
                coordinates={job.coordinates}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <Users size={14} color="#737373" />
              <Text className="text-neutral-500 text-xs">{job.team}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar size={14} color="#737373" />
              <Text className="text-neutral-500 text-xs">{job.duration}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => openJobDetails(job.id, job.status)}
            activeOpacity={0.9}
            style={{ backgroundColor: Colors.common.GRAY_DARK }}
            className="px-4 py-2 rounded-md active:opacity-90"
          >
            <Text className="min-w-20 text-white text-xs font-medium">
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
