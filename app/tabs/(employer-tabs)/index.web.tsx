import React, { useMemo } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareMore,
  Sparkles,
  Star,
  UserRound,
  Users,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MarketRate from "@/components/modules/employer/home/MarketRate";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import { Colors } from "@/constants/Colors";

type Metric = {
  id: string;
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
};

type Shortcut = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const METRICS: Metric[] = [
  {
    id: "workers",
    label: "Workers reviewed",
    value: "28",
    note: "6 this morning",
    icon: <Users size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "requests",
    label: "Job requests",
    value: "9",
    note: "3 urgent matches",
    icon: <BriefcaseBusiness size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "response",
    label: "Avg. response",
    value: "11 min",
    note: "Fastest today",
    icon: <Clock3 size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "rating",
    label: "Employer rating",
    value: "4.8/5",
    note: "From 42 reviews",
    icon: <Star size={18} color={Colors.common.BRAND} />,
  },
];

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <View className="flex-1 min-w-[170px] rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
          {metric.icon}
        </View>
        <Text className="text-xs font-medium text-emerald-600">{metric.note}</Text>
      </View>
      <Text className="mt-3 text-2xl font-black tracking-tight text-neutral-950">
        {metric.value}
      </Text>
      <Text className="mt-1 text-sm font-medium text-neutral-500">
        {metric.label}
      </Text>
    </View>
  );
}

function ShortcutButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
        {icon}
      </View>
      <Text className="flex-1 text-sm font-semibold text-neutral-900">
        {label}
      </Text>
      <ArrowRight size={16} color="#737373" />
    </TouchableOpacity>
  );
}

export default function EmployerHomeScreenWeb() {
  const router = useRouter();

  const handleOpenWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const shortcuts: Shortcut[] = [
    {
      id: "workers",
      label: "Browse workers",
      icon: <UserRound size={18} color="#111827" />,
      onPress: () => router.push("/tabs/workers" as any),
    },
    {
      id: "jobs",
      label: "My jobs",
      icon: <BriefcaseBusiness size={18} color="#111827" />,
      onPress: () => router.push("/tabs/my-jobs" as any),
    },
    {
      id: "chats",
      label: "Messages",
      icon: <MessageSquareMore size={18} color="#111827" />,
      onPress: () => router.push("/tabs/chats" as any),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Sparkles size={18} color="#111827" />,
      onPress: () => router.push("/tabs/profile" as any),
    },
  ];

  const requestSummary = useMemo(
    () => [
      {
        id: "1",
        title: "Painter",
        subtitle: "Studio Form",
        meta: "Hackney - 0.8 mi away",
      },
      {
        id: "2",
        title: "Event Setup Crew",
        subtitle: "Live Works",
        meta: "Waterloo - 1.9 mi away",
      },
    ],
    [],
  );

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-10">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <View className="flex-col md:flex-row">
                <View className="flex-1 p-6 md:p-8 gap-5">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Employer dashboard
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        9 open requests today
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Find the right workers faster.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review workers, manage requests, and create new jobs from a
                      desktop layout that keeps the employer workflow clear and
                      easy to scan.
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/screens/job/CreateJobPost" as any)
                      }
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <ArrowRight size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Create job post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.88}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <Users size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Browse workers
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    {shortcuts.map((shortcut) => (
                      <View key={shortcut.id} className="flex-1 min-w-[140px]">
                        <ShortcutButton
                          label={shortcut.label}
                          icon={shortcut.icon}
                          onPress={shortcut.onPress}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                <View className="relative w-full md:w-[390px]">
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=1400&fit=crop",
                    }}
                    contentFit="cover"
                    className="h-72 w-full md:h-full"
                  />
                  <View className="absolute inset-0 bg-black/30" />

                  <View className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <View className="rounded-2xl bg-white/95 p-4 shadow-sm">
                      <View className="flex-row items-center justify-between gap-3">
                        <View>
                          <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                            Ready to hire
                          </Text>
                          <Text className="mt-1 text-xl font-black tracking-tight text-neutral-950">
                            12 workers nearby
                          </Text>
                        </View>
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                          <CheckCircle2 size={20} color={Colors.common.BRAND} />
                        </View>
                      </View>

                      <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2">
                        <MapPin size={16} color="#737373" />
                        <Text className="text-xs font-medium text-neutral-600">
                          3 urgent matches within 5 miles
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {METRICS.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </View>

            <View className="flex-col gap-6 lg:flex-row">
              <View className="flex-[1.5] gap-6">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center justify-between gap-4">
                    <View className="flex-1">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Market rate
                      </Text>
                      <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                        Compare worker pay quickly
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.8}
                      className="flex-row items-center gap-1.5"
                    >
                      <Text className="text-sm font-medium text-neutral-500">
                        View all
                      </Text>
                      <ArrowRight size={16} color="#737373" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-4">
                    <MarketRate />
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center justify-between gap-4">
                    <View className="flex-1">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Job requests
                      </Text>
                      <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                        Review new worker requests
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.8}
                      className="flex-row items-center gap-1.5"
                    >
                      <Text className="text-sm font-medium text-neutral-500">
                        See workers
                      </Text>
                      <ArrowRight size={16} color="#737373" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-4">
                    <JobRequests openWorkerDetails={handleOpenWorkerDetails} />
                  </View>
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <View className="flex-row items-center justify-between gap-3">
                    <View>
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Hiring pipeline
                      </Text>
                      <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                        4 workers shortlisted
                      </Text>
                    </View>
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <BriefcaseBusiness size={20} color={Colors.common.BRAND} />
                    </View>
                  </View>

                  <View className="mt-4 gap-3">
                    {requestSummary.map((item) => (
                      <View
                        key={item.id}
                        className="rounded-2xl bg-neutral-100 p-4"
                      >
                        <Text className="text-sm font-semibold text-neutral-900">
                          {item.title}
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-neutral-600">
                          {item.subtitle}
                        </Text>
                        <Text className="mt-1 text-xs font-medium text-neutral-500">
                          {item.meta}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
                    Quick actions
                  </Text>

                  <View className="mt-4 gap-3">
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/screens/job/CreateJobPost" as any)
                      }
                      activeOpacity={0.88}
                      className="flex-row items-center justify-between rounded-2xl bg-neutral-100 px-4 py-4"
                    >
                      <View>
                        <Text className="text-sm font-semibold text-neutral-900">
                          Post another job
                        </Text>
                        <Text className="mt-1 text-sm text-neutral-600">
                          Start a new hiring request
                        </Text>
                      </View>
                      <ArrowRight size={18} color="#737373" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/profile" as any)}
                      activeOpacity={0.88}
                      className="flex-row items-center justify-between rounded-2xl bg-neutral-100 px-4 py-4"
                    >
                      <View>
                        <Text className="text-sm font-semibold text-neutral-900">
                          Update profile
                        </Text>
                        <Text className="mt-1 text-sm text-neutral-600">
                          Keep company details current
                        </Text>
                      </View>
                      <ArrowRight size={18} color="#737373" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
