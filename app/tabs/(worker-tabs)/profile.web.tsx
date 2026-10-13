import React, { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AlertCircle,
  BellRing,
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Star,
  User,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import { clearUserAuthenticated } from "@/constants/authState";
import { logout } from "@/store/slices/authSlice";
import { useGetWorkerProfileQuery } from "@/store/api/workerProfileApi";

type MenuItem = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress?: () => void;
};

function SectionHeading({ title }: { title: string }) {
  return (
    <Text className="text-lg font-bold tracking-tight text-neutral-900">
      {title}
    </Text>
  );
}

function MenuSection({
  items,
  isLoggingOut = false,
}: {
  items: MenuItem[];
  isLoggingOut?: boolean;
}) {
  return (
    <View className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-sm">
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          onPress={item.onPress}
          disabled={item.label === "Log out" && isLoggingOut}
          activeOpacity={0.85}
          className={`flex-row items-center justify-between px-5 py-4 ${
            index !== items.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <View className="flex-row items-center gap-3">
            <item.icon
              size={20}
              color={item.label === "Log out" ? Colors.common.BRAND : "#525252"}
            />
            <Text
              className="min-w-[150px] text-base font-bold"
              style={
                item.label === "Log out"
                  ? { color: Colors.common.BRAND }
                  : { color: "#171717" }
              }
            >
              {item.label === "Log out" && isLoggingOut
                ? "Logging out..."
                : item.label}
            </Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function WorkerProfileWebScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [available] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

    const {
    data: getWorkerProfile,
    isLoading: isWorkerProfileLoading,
    isError: isWorkerProfileError,
    error: workerProfileError,
  } = useGetWorkerProfileQuery(undefined);

  useEffect(() => {
    if (isWorkerProfileError) {
      console.log("workerProfileError: ", workerProfileError);
    }
  }, [
    isWorkerProfileError,
    workerProfileError,
  ]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await Promise.all([
        AsyncStorage.removeItem("token"),
        AsyncStorage.removeItem("otpToken"),
        AsyncStorage.removeItem("forgotToken"),
      ]);
    } catch (error) {
      console.error("Failed to clear all auth storage during logout.", error);
    }

    dispatch(logout());
    clearUserAuthenticated();
    router.replace({
      pathname: "/auth",
      params: { currentStep: "login", role: "worker" },
    });
  };

  const menuItems: { account: MenuItem[]; more: MenuItem[] } = {
    account: [
      {
        icon: User,
        label: "Profile",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/edit",
            params: { origin: "worker" },
          }),
      },
      {
        icon: Lock,
        label: "Change Password",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/change-password",
            params: { origin: "worker" },
          }),
      },
      {
        icon: AlertCircle,
        label: "Support",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/disputes",
            params: { origin: "worker" },
          }),
      },
      {
        icon: Star,
        label: "Rating & Feedback",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/rating-feedback",
            params: { origin: "worker" },
          }),
      },
      {
        icon: BellRing,
        label: "Notification Settings",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/notification-settings",
            params: { origin: "worker" },
          }),
      },
    ],
    more: [
      {
        icon: FileText,
        label: "Terms & Conditions",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/terms",
            params: { origin: "worker" },
          }),
      },
      {
        icon: HelpCircle,
        label: "Privacy Policy",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/privacy-policy",
            params: { origin: "worker" },
          }),
      },
      {
        icon: LogOut,
        label: "Log out",
        onPress: handleLogout,
      },
    ],
  };

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

                <View className="relative flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <View className="max-w-3xl gap-3">
                    <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                      <Text className="text-xs font-bold uppercase text-neutral-900">
                        Profile
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Manage your worker profile from one place.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        The same account and settings flow as mobile, arranged in
                        a cleaner web layout for faster scanning and navigation.
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-[24px] border border-neutral-200/80 bg-white px-5 py-4 shadow-sm">
                   <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
                      {"Worker Account"}
                    </Text>
                    <Text className="mt-2 text-lg font-bold text-neutral-950">
                      {getWorkerProfile?.data?.profile?.name || "User name"}
                    </Text>
                    <Text className="mt-1 text-sm text-neutral-500">
                      {getWorkerProfile?.data?.email|| "Profile inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.15] gap-5">
                <SectionHeading title="Account" />
                <MenuSection items={menuItems.account} />
              </View>

              <View className="flex-1 gap-5">
                <SectionHeading title="More" />
                <MenuSection
                  items={menuItems.more}
                  isLoggingOut={isLoggingOut}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
