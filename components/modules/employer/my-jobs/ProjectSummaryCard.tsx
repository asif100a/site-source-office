import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BriefcaseBusiness, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProjectSummaryCard({
  project,
  onPress,
}: {
  project: ProjectCard;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
    >
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
          <BriefcaseBusiness size={18} color={Colors.common.BRAND} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-extrabold text-neutral-950">
                {project.name}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-neutral-500">
                {project.startDate} - {project.endDate}
              </Text>
            </View>

            <View className="rounded-full bg-neutral-100 px-3 py-1">
              <Text className="text-[10px] font-bold text-neutral-600">
                {project.jobs.length} jobs
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <MapPin size={14} color="#737373" />
            <Text className="flex-1 text-xs font-medium text-neutral-600">
              {project.address}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}