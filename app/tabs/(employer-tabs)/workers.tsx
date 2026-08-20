import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  Search,
  SlidersHorizontal,
  Bookmark,
  MapPin,
  Clock,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

const WORKERS = [
  {
    id: "1",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch • 1.2 mi away",
    availability: "Available 8am - 5pm",
    badge: "8 Years Experience",
  },
  {
    id: "2",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch • 1.2 mi away",
    availability: "Available 8am - 5pm",
    badge: "8 Years Experience",
  },
  {
    id: "3",
    name: "Michael Turner",
    role: "Labour",
    location: "Shoreditch • 1.2 mi away",
    availability: "Available 8am - 5pm",
    badge: "8 Years Experience",
  },
];

export default function EmployerWorkersScreen() {
  const router = useRouter();

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleSearchWorkers = () => {
    router.push({
      pathname: "/screens/search/SearchWorker",
      params: { origin: "employer" },
    });
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 110 }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleSearchWorkers}
            activeOpacity={0.9}
            className="flex-1 flex-row items-center bg-white border border-neutral-200/80 rounded-xl px-4 py-3"
          >
            <Search size={18} color="#A3A3A3" className="mr-2" />
            <Text className="flex-1 text-neutral-400 text-sm font-medium">
              Search workers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearchWorkers}
            className="w-12 h-12 bg-white border border-neutral-200/80 rounded-xl items-center justify-center active:opacity-85"
          >
            <SlidersHorizontal size={18} color="#333333" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-4 mb-4">
          <Text className="text-neutral-950 text-[18px] font-semibold">
            Search Result
          </Text>
          <View className="bg-orange-50 px-2.5 py-1.5 rounded-md">
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-xs font-medium"
            >
              28 Results
            </Text>
          </View>
        </View>

        <View className="gap-4">
          {WORKERS.map((worker) => (
            <View
              key={worker.id}
              className="bg-white rounded-xl overflow-hidden"
            >
              <View className="px-4 pt-4 pb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center gap-3 flex-1 pr-3">
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
                      }}
                      className="w-11 h-11 rounded-full"
                    />
                    <View className="flex-1">
                      <Text className="text-neutral-950 text-base font-bold">
                        {worker.name}
                      </Text>
                      <Text className="text-neutral-500 text-sm">
                        {worker.role}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity className="p-1.5">
                    <Bookmark size={20} color="#737373" />
                  </TouchableOpacity>
                </View>

                <View className="pt-4 mt-4 border-t border-neutral-100 gap-2.5">
                  <View className="flex-row items-center gap-2">
                    <MapPin size={14} color="#C81E1E" />
                    <Text className="text-neutral-500 text-xs">
                      {worker.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Clock size={14} color="#737373" />
                    <Text className="text-neutral-500 text-xs">
                      {worker.availability}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between px-4 pb-4">
                <View className="bg-orange-50 px-3 py-1.5 rounded-md">
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
                    <Text
                      className="text-neutral-700 text-xs font-medium"
                      numberOfLines={1}
                    >
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-slate-900 px-4 py-2 rounded-md active:opacity-90"
                    style={{ minWidth: 92, flexShrink: 0 }}
                  >
                    <Text
                      className="text-white text-xs font-medium text-center"
                      numberOfLines={1}
                    >
                      Send Offer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
