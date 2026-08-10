import React from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquareMore,
  Search,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import LabourerCard from "@/components/card/LabourerCard";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";

type Metric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
};

type Shortcut = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

type RecommendedJob = {
  id: string;
  title: string;
  company: string;
  payRate: string;
  tag: string;
  location: string;
  team: string;
  duration: string;
  time: string;
};

const METRICS: Metric[] = [
  {
    id: "active",
    label: "Active jobs",
    value: "3",
    delta: "+1 this week",
    icon: <BriefcaseBusiness size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "applications",
    label: "Applications",
    value: "14",
    delta: "5 awaiting replies",
    icon: <CheckCircle2 size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "earnings",
    label: "Estimated weekly earnings",
    value: "GBP 620",
    delta: "Based on active jobs",
    icon: <Wallet size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "response",
    label: "Response time",
    value: "12 min",
    delta: "Average employer reply",
    icon: <Clock3 size={18} color={Colors.common.BRAND} />,
  },
];

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Interview request received",
    detail: "Brixton Builders requested a call about your carpenter application.",
    time: "10 minutes ago",
  },
  {
    id: "2",
    title: "New job matched your profile",
    detail: "A warehouse operative role in Shoreditch is open for morning shifts.",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "Application updated",
    detail: "Your electrician application has moved to the shortlist.",
    time: "Today",
  },
];

const RECOMMENDED_JOBS: RecommendedJob[] = [
  {
    id: "3",
    title: "Labourer",
    company: "Shoreditch Site Services",
    payRate: "120",
    tag: "Market Rate",
    location: "Shoreditch - 1.2 mi away",
    team: "4 labourers, 1 site supervisor",
    duration: "12 Jun - 1 month",
    time: "2 hours ago",
  },
  {
    id: "4",
    title: "Labourer",
    company: "London Build Group",
    payRate: "130",
    tag: "Urgent hire",
    location: "Camden - 2.4 mi away",
    team: "6 workers, 1 site supervisor",
    duration: "15 Jun - 3 weeks",
    time: "3 hours ago",
  },
];

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-neutral-950 text-[18px] font-extrabold tracking-tight">
        {title}
      </Text>
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.8}
        className="flex-row items-center gap-1.5"
      >
        <Text className="text-neutral-500 text-sm font-medium">{actionLabel}</Text>
        <ArrowRight size={16} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <View className="flex-1 min-w-[160px] rounded-2xl border border-neutral-200/80 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center">
          {metric.icon}
        </View>
        <Text className="text-xs font-medium text-emerald-600">{metric.delta}</Text>
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

function ActivityRow({ item }: { item: Activity }) {
  return (
    <View className="rounded-2xl border border-neutral-200/80 bg-white p-4">
      <Text className="text-sm font-bold text-neutral-950">{item.title}</Text>
      <Text className="mt-1 text-sm leading-5 text-neutral-600">{item.detail}</Text>
      <Text className="mt-3 text-xs font-medium text-neutral-400">{item.time}</Text>
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
      <View className="w-9 h-9 rounded-xl bg-neutral-100 items-center justify-center">
        {icon}
      </View>
      <Text className="flex-1 text-sm font-semibold text-neutral-900">{label}</Text>
      <ArrowRight size={16} color="#737373" />
    </TouchableOpacity>
  );
}

export default function WorkerHomeScreenWeb() {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  const shortcuts: Shortcut[] = [
    {
      id: "jobs",
      label: "Browse jobs",
      icon: <Search size={18} color="#111827" />,
      onPress: () => router.push("/tabs/(worker-tabs)/jobs" as any),
    },
    {
      id: "my-jobs",
      label: "My jobs",
      icon: <BriefcaseBusiness size={18} color="#111827" />,
      onPress: () => router.push("/tabs/(worker-tabs)/my-jobs" as any),
    },
    {
      id: "chats",
      label: "Messages",
      icon: <MessageSquareMore size={18} color="#111827" />,
      onPress: () => router.push("/tabs/(worker-tabs)/chats" as any),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserRound size={18} color="#111827" />,
      onPress: () => router.push("/tabs/(worker-tabs)/profile" as any),
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-6 md:px-10 xl:px-12 pt-6 md:pt-10">
          <View className="w-full max-w-7xl self-center gap-6">
            <View className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <View className="flex-col md:flex-row">
                <View className="flex-1 p-6 md:p-8 gap-5">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Worker dashboard
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        4 new matches today
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Your worker dashboard.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Track job matches, applications, interviews, and active
                      site work from one organized workspace.
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/(worker-tabs)/jobs" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Search size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Browse jobs
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/(worker-tabs)/my-jobs" as any)}
                      activeOpacity={0.88}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <BriefcaseBusiness size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        My jobs
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
                    className="h-72 md:h-full w-full"
                  />
                  <View className="absolute inset-0 bg-black/30" />

                  <View className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <View className="rounded-2xl bg-white/95 p-4 shadow-sm">
                      <View className="flex-row items-center justify-between gap-3">
                        <View>
                          <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                            Jobs available today
                          </Text>
                          <Text className="mt-1 text-xl font-black tracking-tight text-neutral-950">
                            12 jobs near you
                          </Text>
                        </View>
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                          <CalendarDays size={20} color={Colors.common.BRAND} />
                        </View>
                      </View>

                      <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2">
                        <CheckCircle2 size={16} color="#16A34A" />
                        <Text className="text-xs font-medium text-neutral-600">
                          3 interview requests and 1 offer ready for review
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
              <View className="flex-[1.65] gap-4">
                <SectionHeader
                  title="Recommended jobs"
                  actionLabel="View all"
                  onAction={() => router.push("/tabs/(worker-tabs)/jobs" as any)}
                />

                <View className="gap-4">
                  {RECOMMENDED_JOBS.map((job) => (
                    <LabourerCard
                      key={job.id}
                      job={job}
                      handleViewDetails={handleViewDetails}
                      handleApply={() =>
                        router.push({
                          pathname: "/auth",
                          params: { role: "worker", step: "register_sso" },
                        })
                      }
                    />
                  ))}
                </View>
              </View>

              <View className="flex-1 gap-6">
                <View className="gap-4">
                  <SectionHeader
                    title="Recent activity"
                    actionLabel="Notifications"
                    onAction={() =>
                      router.push("/screens/common/Notifications" as any)
                    }
                  />

                  <View className="gap-3">
                    {ACTIVITIES.map((item) => (
                      <ActivityRow key={item.id} item={item} />
                    ))}
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
                    Profile status
                  </Text>
                  <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                    85% complete
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-neutral-600">
                    Complete your profile so employers can confirm your skills,
                    location, documents, and availability faster.
                  </Text>

                  <View className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <View
                      className="h-full rounded-full"
                      style={{ width: "85%", backgroundColor: Colors.common.BRAND }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push("/tabs/(worker-tabs)/profile" as any)}
                    activeOpacity={0.88}
                    className="mt-5 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-white">
                      Complete profile
                    </Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
