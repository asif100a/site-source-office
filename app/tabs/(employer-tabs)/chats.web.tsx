import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Headphones,
  MessageSquareMore,
  Search,
  Send,
  UsersRound,
  Clock3,
  Star,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  status: string;
};

const MOCK_CHATS: ChatItem[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    lastMessage: "You: Did you see the proposal? I ma...",
    time: "4:30 PM",
    unread: true,
    initials: "SM",
    avatarBg: "#E0F2FE",
    avatarColor: "#0369A1",
    status: "Awaiting your reply",
  },
  {
    id: "james-1",
    name: "James Thornton",
    lastMessage: "James: Let's grab coffee tomorrow,...",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#FEE2E2",
    avatarColor: "#B91C1C",
    status: "Recent conversation",
  },
  {
    id: "james-2",
    name: "James Thornton",
    lastMessage: "James: Let's grab coffee tomorrow,...",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#F3E8FF",
    avatarColor: "#6B21A8",
    status: "Interview details",
  },
  {
    id: "james-3",
    name: "James Thornton",
    lastMessage: "James: Let's grab coffee tomorrow,...",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#ECFDF5",
    avatarColor: "#047857",
    status: "Shift update",
  },
  {
    id: "james-4",
    name: "James Thornton",
    lastMessage: "James: Let's grab coffee tomorrow,...",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#FEF3C7",
    avatarColor: "#B45309",
    status: "Support follow-up",
  },
  {
    id: "james-5",
    name: "James Thornton",
    lastMessage: "James: Let's grab coffee tomorrow,...",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#F1F5F9",
    avatarColor: "#475569",
    status: "Pending review",
  },
];

const SUMMARY = [
  {
    id: "unread",
    label: "Unread",
    value: "1",
    note: "Needs response",
    icon: <MessageSquareMore size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "response",
    label: "Avg. reply",
    value: "12 min",
    note: "Today",
    icon: <Clock3 size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "threads",
    label: "Open threads",
    value: "6",
    note: "Across jobs",
    icon: <UsersRound size={18} color={Colors.common.BRAND} />,
  },
  {
    id: "rating",
    label: "Conversation rating",
    value: "4.9/5",
    note: "From recent feedback",
    icon: <Star size={18} color={Colors.common.BRAND} />,
  },
];

function SummaryCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-1 min-w-[180px] rounded-[22px] border border-neutral-200 bg-white p-4">
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

function ChatRow({
  chat,
  active,
  onPress,
}: {
  chat: ChatItem;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className={`rounded-[22px] border px-4 py-4 ${active ? "border-neutral-950 bg-neutral-50" : "border-neutral-200 bg-white"}`}
    >
      <View className="flex-row items-start gap-4">
        <View
          style={{ backgroundColor: chat.avatarBg }}
          className="h-12 w-12 items-center justify-center rounded-full border border-neutral-100"
        >
          <Text style={{ color: chat.avatarColor }} className="text-sm font-bold">
            {chat.initials}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-extrabold text-neutral-950">
                  {chat.name}
                </Text>
                {chat.unread ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-[#FF5500]" />
                ) : null}
              </View>
              <Text className="mt-1 text-xs font-medium text-neutral-500">
                {chat.status}
              </Text>
            </View>

            <Text className="text-xs font-semibold text-neutral-400">
              {chat.time}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={chat.unread ? { color: Colors.common.BRAND } : undefined}
            className={`mt-3 text-xs font-semibold ${chat.unread ? "" : "text-neutral-400"}`}
          >
            {chat.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EmployerChatsScreenWeb() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("sarah");

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return MOCK_CHATS;
    }

    return MOCK_CHATS.filter((chat) => {
      return (
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query) ||
        chat.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const selectedChat =
    filteredChats.find((chat) => chat.id === selectedChatId) ??
    filteredChats[0] ??
    MOCK_CHATS[0];

  const openChat = (id: string) => {
    router.push({
      pathname: "/screens/chats/[id]",
      params: { id, origin: "employer" },
    });
  };

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-10">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <View className="flex-col xl:flex-row">
                <View className="flex-1 p-6 md:p-8 xl:p-10">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <MessageSquareMore size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Chats
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        1 unread thread
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      Keep every worker conversation in one place.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review conversations, jump into active threads, and open the
                      shared chat detail screen when you need the full exchange.
                    </Text>
                  </View>

                  <View className="mt-6 flex-row flex-wrap gap-3">
                    <TouchableOpacity
                      onPress={() => router.push("/tabs/workers" as any)}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                    >
                      <Send size={18} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Browse workers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openChat(selectedChat?.id ?? "sarah")}
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                    >
                      <ArrowRight size={18} color="#111827" />
                      <Text className="text-sm font-semibold text-neutral-900">
                        Open chat
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {SUMMARY.map((item) => (
                      <SummaryCard
                        key={item.id}
                        label={item.label}
                        value={item.value}
                        note={item.note}
                        icon={item.icon}
                      />
                    ))}
                  </View>
                </View>

                <View className="w-full xl:w-[410px] border-t xl:border-t-0 xl:border-l border-neutral-200 bg-neutral-50 p-6 md:p-8">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Search chats
                    </Text>

                    <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <Search size={18} color="#A3A3A3" />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search chats"
                        placeholderTextColor="#A3A3A3"
                        className="flex-1 text-sm text-neutral-900 outline-none"
                      />
                    </View>

                    <View className="mt-5 rounded-2xl bg-orange-50 p-4">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Quick note
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-neutral-700">
                        Keep the inbox narrow and focused, then jump into the
                        shared detail route for the full conversation.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.05] gap-4">
                <View className="flex-row items-center justify-between gap-3">
                  <View>
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                      Inbox
                    </Text>
                    <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                      {filteredChats.length} conversations
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-neutral-900">
                      Sort by recent
                    </Text>
                    <ArrowRight size={16} color="#737373" />
                  </TouchableOpacity>
                </View>

                <View className="gap-3">
                  {filteredChats.map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      active={chat.id === selectedChat?.id}
                      onPress={() => setSelectedChatId(chat.id)}
                    />
                  ))}

                  {filteredChats.length === 0 ? (
                    <View className="items-center rounded-[24px] border border-dashed border-neutral-300 bg-white px-6 py-10">
                      <Text className="text-base font-bold text-neutral-900">
                        No chats found
                      </Text>
                      <Text className="mt-2 max-w-md text-center text-sm text-neutral-500">
                        Try a different search term or clear the current filter.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                        Selected thread
                      </Text>
                      <Text className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                        {selectedChat?.name ?? "No chat selected"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => openChat(selectedChat?.id ?? "sarah")}
                      activeOpacity={0.9}
                      className="flex-row items-center gap-1.5 rounded-2xl bg-neutral-950 px-4 py-3"
                    >
                      <Text className="text-sm font-semibold text-white">
                        Open
                      </Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-5 rounded-2xl bg-neutral-50 p-4">
                    <Text className="text-sm font-semibold text-neutral-900">
                      {selectedChat?.lastMessage}
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-neutral-600">
                      The web inbox keeps the thread list visible so the active
                      conversation never disappears while you scan messages.
                    </Text>
                  </View>

                  <View className="mt-4 gap-3">
                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Reply quickly
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Jump into the detailed chat route when you need to send a
                        full response or review attachments.
                      </Text>
                    </View>

                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Keep context visible
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        The selected thread stays pinned on the right while the
                        inbox remains easy to scan on the left.
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push("/tabs/workers" as any)}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-between rounded-[24px] bg-neutral-950 px-5 py-5"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-white/60">
                      Need help finding workers?
                    </Text>
                    <Text className="mt-2 text-lg font-black tracking-tight text-white">
                      Browse the worker directory
                    </Text>
                  </View>
                  <Headphones size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
