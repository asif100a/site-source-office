import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ChatHeader from "@/components/modules/common/chat/ChatHeader";
import { MessageBubble } from "@/components/modules/common/chat/_ui";
import { Colors } from "@/constants/Colors";
import { useChatSocket } from "@/hooks/useChatSocket";
import {
  useGetChatMessagesQuery,
  useMarkChatReadMutation,
  useSendChatMessageMutation,
} from "@/store/api/chatApi";
import type { ChatMessage } from "@/store/api/chatApi";
import type { RootState } from "@/store/store";
import { getAuthIdFromToken, toBubbleMessage } from "@/utils/chat";
import {
  CONTACT_DETAILS_MESSAGE,
  containsContactDetails,
} from "@/utils/chatContactFilter";

type SocketAck = {
  success?: boolean;
  data?: ChatMessage;
  message?: string;
};

const normalizeParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default function ChatDetailScreen() {
  const { id, origin } = useLocalSearchParams<{
    id?: string;
    origin?: string;
  }>();
  const conversationId = normalizeParam(id);
  const originRoute = normalizeParam(origin);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentAuthId = useMemo(() => getAuthIdFromToken(token), [token]);
  const socketRef = useChatSocket(token);
  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();

  const messagesQuery = useGetChatMessagesQuery(
    { conversationId: conversationId ?? "", page: 1, limit: 50 },
    { skip: !conversationId },
  );

  const messages = useMemo(
    () =>
      (messagesQuery.data ?? []).map((message) =>
        toBubbleMessage(message, currentAuthId),
      ),
    [currentAuthId, messagesQuery.data],
  );

  useEffect(() => {
    if (!conversationId) return;

    void markChatRead(conversationId);
    socketRef.current?.emit("message:read", { conversationId });
  }, [conversationId, markChatRead, socketRef]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    const refreshMessages = (message?: ChatMessage) => {
      if (!message?.conversationId || message.conversationId === conversationId) {
        void messagesQuery.refetch();
      }
    };

    socket.on("message:received", refreshMessages);
    socket.on("message:sent", refreshMessages);
    socket.on("message:read", refreshMessages);

    return () => {
      socket.off("message:received", refreshMessages);
      socket.off("message:sent", refreshMessages);
      socket.off("message:read", refreshMessages);
    };
  }, [conversationId, messagesQuery, socketRef]);

  useEffect(() => {
    if (!messages.length) return;

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  const sendWithSocket = (content: string) =>
    new Promise<void>((resolve, reject) => {
      const socket = socketRef.current;

      if (!socket?.connected || !conversationId) {
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
    const content = inputText.trim();
    if (!conversationId || !content || isSending) return;

    if (containsContactDetails(content)) {
      Toast.show({
        type: "error",
        text1: "Contact details blocked",
        text2: CONTACT_DETAILS_MESSAGE,
      });
      return;
    }

    setInputText("");

    try {
      if (socketRef.current?.connected) {
        await sendWithSocket(content);
      } else {
        await sendMessage({ conversationId, content }).unwrap();
      }

      void messagesQuery.refetch();
    } catch (socketError) {
      try {
        await sendMessage({ conversationId, content }).unwrap();
        void messagesQuery.refetch();
      } catch (restError) {
        setInputText(content);
        console.error("Unable to send chat message:", restError || socketError);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={[]}>
      <ChatHeader origin={originRoute} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white px-5 pt-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={messagesQuery.isFetching && !messagesQuery.isLoading}
              onRefresh={messagesQuery.refetch}
              tintColor={Colors.common.BRAND}
            />
          }
          contentContainerStyle={{ gap: 14, paddingBottom: 124 }}
        >
          {messagesQuery.isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator color={Colors.common.BRAND} />
            </View>
          ) : null}

          {!conversationId ? (
            <Text className="text-center text-sm font-semibold text-neutral-500">
              Conversation not found.
            </Text>
          ) : null}

          {!messagesQuery.isLoading && conversationId && messages.length === 0 ? (
            <Text className="text-center text-sm font-semibold text-neutral-500">
              No messages yet.
            </Text>
          ) : null}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-neutral-200/80 bg-white px-6 pb-14 pt-4">
          <View className="flex-1 rounded-xl border border-neutral-200/70 bg-neutral-50 px-4 py-0">
            <TextInput
              className="max-h-28 min-h-[44px] py-3 text-sm font-semibold text-neutral-800"
              placeholder="Write here....."
              placeholderTextColor="#A3A3A3"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isSending || !conversationId}
            className="h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 active:opacity-90 disabled:opacity-50"
          >
            {isSending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Send size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
