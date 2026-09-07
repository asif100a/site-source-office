import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation<any, any>({
      query: (data) => ({
        url: "/support",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.support],
    }),
    getSupportTickets: builder.query<
      any,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/support",
        method: "GET",
        ...(params ? { params } : {}),
      }),
      providesTags: [tagTypes.support],
    }),
    getSingleSupportTicket: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/support/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.support],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSupportTicketMutation,
  useGetSupportTicketsQuery,
  useGetSingleSupportTicketQuery,
} = supportApi;
