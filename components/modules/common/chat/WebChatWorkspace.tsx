import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Paperclip,
  Search,
  Send,
} from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import { useChatSocket } from "@/hooks/useChatSocket";
import {
  useGetChatMessagesQuery,
  useGetChatsQuery,
  useMarkChatReadMutation,
  useSendChatMessageMutation,
} from "@/store/api/chatApi";
import type { ChatMessage } from "@/store/api/chatApi";
import type { RootState } from "@/store/store";
import type { ChatOrigin } from "@/types";
import { getAuthIdFromToken, toBubbleMessage, toThread } from "@/utils/chat";
import {
  CONTACT_DETAILS_MESSAGE,
  containsContactDetails,
} from "@/utils/chatContactFilter";
import { ChatAvatar, MessageBubble, ThreadRow } from "./_ui";

type SocketAck = {
  success?: boolean;
  data?: ChatMessage;
  message?: string;
};

export default function WebChatWorkspace({
  origin,
  jobId,
}: {
  origin: ChatOrigin;
  jobId?: string;
}) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentAuthId = useMemo(() => getAuthIdFromToken(token), [token]);
  const chatsQuery = useGetChatsQuery({ page: 1, limit: 30 });
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const messagesScrollRef = useRef<ScrollView | null>(null);
  const socketRef = useChatSocket(token);
  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();

  const threads = useMemo(
    () =>
      (chatsQuery.data ?? []).map((conversation, index) =>
        toThread(conversation, index),
      ),
    [chatsQuery.data],
  );

  useEffect(() => {
    if (jobId) {
      const matchingConversation = chatsQuery.data?.find(
        (conversation) => conversation.job?.id === jobId,
      );
      if (
        matchingConversation &&
        selectedThreadId !== matchingConversation.id
      ) {
        setSelectedThreadId(matchingConversation.id);
      }
      return;
    }

    if (!selectedThreadId && threads[0]?.id) {
      setSelectedThreadId(threads[0].id);
    }
  }, [chatsQuery.data, jobId, selectedThreadId, threads]);

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;

    return threads.filter((thread) =>
      [thread.name, thread.role, thread.job, thread.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery, threads]);

  const selectedThread =
    threads.find((thread) => thread.id === selectedThreadId) ??
    filteredThreads[0] ??
    threads[0];

  const messagesQuery = useGetChatMessagesQuery(
    { conversationId: selectedThread?.id ?? "", page: 1, limit: 50 },
    { skip: !selectedThread?.id },
  );

  const messages = useMemo(
    () =>
      (messagesQuery.data ?? []).map((message) =>
        toBubbleMessage(message, currentAuthId),
      ),
    [currentAuthId, messagesQuery.data],
  );

  useEffect(() => {
    if (!selectedThread?.id) return;

    void markChatRead(selectedThread.id);
    socketRef.current?.emit("message:read", {
      conversationId: selectedThread.id,
    });
  }, [markChatRead, selectedThread?.id, socketRef]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const refreshChats = (message?: ChatMessage) => {
      void chatsQuery.refetch();

      if (
        !message?.conversationId ||
        message.conversationId === selectedThread?.id
      ) {
        void messagesQuery.refetch();
      }
    };

    socket.on("message:received", refreshChats);
    socket.on("message:sent", refreshChats);
    socket.on("message:read", refreshChats);

    return () => {
      socket.off("message:received", refreshChats);
      socket.off("message:sent", refreshChats);
      socket.off("message:read", refreshChats);
    };
  }, [chatsQuery, messagesQuery, selectedThread?.id, socketRef]);

  useEffect(() => {
    if (!messages.length) return;

    requestAnimationFrame(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  const openDetailRoute = () => {
    if (!selectedThread?.id) return;

    router.push({
      pathname: "/screens/chats/[id]",
      params: { id: selectedThread.id, origin },
    });
  };

  const sendWithSocket = (conversationId: string, content: string) =>
    new Promise<void>((resolve, reject) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        reject(new Error("Socket is not connected."));
        return;
      }

      socket.emit(
        "message:send",
        { conversationId, content },
        (response?: SocketAck) => {
          if (response?.success) {
            resolve();
            return;
          }

          reject(new Error(response?.message ?? "Unable to send message."));
        },
      );
    });

  const handleSend = async () => {
    const content = draft.trim();
    if (!selectedThread?.id || !content || isSending) return;

    if (containsContactDetails(content)) {
      Toast.show({
        type: "error",
        text1: "Contact details blocked",
        text2: CONTACT_DETAILS_MESSAGE,
      });
      return;
    }

    setDraft("");

    try {
      if (socketRef.current?.connected) {
        await sendWithSocket(selectedThread.id, content);
      } else {
        await sendMessage({
          conversationId: selectedThread.id,
          content,
        }).unwrap();
      }

      void messagesQuery.refetch();
      void chatsQuery.refetch();
    } catch (socketError) {
      try {
        await sendMessage({
          conversationId: selectedThread.id,
          content,
        }).unwrap();
        void messagesQuery.refetch();
        void chatsQuery.refetch();
      } catch (restError) {
        setDraft(content);
        console.error("Unable to send chat message:", restError || socketError);
      }
    }
  };

  const browseRoute = origin === "worker" ? "/tabs/jobs" : "/tabs/workers";
  const browseLabel = origin === "worker" ? "Browse jobs" : "Browse workers";
  const emptyMessage =
    origin === "worker"
      ? "Search employers, jobs, or message text."
      : "Search workers, jobs, or message text.";

  return (
    <ScreenWrapper>
      <View className="flex-1 px-6 py-6 md:px-10 xl:px-12">
        <View className="mx-auto flex w-full max-w-7xl flex-1 gap-5">
          <View className="flex-row flex-wrap items-center justify-between gap-4">
            <View>
              <View className="flex-row items-center gap-2">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                  <BriefcaseBusiness size={17} color={Colors.common.BRAND} />
                </View>
                <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                  Messages
                </Text>
              </View>
              <Text className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                Chat with {origin === "worker" ? "employers" : "workers"}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              {/* Back button */}
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.88}
                className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
              >
                <ArrowLeft size={18} color="#111827" />
                <Text className="text-sm font-semibold text-neutral-900">
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push(browseRoute as any)}
                activeOpacity={0.88}
                className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3"
              >
                <Text className="text-sm font-semibold text-white">
                  {browseLabel}
                </Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="min-h-[680px] flex-1 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
            <View className="flex-1 flex-col lg:flex-row">
              <View className="w-full border-b border-neutral-200 bg-neutral-50 p-4 lg:w-[390px] lg:border-b-0 lg:border-r">
                <View>
                  <Text className="text-lg font-semibold tracking-tight text-neutral-950">
                    Inbox
                  </Text>
                  <Text className="mt-0.5 text-xs font-medium text-neutral-500">
                    {filteredThreads.length} conversations
                  </Text>
                </View>

                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <Search size={18} color="#A3A3A3" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search messages"
                    placeholderTextColor="#A3A3A3"
                    className="flex-1 text-sm text-neutral-900 outline-none"
                  />
                </View>

                <ScrollView
                  className="mt-4"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                >
                  {chatsQuery.isLoading ? (
                    <View className="items-center py-10">
                      <ActivityIndicator color={Colors.common.BRAND} />
                    </View>
                  ) : null}

                  {filteredThreads.map((thread) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      active={thread.id === selectedThread?.id}
                      onPress={() => setSelectedThreadId(thread.id)}
                    />
                  ))}

                  {!chatsQuery.isLoading && filteredThreads.length === 0 ? (
                    <View className="items-center rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
                      <Text className="text-sm font-semibold text-neutral-900">
                        No conversations found
                      </Text>
                      <Text className="mt-2 text-center text-sm leading-6 text-neutral-500">
                        {emptyMessage}
                      </Text>
                    </View>
                  ) : null}
                </ScrollView>
              </View>

              <View className="flex-1 bg-white">
                {selectedThread ? (
                  <>
                    <View className="flex-row items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
                      <View className="min-w-0 flex-1 flex-row items-center gap-3">
                        <ChatAvatar thread={selectedThread} />
                        <View className="min-w-0 flex-1">
                          <Text
                            numberOfLines={1}
                            className="text-base font-semibold text-neutral-950"
                          >
                            {selectedThread.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            className="mt-0.5 text-xs font-medium text-neutral-500"
                          >
                            {selectedThread.job}
                          </Text>
                        </View>
                      </View>

                      {/* <TouchableOpacity
                        onPress={openDetailRoute}
                        className="rounded-xl bg-neutral-100 px-3 py-2"
                      >
                        <Text className="text-xs font-bold text-neutral-700">
                          Open
                        </Text>
                      </TouchableOpacity> */}
                    </View>

                    <ScrollView
                      ref={messagesScrollRef}
                      className="flex-1 bg-white px-5 py-5"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
                    >
                      <View className="self-center rounded-full bg-neutral-100 px-3 py-1.5">
                        <Text className="text-xs font-semibold text-neutral-500">
                          {selectedThread.job}
                        </Text>
                      </View>

                      {messagesQuery.isLoading ? (
                        <ActivityIndicator color={Colors.common.BRAND} />
                      ) : null}

                      {!messagesQuery.isLoading && messages.length === 0 ? (
                        <Text className="text-center text-sm font-medium text-neutral-500">
                          No messages yet.
                        </Text>
                      ) : null}

                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                    </ScrollView>

                    <View className="border-t border-neutral-200 bg-white p-4">
                      <View className="flex-row items-center gap-3 rounded-[24px] border border-neutral-200 bg-neutral-50 px-4 py-3">
                        {/* <TouchableOpacity
                          activeOpacity={0.85}
                          className="h-10 w-10 items-center justify-center rounded-full bg-white"
                        >
                          <Paperclip size={18} color="#525252" />
                        </TouchableOpacity> */}

                        <TextInput
                          value={draft}
                          onChangeText={setDraft}
                          placeholder="Type a message"
                          placeholderTextColor="#A3A3A3"
                          multiline
                          className="max-h-28 min-h-[40px] flex-1 py-2 text-sm text-neutral-900 outline-none"
                        />

                        <TouchableOpacity
                          onPress={handleSend}
                          disabled={isSending || !draft.trim()}
                          activeOpacity={0.9}
                          style={{ backgroundColor: Colors.common.BRAND }}
                          className="h-10 w-10 items-center justify-center rounded-full disabled:opacity-50"
                        >
                          {isSending ? (
                            <ActivityIndicator color="#FFFFFF" />
                          ) : (
                            <Send size={17} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                      </View>

                      <View className="mt-3 flex-row items-center gap-2">
                        <CheckCircle2 size={14} color="#16A34A" />
                        <Text className="text-xs font-medium text-neutral-500">
                          Messages are linked to the selected job conversation.
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-sm font-semibold text-neutral-500">
                      Select a conversation to start chatting.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
