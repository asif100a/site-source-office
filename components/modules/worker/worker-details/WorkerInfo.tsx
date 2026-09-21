import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import WorkerRatingStars from "./_ui/WorkerRatingStars";
import { MapPin } from "lucide-react-native";
import PLACEHOLDER_USER from "@/assets/images/placeholder/placeholder-user.png";

export default function WorkerInfo({worker}: {worker: any}) {
  return (
    <View className="bg-white">
      <View className="items-center p-4">
        <View className="relative">
          <Image
            source={worker.image ? { uri: worker.image } : PLACEHOLDER_USER}
            style={{ width: 96, height: 96 }}
            className="w-24 h-24 rounded-full"
          />
          <View
            style={{ left: 0, transform: [{ translateX: 0 }] }}
            className="absolute -bottom-2 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full"
          >
            <Text className="text-emerald-600 text-[10px] font-bold">
              {worker.status}
            </Text>
          </View>
        </View>

        <Text className="flex-1 min-w-[80%] text-center text-neutral-900 text-3xl font-extrabold mt-6">
          {worker.name}
        </Text>
        <Text className="text-neutral-500 text-base mt-1">{worker.role}</Text>

        <View className="flex-row items-center gap-2 mt-2">
          <WorkerRatingStars rating={worker.rating} />
          <Text className="text-neutral-700 text-sm font-medium">
            <Text className="font-extrabold">{worker.rating}</Text> (
            {worker.reviews})
          </Text>
        </View>

        <View className="flex-row items-center gap-2 mt-5">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-neutral-500 text-sm font-medium">
            {worker.location}
          </Text>
        </View>
      </View>
    </View>
  );
}
