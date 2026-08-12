import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Check, CircleAlert, ArrowLeft, Clock3, FileText, ShieldCheck } from "lucide-react-native";
import {
  Avatar,
  Card,
  DisputeSummary,
  proofPhoto,
  ScreenShell,
  StatusPill,
  WorkSummaryList,
} from "./_components";
import { Colors } from "@/constants/Colors";

export default function DisputeDetailScreenWeb() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const resolved = status === "resolved";

  return (
    <ScreenShell title="Support Details">
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
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Case details
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className={`h-2 w-2 rounded-full ${resolved ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {resolved ? "Resolved" : "Under review"}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      {resolved ? "Resolved support case" : "Open support case"}
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review the dispute summary, the evidence shared by both
                      sides, and the admin outcome in a desktop layout.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.88}
                  className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                >
                  <ArrowLeft size={18} color="#111827" />
                  <Text className="text-sm font-semibold text-neutral-900">
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.2] gap-4">
                <DisputeSummary resolved={resolved} />

                {resolved ? (
                  <Card className="p-6 items-center">
                    <View className="w-14 h-14 rounded-full bg-orange-100 items-center justify-center mb-3">
                      <View className="w-10 h-10 rounded-full bg-orange-400 items-center justify-center">
                        <Check size={25} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    </View>
                    <Text className="text-slate-900 font-extrabold text-base">
                      Support Resolved
                    </Text>
                    <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
                      After reviewing the case, the admin approved the invoice
                      payment and released the funds.
                    </Text>
                  </Card>
                ) : (
                  <>
                    <Card className="p-4">
                      <Text className="text-slate-900 font-extrabold text-base mb-3">
                        Support Information
                      </Text>
                      <View className="gap-3">
                        <View className="flex-row justify-between">
                          <Text className="text-neutral-500 text-xs">
                            Raised By
                          </Text>
                          <Text className="text-neutral-600 text-xs">
                            Employer
                          </Text>
                        </View>
                        <View className="h-px bg-neutral-100" />
                        <View className="flex-row justify-between">
                          <Text className="text-neutral-500 text-xs">
                            Raised Date
                          </Text>
                          <Text className="text-neutral-600 text-xs">
                            May 17
                          </Text>
                        </View>
                        <View className="h-px bg-neutral-100" />
                        <View className="flex-row items-center justify-between">
                          <Text className="text-neutral-500 text-xs">
                            Current Status
                          </Text>
                          <StatusPill label="Under Review" />
                        </View>
                      </View>
                    </Card>

                    <Card className="p-4">
                      <View className="flex-row items-center gap-2 mb-4">
                        <CircleAlert size={18} color="#FFBA08" fill="#FFBA08" />
                        <Text className="text-slate-900 font-extrabold text-base">
                          Employer Reason
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <Avatar
                          uri="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=80&h=80&fit=crop"
                          size={32}
                        />
                        <View className="flex-1">
                          <Text className="text-neutral-900 text-sm font-semibold">
                            ABC Construction Ltd
                          </Text>
                          <Text className="text-neutral-700 text-sm mt-1">
                            "Worker missed Friday shift."
                          </Text>
                        </View>
                      </View>
                    </Card>

                    <Card className="p-4">
                      <View className="flex-row items-center gap-2 mb-3">
                        <CircleAlert size={18} color="#FFBA08" fill="#FFBA08" />
                        <Text className="text-slate-900 font-extrabold text-base">
                          Worker Reason
                        </Text>
                      </View>
                      <Text className="text-neutral-700 text-sm mb-4">
                        I completed all assigned tasks before leaving site.
                      </Text>
                      <Text className="text-slate-900 font-extrabold text-sm mb-3">
                        Uploaded proof
                      </Text>
                      <Image
                        source={{ uri: proofPhoto }}
                        className="h-56 w-full rounded-xl"
                      />
                    </Card>
                  </>
                )}
              </View>

              <View className="flex-1 gap-4">
                <Card className="p-4">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Clock3 size={18} color={Colors.common.BRAND} />
                    <Text className="text-slate-900 font-extrabold text-base">
                      Review status
                    </Text>
                  </View>
                  <Text className="text-sm leading-6 text-neutral-600">
                    The case is tracked through the same shared profile route on
                    mobile and web, with only the web layout changing.
                  </Text>
                </Card>

                <Card className="p-4">
                  <View className="flex-row items-center gap-2 mb-3">
                    <ShieldCheck size={18} color={Colors.common.BRAND} />
                    <Text className="text-slate-900 font-extrabold text-base">
                      Work Summary
                    </Text>
                  </View>
                  <WorkSummaryList resolved={resolved} />
                </Card>

                {resolved ? (
                  <Card className="p-4">
                    <Text className="text-slate-900 font-extrabold text-base mb-3">
                      Admin Resolution Note
                    </Text>
                    <Text className="text-neutral-700 text-sm leading-6">
                      Worker provided sufficient proof of completed work. Full
                      payment approved.
                    </Text>
                  </Card>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
