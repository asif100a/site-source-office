import React from "react";
import { Text, View } from "react-native";

export default function AuthWebShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <View className="flex-1 px-6 py-6 md:px-8 md:py-8">
      <View className="mb-6 max-w-2xl gap-3">
        {eyebrow ? (
          <View className="w-fit rounded-full bg-orange-50 px-3 py-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
              {eyebrow}
            </Text>
          </View>
        ) : null}

        <Text className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
          {title}
        </Text>

        {subtitle ? (
          <Text className="max-w-xl text-sm leading-6 text-neutral-600 md:text-base">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View className="flex-1 min-h-0">{children}</View>
      {footer ? <View className="mt-6">{footer}</View> : null}
    </View>
  );
}
