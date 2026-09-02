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
    getSupportTickets: builder.query<any, any>({
      query: () => ({
        url: "/support",
        method: "GET",
      }),
      providesTags: [tagTypes.support],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateSupportTicketMutation, useGetSupportTicketsQuery } =
  supportApi;
