import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useGetUnseenCountQuery } from "@/store/api/notificationApi";
import { router } from "expo-router";
import { Routes } from "@/constants/Routes";

export default function NotificationIcon() {
  const { data: unseenNotificationCountRes } = useGetUnseenCountQuery({});
  const unseenNotificationCount =
    unseenNotificationCountRes?.data?.unseenCount || 0;

  const handleNotificationPress = () => {
    router.push(Routes.CommonRoutes.NOTIFICATIONS);
  };

  return (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={handleNotificationPress}
        className="relative w-12 h-12 rounded-full bg-white/10 items-center justify-center active:opacity-85"
      >
        <Feather name="bell" size={22} color="#FFFFFF" />
        <View className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/15 items-center justify-center border border-white/20">
          <Text className="text-white text-[10px] font-bold">
            {unseenNotificationCount}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
