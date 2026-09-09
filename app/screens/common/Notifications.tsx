import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bell, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/standard_ui/buttons/BackButton";
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
    <View className="bg-white rounded-[18px] px-4 py-4 flex-row items-start border border-neutral-100 shadow-sm">
      <View
        className="w-7 h-7 rounded-full items-center justify-center mt-0.5"
        style={{ backgroundColor: isRead ? "#CBD5E1" : Colors.common.BRAND }}
      >
        <Bell size={14} color="#FFFFFF" />
      </View>

      <View className="flex-1 pr-2 ml-3">
        <View className="flex-row items-start justify-between">
          <Text className="text-neutral-900 text-sm font-semibold flex-1 pr-3">
            {title}
          </Text>
          <Text className="text-neutral-500 text-[11px] font-medium">
            {time}
          </Text>
        </View>
        <Text className="text-neutral-400 text-xs leading-5 mt-1">
          {description}
        </Text>
      </View>
      <TouchableOpacity
        disabled={isDeleting}
        onPress={onDelete}
        className="h-8 w-8 items-center justify-center rounded-full bg-neutral-50 active:opacity-70"
      >
        <Trash2 size={15} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}

export default function Notifications() {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={[]}>
      <View
        style={{ backgroundColor: Colors.common.BRAND }}
        className="px-6 pt-12 pb-3"
      >
        <BackButton />
        <Text className="text-white text-[17px] font-semibold mt-4">
          Notifications
        </Text>
        <View className="mt-3 flex-row gap-2">
          <TouchableOpacity
            disabled={isMarkingAll || notifications.length === 0}
            onPress={() => void handleMarkAllAsRead()}
            className="rounded-full bg-white/15 px-3 py-1.5 active:opacity-75 disabled:opacity-50"
          >
            <Text className="text-xs font-bold text-white">
              {isMarkingAll ? "Updating..." : "Mark all as read"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDeletingAll || notifications.length === 0}
            onPress={() => void handleDeleteAll()}
            className="rounded-full bg-white/15 px-3 py-1.5 active:opacity-75 disabled:opacity-50"
          >
            <Text className="text-xs font-bold text-white">
              {isDeletingAll ? "Deleting..." : "Delete all"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={notificationsQuery.isFetching}
            onRefresh={() => void notificationsQuery.refetch()}
          />
        }
      >
        {notificationsQuery.isLoading ? (
          <ActivityIndicator className="mt-8" color={Colors.common.BRAND} />
        ) : null}

        {notificationsQuery.isError ? (
          <Text className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-700">
            Unable to load notifications. Please try again.
          </Text>
        ) : null}

        {!notificationsQuery.isLoading &&
        !notificationsQuery.isError &&
        notifications.length === 0 ? (
          <Text className="rounded-2xl bg-white p-5 text-center text-sm font-semibold text-neutral-500">
            No notifications yet.
          </Text>
        ) : null}

        <View>
          {notifications.map((notification, index) => (
            <View
              key={getNotificationId(notification)}
              style={{ marginBottom: index === notifications.length - 1 ? 0 : 12 }}
            >
              <NotificationItem
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
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
