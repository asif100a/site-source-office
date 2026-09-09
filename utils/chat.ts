import { ChatConversation, ChatMessage, ChatUser } from "@/store/api/chatApi";
import { ChatThread, Message } from "@/types";

const AVATAR_COLORS = [
  { bg: "#E0F2FE", text: "#0369A1" },
  { bg: "#FEE2E2", text: "#B91C1C" },
  { bg: "#F3E8FF", text: "#6B21A8" },
  { bg: "#ECFDF5", text: "#047857" },
  { bg: "#FEF3C7", text: "#B45309" },
];

export function getAuthIdFromToken(token?: string | null) {
  try {
    const rawToken = token?.replace(/^Bearer\s+/i, "").trim();
    const payload = rawToken?.split(".")[1];
    if (!payload || typeof globalThis.atob !== "function") return undefined;
    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(
      base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
      "="
    );
    const claims = JSON.parse(globalThis.atob(paddedPayload));

    return (
      claims.authId ??
      claims.userId ??
      claims.id ??
      claims.sub ??
      claims.user?.authId ??
      claims.user?.id
    ) as string | undefined;
  } catch {
    return undefined;
  }
}

export function getChatUserName(user?: ChatUser | null) {
  return (
    user?.profile?.name ??
    user?.workerProfile?.name ??
    user?.employerProfile?.name ??
    user?.email ??
    "Unknown user"
  );
}

export function getChatUserImage(user?: ChatUser | null) {
  return (
    user?.profile?.image ??
    user?.workerProfile?.image ??
    user?.employerProfile?.image ??
    undefined
  );
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function formatChatTime(date?: string) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

export function getMessageText(message?: ChatMessage | null) {
  if (!message) return "No messages yet";
  if (message.content?.trim()) return message.content;
  if (message.image) return "Image";
  return "Message";
}

export function toThread(conversation: ChatConversation, index: number): ChatThread {
  const name = getChatUserName(conversation.otherUser);
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return {
    id: conversation.id,
    name,
    role: conversation.otherUser?.email ?? "Conversation",
    job: conversation.job?.title ?? "Job conversation",
    status: conversation.unreadCount ? `${conversation.unreadCount} unread` : "Active",
    lastMessage: getMessageText(conversation.lastMessage),
    time: formatChatTime(conversation.lastMessage?.createdAt ?? conversation.updatedAt),
    unread: Boolean(conversation.unreadCount),
    unreadCount: conversation.unreadCount ?? 0,
    initials: getInitials(name),
    avatarBg: colors.bg,
    avatarColor: colors.text,
    avatar: getChatUserImage(conversation.otherUser),
    messages: [],
  };
}

export function toBubbleMessage(message: ChatMessage, currentAuthId?: string): Message {
  return {
    id: message.id,
    body: getMessageText(message),
    image: message.image ?? undefined,
    time: formatChatTime(message.createdAt),
    mine: Boolean(currentAuthId && message.senderAuthId === currentAuthId),
    hasRead: message.hasRead,
    readAt: message.readAt,
  };
}
