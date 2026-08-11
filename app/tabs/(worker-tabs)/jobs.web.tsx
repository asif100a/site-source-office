import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LabourerCard from "@/components/card/LabourerCard";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

type JobMode = "browse" | "offers";

type JobItem = {
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

const BROWSE_JOBS: JobItem[] = [
  {
    id: "3",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "80",
    tag: "Market Rate",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    time: "2 hours ago",
  },
  {
    id: "5",
    title: "Graphic Designer",
    company: "Creative Studios",
    payRate: "60",
    tag: "Competitive Rate",
    location: "Soho - 2.5 mi away",
    team: "1 designer",
    duration: "15 Jun - 2 weeks",
    time: "4 hours ago",
  },
  {
    id: "6",
    title: "Warehouse Helper",
    company: "Northside Logistics",
    payRate: "72",
    tag: "Fast Start",
    location: "Camden - 3.1 mi away",
    team: "1 supervisor, 6 workers",
    duration: "18 Jun - 3 weeks",
    time: "6 hours ago",
  },
];

const OFFER_JOBS: JobItem[] = [
  {
    id: "8",
    title: "Painter",
    company: "Studio Form",
    payRate: "95",
    tag: "Offer",
    location: "Hackney - 0.8 mi away",
    team: "2 painters, 1 coordinator",
    duration: "14 Jun - 10 days",
    time: "Just now",
  },
  {
    id: "9",
    title: "Event Setup Crew",
    company: "Live Works",
    payRate: "85",
    tag: "Offer",
    location: "Waterloo - 1.9 mi away",
    team: "8 crew members",
    duration: "15 Jun - weekend",
    time: "35 minutes ago",
  },
];

const FILTERS = [
  "All shifts",
  "Full time",
  "Part time",
  "Remote",
  "Urgent",
  "High pay",
];

function SectionLabel({
  title,
  action,
  onAction,
}: {
  title: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-[18px] font-semibold tracking-tight text-neutral-950">
        {title}
      </Text>
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.8}
        className="flex-row items-center gap-1.5"
      >
        <Text className="text-sm font-medium text-neutral-500">{action}</Text>
        <ArrowRight size={16} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`rounded-full px-4 py-2 ${
        active ? "bg-neutral-950" : "bg-white"
      }`}
      style={{
        borderWidth: 1,
        borderColor: active ? "#111827" : "#E5E7EB",
      }}
    >
      <Text
        className={`text-sm font-semibold ${active ? "text-white" : "text-neutral-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SideStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
            {label}
          </Text>
          <Text className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function WorkerJobsWebScreen() {
  const [activeMode, setActiveMode] = useState<JobMode>("browse");
  const [activeFilter, setActiveFilter] = useState("All shifts");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const handleOpenSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const visibleJobs = useMemo(() => {
    const source = activeMode === "browse" ? BROWSE_JOBS : OFFER_JOBS;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return source.filter((job) => {
      const matchesQuery =
        !normalizedQuery ||
        [job.title, job.company, job.location, job.tag]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        activeFilter === "All shifts" ||
        (activeFilter === "High pay" && Number(job.payRate) >= 85) ||
        (activeFilter === "Urgent" && job.tag.toLowerCase().includes("fast")) ||
        (activeFilter === "Remote" &&
          job.location.toLowerCase().includes("remote")) ||
        (activeFilter === "Part time" &&
          job.duration.toLowerCase().includes("week")) ||
        (activeFilter === "Full time" &&
          !job.duration.toLowerCase().includes("weekend"));

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, activeMode, searchQuery]);

  return (
    <View className="flex-1 bg-neutral-50">
      <View
        className="flex-1"
        style={{ paddingBottom: 96 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            {/* Top Section */}
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Worker jobs
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        24 active listings
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Find the right shift faster.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Search jobs, narrow results, and switch between browsing
                      and offers without leaving the page. This view stays
                      desktop-first on web and leaves the mobile screen
                      untouched.
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <TouchableOpacity
                    onPress={handleOpenSearch}
                    activeOpacity={0.9}
                    className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                  >
                    <Search size={18} color="#FFFFFF" />
                    <Text className="text-sm font-semibold text-white">
                      Open search
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      router.push("/tabs/(worker-tabs)/my-jobs" as any)
                    }
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                  >
                    <BriefcaseBusiness size={18} color="#111827" />
                    <Text className="text-sm font-semibold text-neutral-900">
                      My jobs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.65] gap-6">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-col gap-3 lg:flex-row lg:items-center">
                    <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <Search size={18} color="#A3A3A3" />
                      <TextInput
                        ref={searchInputRef}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search offers, companies, locations"
                        placeholderTextColor="#A3A3A3"
                        className="flex-1 text-sm text-neutral-900 focus:outline-none"
                      />
                    </View>
                  </View>

                  <View className="mt-5 flex-row flex-wrap gap-2.5">
                    {FILTERS.map((filter) => (
                      <FilterPill
                        key={filter}
                        label={filter}
                        active={activeFilter === filter}
                        onPress={() => setActiveFilter(filter)}
                      />
                    ))}
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => setActiveMode("browse")}
                      className={`flex-1 min-w-[180px] rounded-2xl px-4 py-3.5 ${
                        activeMode === "browse"
                          ? "bg-neutral-950"
                          : "bg-neutral-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          activeMode === "browse"
                            ? "text-white"
                            : "text-neutral-700"
                        } text-center`}
                      >
                        Browse opportunities
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setActiveMode("offers")}
                      className={`flex-1 min-w-[180px] rounded-2xl px-4 py-3.5 ${
                        activeMode === "offers"
                          ? "bg-neutral-950"
                          : "bg-neutral-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          activeMode === "offers"
                            ? "text-white"
                            : "text-neutral-700"
                        } text-center`}
                      >
                        Offers
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-4">
                  <SectionLabel
                    title={
                      activeMode === "browse"
                        ? "Active opportunities"
                        : "Available offers"
                    }
                    action="See all"
                    onAction={handleOpenSearch}
                  />

                  <View className="flex-row flex-wrap gap-4">
                    {visibleJobs.map((job) => (
                      <View
                        key={job.id}
                        style={{ flexBasis: "48%", minWidth: 320, flexGrow: 1 }}
                      >
                        {activeMode === "browse" ? (
                          <LabourerCard
                            job={job}
                            handleViewDetails={handleViewDetails}
                            handleApply={handleApply}
                          />
                        ) : (
                          <View className="rounded-2xl border border-neutral-200 bg-white p-5">
                            <View className="flex-row items-start justify-between gap-4">
                              <View className="flex-1 flex-row items-center gap-3">
                                <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                                  <BriefcaseBusiness
                                    size={20}
                                    color="#FFFFFF"
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text className="text-base font-semibold text-neutral-950">
                                    {job.title}
                                  </Text>
                                  <Text className="text-sm font-semibold text-neutral-500">
                                    {job.company}
                                  </Text>
                                </View>
                              </View>

                              <View className="rounded-xl bg-orange-50 px-3 py-1.5">
                                <Text className="text-xs font-semibold text-neutral-900">
                                  {job.tag}
                                </Text>
                              </View>
                            </View>

                            <View className="mt-4 gap-2.5 border-y border-neutral-100 py-4">
                              <View className="flex-row items-center gap-2">
                                <MapPin size={15} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                  {job.location}
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <Users size={15} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                  {job.team}
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <CalendarDays size={15} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                  {job.duration}
                                </Text>
                              </View>
                            </View>

                            <View className="mt-4 flex-row items-center justify-between gap-3">
                              <Text className="text-xs font-medium text-neutral-400">
                                {job.time}
                              </Text>
                              <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                  onPress={() => handleViewDetails(job.id)}
                                  className="rounded-xl bg-neutral-100 px-4 py-2.5"
                                >
                                  <Text className="text-xs font-semibold text-neutral-700">
                                    View Details
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={handleApply}
                                  className="rounded-xl bg-neutral-950 px-4 py-2.5"
                                >
                                  <Text className="text-xs font-semibold text-white">
                                    Apply
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <View className="flex-row items-center justify-between gap-3">
                    <View>
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                        Match overview
                      </Text>
                      <Text className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                        12 new matches
                      </Text>
                    </View>
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <Star size={20} color={Colors.common.BRAND} />
                    </View>
                  </View>

                  <View className="mt-4 gap-3">
                    <SideStat
                      icon={<Sparkles size={18} color={Colors.common.BRAND} />}
                      label="Today"
                      value="4 fresh listings"
                    />
                    <SideStat
                      icon={<MapPin size={18} color={Colors.common.BRAND} />}
                      label="Nearby"
                      value="8 within 5 miles"
                    />
                    <SideStat
                      icon={<Users size={18} color={Colors.common.BRAND} />}
                      label="Best fit"
                      value="3 strong matches"
                    />
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <SectionLabel
                    title="Search tips"
                    action="Expand"
                    onAction={handleOpenSearch}
                  />

                  <View className="mt-4 gap-3">
                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Narrow by pay rate
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Use the filter pills to focus on better-paying shifts.
                      </Text>
                    </View>
                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Prioritize location
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Keep nearby listings near the top when you are comparing
                        options.
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleOpenSearch}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-between rounded-[24px] bg-neutral-950 px-5 py-5"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-white/60">
                      Need more results?
                    </Text>
                    <Text className="mt-2 text-lg font-semibold tracking-tight text-white">
                      Open advanced search
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
