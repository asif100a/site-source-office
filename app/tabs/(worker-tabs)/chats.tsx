import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { ChatAvatar } from "@/components/modules/common/chat/_ui";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useGetChatsQuery } from "@/store/api/chatApi";
import { RootState } from "@/store/store";
import { toThread } from "@/utils/chat";

export default function WorkerChatsScreen() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const chatsQuery = useGetChatsQuery({ page: 1, limit: 30 });
  console.log("WorkerChatsScreen: chatsQuery = ", chatsQuery);
  const socketRef = useChatSocket(token);

  const threads = useMemo(
    () =>
      (chatsQuery.data ?? []).map((conversation, index) =>
        toThread(conversation, index)
      ),
    [chatsQuery.data]
  );

  useEffect(() => {
    const socket = socketRef.current;
    console.log("WorkerChatsScreen: socketRef.current = ", socket);
    if (!socket) return;

    const refreshChats = () => {
      void chatsQuery.refetch();
    };

    socket.on("message:received", refreshChats);
    socket.on("message:sent", refreshChats);
    socket.on("message:read", refreshChats);

    return () => {
      socket.off("message:received", refreshChats);
      socket.off("message:sent", refreshChats);
      socket.off("message:read", refreshChats);
    };
  }, [chatsQuery, socketRef]);

  const handleOpenChat = (id: string) => {
    router.push({
      pathname: "/screens/chats/[id]",
      params: { id, origin: "worker" },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader />

      <ScrollView
        className="mt-4 flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={chatsQuery.isFetching}
            onRefresh={() => void chatsQuery.refetch()}
            tintColor="#000000"
            colors={["#000000"]}
          />
        }
      >
        {chatsQuery.isLoading ? (
          <View className="py-12">
            <ActivityIndicator color={Colors.common.BRAND} />
          </View>
        ) : null}

        {!chatsQuery.isLoading && threads.length === 0 ? (
          <View className="items-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10">
            <Text className="text-sm font-extrabold text-neutral-900">
              No conversations yet
            </Text>
            <Text className="mt-2 text-center text-xs font-semibold leading-5 text-neutral-500">
              Job conversations will appear here after an accepted application or offer.
            </Text>
          </View>
        ) : null}

        <View className="divide-y divide-neutral-100">
          {threads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              onPress={() => handleOpenChat(thread.id)}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-1 flex-row items-center gap-4">
                <ChatAvatar thread={thread} />

                <View className="flex-1 pr-4">
                  <View className="mb-1 flex-row items-center gap-1.5">
                    <Text
                      className="text-sm font-extrabold text-neutral-900"
                      numberOfLines={1}
                    >
                      {thread.name}
                    </Text>
                    {thread.unread ? (
                      <View className="min-w-[18px] items-center justify-center rounded-full bg-[#FF5500] px-1.5 py-0.5">
                        <Text className="text-[10px] font-bold text-white">
                          {thread.unreadCount && thread.unreadCount > 9
                            ? "9+"
                            : thread.unreadCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    className="mb-1 text-[11px] font-semibold text-neutral-500"
                    numberOfLines={1}
                  >
                    {thread.job}
                  </Text>
                  <Text
                    style={
                      thread.unread ? { color: Colors.common.BRAND } : undefined
                    }
                    className={`text-xs font-semibold ${
                      thread.unread ? "" : "text-neutral-400"
                    }`}
                    numberOfLines={1}
                  >
                    {thread.lastMessage}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-xs font-semibold text-neutral-400">
                  {thread.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
