import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import WorkerDetailsHeader from "@/components/modules/worker/worker-details/WorkerDetailsHeader";
import WorkerInfo from "@/components/modules/worker/worker-details/WorkerInfo";
import WorkerDetailsStats from "@/components/modules/worker/worker-details/WorkerDetailsStats";
import WorkerDetailsDocuments from "@/components/modules/worker/worker-details/WorkerDetailsDocuments";
import WorkerDetailsWorkHistory from "@/components/modules/worker/worker-details/WorkerDetailsWorkHistory";
import WorkerDetailsReviews from "@/components/modules/worker/worker-details/WorkerDetailsReviews";
import WorkerRatingStars from "@/components/modules/worker/worker-details/_ui/WorkerRatingStars";
import { useGetSingleWorkerQuery } from "@/store/api/workerProfileApi";

const STATIC_WORKER = {
  name: "James Mitchell",
  role: "Groundworker",
  status: "Available Now",
  rating: "4.8",
  reviews: "142 reviews",
  location: "Shoreditch - 2.4 mi away",
  stats: [
    { label: "Jobs Completed", value: "87" },
    { label: "Reliability", value: "98%" },
    { label: "Repeat Hires", value: "34" },
  ],
  about:
    "Highly experienced groundworker with over 8 years in the industry. Specialized in site preparation, drainage systems, and structural foundations. Known for punctuality and a strong focus on safety standards.",
  documents: [
    { id: "doc-1", name: "CSCS Gold Card", size: "1.1 MB" },
    { id: "doc-2", name: "Public Liability", size: "860 KB" },
    { id: "doc-3", name: "Right to Work", size: "540 KB" },
  ],
  workHistory: [
    {
      id: "wh-1",
      title: "Lead Groundworker",
      company: "BuildRight Group",
      duration: "3 months",
      rating: "5.0",
    },
    {
      id: "wh-2",
      title: "Groundworker",
      company: "Northline Builders",
      duration: "1 year",
      rating: "4.9",
    },
  ],
  feedback: [
    {
      id: "fb-1",
      name: "Jane Cooper",
      date: "20 Apr 2026",
      text: "Very professional and always arrived on time.",
      rating: "5.00",
    },
    {
      id: "fb-2",
      name: "Esther Howard",
      date: "28 May 2026",
      text: "Worked safely, communicated well, and kept the site moving.",
      rating: "4.90",
    },
  ],
};

function StaticRatingCard() {
  const { id } = useLocalSearchParams();

  const workerQuery = useGetSingleWorkerQuery({ id: id as string });
  console.log("Worker query data: ", workerQuery.data);

  return (
    <View className="mt-6">
      <Text className="mb-3 text-base font-extrabold text-neutral-900">
        Rating & Feedback
      </Text>

      <View className="rounded-xl border border-neutral-200/80 bg-white p-4">
        <View className="flex-row items-center gap-4">
          <View className="items-center">
            <Text className="text-4xl font-extrabold text-neutral-900">
              {STATIC_WORKER.rating}
            </Text>
            <Text className="text-xs text-neutral-400">/5</Text>
            <View className="mt-2">
              <WorkerRatingStars rating={STATIC_WORKER.rating} />
            </View>
            <Text className="mt-2 text-xs text-neutral-400">
              {STATIC_WORKER.reviews}
            </Text>
          </View>

          <View className="flex-1 gap-2">
            {[200, 40, 32, 19, 7].map((value, index) => (
              <View
                key={`${value}-${index}`}
                className="flex-row items-center gap-2"
              >
                <Text className="w-4 text-right text-xs text-neutral-400">
                  {5 - index}
                </Text>
                <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <View
                    className="h-full rounded-full bg-slate-500"
                    style={{ width: `${Math.max(15, value / 2)}%` }}
                  />
                </View>
                <Text className="w-8 text-right text-xs text-neutral-400">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function StaticTimesheetCard() {
  const weeks = [
    { id: "week-1", title: "Week 1", range: "12 Jul - 16 Jul" },
    { id: "week-2", title: "Week 2", range: "19 Jul - 23 Jul" },
    { id: "week-3", title: "Week 3", range: "26 Jul - 30 Jul" },
    { id: "week-4", title: "Week 4", range: "2 Aug - 6 Aug" },
  ];

  return (
    <View className="mt-4 rounded-2xl bg-white px-4 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-medium text-neutral-900">
          Update Timesheet
        </Text>
        <View className="rounded-full bg-[#FFF1E9] px-2.5 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-xs font-medium"
          >
            Day 3 of 20
          </Text>
        </View>
      </View>

      {weeks.map((week, index) => (
        <View
          key={week.id}
          className={`flex-row items-center justify-between py-3 ${
            index < weeks.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-neutral-900">
              {week.title}
            </Text>
            <Text className="mt-0.5 text-sm text-neutral-500">
              {week.range}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="px-1 py-2 active:opacity-70">
              <Text className="text-sm font-medium text-neutral-600">View</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-xl border border-neutral-200 bg-white px-4 py-2 active:opacity-80">
              <Text className="text-xs font-medium text-neutral-500">
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function WorkerDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      <WorkerDetailsHeader handleHeaderBack={() => router.back()} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-32 pt-6">
          <WorkerInfo worker={STATIC_WORKER} />

          <View className="px-5">
            <WorkerDetailsStats worker={STATIC_WORKER} />

            <View className="mt-4 rounded-xl border border-neutral-200/80 bg-white p-4">
              <Text className="mb-3 text-base font-extrabold text-neutral-900">
                About
              </Text>
              <Text className="text-sm leading-6 text-neutral-600">
                {STATIC_WORKER.about}
              </Text>
            </View>

            <WorkerDetailsDocuments worker={STATIC_WORKER} />
            <WorkerDetailsWorkHistory worker={STATIC_WORKER} />
            <StaticRatingCard />

            <Text className="mb-3 mt-6 text-base font-extrabold text-neutral-900">
              Reviews
            </Text>
            <WorkerDetailsReviews worker={STATIC_WORKER} />

            {/* <StaticTimesheetCard /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
