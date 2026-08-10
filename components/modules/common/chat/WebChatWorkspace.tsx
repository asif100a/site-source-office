import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
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

type ChatOrigin = "worker" | "employer";

type Message = {
  id: string;
  body: string;
  time: string;
  mine: boolean;
};

type ChatThread = {
  id: string;
  name: string;
  role: string;
  job: string;
  status: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  messages: Message[];
};

const WORKER_THREADS: ChatThread[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    role: "Hiring manager",
    job: "Carpenter - Brixton Builders",
    status: "Online",
    lastMessage: "Can you confirm your availability for tomorrow morning?",
    time: "4:30 PM",
    unread: true,
    initials: "SM",
    avatarBg: "#E0F2FE",
    avatarColor: "#0369A1",
    messages: [
      {
        id: "1",
        body: "Hi, thanks for applying for the carpenter role in Brixton.",
        time: "4:08 PM",
        mine: false,
      },
      {
        id: "2",
        body: "Thanks Sarah. I am available and can start this week.",
        time: "4:16 PM",
        mine: true,
      },
      {
        id: "3",
        body: "Can you confirm your availability for tomorrow morning?",
        time: "4:30 PM",
        mine: false,
      },
    ],
  },
  {
    id: "james-1",
    name: "James Thornton",
    role: "Site supervisor",
    job: "Labourer - Shoreditch Site Services",
    status: "Last seen 12 min ago",
    lastMessage: "Please bring your right-to-work documents to site.",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#FEE2E2",
    avatarColor: "#B91C1C",
    messages: [
      {
        id: "1",
        body: "Your shift is confirmed for 8:00 AM at the Shoreditch site.",
        time: "2:40 PM",
        mine: false,
      },
      {
        id: "2",
        body: "Confirmed. I will arrive 15 minutes early.",
        time: "2:44 PM",
        mine: true,
      },
      {
        id: "3",
        body: "Please bring your right-to-work documents to site.",
        time: "3:15 PM",
        mine: false,
      },
    ],
  },
  {
    id: "james-2",
    name: "James Thornton",
    role: "Project coordinator",
    job: "Painter - Camden Fitout",
    status: "Offline",
    lastMessage: "The client has approved the revised start time.",
    time: "1:10 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#F3E8FF",
    avatarColor: "#6B21A8",
    messages: [
      {
        id: "1",
        body: "The client has approved the revised start time.",
        time: "1:10 PM",
        mine: false,
      },
    ],
  },
];

const EMPLOYER_THREADS: ChatThread[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    role: "Labourer",
    job: "Warehouse shift - Shoreditch",
    status: "Online",
    lastMessage: "I can start tomorrow and have the required documents ready.",
    time: "4:30 PM",
    unread: true,
    initials: "SM",
    avatarBg: "#E0F2FE",
    avatarColor: "#0369A1",
    messages: [
      {
        id: "1",
        body: "Hi Sarah, are you available for the Shoreditch shift tomorrow?",
        time: "4:05 PM",
        mine: true,
      },
      {
        id: "2",
        body: "Yes, I can start tomorrow and have the required documents ready.",
        time: "4:30 PM",
        mine: false,
      },
    ],
  },
  {
    id: "james-1",
    name: "James Thornton",
    role: "Electrician",
    job: "Site maintenance - Waterloo",
    status: "Last seen 8 min ago",
    lastMessage: "I have reviewed the job notes and can cover the full shift.",
    time: "3:15 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#FEE2E2",
    avatarColor: "#B91C1C",
    messages: [
      {
        id: "1",
        body: "Can you cover the full maintenance shift on Friday?",
        time: "2:55 PM",
        mine: true,
      },
      {
        id: "2",
        body: "I have reviewed the job notes and can cover the full shift.",
        time: "3:15 PM",
        mine: false,
      },
    ],
  },
  {
    id: "james-2",
    name: "James Thornton",
    role: "Painter",
    job: "Interior finish - Camden",
    status: "Offline",
    lastMessage: "Please send the site address when it is confirmed.",
    time: "12:40 PM",
    unread: false,
    initials: "JT",
    avatarBg: "#F3E8FF",
    avatarColor: "#6B21A8",
    messages: [
      {
        id: "1",
        body: "Please send the site address when it is confirmed.",
        time: "12:40 PM",
        mine: false,
      },
    ],
  },
];

function ChatAvatar({ thread }: { thread: ChatThread }) {
  return (
    <View
      style={{ backgroundColor: thread.avatarBg }}
      className="h-11 w-11 items-center justify-center rounded-full border border-neutral-100"
    >
      <Text style={{ color: thread.avatarColor }} className="text-sm font-bold">
        {thread.initials}
      </Text>
    </View>
  );
}

function ThreadRow({
  thread,
  active,
  onPress,
}: {
  thread: ChatThread;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className={`rounded-2xl border px-4 py-3.5 ${
        active ? "border-gray-300 bg-neutral-50" : "border-transparent bg-white"
      }`}
    >
      <View className="flex-row gap-3">
        <ChatAvatar thread={thread} />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <View className="flex-row items-center gap-2">
                <Text numberOfLines={1} className="text-sm font-bold text-neutral-950">
                  {thread.name}
                </Text>
                {thread.unread ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-[#FF5500]" />
                ) : null}
              </View>
              <Text numberOfLines={1} className="mt-0.5 text-xs font-medium text-neutral-500">
                {thread.job}
              </Text>
            </View>
            <Text className="text-xs font-semibold text-neutral-400">
              {thread.time}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={thread.unread ? { color: Colors.common.BRAND } : undefined}
            className={`mt-2 text-xs leading-5 ${
              thread.unread ? "font-semibold" : "font-medium text-neutral-500"
            }`}
          >
            {thread.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <View className={`flex-row ${message.mine ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[78%] rounded-2xl px-4 py-3 ${
          message.mine ? "bg-neutral-950" : "bg-neutral-100"
        }`}
      >
        <Text
          className={`text-sm leading-6 ${
            message.mine ? "text-white" : "text-neutral-800"
          }`}
        >
          {message.body}
        </Text>
        <Text
          className={`mt-2 text-[11px] font-medium ${
            message.mine ? "text-white/60" : "text-neutral-400"
          }`}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}

export default function WebChatWorkspace({
  origin,
}: {
  origin: ChatOrigin;
}) {
  const router = useRouter();
  const threads = origin === "worker" ? WORKER_THREADS : EMPLOYER_THREADS;
  const [selectedThreadId, setSelectedThreadId] = useState(threads[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return threads;
    }

    return threads.filter((thread) =>
      [thread.name, thread.role, thread.job, thread.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery, threads]);

  const selectedThread =
    filteredThreads.find((thread) => thread.id === selectedThreadId) ??
    filteredThreads[0] ??
    threads[0];

  const openDetailRoute = () => {
    router.push({
      pathname: "/screens/chats/[id]",
      params: { id: selectedThread.id, origin },
    });
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
                <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
                  Messages
                </Text>
              </View>
              <Text className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
                Chat with {origin === "worker" ? "employers" : "workers"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(browseRoute as any)}
              activeOpacity={0.88}
              className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3"
            >
              <Text className="text-sm font-semibold text-white">{browseLabel}</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="min-h-[680px] flex-1 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
            <View className="flex-1 flex-col lg:flex-row">
              <View className="w-full border-b border-neutral-200 bg-neutral-50 p-4 lg:w-[390px] lg:border-b-0 lg:border-r">
                <View className="flex-row items-center justify-between gap-3">
                  <View>
                    <Text className="text-lg font-black tracking-tight text-neutral-950">
                      Inbox
                    </Text>
                    <Text className="mt-0.5 text-xs font-medium text-neutral-500">
                      {filteredThreads.length} conversations
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white"
                  >
                    <MoreHorizontal size={18} color="#525252" />
                  </TouchableOpacity>
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
                  {filteredThreads.map((thread) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      active={thread.id === selectedThread.id}
                      onPress={() => setSelectedThreadId(thread.id)}
                    />
                  ))}

                  {filteredThreads.length === 0 ? (
                    <View className="items-center rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
                      <Text className="text-sm font-bold text-neutral-900">
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
                <View className="flex-row items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
                  <View className="flex-row min-w-0 flex-1 items-center gap-3">
                    <ChatAvatar thread={selectedThread} />
                    <View className="min-w-0 flex-1">
                      <Text numberOfLines={1} className="text-base font-black text-neutral-950">
                        {selectedThread.name}
                      </Text>
                      <Text numberOfLines={1} className="mt-0.5 text-xs font-medium text-neutral-500">
                        {selectedThread.role} - {selectedThread.status}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={openDetailRoute}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5"
                  >
                    <Text className="text-sm font-semibold text-neutral-900">
                      Details
                    </Text>
                    <ArrowRight size={15} color="#737373" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  className="flex-1 bg-white px-5 py-5"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
                >
                  <View className="self-center rounded-full bg-neutral-100 px-3 py-1.5">
                    <Text className="text-xs font-semibold text-neutral-500">
                      {selectedThread.job}
                    </Text>
                  </View>

                  {selectedThread.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </ScrollView>

                <View className="border-t border-neutral-200 bg-white p-4">
                  <View className="flex-row items-end gap-3 rounded-[24px] border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    >
                      <Paperclip size={18} color="#525252" />
                    </TouchableOpacity>

                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder="Type a message"
                      placeholderTextColor="#A3A3A3"
                      multiline
                      className="max-h-28 min-h-[40px] flex-1 py-2 text-sm text-neutral-900 outline-none"
                    />

                    <TouchableOpacity
                      onPress={() => setDraft("")}
                      activeOpacity={0.9}
                      style={{ backgroundColor: Colors.common.BRAND }}
                      className="h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Send size={17} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-3 flex-row items-center gap-2">
                    <CheckCircle2 size={14} color="#16A34A" />
                    <Text className="text-xs font-medium text-neutral-500">
                      Messages are linked to the selected job conversation.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
