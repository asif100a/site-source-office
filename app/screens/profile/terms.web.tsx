import React from "react";
import { ScrollView, Text, View } from "react-native";
import { FileText, Sparkles } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Card, ScreenShell, VersionBanner } from "./_components";

const sections = Array.from({ length: 4 }, (_, index) => ({
  id: index,
  title: "About Sitesource",
  body:
    "Lorem ipsum dolor sit amet consectetur. In faucibus ante sit nisl justo. Vehicula urna urna vitae magnis. Pellentesque et felis eget mattis enim vel mauris fermentum. Aenean morbi sit vitae commodo nunc mattis quis bibendum.",
}));

export default function TermsScreenWeb() {
  return (
    <ScreenShell title="Terms & Conditions">
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
                    1 Jan 2026
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.55] gap-4">
                <VersionBanner />
                <Text className="text-xl font-semibold text-neutral-950">
                  Contents
                </Text>
                <View className="gap-4">
                  {sections.map((section) => (
                    <Card key={section.id} className="p-5">
                      <Text className="text-base font-semibold text-slate-700 mb-3">
                        {section.title}
                      </Text>
                      <Text className="text-sm leading-6 text-slate-600">
                        {section.body}
                      </Text>
                    </Card>
                  ))}
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
