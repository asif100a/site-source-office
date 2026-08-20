import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function MyJobToggleChips({
  activeTab,
  setActiveTab,
}: {
  activeTab: "active" | "completed" | "upcoming";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"active" | "completed" | "upcoming">
  >;
}) {
  return (
    <View className="flex-row gap-2.5 mt-4">
      {(
        [
          { key: "active", label: "Active Jobs" },
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
        ] as const
      ).map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={
              isActive
                ? { backgroundColor: Colors.common.GRAY_DARK }
                : { backgroundColor: "#FFFFFF" }
            }
            className={`px-4 py-2.5 rounded-lg ${isActive ? "" : "border border-neutral-200/80"}`}
          >
            <Text
              className={`min-w-18 text-center text-xs font-bold ${isActive ? "text-white" : "text-neutral-500"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
