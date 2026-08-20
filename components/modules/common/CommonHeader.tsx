import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import LogoWhite from "@/assets/icons/LogoWhite";

export default function CommonHeader({
  headerTitle = "Header",
  withBackButton = false,
  onPress,
}: {
  headerTitle?: string;
  withBackButton?: boolean;
  onPress?: () => void;
}) {
  const handleNavigateBack = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  return (
    <View
      style={{ backgroundColor: Colors.common.BRAND }}
      className="pt-12 pb-3 px-6"
    >
      <View className="flex-row justify-between items-end">
        {withBackButton ? (
          <TouchableOpacity
            onPress={handleNavigateBack}
            className="flex-row items-center"
          >
            <ChevronLeft size={20} color="#FFFFFF" />
            <Text className="min-w-32 text-white text-xl font-extrabold tracking-tight">
              {headerTitle}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="min-w-32 text-white text-xl font-extrabold tracking-tight">
            {headerTitle}
          </Text>
        )}

        <View
          className="-mb-3 mr-8"
          style={{ minWidth: "100", minHeight: "72", position: "relative" } as any}
        >
          <View style={{
            position: 'absolute',
            right: '37%'
          }}>
            <LogoWhite size={{ width: "100", height: "72" }} />
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/15 items-center justify-center border border-white/10 active:opacity-75">
          <Bell color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
