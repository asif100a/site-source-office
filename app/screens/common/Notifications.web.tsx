import React from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "2",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "3",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "4",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "5",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "6",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
  {
    id: "7",
    title: "New Job Nearby",
    description: "A plumbing job is available within your selected radius.",
    time: "5 hours ago",
  },
];

function NotificationItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <View className="rounded-[22px] border border-neutral-200/80 bg-white px-5 py-4 shadow-sm">
      <View className="flex-row items-start gap-4">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: Colors.common.BRAND }}
        >
          <Bell size={16} color="#FFFFFF" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-sm font-bold text-neutral-900">
              {title}
            </Text>
            <Text className="text-xs font-medium text-neutral-500">{time}</Text>
          </View>

          <Text className="mt-2 text-sm leading-6 text-neutral-500">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function NotificationsWeb() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-5xl gap-6">
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
                        Notifications
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Stay on top of job updates and alerts.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        The same notification content as mobile, arranged in a
                        clearer desktop layout for easier scanning.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 self-start rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 lg:self-auto"
                  >
                    <ArrowLeft size={18} color="#111827" />
                    <Text className="text-sm font-bold text-neutral-900">
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mb-5 flex-row items-center justify-between gap-4">
                <Text className="text-lg font-bold tracking-tight text-neutral-900">
                  Recent notifications
                </Text>
                <Text className="text-sm text-neutral-500">
                  {NOTIFICATIONS.length} items
                </Text>
              </View>

              <View className="gap-3">
                {NOTIFICATIONS.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    title={notification.title}
                    description={notification.description}
                    time={notification.time}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
