import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react-native";

export default function SearchWorkerSearchBar({
  searchQuery,
  setSearchQuery,
  setShowFilters,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="px-5 pt-3 pb-2 flex-row gap-2.5 items-center z-10">
      <View className="flex-1 h-10 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-3.5">
        <Search size={16} color="#A3A3A3" className="mr-2" />
        <TextInput
          className="flex-1 h-full text-neutral-800 text-sm font-medium py-0 focus:outline-none"
          placeholder="Search workers or location"
          placeholderTextColor="#A3A3A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity
        onPress={() => setShowFilters(true)}
        className="w-10 h-10 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-80"
      >
        <SlidersHorizontal size={16} color="#333333" />
      </TouchableOpacity>
    </View>
  );
}
