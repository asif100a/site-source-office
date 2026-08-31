import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";

type ScreenLoaderProps = {
  message?: string;
};

export default function ScreenLoader({
  message = "Loading content...",
}: ScreenLoaderProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <Spinner size="large" color="#FF5500" />
      <Text className="mt-4 text-sm font-semibold text-neutral-600">
        {message}
      </Text>
    </View>
  );
}
