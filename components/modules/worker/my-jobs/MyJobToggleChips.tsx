import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function MyJobToggleChips({
  tabOptions,
  activeTab,
  setActiveTab,
}: {
  tabOptions: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View className="flex-row gap-2.5 mb-6">
      {tabOptions.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={
            activeTab === tab
              ? { backgroundColor: Colors.common.GRAY_DARK }
              : { backgroundColor: "#FFFFFF" }
          }
          className={`px-4 py-2 rounded-lg ${activeTab === tab ? "" : "border border-neutral-200/60"}`}
        >
          <Text
            className={`min-w-18 text-center text-xs font-bold ${activeTab === tab ? "text-white" : "text-neutral-500"}`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
