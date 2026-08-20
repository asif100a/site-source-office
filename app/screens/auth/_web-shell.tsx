import BackButton from "@/components/standard_ui/buttons/BackButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, View } from "react-native";

export default function AuthWebShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  onBackPress,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBackPress?: () => void;
}) {
  return (
    <View className="flex-1 px-6 py-6 md:px-8 md:py-8">
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View
          className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8"
          style={{ backgroundColor: Colors.common.BRAND }}
        >
          <View className="mb-6 w-full">
            <BackButton
              onPress={onBackPress}
              textStyle={{
                color: Colors.common.WHITE,
              }}
              iconColor={Colors.common.WHITE}
            />
          </View>

          {eyebrow ? (
            <View className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">
              <Text className="text-xs font-semibold uppercase tracking-[0px] text-white">
                {eyebrow}
              </Text>
            </View>
          ) : null}

          <Text className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
            {title}
          </Text>

          {subtitle ? (
            <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="flex-1 min-h-0">{children}</View>
        {footer ? <View className="mt-6">{footer}</View> : null}
      </View>
    </View>
  );
}
