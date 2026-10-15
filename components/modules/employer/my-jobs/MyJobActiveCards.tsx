import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Briefcase, Calendar, MapPin, MessageCircle, Users } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import AvatarStack from "./_ui/AvatarStack";
import JobLocationLabel from "./JobLocationLabel";

export default function MyJobActiveCards({
  job,
  openJobDetails,
  user,
}: {
  job: any;
  openJobDetails: (id: string) => void;
  user: string;
}) {
  const router = useRouter();

  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
              <Briefcase size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-950 text-base font-bold">
                {job.title}
              </Text>
              <Text className="text-neutral-500 text-sm">{user ?? "User not found"}</Text>
            </View>
          </View>

          <View className="bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md">
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-[10px] font-extrabold"
            >
              {job.badge}
            </Text>
          </View>
        </View>

        <View className="pt-4 mt-4 border-t border-neutral-100 gap-2.5">
          <View className="flex-row items-center gap-2">
            <MapPin size={14} color="#C81E1E" />
            <JobLocationLabel
              location={job.location}
              coordinates={job.coordinates}
            />
          </View>
          <View className="flex-row items-center gap-2">
            <Users size={14} color="#737373" />
            <Text className="text-neutral-500 text-xs">{job.team}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Calendar size={14} color="#737373" />
            <Text className="text-neutral-500 text-xs">{job.duration}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-4 pb-4">
        <View className="flex-row items-center gap-2">
          <AvatarStack applicants={job.applicants} />
          <Text className="text-neutral-500 text-xs font-medium">
            {job.applications ?? "0 Applications"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => openJobDetails(job.id)}
          activeOpacity={0.9}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="px-4 py-2 rounded-md active:opacity-90"
        >
          <Text className="min-w-20 text-white text-xs font-medium">
            View Details
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/chats/chats",
            params: { jobId: job.id, origin: "employer" },
          })
        }
        activeOpacity={0.8}
        className="mx-4 mb-4 flex-row items-center justify-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-4 py-2.5"
      >
        <MessageCircle size={16} color="#C2410C" />
        <Text className="text-xs font-bold text-orange-700">Send message</Text>
      </TouchableOpacity>
    </View>
  );
}
