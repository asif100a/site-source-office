import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function CategoryToggles({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: "browse" | "offers";
  setActiveCategory: (category: "browse" | "offers") => void;
}) {
  return (
    <View className="flex-row gap-3 mt-6">
      <TouchableOpacity
        onPress={() => {
          setActiveCategory("browse");
        }}
        style={
          activeCategory === "browse"
            ? { backgroundColor: Colors.common.GRAY_DARK }
            : { backgroundColor: "#ffffff" }
        }
        className={`px-4 py-2 rounded-lg ${activeCategory === "browse" ? "" : "border border-neutral-200/60"}`}
      >
        <Text
          className={`min-w-[120px] text-center text-xs font-bold ${activeCategory === "browse" ? "text-white" : "text-neutral-500"}`}
        >
          Browse Opportunities
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setActiveCategory("offers");
        }}
        style={
          activeCategory === "offers"
            ? { backgroundColor: Colors.common.GRAY_DARK }
            : { backgroundColor: "#ffffff" }
        }
        className={`px-4 py-2 rounded-lg ${activeCategory === "offers" ? "" : "border border-neutral-200/60"}`}
      >
        <Text
          className={`text-xs font-bold ${activeCategory === "offers" ? "text-white" : "text-neutral-500"}`}
        >
          Favourites
        </Text>
      </TouchableOpacity>
    </View>
  );
}
