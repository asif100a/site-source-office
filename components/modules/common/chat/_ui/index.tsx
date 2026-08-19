import { Colors } from "@/constants/Colors";
import { ChatThread, Message } from "@/types";
import { Text, TouchableOpacity, View } from "react-native";

export function ChatAvatar({ thread }: { thread: ChatThread }) {
  return (
    <View
      style={{ backgroundColor: thread.avatarBg }}
      className="h-11 w-11 items-center justify-center rounded-full border border-neutral-100"
    >
      <Text style={{ color: thread.avatarColor }} className="text-sm font-semibold">
        {thread.initials}
      </Text>
    </View>
  );
}

export function ThreadRow({
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
                <Text numberOfLines={1} className="text-sm font-semibold text-neutral-950">
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

export function MessageBubble({ message }: { message: Message }) {
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