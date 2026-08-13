import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { ArrowRight, Bookmark, Clock, MapPin } from "lucide-react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";

const JOB_REQUESTS = [
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
];

export default function JobRequests({
  openWorkerDetails,
  containerStyle,
}: {
  openWorkerDetails: (id: string) => void;
  containerStyle?: ViewStyle;
}) {
  return (
    <View className="mt-8" style={containerStyle}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-950 text-[18px] font-semibold">
          Job Requests
        </Text>
        <ArrowRight size={20} color="#1F2937" />
      </View>

      <View className="gap-4">
        {JOB_REQUESTS.map((job) => (
          <View
            key={job.id}
            className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden"
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
                      {job.name}
                    </Text>
                    <Text className="text-neutral-500 text-sm">{job.role}</Text>
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
                    {job.location}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={14} color="#737373" />
                  <Text className="text-neutral-500 text-xs">
                    {job.availability}
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
                  {job.badge}
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => openWorkerDetails(job.id)}
                  activeOpacity={0.9}
                >
                  <Text className="min-w-20 text-neutral-700 text-xs font-medium">
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-900 px-4 py-2 rounded-md active:opacity-90">
                  <Text className="text-white text-xs font-medium">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
