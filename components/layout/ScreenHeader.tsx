import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter, useSegments } from "expo-router";
import { DEFAULT_USER_ROLE, Routes, type UserRole } from "@/constants/Routes";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useGetEmployerProfileQuery } from "@/store/api/employerProfileApi";
import { useGetWorkerProfileQuery } from "@/store/api/workerProfileApi";

export default function ScreenHeader() {
  const router = useRouter();
  const segments = useSegments();
  const routeSegments = segments as string[];

  const { data: workerProfile } = useGetWorkerProfileQuery();
  const { data: employerProfile } = useGetEmployerProfileQuery();

  const profile = workerProfile?.data || employerProfile?.data;
  // console.log("Profile data in ScreenHeader: ", profile);

  const handleNotificationPress = () => {
    router.push(Routes.CommonRoutes.NOTIFICATIONS);
  };

  const role: UserRole = routeSegments.includes("(employer-tabs)")
    ? "employer"
    : routeSegments.includes("(worker-tabs)")
      ? "worker"
      : DEFAULT_USER_ROLE;

  return (
    <View
      style={{ backgroundColor: Colors.common.BRAND }}
      className="px-6 pt-8 pb-3"
    >
      <View className="flex-row items-end justify-between">
        <Pressable
          onPress={() =>
            router.push(
              role === "worker"
                ? Routes.WorkerRoutes.PROFILE_WORKER
                : Routes.EmployerRoutes.PROFILE_EMPLOYER,
            )
          }
          className="active:opacity-75"
        >
          <Image
            source={{
              uri: profile?.profile?.image || undefined,
            }}
            className="w-14 h-14 rounded-full border-2 border-white/30"
          />
        </Pressable>

        <View className="-mb-3">
          <LogoWhite size={{ width: "124", height: "84" }} />
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleNotificationPress}
            className="relative w-12 h-12 rounded-full bg-white/10 items-center justify-center active:opacity-85"
          >
            <Feather name="bell" size={22} color="#FFFFFF" />
            <View className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/15 items-center justify-center border border-white/20">
              <Text className="text-white text-[10px] font-bold">2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
