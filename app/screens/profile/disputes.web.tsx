import React from "react";
import { useRouter } from "expo-router";
import { ArrowRight, AlertTriangle, Search, ShieldCheck } from "lucide-react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { DisputeLogo, ScreenShell, StatusPill } from "./_components";

const DISPUTES = Array.from({ length: 6 }, (_, index) => ({
  id: `dispute-${index + 1}`,
  title: "Hartley Construction",
  period: "May 12 - May 16",
  status: index === 5 ? "Resolved" : "Under Review",
  tone: index === 5 ? ("resolved" as const) : ("review" as const),
  summary:
    index === 5
      ? "Admin reviewed the case and released payment."
      : "Waiting for admin review and supporting evidence.",
}));

function DisputeRow({
  title,
  period,
  status,
  tone,
  summary,
  onPress,
}: {
  title: string;
  period: string;
  status: string;
  tone: "review" | "resolved";
  summary: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className="rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row flex-1 items-center gap-3">
          <DisputeLogo />
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-950">
              {title}
            </Text>
            <Text className="mt-0.5 text-xs font-semibold text-neutral-500">
              {period}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-neutral-600">
              {summary}
            </Text>
          </View>
        </View>

        <View className="items-end gap-2">
          <StatusPill label={status} tone={tone} />
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-neutral-500">Open</Text>
            <ArrowRight size={16} color="#737373" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DisputesScreenWeb() {
  const router = useRouter();

  return (
    <ScreenShell title="My Supports">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <AlertTriangle size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Support cases
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        1 resolved, 5 under review
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Track support cases from one place.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review open disputes, inspect the details, and keep the web
                      view clean while the mobile experience stays unchanged.
                    </Text>
                  </View>
                </View>

                {/* <TouchableOpacity
                  onPress={() => router.push("/screens/profile/contact" as any)}
                  activeOpacity={0.9}
                  className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                >
                  <ShieldCheck size={18} color="#FFFFFF" />
                  <Text className="text-sm font-semibold text-white">
                    Contact support
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
              <View className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <Search size={18} color="#A3A3A3" />
                <TextInput
                  placeholder="Search support cases"
                  placeholderTextColor="#A3A3A3"
                  className="flex-1 text-sm text-neutral-900"
                />
              </View>
            </View> */}

            <View className="gap-4">
              {DISPUTES.map((item) => (
                <DisputeRow
                  key={item.id}
                  title={item.title}
                  period={item.period}
                  status={item.status}
                  tone={item.tone}
                  summary={item.summary}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/profile/dispute-detail",
                      params: {
                        status: item.tone === "resolved" ? "resolved" : "review",
                      },
                    } as any)
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
