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

type PaginatedResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T[] | { docs?: T[]; items?: T[]; results?: T[]; data?: T[] };
};

const unwrapList = <T>(response: PaginatedResponse<T> | T[] | undefined) => {
  if (Array.isArray(response)) return response;
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.docs)) return data.docs;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
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
      transformResponse: (response: PaginatedResponse<ChatConversation>) =>
        unwrapList(response),
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
      transformResponse: (response: PaginatedResponse<ChatMessage>) =>
        unwrapList(response).slice().reverse(),
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
