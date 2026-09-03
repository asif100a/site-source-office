import { PUSH_TOKEN_REGISTRATION_PATH } from "@/constants/env.config";
import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export type NotificationItem = {
  _id?: string;
  id?: string;
  title?: string;
  subject?: string;
  message?: string;
  messages?: string;
  body?: string;
  description?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type GetNotificationsRequest = {
  page?: number;
  limit?: number;
};

export type GetNotificationsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  meta: NotificationMeta;
  data: NotificationItem[];
};

export type UpdateNotificationsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  meta: NotificationMeta;
  data: {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string | null;
    upsertedCount: number;
    matchedCount: number;
  };
};

export type DeleteAllNotificationResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    acknowledged: boolean;
    deletedCount: number;
  };
};

export type DeleteSingleNotificationResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    acknowledged: boolean;
    deletedCount: number;
  };
};

export type RegisterPushTokenRequest = {
  token: string;
  expoPushToken?: string;
  devicePushToken?: string;
  devicePushTokenType?: string;
  platform: "ios" | "android" | "windows" | "macos" | "web";
  deviceName?: string | null;
};

export type RegisterPushTokenResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

const defaultMeta: NotificationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPage: 0,
};

const BASE_POINT = "/notification";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsResponse,
      GetNotificationsRequest | void
    >({
      query: (params) => ({
        url: BASE_POINT,
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      transformResponse: (response: Partial<GetNotificationsResponse>) => ({
        success: Boolean(response.success),
        statusCode: response.statusCode ?? 200,
        message: response.message ?? "",
        meta: response.meta ?? defaultMeta,
        data: Array.isArray(response.data) ? response.data : [],
      }),
      providesTags: [tagTypes.notification],
    }),
    markAsDoneNotifications: builder.mutation<
      UpdateNotificationsResponse,
      null
    >({
      query: () => ({
        url: BASE_POINT,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    deleteSingleNotification: builder.mutation<
      DeleteSingleNotificationResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: BASE_POINT + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    deleteAllNotification: builder.mutation<
      DeleteAllNotificationResponse,
      null
    >({
      query: () => ({
        url: BASE_POINT + "/my-notifications",
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    registerPushToken: builder.mutation<
      RegisterPushTokenResponse,
      RegisterPushTokenRequest
    >({
      query: (body) => ({
        url: PUSH_TOKEN_REGISTRATION_PATH || '/push-token',
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useMarkAsDoneNotificationsMutation,
  useDeleteSingleNotificationMutation,
  useDeleteAllNotificationMutation,
  useRegisterPushTokenMutation,
} = notificationApi;
