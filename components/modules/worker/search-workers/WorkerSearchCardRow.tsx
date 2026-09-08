import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Bookmark, Clock, MapPin } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import ProfileAvatar from "@/components/common/ProfileAvatar";

export default function WorkerCardRow({
  worker,
  onPress,
}: {
  worker: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl overflow-hidden"
    >
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <ProfileAvatar uri={worker.image} name={worker.name} size={44} />
            <View className="flex-1">
              <Text className="text-neutral-950 text-base font-bold">
                {worker.name}
              </Text>
              <Text className="text-neutral-500 text-sm">{worker.role}</Text>
            </View>
          </View>

          <TouchableOpacity className="p-1.5">
            <Bookmark size={20} color="#737373" />
          </TouchableOpacity>
        </View>

        <View className="pt-4 mt-4 border-t border-neutral-100 gap-2.5">
          <View className="flex-row items-center gap-2">
            <MapPin size={14} color="#C81E1E" />
            <Text className="text-neutral-500 text-xs">{worker.location}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Clock size={14} color="#737373" />
            <Text className="text-neutral-500 text-xs">
              {worker.availability}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-4 pb-4">
        <View className="bg-orange-50 px-3 py-1.5 rounded-md">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-xs font-medium"
          >
            {worker.experience}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPress}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="px-4 py-2 rounded-lg active:opacity-90"
        >
          <Text className="min-w-20 text-white text-xs font-medium">View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
