import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  Briefcase,
  Filter,
  Navigation,
  Plus,
} from "lucide-react-native";

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";

type HomeFilter = "All" | "Urgent" | "Highest paid" | "Closest";

type HomeJob = {
  id: string;
  title: string;
  company: string;
  area: string;
  distance: string;
  needed: string;
  startLabel: string;
  posted: string;
  payRate: number;
  length: string;
  badgeTone: "dark" | "light" | "orange";
  mapPrice: string;
  mapPosition: {
    top: number;
    left: string;
  };
};

const FILTERS: HomeFilter[] = ["All", "Urgent", "Highest paid", "Closest"];

const JOBS: HomeJob[] = [
  {
    id: "scaffolder",
    title: "Scaffolder",
    company: "Eastway Access",
    area: "Shoreditch",
    distance: "3.0 mi",
    needed: "5 live sites",
    startLabel: "Starts tomorrow",
    posted: "Tap to view",
    payRate: 26,
    length: "Tomorrow",
    badgeTone: "dark",
    mapPrice: "£26",
    mapPosition: { top: 156, left: "69%" },
  },
  {
    id: "labourer",
    title: "Labourer",
    company: "London Builder Ltd",
    area: "Shoreditch",
    distance: "0.8 mi",
    needed: "4 needed",
    startLabel: "Starts tomorrow",
    posted: "Posted 12 min ago",
    payRate: 18,
    length: "2 weeks",
    badgeTone: "orange",
    mapPrice: "£30",
    mapPosition: { top: 92, left: "28%" },
  },
  {
    id: "groundworker",
    title: "Groundworker",
    company: "Kerigan Civils",
    area: "Hackney Wick",
    distance: "1.4 mi",
    needed: "2 needed",
    startLabel: "Starts Mon 24 Aug",
    posted: "Posted 1 hr ago",
    payRate: 24,
    length: "6 weeks",
    badgeTone: "light",
    mapPrice: "£24",
    mapPosition: { top: 86, left: "59%" },
  },
  {
    id: "bricklayer",
    title: "Bricklayer",
    company: "Fieldstone Projects",
    area: "Bethnal Green",
    distance: "1.1 mi",
    needed: "1 needed",
    startLabel: "Urgent today",
    posted: "Posted 25 min ago",
    payRate: 28,
    length: "4 days",
    badgeTone: "dark",
    mapPrice: "£28",
    mapPosition: { top: 186, left: "43%" },
  },
];

function MapPriceTag({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <View
      className="rounded-full px-4 py-2 shadow-sm"
      style={{
        backgroundColor: dark ? "#1B1B1B" : "#FFFFFF",
        borderWidth: dark ? 0 : 1,
        borderColor: "#E9E9E9",
      }}
    >
      <Text
        className="text-sm font-extrabold"
        style={{ color: dark ? "#FFFFFF" : "#111111" }}
      >
        {label}
      </Text>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: HomeFilter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mr-3 rounded-full px-5 py-3"
      style={{
        backgroundColor: active ? "#111111" : "#FFFFFF",
        borderWidth: active ? 0 : 1,
        borderColor: "#E7E7E7",
      }}
    >
      <Text
        className="text-sm font-bold"
        style={{ color: active ? "#FFFFFF" : "#4B4B4B" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function JobCard({
  job,
  onDetails,
  onApply,
}: {
  job: HomeJob;
  onDetails: (id: string) => void;
  onApply: () => void;
}) {
  const metaBadgeStyles =
    job.badgeTone === "orange"
      ? { backgroundColor: "#FFF0E8", color: Colors.common.BRAND }
      : job.badgeTone === "dark"
        ? { backgroundColor: "#111111", color: "#FFFFFF" }
        : { backgroundColor: "#F4F4F4", color: "#555555" };

  return (
    <View className="rounded-[28px] bg-white px-6 py-5 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
            <Briefcase size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-extrabold text-neutral-950">
              {job.title}
            </Text>
            <Text className="text-base font-medium text-neutral-500">
              {job.company}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xl font-extrabold text-neutral-950">
            £{job.payRate}/hr
          </Text>
          <Text className="mt-1 text-sm font-medium text-neutral-500">
            {job.length}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row flex-wrap gap-2">
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {job.area} · {job.distance}
          </Text>
        </View>
        <View className="rounded-full bg-[#F4F4F4] px-3 py-1.5">
          <Text className="text-sm font-semibold text-neutral-600">
            {job.needed}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1.5"
          style={{ backgroundColor: metaBadgeStyles.backgroundColor }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: metaBadgeStyles.color }}
          >
            {job.startLabel}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-neutral-400">{job.posted}</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onDetails(job.id)}
            className="rounded-xl bg-[#F5F3F3] px-5 py-3"
          >
            <Text className="text-sm font-bold text-neutral-700">Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onApply}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: "#111111" }}
          >
            <Text className="text-sm font-bold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function WorkerHomeScreen() {
  const [activeFilter, setActiveFilter] = useState<HomeFilter>("All");

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All") {
      return JOBS;
    }

    if (activeFilter === "Urgent") {
      return JOBS.filter((job) => job.startLabel.toLowerCase().includes("urgent"));
    }

    if (activeFilter === "Highest paid") {
      return [...JOBS].sort((a, b) => b.payRate - a.payRate);
    }

    return [...JOBS].sort(
      (a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance),
    );
  }, [activeFilter]);

  const featuredJob = filteredJobs[0] ?? JOBS[0];

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#F3F3F3" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 72 }}
      >
        <View className="px-6 py-6 xl:px-10">
          <View className="mx-auto w-full max-w-[1260px]">
            <View
              className="overflow-hidden rounded-[36px] border border-[#E9E6DF] bg-[#E6DCCB] shadow-sm"
            >
              <View className="px-6 pb-5 pt-6 md:px-8">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <MapPriceTag label="Shoreditch, E2" />
                    <MapPriceTag label="5 live sites" tone="dark" />
                  </View>

                  <View className="flex-row items-center gap-2 rounded-full bg-[#111111] px-4 py-3">
                    <Filter size={18} color="#FFFFFF" />
                    <Text className="text-sm font-bold text-white">Filters</Text>
                    <View
                      className="h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: Colors.common.BRAND }}
                    >
                      <Text className="text-[10px] font-bold text-white">6</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="relative h-[380px] bg-[#D8D1C6]">
                <View className="absolute left-[-60px] top-[54px] h-24 w-[760px] rotate-[10deg] rounded-full bg-white/40" />
                <View className="absolute left-[-80px] top-[178px] h-16 w-[780px] rotate-[-7deg] rounded-full bg-[#B9B2A6]/60" />
                <View className="absolute left-[180px] top-[6px] h-[400px] w-14 rounded-full bg-[#C8D9B5]/65" />
                <View className="absolute right-[120px] top-[34px] h-[280px] w-28 rounded-[32px] bg-[#C7DEB7]/75" />
                <View className="absolute left-[76px] top-[112px] h-20 w-[560px] rotate-[27deg] rounded-full border border-white/60" />
                <View className="absolute left-[28px] top-[252px] h-12 w-[610px] rotate-[-10deg] rounded-full border border-[#F5F5F5]/90" />

                {JOBS.map((job, index) => (
                  <View
                    key={job.id}
                    className="absolute"
                    style={{
                      top: job.mapPosition.top,
                      left: job.mapPosition.left as any,
                      transform: [{ translateX: -24 }],
                      zIndex: 5 + index,
                    }}
                  >
                    <MapPriceTag
                      label={job.mapPrice}
                      tone={index === 0 || index === 3 ? "dark" : "light"}
                    />
                  </View>
                ))}

                <View className="absolute bottom-14 left-[51%] z-20">
                  <View className="relative h-9 w-9 -translate-x-1/2 rounded-full border-[5px] border-white bg-[#2F5BFF]" />
                  <View className="absolute -left-3 top-1 h-7 w-7 rounded-full border-[4px] border-white bg-[#FF5500]" />
                </View>

                <View className="absolute bottom-5 right-5 gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Navigation size={18} color={Colors.common.BRAND} />
                  </View>
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Plus size={20} color="#111111" />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => handleViewDetails(featuredJob.id)}
                className="mx-5 mb-5 mt-[-22px] rounded-[28px] bg-white px-5 py-5 shadow-sm"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 flex-row items-center gap-4">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                      <Briefcase size={24} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-2xl font-extrabold text-neutral-950">
                        {featuredJob.title}
                      </Text>
                      <Text className="text-base font-medium text-neutral-500">
                        {featuredJob.company} · {featuredJob.distance} ·{" "}
                        {featuredJob.startLabel}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-xl font-extrabold text-neutral-950">
                      £{featuredJob.payRate}/hr
                    </Text>
                    <Text className="mt-1 text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                      {featuredJob.posted}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-[34px] font-extrabold text-neutral-950">
                  Nearby Jobs
                </Text>
                <Text className="mt-1 text-base font-medium text-neutral-500">
                  5 within 5 mi
                </Text>
              </View>

              <TouchableOpacity>
                <Text
                  className="text-base font-bold"
                  style={{ color: Colors.common.BRAND }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
            >
              {FILTERS.map((filter) => (
                <FilterChip
                  key={filter}
                  label={filter}
                  active={activeFilter === filter}
                  onPress={() => setActiveFilter(filter)}
                />
              ))}
            </ScrollView>

            <View className="mt-6 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
