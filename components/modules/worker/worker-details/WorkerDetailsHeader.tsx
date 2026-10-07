import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeft, Bookmark } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

export default function WorkerDetailsHeader({
  handleHeaderBack,
  isFavorite = false,
  onToggleFavorite,
}: {
  handleHeaderBack: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  return (
    <View className="bg-[#FAFAFA] px-5 pr-14 pt-4 pb-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleHeaderBack}
          className="w-9 h-9 rounded-full bg-white items-center justify-center active:opacity-75"
        >
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-neutral-900 text-lg font-extrabold ml-2">
          Worker Details
        </Text>
      </View>
      <TouchableOpacity onPress={onToggleFavorite} className="w-9 h-9 rounded-lg bg-[#101820] items-center justify-center active:opacity-85">
        <Bookmark size={17} color={isFavorite ? Colors.common.BRAND : "#FFFFFF"} fill={isFavorite ? Colors.common.BRAND : "transparent"} />
      </TouchableOpacity>
    </View>
  );
}
