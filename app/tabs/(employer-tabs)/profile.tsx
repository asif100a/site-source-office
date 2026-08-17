import React, { useState, type ComponentType } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Clock,
  Lock,
  AlertCircle,
  Star,
  BellRing,
  FileText,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronRight,
  Copy,
  MessageSquareText,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import StandardToggle from "@/components/standard_ui/StandardToggle";

type MenuItem = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress?: () => void;
  type?: "switch";
};

export default function ProfileScreen() {
  const router = useRouter();
  const [available, setAvailable] = useState(true);

  const menuItems: { account: MenuItem[]; more: MenuItem[] } = {
    account: [
      {
        icon: User,
        label: "Profile",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/edit",
            params: { origin: "employer" },
          }),
      },
      // { icon: Clock, label: "Available time", type: "switch" },
      {
        icon: Lock,
        label: "Change Password",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/change-password",
            params: { origin: "employer" },
          }),
      },
      {
        icon: AlertCircle,
        label: "Support",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/disputes",
            params: { origin: "employer" },
          }),
      },
      {
        icon: Star,
        label: "Rating & Feedback",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/rating-feedback",
            params: { origin: "employer" },
          }),
      },
      {
        icon: Copy,
        label: "Saved Workers",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/saved-workers",
            params: { origin: "employer" },
          }),
      },
      {
        icon: BellRing,
        label: "Notification Settings",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/notification-settings",
            params: { origin: "employer" },
          }),
      },
      {
        icon: MessageSquareText,
        label: "Chats",
        onPress: () =>
          router.push({
            pathname: "/screens/chats/chats",
            params: { origin: "employer" },
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
            params: { origin: "employer" },
          }),
      },
      {
        icon: HelpCircle,
        label: "Privacy Policy",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/privacy-policy",
            params: { origin: "employer" },
          }),
      },
      {
        icon: MessageSquare,
        label: "Contact Site Source",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/contact",
            params: { origin: "employer" },
          }),
      },
      {
        icon: LogOut,
        label: "Log out",
        onPress: () => {
          return router.replace("/screens/auth/LoginScreen");
        },
      },
    ],
  };

  return (
    <View className="flex-1 bg-neutral-50">
      {/* Header */}
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Account Section */}
        <View className="mt-8">
          <Text className="text-neutral-900 font-extrabold text-lg tracking-tight mb-4">
            Account
          </Text>
          <View className="bg-white rounded-xl overflow-hidden">
            {menuItems.account.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={
                  item.type === "switch"
                    ? () => setAvailable((value) => !value)
                    : item.onPress
                }
                className="flex-row items-center justify-between px-5 py-4 border-b border-neutral-50 last:border-b-0 active:opacity-70"
              >
                <View className="flex-row items-center gap-3">
                  <item.icon
                    size={20}
                    color={
                      item.label === "Log out" ? Colors.common.BRAND : "#525252"
                    }
                  />
                  <Text className="min-w-[150px] text-neutral-900 font-semibold text-base">
                    {item.label}
                  </Text>
                </View>
                {item.type === "switch" ? (
                  <StandardToggle value={available} />
                ) : (
                  <ChevronRight size={20} color="#737373" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* More Section */}
        <View className="mt-8">
          <Text className="text-neutral-900 font-extrabold text-lg tracking-tight mb-4">
            More
          </Text>
          <View className="bg-white rounded-xl overflow-hidden">
            {menuItems.more.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center justify-between px-5 py-4 border-b border-neutral-50 last:border-b-0 active:opacity-70"
              >
                <View className="flex-row items-center gap-3">
                  <item.icon
                    size={20}
                    color={
                      item.label === "Log out" ? Colors.common.BRAND : "#525252"
                    }
                  />
                  <Text
                    className="min-w-[150px] font-semibold text-base"
                    style={
                      item.label === "Log out"
                        ? { color: Colors.common.BRAND }
                        : { color: "#171717" }
                    }
                  >
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={20} color="#737373" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
