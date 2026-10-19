import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter, useSegments } from "expo-router";
import { DEFAULT_USER_ROLE, Routes, type UserRole } from "@/constants/Routes";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useGetEmployerProfileQuery } from "@/store/api/employerProfileApi";
import { useGetWorkerProfileQuery } from "@/store/api/workerProfileApi";
import ProfileAvatar from "../common/ProfileAvatar";
import { useGetUnseenCountQuery } from "@/store/api/notificationApi";
import NotificationIcon from "../common/NotificationIcon";

export default function ScreenHeader() {
  const router = useRouter();
  const segments = useSegments();
  const routeSegments = segments as string[];

  const { data: workerProfile } = useGetWorkerProfileQuery();
  const { data: employerProfile } = useGetEmployerProfileQuery();

  const profile = workerProfile?.data || employerProfile?.data;

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
          <ProfileAvatar
            uri={profile?.profile?.image}
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderColor: "#ffffff4d",
            }}
          />
        </Pressable>

        <View className="-mb-3">
          <LogoWhite size={{ width: "124", height: "84" }} />
        </View>

        {/* Notification Icon */}
        <NotificationIcon />
      </View>
    </View>
  );
}
