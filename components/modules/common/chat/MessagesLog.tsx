import { View, Text, ScrollView } from "react-native";
import React from "react";

export default function MessagesLog({ id }: { id: string }) {
  // Lookup chat partner details based on route parameter (mock)
  const chatPartner = {
    name: id === "sarah" ? "Sarah Mitchell" : "Hafizur Rahman",
    initials: id === "sarah" ? "SM" : "HR",
    avatarBg: id === "sarah" ? "#E0F2FE" : "#FEF3C7",
    avatarColor: id === "sarah" ? "#0369A1" : "#D97706",
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-6 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Message 1 (From Chat Partner) */}
      <View className="flex-row items-start mb-6 gap-3">
        {/* Avatar */}
        <View
          style={{ backgroundColor: chatPartner.avatarBg }}
          className="w-10 h-10 rounded-full items-center justify-center border border-neutral-100"
        >
          <Text
            style={{ color: chatPartner.avatarColor }}
            className="font-semibold text-xs"
          >
            {chatPartner.initials}
          </Text>
        </View>

        <View className="flex-1 items-start">
          {/* Partner Name */}
          <Text className="text-neutral-700 text-xs font-semibold mb-1.5">
            {chatPartner.name}
          </Text>

          {/* Bubble */}
          <View className="bg-orange-50/80 rounded-2xl rounded-tl-none px-4 py-3 border border-orange-100/50 max-w-[85%]">
            <Text className="text-neutral-800 text-sm font-semibold leading-relaxed">
              Have a great working week!!
            </Text>
          </View>

          {/* Timestamp */}
          <Text className="text-neutral-400 text-[10px] font-semibold mt-1">
            09:25 AM
          </Text>
        </View>
      </View>

      {/* Message 2 (From You) */}
      <View className="flex-row items-start justify-end mb-6 gap-3">
        <View className="flex-1 items-end">
          {/* Your Name */}
          <Text className="text-neutral-700 text-xs font-semibold mb-1.5">You</Text>

          {/* Bubble */}
          <View className="bg-[#7C3AED] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-sm">
            <Text className="text-white text-sm font-semibold leading-relaxed">
              You did your job well!
            </Text>
          </View>

          {/* Timestamp */}
          <Text className="text-neutral-400 text-[10px] font-semibold mt-1">
            09:25 AM
          </Text>
        </View>

        {/* Avatar */}
        <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center border border-purple-200">
          <Text className="text-purple-700 font-semibold text-xs">TH</Text>
        </View>
      </View>
    </ScrollView>
  );
}
