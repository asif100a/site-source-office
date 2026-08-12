import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react-native";

export default function TappableSearchTriggerBar({
  handleOpenSearch,
}: {
  handleOpenSearch: () => void;
}) {
  return (
    <View className="flex-row justify-between items-center gap-2 mt-4">
      <TouchableOpacity
        onPress={handleOpenSearch}
        activeOpacity={0.9}
        className="flex-1 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-4 py-3"
      >
        <Search size={18} color="#A3A3A3" className="mr-3" />
        <Text className="flex-1 text-neutral-400 text-sm font-medium">
          Search Jobs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleOpenSearch} className="bg-white rounded-xl items-center justify-center border border-neutral-200/80 p-3.5 w-auto h-auto">
        <SlidersHorizontal size={14} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}
