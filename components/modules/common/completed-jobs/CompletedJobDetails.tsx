import { View, Text, Platform } from "react-native";
import React from "react";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";

export default function CompletedJobDetails({ jobDetails }: { jobDetails: any }) {
  return (
    <View className="bg-white rounded-xl p-5 border border-neutral-200/80 mb-6">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
            <Briefcase size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-neutral-950 font-extrabold text-base" style={Platform.OS === 'ios' ? { maxWidth: 200 } : { maxWidth: 160 }}>
              {jobDetails.title}
            </Text>
            <Text className="text-neutral-500 text-xs font-semibold">
              {jobDetails.company}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <View className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
            <Text className="text-[10px] font-extrabold text-emerald-500">
              {jobDetails.statusBadge}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-2.5 pt-3 border-t border-neutral-50">
        <View className="flex-row items-center gap-2">
          <MapPin size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {jobDetails.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {jobDetails.team}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {jobDetails.duration}
          </Text>
        </View>
      </View>
    </View>
  );
}
