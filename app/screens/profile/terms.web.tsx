import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { FileText, Sparkles } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import RenderHTML from "react-native-render-html";
import { useGetLegalsQuery } from "@/store/api/legalApi";
import { ScreenShell, VersionBanner } from "./_components";

const legalTagsStyles = {
  h1: {
    color: "#0A0A0A",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 38,
    marginBottom: 14,
  },
  h2: {
    color: "#0A0A0A",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 18,
  },
  p: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 12,
  },
  li: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 8,
  },
  a: {
    color: Colors.common.BRAND,
  },
};

function formatLegalDate(date?: string) {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function TermsScreenWeb() {
  const { width } = useWindowDimensions();
  const legalQuery = useGetLegalsQuery({});
  const legalData = legalQuery.data?.data ?? legalQuery.data;
  const updatedAt = formatLegalDate(legalData?.updatedAt);
  const html = legalData?.termsCondition || "<p>No Content Found</p>";
  const contentWidth = Math.min(width - 96, 760);

  return (
    <ScreenShell title="Terms & Conditions">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={legalQuery.isFetching}
            onRefresh={() => void legalQuery.refetch()}
            tintColor="#000000"
            colors={["#000000"]}
          />
        }
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <FileText size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Legal
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        Updated and versioned
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Terms & Conditions
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review the policy summary in a desktop-friendly layout while
                      keeping the mobile screen exactly the same.
                    </Text>
                  </View>
                </View>

                <View className="rounded-2xl bg-neutral-950 px-5 py-3.5">
                  <Text className="text-xs font-semibold uppercase tracking-[0px] text-white/60">
                    Effective
                  </Text>
                  <Text className="mt-1 text-lg font-semibold tracking-tight text-white">
                    {updatedAt}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.55] gap-4">
                {/* <VersionBanner /> */}
                <Text className="text-xl font-semibold text-neutral-950">
                  Contents
                </Text>
                <View className="rounded-xl border border-neutral-200/80 bg-white p-5">
                  {legalQuery.isLoading ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <RenderHTML
                      contentWidth={contentWidth}
                      tagsStyles={legalTagsStyles as any}
                      source={{ html }}
                    />
                  )}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <Sparkles size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Policy overview
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        This page is laid out for scanning, with the content
                        separated into clear cards on desktop.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
