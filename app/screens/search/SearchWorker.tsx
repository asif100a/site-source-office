import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import SearchWorkerHeader from "@/components/modules/worker/search-workers/SearchWorkerHeader";
import WorkerSearchCardRow from "@/components/modules/worker/search-workers/WorkerSearchCardRow";
import SearchWorkerSearchBar from "@/components/modules/worker/search-workers/SearchWorkerSearchBar";
import SearchWorkerMapView from "@/components/modules/worker/search-workers/SearchWorkerMapView";
import SearchWorkerModal from "@/components/modules/worker/search-workers/SearchWorkerModal";

type WorkerCard = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type FilterValues = {
  project: string;
  jobPosting: string;
  tradeSkill: string;
  radius: string;
  availableTime: string;
};

const WORKERS: WorkerCard[] = [
  {
    id: "1",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch • 1.2 mi away",
    availability: "Available 8am - 5pm",
    experience: "8 Years Experience",
    coordinate: {
      latitude: 51.5295,
      longitude: -0.056,
    },
  },
  {
    id: "2",
    name: "Daniel Foster",
    role: "Carpenter",
    location: "Bethnal Green • 1.4 mi away",
    availability: "Available 7am - 4pm",
    experience: "6 Years Experience",
    coordinate: {
      latitude: 51.5332,
      longitude: -0.0474,
    },
  },
  {
    id: "3",
    name: "Aaron Hughes",
    role: "Electrician",
    location: "Old Street • 1.8 mi away",
    availability: "Available 8am - 5pm",
    experience: "9 Years Experience",
    coordinate: {
      latitude: 51.5248,
      longitude: -0.0641,
    },
  },
];

export default function SearchWorkerScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { control } = useForm<FilterValues>({
    defaultValues: {
      project: "hoxton-refurb",
      jobPosting: "labourer-hoxton",
      tradeSkill: "groundworker",
      radius: "1-10",
      availableTime: "8-5",
    },
  });

  const openWorkerDetails = (id: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id, origin: "employer" },
    });
  };

  const goBackToOrigin = () => {
    void originRoute;
    router.back();
  };

  return (
    <ScreenWrapper>
      <SearchWorkerHeader
        goBackToOrigin={goBackToOrigin}
        setViewType={setViewType}
        viewType={viewType}
      />

      {viewType === "list" && (
        <SearchWorkerSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowFilters={setShowFilters}
        />
      )}

      {viewType === "list" ? (
        <ScrollView
          className="flex-1 bg-neutral-50 px-5 pt-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="my-4 flex-row items-center justify-between">
            <Text className="text-base font-extrabold tracking-tight text-neutral-900">
              Search Result
            </Text>
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-extrabold"
            >
              28 Results
            </Text>
          </View>

          <View className="gap-4">
            {WORKERS.map((worker) => (
              <WorkerSearchCardRow
                key={worker.id}
                worker={worker}
                onPress={() => openWorkerDetails(worker.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="relative flex-1">
          <SearchWorkerMapView
            WORKERS={WORKERS}
            openWorkerDetails={openWorkerDetails}
          />

          <View className="absolute top-0 w-full">
            <SearchWorkerSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowFilters={setShowFilters}
            />
          </View>
        </View>
      )}

      <SearchWorkerModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        control={control}
      />
    </ScreenWrapper>
  );
}
