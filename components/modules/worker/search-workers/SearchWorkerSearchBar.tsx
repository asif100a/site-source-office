import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react-native";

export default function SearchWorkerSearchBar({
  searchQuery,
  setSearchQuery,
  setShowFilters,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="px-5 pt-4 pb-2 flex-row gap-3 items-center z-10">
      <View className="flex-1 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-4 py-0">
        <Search size={18} color="#A3A3A3" className="mr-2" />
        <TextInput
          className="flex-1 text-neutral-800 text-sm font-medium py-0"
          placeholder="Search workers or location"
          placeholderTextColor="#A3A3A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity
        onPress={() => setShowFilters(true)}
        className="w-12 h-12 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-80"
      >
        <SlidersHorizontal size={18} color="#333333" />
      </TouchableOpacity>
    </View>
  );
}
