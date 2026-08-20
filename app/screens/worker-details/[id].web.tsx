import React from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import WorkerRatingStars from "@/components/modules/worker/worker-details/_ui/WorkerRatingStars";
import PLACEHOLDER_USER from "@/assets/images/placeholder/placeholder-user.png";

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
  weeks: [
    { id: "week-1", title: "Week 1", range: "12 Jul - 16 Jul" },
    { id: "week-2", title: "Week 2", range: "19 Jul - 23 Jul" },
    { id: "week-3", title: "Week 3", range: "26 Jul - 30 Jul" },
    { id: "week-4", title: "Week 4", range: "2 Aug - 6 Aug" },
  ],
};

function SectionTitle({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-4">
      <Text className="text-base font-bold text-neutral-900">{title}</Text>
      {detail ? (
        <Text className="text-xs font-medium text-neutral-400">{detail}</Text>
      ) : null}
    </View>
  );
}

function HeroCard({ onBack }: { onBack: () => void }) {
  return (
    <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Sparkles size={14} color={Colors.common.BRAND} />
              <Text className="text-xs font-bold uppercase text-neutral-900">
                Worker details
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-neutral-600">
                {STATIC_WORKER.status}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              {STATIC_WORKER.name}
            </Text>
            <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
              Static worker details page for web. This screen now renders a
              fixed profile layout without route-based or state-based client
              logic.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.88}
          className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
        >
          <ArrowLeft size={18} color="#111827" />
          <Text className="text-sm font-semibold text-neutral-900">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="items-center">
        <View className="relative">
          <Image
            source={PLACEHOLDER_USER}
            style={{ width: 96, height: 96 }}
            className="rounded-full"
          />
          <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1">
            <Text className="text-[10px] font-bold text-emerald-700">
              {STATIC_WORKER.status}
            </Text>
          </View>
        </View>

        <Text className="mt-6 text-center text-[28px] font-bold text-neutral-900">
          {STATIC_WORKER.name}
        </Text>
        <Text className="mt-1 text-base text-neutral-500">
          {STATIC_WORKER.role}
        </Text>

        <View className="mt-3 flex-row items-center gap-2">
          <WorkerRatingStars rating={STATIC_WORKER.rating} />
          <Text className="text-sm font-medium text-neutral-700">
            <Text className="font-bold">{STATIC_WORKER.rating}</Text> (
            {STATIC_WORKER.reviews})
          </Text>
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-sm font-medium text-neutral-500">
            {STATIC_WORKER.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatsCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="flex-row">
        {STATIC_WORKER.stats.map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center py-2 ${
              index < STATIC_WORKER.stats.length - 1
                ? "border-r border-neutral-100"
                : ""
            }`}
          >
            <Text className="text-3xl font-bold text-neutral-900">
              {item.value}
            </Text>
            <Text className="mt-1 text-center text-[11px] text-neutral-500">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AboutCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="About" />
      <Text className="text-sm leading-6 text-neutral-600">
        {STATIC_WORKER.about}
      </Text>
    </View>
  );
}

function DocumentsCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Documents" />
      <View className="flex-row flex-wrap gap-3">
        {STATIC_WORKER.documents.map((document) => (
          <View
            key={document.id}
            className="min-w-[170px] flex-1 rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <Text className="text-sm font-bold text-rose-500">PDF</Text>
            </View>
            <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
              {document.name}
            </Text>
            <Text className="mt-1 text-[11px] text-neutral-400">
              {document.size}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkHistoryCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Work History" detail="Recent roles" />
      <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        {STATIC_WORKER.workHistory.map((item, index) => (
          <View
            key={item.id}
            className={`flex-row items-start justify-between px-4 py-4 ${
              index < STATIC_WORKER.workHistory.length - 1
                ? "border-b border-neutral-100"
                : ""
            }`}
          >
            <View className="flex-1 flex-row items-start gap-3 pr-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Briefcase size={18} color="#64748B" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-900">
                  {item.title}
                </Text>
                <Text className="mt-0.5 text-xs text-neutral-500">
                  {item.company} - {item.duration}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text className="text-sm font-bold text-neutral-900">
                {item.rating}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RatingCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Rating & Feedback" />
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          <Text className="text-4xl font-bold text-neutral-900">
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
  );
}

function ReviewsCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle
        title="Reviews"
        detail={`${STATIC_WORKER.feedback.length} entries`}
      />
      <View className="gap-3">
        {STATIC_WORKER.feedback.map((item) => (
          <View
            key={item.id}
            className="rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
                  <Text className="text-xs font-bold text-neutral-700">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-neutral-900">
                    {item.name}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Star size={13} color="#FBBF24" fill="#FBBF24" />
                    <Text className="text-xs font-bold text-neutral-900">
                      {item.rating}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xs text-neutral-400">{item.date}</Text>
            </View>
            <Text className="mt-3 text-sm leading-6 text-neutral-600">
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TimesheetCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-medium text-neutral-900">
            Update Timesheet
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">Day 3 of 20</Text>
        </View>
        <View className="rounded-full bg-[#FFF1E9] px-2.5 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-xs font-medium"
          >
            Approval queue
          </Text>
        </View>
      </View>

      <View className="gap-3">
        {STATIC_WORKER.weeks.map((week) => (
          <View
            key={week.id}
            className="flex-row items-center justify-between rounded-2xl border border-neutral-100 px-4 py-3"
          >
            <View className="flex-1 pr-3">
              <Text className="text-base font-medium text-slate-800">
                {week.title}
              </Text>
              <Text className="mt-0.5 text-sm text-slate-400">
                {week.range}
              </Text>
            </View>

            <TouchableOpacity className="rounded-xl border border-neutral-200 px-4 py-2 active:opacity-80">
              <Text className="text-xs font-medium text-neutral-500">
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

function SummaryCard({ onBack }: { onBack: () => void }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
          <ShieldCheck size={18} color={Colors.common.BRAND} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-900">
            Static worker summary
          </Text>
          <Text className="mt-1 text-sm leading-6 text-neutral-600">
            This page is now presentation-only and always shows the same worker
            information without client-side branching.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.88}
        className="mt-5 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-4"
      >
        <Text className="text-sm font-semibold text-neutral-900">Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkerDetailsWebScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="px-6 pt-6 md:px-10 md:pt-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <HeroCard onBack={() => router.back()} />

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.45] gap-4">
                <ProfileCard />
                <StatsCard />
                <AboutCard />
                <DocumentsCard />
                <WorkHistoryCard />
                <RatingCard />
                <ReviewsCard />
              </View>

              <View className="flex-1 gap-4">
                {/* <TimesheetCard /> */}
                <SummaryCard onBack={() => router.back()} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
