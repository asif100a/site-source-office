import React from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, Trash2 } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import {
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllAsDoneNotificationsMutation,
} from "@/store/api/notificationApi";
import Toast from "react-native-toast-message";

type Notification = {
  id?: string;
  _id?: string;
  title?: string;
  message?: string;
  description?: string;
  body?: string;
  createdAt?: string;
  time?: string;
  isRead?: boolean;
  read?: boolean;
};

const getNotificationId = (notification: Notification) =>
  String(notification.id ?? notification._id ?? "");

const getResponseData = (response: any) => response?.data?.data ?? response?.data;

const getNotifications = (response: any): Notification[] => {
  const data = getResponseData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.notifications)) return data.notifications;

  return [];
};

const formatNotificationTime = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function NotificationItem({
  title,
  description,
  time,
  isRead,
  onDelete,
  isDeleting,
}: {
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <View className="rounded-[22px] border border-neutral-200/80 bg-white px-5 py-4 shadow-sm">
      <View className="flex-row items-start gap-4">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: isRead ? "#CBD5E1" : Colors.common.BRAND }}
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

        <TouchableOpacity
          disabled={isDeleting}
          onPress={onDelete}
          className="h-9 w-9 items-center justify-center rounded-full bg-neutral-50 active:opacity-70 disabled:opacity-50"
        >
          <Trash2 size={16} color="#737373" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NotificationsWeb() {
  const router = useRouter();
  const notificationsQuery = useGetNotificationsQuery({ page: 1, limit: 50 });
  const [markAllAsDone, { isLoading: isMarkingAll }] =
    useMarkAllAsDoneNotificationsMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteSingleNotificationMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationMutation();
  const notifications = getNotifications(notificationsQuery.data);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsDone(null).unwrap();
      Toast.show({ type: "success", text1: "Notifications marked as read" });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: (error as any)?.data?.message ?? "Please try again.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ id }).unwrap();
      Toast.show({ type: "success", text1: "Notification deleted" });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: (error as any)?.data?.message ?? "Please try again.",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(null).unwrap();
      Toast.show({ type: "success", text1: "Notifications deleted" });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: (error as any)?.data?.message ?? "Please try again.",
      });
    }
  };

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
                    disabled={notificationsQuery.isFetching}
                    onPress={() => void notificationsQuery.refetch()}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 self-start rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 lg:self-auto"
                  >
                    <Text className="text-sm font-bold text-neutral-900">
                      {notificationsQuery.isFetching ? "Refreshing..." : "Refresh"}
                    </Text>
                  </TouchableOpacity>

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
                  {notifications.length} items
                </Text>
              </View>

              <View className="mb-4 flex-row flex-wrap gap-2">
                <TouchableOpacity
                  disabled={isMarkingAll || notifications.length === 0}
                  onPress={() => void handleMarkAllAsRead()}
                  className="rounded-xl bg-neutral-950 px-4 py-3 disabled:opacity-50"
                >
                  <Text className="text-xs font-bold text-white">
                    {isMarkingAll ? "Updating..." : "Mark all as read"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isDeletingAll || notifications.length === 0}
                  onPress={() => void handleDeleteAll()}
                  className="rounded-xl bg-red-600 px-4 py-3 disabled:opacity-50"
                >
                  <Text className="text-xs font-bold text-white">
                    {isDeletingAll ? "Deleting..." : "Delete all"}
                  </Text>
                </TouchableOpacity>
              </View>

              {notificationsQuery.isLoading ? (
                <Text className="rounded-2xl bg-neutral-50 p-5 text-center text-sm font-semibold text-neutral-500">
                  Loading notifications...
                </Text>
              ) : null}

              {notificationsQuery.isError ? (
                <Text className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-700">
                  Unable to load notifications. Please try again.
                </Text>
              ) : null}

              {!notificationsQuery.isLoading &&
              !notificationsQuery.isError &&
              notifications.length === 0 ? (
                <Text className="rounded-2xl bg-neutral-50 p-5 text-center text-sm font-semibold text-neutral-500">
                  No notifications yet.
                </Text>
              ) : null}

              <View className="gap-3">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={getNotificationId(notification)}
                    title={notification.title ?? "Notification"}
                    description={
                      notification.description ??
                      notification.message ??
                      notification.body ??
                      ""
                    }
                    time={notification.time ?? formatNotificationTime(notification.createdAt)}
                    isRead={Boolean(notification.isRead ?? notification.read)}
                    isDeleting={isDeleting}
                    onDelete={() => void handleDelete(getNotificationId(notification))}
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
