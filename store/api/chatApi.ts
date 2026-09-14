import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export type ChatUserProfile = {
  name?: string;
  image?: string | null;
};

export type ChatUser = {
  id?: string;
  authId?: string;
  email?: string;
  profile?: ChatUserProfile | null;
  workerProfile?: ChatUserProfile | null;
  employerProfile?: ChatUserProfile | null;
};

export type ChatJob = {
  id?: string;
  title?: string;
};

export type ChatMessage = {
  id: string;
  conversationId?: string;
  content?: string | null;
  image?: string | null;
  senderAuthId?: string;
  receiverAuthId?: string;
  hasRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
};

export type ChatConversation = {
  id: string;
  job?: ChatJob | null;
  otherUser?: ChatUser | null;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ChatMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

type ChatListResponse = {
  success?: boolean;
  message?: string;
  data?: {
    meta?: ChatMeta;
    chats?: ChatConversation[];
  };
};

type ChatMessagesResponse = {
  success?: boolean;
  message?: string;
  data?: {
    meta?: ChatMeta;
    messages?: ChatMessage[];
  };
};

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<ChatConversation[], { page?: number; limit?: number } | void>({
      query: (args) => ({
        url: "/chats",
        method: "GET",
        params: {
          page: args?.page ?? 1,
          limit: args?.limit ?? 20,
        },
      }),
      transformResponse: (response: ChatListResponse) =>
        response.data?.chats ?? [],
      providesTags: [tagTypes.chat],
    }),
    getChatMessages: builder.query<
      ChatMessage[],
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: `/chats/${conversationId}/messages`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: ChatMessagesResponse) =>
        (response.data?.messages ?? []).slice().reverse(),
      providesTags: (_result, _error, arg) => [
        { type: tagTypes.chat, id: arg.conversationId },
      ],
    }),
    sendChatMessage: builder.mutation<
      ChatMessage,
      { conversationId: string; content?: string; image?: string }
    >({
      query: ({ conversationId, content, image }) => ({
        url: `/chats/${conversationId}/messages`,
        method: "POST",
        body: { content, image },
      }),
      transformResponse: (response: { data?: ChatMessage } | ChatMessage) =>
        "data" in response && response.data ? response.data : (response as ChatMessage),
      invalidatesTags: (_result, _error, arg) => [
        tagTypes.chat,
        { type: tagTypes.chat, id: arg.conversationId },
      ],
    }),
    markChatRead: builder.mutation<{ success?: boolean }, string>({
      query: (conversationId) => ({
        url: `/chats/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        tagTypes.chat,
        { type: tagTypes.chat, id: conversationId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetChatsQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatReadMutation,
} = chatApi;
