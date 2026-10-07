import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { ImageStyle, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

export default function BackButton({
  title = "Back",
  size = "base",
  onPress,
  style = {},
  textStyle = {},
  iconStyle = {},
  iconColor = "#fff",
}: {
  title?: string;
  size?: "base" | "lg";
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ImageStyle;
  iconColor?: string;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : navigation.goBack())}
      className={`flex-row items-center`}
      style={{...style}}
      activeOpacity={0.7}
    >
      <Ionicons
        name="chevron-back"
        size={18}
        color={iconColor}
        style={{...iconStyle}}
      />

      <Text
        className={`text-white text-base mb-[0.5px] ${size === "lg" ? "text-2xl" : "text-base"}`}
        style={{...textStyle}}
      >
        {"Back"}
      </Text>
    </TouchableOpacity>
  );
}
