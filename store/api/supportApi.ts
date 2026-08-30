import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export type CreateSupportRequest = {
  subject: string;
  messages: string;
};

export type CreateSupportResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation<
      CreateSupportResponse,
      CreateSupportRequest
    >({
      query: (data) => ({
        url: "/support",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.support],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateSupportTicketMutation } = supportApi;
