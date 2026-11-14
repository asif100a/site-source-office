import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { ChevronLeft, List, Map } from "lucide-react-native";

export default function SearchWorkerHeader({
  goBackToOrigin,
  setViewType,
  viewType,
}: {
  goBackToOrigin: () => void;
  setViewType: (viewType: "list" | "map") => void;
  viewType: "list" | "map";
}) {
  return (
    <View
      style={{ backgroundColor: Colors.common.BRAND }}
      className="pb-4 pt-14 px-6 z-10"
    >
      <View className="flex-row justify-between items-center">
        {/* Back button and title */}
        <TouchableOpacity
          onPress={goBackToOrigin}
          className="flex-row items-center gap-1 active:opacity-75"
        >
          <ChevronLeft size={20} color="#FFFFFF" />
          <Text className="text-white text-base font-extrabold tracking-tight">
            Search Workers
          </Text>
        </TouchableOpacity>

        {/* Map/List View Toggle */}
        <TouchableOpacity
          onPress={() => setViewType(viewType === "list" ? "map" : "list")}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/25 active:opacity-75"
        >
          {viewType === "list" ? (
            <Map color="#FFFFFF" size={18} />
          ) : (
            <List color="#FFFFFF" size={18} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
