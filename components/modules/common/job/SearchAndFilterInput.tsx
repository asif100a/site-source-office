import { View, Text, TextInput, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react-native";

export default function SearchAndFilterInput({
  searchQuery,
  setSearchQuery,
  shouldHideFilters = false,
  searchContainerStyle = {},
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  shouldHideFilters?: boolean;
  searchContainerStyle?: ViewStyle;
}) {
  return (
    <View className="flex-row gap-3 mb-6">
      <View className="flex-1 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-4 py-0" style={searchContainerStyle}>
        <Search size={18} color="#A3A3A3" className="mr-2" />
        <TextInput
          className="flex-1 text-neutral-800 text-sm font-medium py-0 focus:outline-none"
          placeholder="Search Jobs"
          placeholderTextColor="#A3A3A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {shouldHideFilters || (
        <TouchableOpacity className="p-3 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-85">
          <SlidersHorizontal size={18} color="#333333" />
        </TouchableOpacity>
      )}
    </View>
  );
}
