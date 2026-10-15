import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeft } from "lucide-react-native";

export default function UpdateJobHeader({
  onBackPress,
}: {
  onBackPress: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3 mt-14 px-5 pb-4 border-b border-neutral-100">
      <TouchableOpacity
        onPress={onBackPress}
        className="w-10 h-10 rounded-full bg-white items-center justify-center active:opacity-75"
      >
        <ArrowLeft size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-neutral-900 text-base font-extrabold">
        Update Job
      </Text>
      <View className="w-10 h-10" />
    </View>
  );
}
