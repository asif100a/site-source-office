import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react-native";

export default function TappableSearchTriggerBar({
  handleOpenSearch,
}: {
  handleOpenSearch: () => void;
}) {
  return (
    <View className="flex-row justify-between items-center gap-2.5 mt-3">
      <TouchableOpacity
        onPress={handleOpenSearch}
        activeOpacity={0.9}
        className="flex-1 h-10 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-3.5"
      >
        <Search size={16} color="#A3A3A3" />
        <Text className="flex-1 text-neutral-400 text-sm font-medium ml-2">
          Search Jobs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleOpenSearch}
        className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-neutral-200/80 active:opacity-85"
      >
        <SlidersHorizontal size={16} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}
