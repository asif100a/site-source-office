import React, { useMemo, useState } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  Filter,
  MapPin,
  MessageSquareMore,
  Search,
  Star,
  Users,
  Zap,
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

type Worker = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  rating: string;
  status: "Available" | "Busy" | "Shortlisted";
  distance: string;
  skills: string[];
};

const WORKERS: Worker[] = [
  {
    id: "1",
    name: "Michael Turner",
    role: "Labourer",
    location: "Shoreditch",
    availability: "Available 8am - 5pm",
    experience: "8 years experience",
    rating: "4.9/5",
    status: "Available",
    distance: "1.2 mi away",
    skills: ["Site prep", "Loading", "Cleanup"],
  },
  {
    id: "2",
    name: "Amina Rahman",
    role: "Painter",
    location: "Hackney",
    availability: "Available tomorrow",
    experience: "6 years experience",
    rating: "4.8/5",
    status: "Shortlisted",
    distance: "0.8 mi away",
    skills: ["Interior finish", "Detail work", "Colour matching"],
  },
  {
    id: "3",
    name: "Daniel Brooks",
    role: "Electrician",
    location: "Waterloo",
    availability: "Busy until 2pm",
    experience: "11 years experience",
    rating: "4.7/5",
    status: "Busy",
    distance: "2.1 mi away",
    skills: ["Fault finding", "Wiring", "Testing"],
  },
  {
    id: "4",
    name: "Sarah Khan",
    role: "Site Assistant",
    location: "Islington",
    availability: "Available now",
    experience: "5 years experience",
    rating: "5.0/5",
    status: "Available",
    distance: "1.5 mi away",
    skills: ["Coordination", "Inventory", "Reporting"],
  },
];

const FILTERS = ["All", "Available", "Shortlisted", "Busy"] as const;

function statusTone(status: Worker["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700";
    case "Shortlisted":
      return "bg-orange-50 text-orange-700";
    case "Busy":
      return "bg-neutral-100 text-neutral-700";
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

function WorkerCard({
  worker,
  onOpenDetails,
}: {
  worker: Worker;
  onOpenDetails: (id: string) => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row flex-1 items-center gap-4">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
            }}
            contentFit="cover"
            className="h-14 w-14 rounded-full"
          />
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-lg font-bold text-neutral-950">
                {worker.name}
              </Text>
              <View className={`rounded-full px-2.5 py-1 ${statusTone(worker.status)}`}>
                <Text className="text-[11px] font-bold uppercase tracking-[0px]">
                  {worker.status}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-sm font-medium text-neutral-500">
              {worker.role}
            </Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} className="p-2">
          <Bookmark size={18} color="#737373" />
        </TouchableOpacity>
      </View>

      <View className="mt-5 grid gap-3 md:grid-cols-3">
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <MapPin size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.location} - {worker.distance}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <Clock3 size={15} color="#737373" />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.availability}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
          <Star size={15} color={Colors.common.BRAND} />
          <Text className="text-sm font-medium text-neutral-700">
            {worker.rating} - {worker.experience}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {worker.skills.map((skill) => (
          <View key={skill} className="rounded-full bg-orange-50 px-3 py-1.5">
            <Text className="text-xs font-semibold text-orange-700">
              {skill}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-5 flex-row flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <TouchableOpacity
          onPress={() => onOpenDetails(worker.id)}
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
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl bg-neutral-950 px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-white">
              Send offer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function EmployerWorkersScreenWeb() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const filteredWorkers = useMemo(() => {
    return WORKERS.filter((worker) => {
      const matchesQuery =
        query.trim().length === 0 ||
        [worker.name, worker.role, worker.location, ...worker.skills]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      const matchesFilter =
        activeFilter === "All" || worker.status === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  const handleOpenWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
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
                      <BriefcaseBusiness size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Worker directory
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {filteredWorkers.length} matches found
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Find and hire workers from one place.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Search by skill, location, or experience, then shortlist
                      workers and send an offer without leaving the page.
                    </Text>
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => router.push("/screens/job/CreateJobPost" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Users size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Create job post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/tabs/chats" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <MessageSquareMore size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Open chats
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      icon={<Users size={18} color={Colors.common.BRAND} />}
                      label="Workers available now"
                      value="18"
                      note="6 nearby"
                    />
                    <StatCard
                      icon={<Star size={18} color={Colors.common.BRAND} />}
                      label="Average rating"
                      value="4.8/5"
                      note="From 42 reviews"
                    />
                    <StatCard
                      icon={<Clock3 size={18} color={Colors.common.BRAND} />}
                      label="Fastest response"
                      value="11 min"
                      note="Today"
                    />
                    <StatCard
                      icon={<Zap size={18} color={Colors.common.BRAND} />}
                      label="Shortlisted"
                      value="9"
                      note="This week"
                    />
                  </View>
                </View>

                <View className="w-full xl:w-[410px] border-t xl:border-t-0 xl:border-l border-neutral-200 bg-neutral-50 p-6 md:p-8">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Search workers
                    </Text>

                    <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <Search size={18} color="#A3A3A3" />
                      <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search by name, skill, location"
                        placeholderTextColor="#A3A3A3"
                        className="flex-1 text-sm text-neutral-900 outline-none"
                      />
                    </View>

                    <View className="mt-4">
                      <View className="flex-row items-center gap-2">
                        <Filter size={16} color="#737373" />
                        <Text className="text-sm font-semibold text-neutral-700">
                          Quick filters
                        </Text>
                      </View>

                      <View className="mt-3 flex-row flex-wrap gap-2">
                        {FILTERS.map((filter) => {
                          const active = filter === activeFilter;

                          return (
                            <Pressable
                              key={filter}
                              onPress={() => setActiveFilter(filter)}
                              className={`rounded-full px-4 py-2 ${
                                active
                                  ? "bg-neutral-950"
                                  : "bg-neutral-100"
                              }`}
                            >
                              <Text
                                className={`text-sm font-semibold ${
                                  active ? "text-white" : "text-neutral-700"
                                }`}
                              >
                                {filter}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <View className="mt-5 rounded-2xl bg-orange-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Employer note
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-neutral-700">
                        Keep availability updated and review workers who are
                        currently nearby first.
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
                      Search result
                    </Text>
                    <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                      {filteredWorkers.length} workers ready to review
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-neutral-900">
                      Sort by experience
                    </Text>
                    <ArrowRight size={16} color="#737373" />
                  </TouchableOpacity>
                </View>

                <View className="gap-4">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onOpenDetails={handleOpenWorkerDetails}
                    />
                  ))}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                  <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                    Hiring pipeline
                  </Text>
                  <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                    4 workers shortlisted
                  </Text>

                  <View className="mt-4 gap-3">
                    {[
                      {
                        title: "Review profile",
                        note: "Open workers with strong availability first.",
                      },
                      {
                        title: "Send offer",
                        note: "Keep the next action visible and direct.",
                      },
                      {
                        title: "Start chat",
                        note: "Confirm the scope before creating a job.",
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
