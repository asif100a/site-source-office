import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function ChatHeader({ origin }: { origin?: string }) {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <View
      style={{ backgroundColor: Colors.common.BRAND }}
      className="pb-4 pt-14 px-6"
    >
      <View className="flex-row items-center gap-1">
        <TouchableOpacity
          onPress={handleBackPress}
          className="flex-row items-center gap-0.5 active:opacity-75"
        >
          <ChevronLeft size={20} color="#FFFFFF" />
          <Text className="text-white text-xl font-semibold tracking-tight">
            Chats
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
