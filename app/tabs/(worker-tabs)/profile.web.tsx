import React, { useState, type ComponentType, type ReactNode } from "react";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  BellRing,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Headphones,
  Lock,
  LogOut,
  MessageSquare,
  Star,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import { Colors } from "@/constants/Colors";

type MenuItem = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress?: () => void;
};

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
};

const PROFILE_STATS = [
  {
    id: "completion",
    label: "Profile completion",
    value: "85%",
    note: "Almost there",
    icon: <ShieldCheck size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "rating",
    label: "Worker rating",
    value: "4.9/5",
    note: "18 reviews",
    icon: <Star size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "response",
    label: "Avg. response",
    value: "12 min",
    note: "Fast replies",
    icon: <Clock size={18} color={Colors.common.BRAND} />,
  },
];

function StatCard({ label, value, note, icon }: StatCardProps) {
  return (
    <View className="flex-1 min-w-[170px] rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
          {icon}
        </View>
        <Text className="text-xs font-medium text-emerald-600">{note}</Text>
      </View>
      <Text className="mt-3 text-2xl font-black tracking-tight text-neutral-950">
        {value}
      </Text>
      <Text className="mt-1 text-sm font-medium text-neutral-500">{label}</Text>
    </View>
  );
}

function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-[18px] font-extrabold tracking-tight text-neutral-950">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.8}
          className="flex-row items-center gap-1.5"
        >
          <Text className="text-sm font-medium text-neutral-500">{actionLabel}</Text>
          <ArrowRight size={16} color="#737373" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function WorkerProfileWebScreen() {
  const router = useRouter();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<"form" | "submitted">(
    "form",
  );

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
        icon: MessageSquare,
        label: "Contact Site Source",
        onPress: () =>
          router.push({
            pathname: "/screens/profile/contact",
            params: { origin: "worker" },
          }),
      },
      {
        icon: LogOut,
        label: "Log out",
        onPress: () => {
          router.replace("/screens/auth/LoginScreen");
        },
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
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <View className="flex-col lg:flex-row">
                <View className="flex-1 p-6 md:p-8">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Profile
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        Worker account active
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Manage your worker profile.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Keep your account details, support access, and policy
                      settings organized in one desktop-friendly view.
                    </Text>
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => setShowSupportModal(true)}
                      activeOpacity={0.9}
                      className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Headphones size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Message support
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/screens/profile/edit",
                          params: { origin: "worker" },
                        })
                      }
                      activeOpacity={0.88}
                      className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <User size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Edit profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="w-full justify-center border-t border-neutral-200 bg-neutral-50 p-6 md:p-8 lg:w-[360px] lg:border-l lg:border-t-0">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-6">
                    <View className="flex-row items-center gap-4">
                      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                        <User size={28} color={Colors.common.BRAND} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                          Worker account
                        </Text>
                        <Text className="mt-1 text-xl font-black tracking-tight text-neutral-950">
                          Hafizur Rahman
                        </Text>
                        <Text className="mt-1 text-sm font-medium text-neutral-500">
                          Verified worker profile
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {PROFILE_STATS.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  note={stat.note}
                  icon={stat.icon}
                />
              ))}
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.2] gap-5">
                <SectionTitle title="Account" />
                <View className="rounded-[24px] border border-neutral-200 bg-white overflow-hidden">
                  {menuItems.account.map((item, index) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={item.onPress}
                      className={`flex-row items-center justify-between px-5 py-4 active:opacity-70 ${
                        index !== menuItems.account.length - 1
                          ? "border-b border-neutral-50"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center gap-3">
                        <item.icon
                          size={20}
                          color={
                            item.label === "Log out"
                              ? Colors.common.BRAND
                              : "#525252"
                          }
                        />
                        <Text className="min-w-[150px] text-base font-semibold text-neutral-900">
                          {item.label}
                          </Text>
                        </View>
                      <ChevronRight size={20} color="#737373" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-1 gap-5">
                <SectionTitle
                  title="More"
                  actionLabel="Contact support"
                  onAction={() => setShowSupportModal(true)}
                />
                <View className="rounded-[24px] border border-neutral-200 bg-white overflow-hidden">
                  {menuItems.more.map((item, index) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={item.onPress}
                      className={`flex-row items-center justify-between px-5 py-4 active:opacity-70 ${
                        index !== menuItems.more.length - 1
                          ? "border-b border-neutral-50"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center gap-3">
                        <item.icon
                          size={20}
                          color={
                            item.label === "Log out"
                              ? Colors.common.BRAND
                              : "#525252"
                          }
                        />
                        <Text
                          className="min-w-[150px] text-base font-semibold"
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
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setSupportModalState("form");
          setShowSupportModal(true);
        }}
        style={{ backgroundColor: Colors.common.BRAND }}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full active:opacity-90 z-20"
      >
        <Headphones size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
      />
    </ScreenWrapper>
  );
}
