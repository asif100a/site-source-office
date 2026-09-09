import { PUSH_TOKEN_REGISTRATION_PATH } from "@/constants/env.config";
import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/notifications";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      any, any
    >({
      query: (params) => ({
        url: BASE_POINT,
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: [tagTypes.notification],
    }),
    markAllAsDoneNotifications: builder.mutation<
      any, any
    >({
      query: () => ({
        url: BASE_POINT + '/read-all',
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    deleteSingleNotification: builder.mutation<
      any,
      { id: string }
    >({
      query: ({ id }) => ({
        url: BASE_POINT + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    deleteAllNotification: builder.mutation<
      any,
      null
    >({
      query: () => ({
        url: BASE_POINT + "/all",
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notification, tagTypes.meta],
    }),
    registerPushToken: builder.mutation<
      any,
      any
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
  useMarkAllAsDoneNotificationsMutation,
  useDeleteSingleNotificationMutation,
  useDeleteAllNotificationMutation,
  useRegisterPushTokenMutation,
} = notificationApi;
