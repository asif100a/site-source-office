import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";

type JobStatus = "active" | "upcoming" | "completed" | "cancelled";
type JobTab = "active" | "upcoming" | "completed";

type JobCard = {
  id: string;
  title: string;
  company: string;
  badge: string;
  location: string;
  team: string;
  duration: string;
  status: JobStatus;
  rate?: string;
  applications?: string;
  applicants?: Array<{
    id: string;
    name: string;
    role: string;
    location: string;
    availability: string;
    experience: string;
  }>;
};

const ACTIVE_JOBS: JobCard[] = [
  {
    id: "active-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 applications",
  },
  {
    id: "active-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 applications",
  },
  {
    id: "active-3",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "active",
    applications: "+ 21 applications",
  },
];

const UPCOMING_JOBS: JobCard[] = [
  {
    id: "upcoming-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "120",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "upcoming",
    rate: "Market Rate",
    applicants: [
      {
        id: "1",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "2",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
    ],
  },
  {
    id: "upcoming-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "80",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "upcoming",
    rate: "Market Rate",
    applicants: [
      {
        id: "1",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
      {
        id: "2",
        name: "Michael Turner",
        role: "Labour",
        location: "Shoreditch - 1.2 mi away",
        availability: "Available 8am - 5pm",
        experience: "8 Years Experience",
      },
    ],
  },
];

const COMPLETED_JOBS: JobCard[] = [
  {
    id: "completed-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 20 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "completed",
  },
  {
    id: "completed-2",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Day 20 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "completed",
  },
];

const CANCELLED_JOBS: JobCard[] = [
  {
    id: "cancelled-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    badge: "Cancelled",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    status: "cancelled",
  },
];

const TAB_OPTIONS: Array<{
  key: JobTab;
  label: string;
  note: string;
}> = [
  { key: "active", label: "Active", note: "Live jobs" },
  { key: "upcoming", label: "Upcoming", note: "Awaiting starts" },
  { key: "completed", label: "Completed", note: "Closed jobs" },
];

function statusTone(status: JobStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700";
    case "upcoming":
      return "bg-orange-50 text-orange-700";
    case "completed":
      return "bg-neutral-100 text-neutral-700";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <View className="flex-1 min-w-[180px] rounded-[22px] border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
          {icon}
        </View>
        <Text className="text-xs font-semibold text-emerald-600">{note}</Text>
      </View>
      <Text className="mt-4 text-2xl font-black tracking-tight text-neutral-950">
        {value}
      </Text>
      <Text className="mt-1 text-sm font-medium text-neutral-500">{label}</Text>
    </View>
  );
}

function JobCardView({
  job,
  onOpenDetails,
}: {
  job: JobCard;
  onOpenDetails: (jobId: string, status: JobStatus) => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-xl font-black tracking-tight text-neutral-950">
              {job.title}
            </Text>
            <View className={`rounded-full px-2.5 py-1 ${statusTone(job.status)}`}>
              <Text className="text-[11px] font-bold uppercase tracking-[0px]">
                {job.status}
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-sm font-medium text-neutral-500">
            {job.company}
          </Text>
        </View>

        <View className="rounded-2xl bg-orange-50 px-3 py-2">
          <Text className="text-xs font-bold uppercase tracking-[0px] text-orange-700">
            {job.badge}
          </Text>
        </View>
      </View>

      <View className="mt-4 grid gap-3 md:grid-cols-3">
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <BriefcaseBusiness size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {job.team}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <CalendarDays size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {job.duration}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <Clock3 size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {job.location}
          </Text>
        </View>
      </View>

      {job.applications ? (
        <View className="mt-4 rounded-2xl bg-neutral-950 px-4 py-3">
          <Text className="text-sm font-semibold text-white">
            {job.applications}
          </Text>
        </View>
      ) : null}

      {job.rate ? (
        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          <View className="rounded-full bg-orange-50 px-3 py-1.5">
            <Text className="text-xs font-semibold text-orange-700">
              {job.rate}
            </Text>
          </View>
          <View className="rounded-full bg-emerald-50 px-3 py-1.5">
            <Text className="text-xs font-semibold text-emerald-700">
              {job.applicants?.length ?? 0} workers shortlisted
            </Text>
          </View>
        </View>
      ) : null}

      {job.applicants?.length ? (
        <View className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <Text className="text-sm font-bold text-neutral-900">
            Top applicants
          </Text>
          <View className="mt-3 gap-3">
            {job.applicants.slice(0, 2).map((applicant) => (
              <View
                key={applicant.id}
                className="rounded-2xl bg-white px-3 py-3"
              >
                <Text className="text-sm font-semibold text-neutral-900">
                  {applicant.name}
                </Text>
                <Text className="mt-1 text-sm text-neutral-600">
                  {applicant.role} - {applicant.location}
                </Text>
                <Text className="mt-1 text-xs text-neutral-500">
                  {applicant.availability} - {applicant.experience}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View className="mt-5 flex-row flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <TouchableOpacity
          onPress={() => onOpenDetails(job.id, job.status)}
          activeOpacity={0.9}
          className="flex-row items-center gap-1.5"
        >
          <Text className="text-sm font-semibold text-neutral-700">
            View details
          </Text>
          <ArrowRight size={16} color="#737373" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-neutral-900">
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl bg-neutral-950 px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-white">
              Open timeline
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function EmployerMyJobsScreenWeb() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<JobTab>("active");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (
      requestedTab === "active" ||
      requestedTab === "upcoming" ||
      requestedTab === "completed" ||
      requestedTab === "cancelled"
    ) {
      setActiveTab(requestedTab === "cancelled" ? "completed" : requestedTab);
    }
  }, [tab]);

  const jobsByTab: Record<JobTab, JobCard[]> = {
    active: ACTIVE_JOBS,
    upcoming: UPCOMING_JOBS,
    completed: [...COMPLETED_JOBS, ...CANCELLED_JOBS],
  };

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return jobsByTab[activeTab].filter((job) => {
      if (!query) {
        return true;
      }

      const haystack = [
        job.title,
        job.company,
        job.location,
        job.team,
        job.duration,
        job.badge,
        job.rate ?? "",
        job.applications ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activeTab, jobsByTab, searchQuery]);

  const openJobDetails = (jobId: string, status: JobStatus = activeTab) => {
    if (status === "completed") {
      router.push({
        pathname: "/screens/completed-jobs/[id]",
        params: { id: jobId, origin: "employer", status },
      });
      return;
    }

    if (status === "cancelled") {
      router.push({
        pathname: "/screens/cancelled-jobs/[id]",
        params: { id: jobId, origin: "employer", status },
      });
      return;
    }

    router.push({
      pathname: "/screens/active-jobs/[id]",
      params: { id: jobId, origin: "employer", status },
    });
  };

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
              <View className="flex-col xl:flex-row">
                <View className="flex-1 p-6 md:p-8 xl:p-10">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        My jobs
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {filteredJobs.length} jobs visible
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Track every job in one place.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review active work, upcoming start dates, and completed
                      jobs from a desktop-first layout that keeps your hiring
                      flow easy to scan.
                    </Text>
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Users size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Browse workers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/chats" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <ShieldCheck size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Open chats
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      icon={<BriefcaseBusiness size={18} color={Colors.common.BRAND} />}
                      label="Active jobs"
                      value="3"
                      note="1 updated today"
                    />
                    <StatCard
                      icon={<CheckCircle2 size={18} color={Colors.common.BRAND} />}
                      label="Completed"
                      value="6"
                      note="2 this month"
                    />
                    <StatCard
                      icon={<Clock3 size={18} color={Colors.common.BRAND} />}
                      label="Avg. response"
                      value="12 min"
                      note="Fastest this week"
                    />
                    <StatCard
                      icon={<CalendarDays size={18} color={Colors.common.BRAND} />}
                      label="Upcoming starts"
                      value="4"
                      note="Next 7 days"
                    />
                  </View>
                </View>

                <View className="w-full xl:w-[410px] border-t xl:border-t-0 xl:border-l border-neutral-200 bg-neutral-50 p-6 md:p-8">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Search and filter
                    </Text>

                    <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <Search size={18} color="#A3A3A3" />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search jobs, company, location"
                        placeholderTextColor="#A3A3A3"
                        className="flex-1 text-sm text-neutral-900 outline-none"
                      />
                    </View>

                    <View className="mt-4">
                      <View className="flex-row items-center gap-2">
                        <Filter size={16} color="#737373" />
                        <Text className="text-sm font-semibold text-neutral-700">
                          Job status
                        </Text>
                      </View>

                      <View className="mt-3 flex-row flex-wrap gap-2">
                        {TAB_OPTIONS.map((option) => {
                          const active = option.key === activeTab;
                          return (
                            <Pressable
                              key={option.key}
                              onPress={() => setActiveTab(option.key)}
                              className={`rounded-full px-4 py-2 ${
                                active ? "bg-neutral-950" : "bg-neutral-100"
                              }`}
                            >
                              <Text
                                className={`text-sm font-semibold ${
                                  active ? "text-white" : "text-neutral-700"
                                }`}
                              >
                                {option.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <View className="mt-5 rounded-2xl bg-orange-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Current view
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-neutral-700">
                        {activeTab === "active"
                          ? "Track work that is currently underway."
                          : activeTab === "upcoming"
                            ? "Review jobs that are waiting to start."
                            : "Check finished or closed jobs and their outcomes."}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.5] gap-4">
                <View className="flex-row items-center justify-between gap-3">
                  <View>
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Jobs
                    </Text>
                    <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                      {activeTab.charAt(0).toUpperCase()}
                      {activeTab.slice(1)} jobs
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-neutral-900">
                      Sort by latest
                    </Text>
                    <ArrowRight size={16} color="#737373" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {TAB_OPTIONS.map((option) => {
                    const active = option.key === activeTab;
                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setActiveTab(option.key)}
                        className={`rounded-full border px-4 py-3 ${
                          active
                            ? "border-neutral-950 bg-neutral-950"
                            : "border-neutral-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            active ? "text-white" : "text-neutral-700"
                          }`}
                        >
                          {option.label}
                        </Text>
                        <Text
                          className={`mt-0.5 text-xs ${
                            active ? "text-white/80" : "text-neutral-500"
                          }`}
                        >
                          {option.note}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="gap-4">
                  {filteredJobs.map((job) => (
                    <JobCardView
                      key={job.id}
                      job={job}
                      onOpenDetails={openJobDetails}
                    />
                  ))}

                  {filteredJobs.length === 0 ? (
                    <View className="items-center rounded-[24px] border border-dashed border-neutral-300 bg-white px-6 py-10">
                      <Text className="text-base font-bold text-neutral-900">
                        No jobs found
                      </Text>
                      <Text className="mt-2 max-w-md text-center text-sm text-neutral-500">
                        Try a different search or switch to another job status.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                    Hiring summary
                  </Text>
                  <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                    4 jobs need attention
                  </Text>

                  <View className="mt-4 gap-3">
                    {[
                      {
                        title: "Review applicants",
                        note: "Open the active jobs first to keep response times low.",
                      },
                      {
                        title: "Confirm starts",
                        note: "Check upcoming jobs that are waiting on availability.",
                      },
                      {
                        title: "Close the loop",
                        note: "Archive completed work once feedback is logged.",
                      },
                    ].map((item) => (
                      <View
                        key={item.title}
                        className="rounded-2xl bg-neutral-100 p-4"
                      >
                        <Text className="text-sm font-semibold text-neutral-900">
                          {item.title}
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-neutral-600">
                          {item.note}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="rounded-[24px] border border-neutral-200 bg-neutral-950 p-5">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-400">
                    Need support?
                  </Text>
                  <Text className="mt-1 text-2xl font-black tracking-tight text-white">
                    Open a support ticket
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="mt-4 flex-row items-center justify-between rounded-2xl bg-white px-4 py-3.5"
                  >
                    <Text className="text-sm font-semibold text-neutral-950">
                      Message support
                    </Text>
                    <ArrowRight size={16} color="#111827" />
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
