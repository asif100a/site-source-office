import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Bookmark,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import {
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
  badge: string;
};

const WORKERS: Worker[] = [
  {
    id: "1",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch - 1.2 mi away",
    availability: "Available 8am - 5pm",
    badge: "8 Years Experience",
  },
  {
    id: "2",
    name: "Amina Rahman",
    role: "Groundworker",
    location: "Hackney - 3.8 mi away",
    availability: "Available 8am - 5pm",
    badge: "6 Years Experience",
  },
  {
    id: "3",
    name: "Daniel Brooks",
    role: "Electrician",
    location: "Waterloo - 11.4 mi away",
    availability: "Available 9am - 6pm",
    badge: "11 Years Experience",
  },
  {
    id: "4",
    name: "Sarah Khan",
    role: "Carpenter",
    location: "Islington - 18.6 mi away",
    availability: "Night shift",
    badge: "5 Years Experience",
  },
];

const TRADE_OPTIONS = [
  "All trades",
  "Groundworker",
  "Labour",
  "Electrician",
  "Carpenter",
];

const RADIUS_OPTIONS = [
  "Any radius",
  "1 - 10 miles",
  "11 - 20 miles",
  "21 - 50 miles",
];

const TIME_OPTIONS = [
  "Any time",
  "8am - 5pm",
  "9am - 6pm",
  "Night shift",
];

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            activeOpacity={0.85}
            className={`rounded-full px-4 py-2 ${
              value === option ? "bg-neutral-950" : "bg-neutral-100"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                value === option ? "text-white" : "text-neutral-700"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function EmployerWorkersScreenWeb() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tradeSkill, setTradeSkill] = useState("All trades");
  const [radius, setRadius] = useState("Any radius");
  const [availableTime, setAvailableTime] = useState("Any time");

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const filteredWorkers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return WORKERS.filter((worker) => {
      const matchesQuery =
        !normalizedQuery ||
        [worker.name, worker.role, worker.location, worker.availability, worker.badge]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesTrade =
        tradeSkill === "All trades" ||
        worker.role.toLowerCase() === tradeSkill.toLowerCase();

      const distance = Number(worker.location.match(/(\d+(\.\d+)?)\s*mi/)?.[1] ?? "0");
      const matchesRadius =
        radius === "Any radius" ||
        (radius === "1 - 10 miles" && distance <= 10) ||
        (radius === "11 - 20 miles" && distance > 10 && distance <= 20) ||
        (radius === "21 - 50 miles" && distance > 20 && distance <= 50);

      const normalizedAvailability = worker.availability.toLowerCase();
      const matchesTime =
        availableTime === "Any time" ||
        (availableTime === "8am - 5pm" &&
          normalizedAvailability.includes("8am - 5pm")) ||
        (availableTime === "9am - 6pm" &&
          normalizedAvailability.includes("9am - 6pm")) ||
        (availableTime === "Night shift" &&
          normalizedAvailability.includes("night shift"));

      return matchesQuery && matchesTrade && matchesRadius && matchesTime;
    });
  }, [availableTime, radius, searchQuery, tradeSkill]);

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-14 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative gap-4">
                  <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                    <Text className="text-xs font-bold uppercase text-neutral-900">
                      Workers
                    </Text>
                  </View>

                  <View className="gap-2">
                    <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                      Review and hire workers from this platform.
                    </Text>
                    <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                      Search, filter, and shortlist worker profiles in one
                      organized place built for faster hiring decisions.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="flex-row items-center gap-3">
                <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-3">
                  <Search size={18} color="#A3A3A3" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search workers"
                    placeholderTextColor="#A3A3A3"
                    className="flex-1 px-3 text-sm font-medium text-neutral-800"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowFilters((current) => !current)}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-4 py-3"
                >
                  <SlidersHorizontal size={16} color="#333333" />
                  <Text className="text-sm font-bold text-neutral-700">
                    Filters
                  </Text>
                  <ChevronDown
                    size={16}
                    color="#525252"
                    style={{
                      transform: [{ rotate: showFilters ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
              </View>

              {showFilters ? (
                <View className="mt-5 gap-5 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 md:p-5">
                  <FilterGroup
                    label="Trade / Skill"
                    options={TRADE_OPTIONS}
                    value={tradeSkill}
                    onChange={setTradeSkill}
                  />
                  <FilterGroup
                    label="Radius"
                    options={RADIUS_OPTIONS}
                    value={radius}
                    onChange={setRadius}
                  />
                  <FilterGroup
                    label="Available time"
                    options={TIME_OPTIONS}
                    value={availableTime}
                    onChange={setAvailableTime}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setTradeSkill("All trades");
                      setRadius("Any radius");
                      setAvailableTime("Any time");
                    }}
                    activeOpacity={0.85}
                    className="self-start rounded-xl bg-white px-4 py-2.5"
                  >
                    <Text className="text-sm font-bold text-neutral-700">
                      Reset filters
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mb-5 flex-row items-center justify-between gap-4">
                <Text className="text-lg font-bold tracking-tight text-neutral-900">
                  Search Result
                </Text>
                <View className="rounded-md bg-orange-50 px-2.5 py-1.5">
                  <Text
                    style={{ color: Colors.common.BRAND }}
                    className="text-xs font-medium"
                  >
                    {filteredWorkers.length} Results
                  </Text>
                </View>
              </View>

              <View className="gap-4">
                {filteredWorkers.map((worker) => (
                  <View
                    key={worker.id}
                    className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white"
                  >
                    <View className="px-5 pt-5 pb-4">
                      <View className="flex-row items-start justify-between gap-4">
                        <View className="flex-1 flex-row items-center gap-3 pr-3">
                          <Image
                            source={{
                              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
                            }}
                            className="h-12 w-12 rounded-full"
                          />
                          <View className="flex-1">
                            <Text className="text-base font-bold text-neutral-950">
                              {worker.name}
                            </Text>
                            <Text className="text-sm text-neutral-500">
                              {worker.role}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity className="p-1.5" activeOpacity={0.85}>
                          <Bookmark size={20} color="#737373" />
                        </TouchableOpacity>
                      </View>

                      <View className="mt-4 gap-2.5 border-t border-neutral-100 pt-4">
                        <View className="flex-row items-center gap-2">
                          <MapPin size={14} color="#C81E1E" />
                          <Text className="text-xs text-neutral-500">
                            {worker.location}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Clock size={14} color="#737373" />
                          <Text className="text-xs text-neutral-500">
                            {worker.availability}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between px-5 pb-5">
                      <View className="rounded-md bg-orange-50 px-3 py-1.5">
                        <Text
                          style={{ color: Colors.common.BRAND }}
                          className="text-xs font-medium"
                        >
                          {worker.badge}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                          onPress={() => openWorkerDetails(worker.id)}
                          activeOpacity={0.9}
                        >
                          <Text className="text-xs font-medium text-neutral-700">
                            View Details
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          className="rounded-md bg-slate-900 px-4 py-2"
                          style={{ minWidth: 92, flexShrink: 0 }}
                        >
                          <Text className="text-center text-xs font-medium text-white">
                            Send Offer
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}

                {filteredWorkers.length === 0 ? (
                  <View className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10">
                    <Text className="text-base font-bold text-neutral-900">
                      No matching workers found
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-neutral-600">
                      Try a different search term or reset the current filters to
                      see more worker profiles.
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
