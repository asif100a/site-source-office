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
    <View className="flex-row items-center gap-2.5 mb-3.5">
      <View
        className="flex-1 h-10 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-3.5"
        style={searchContainerStyle}
      >
        <Search size={16} color="#A3A3A3" className="mr-2" />
        <TextInput
          className="flex-1 h-full text-neutral-800 text-sm font-medium py-0 focus:outline-none"
          placeholder="Search Jobs"
          placeholderTextColor="#A3A3A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {shouldHideFilters || (
        <TouchableOpacity className="w-10 h-10 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-85">
          <SlidersHorizontal size={16} color="#333333" />
        </TouchableOpacity>
      )}
    </View>
  );
}
