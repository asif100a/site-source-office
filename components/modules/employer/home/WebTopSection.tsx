import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function WebTopSection({
  handleCreateJobPost,
}: {
  handleCreateJobPost: () => void;
}) {
  return (
    <View className="overflow-hidden rounded-[32px] border border-neutral-200/80 bg-white shadow-sm">
      <View className="relative px-6 py-6 md:px-8 md:py-8">
        <View
          className="absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-80"
          style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
        />
        <View className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-neutral-100" />

        <View className="relative flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <View className="max-w-3xl gap-3">
            <View className="self-start rounded-full bg-orange-50 px-3 py-1.5">
              <Text
                style={{ color: Colors.common.BRAND }}
                className="text-xs font-bold uppercase"
              >
                Employer workspace
              </Text>
            </View>

            <View className="gap-2">
              <Text className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950">
                Build the job brief, lock the site details, and start hiring
                from one desktop workspace.
              </Text>
              <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                This follows the same employer home flow as mobile, reorganized
                for web with a live posting canvas on the left and a hiring
                summary on the right.
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleCreateJobPost}
            className="self-start rounded-2xl px-5 py-4 xl:self-auto"
            style={{ backgroundColor: Colors.common.BRAND }}
          >
            <Text className="text-sm font-bold text-white">Post Job</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}
