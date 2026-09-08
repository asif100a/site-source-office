import { baseApi } from "./_base/baseApi";
import { tagTypes } from "../type/tagType";

const BASE_POINT = "/jobs";

export const jobOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobOffer: builder.mutation<
      any,
      {
        jobId: string;
        workerAuthId: string;
      }
    >({
      query: ({ jobId, workerAuthId }) => ({
        url: BASE_POINT + `/offers`,
        method: "POST",
        body: { jobId, workerAuthId },
      }),
      invalidatesTags: [tagTypes.jobOffer, tagTypes.job, tagTypes.meta],
    }),
    getSentJobOffers: builder.query<
      any,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) => ({
        url: BASE_POINT + `/offers/sent`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [tagTypes.jobOffer],
    }),
    getReceivedJobOffers: builder.query<any, { page: number; limit: number }>({
      query: (args) => ({
        url: BASE_POINT + `/offers/received`,
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.jobOffer],
    }),
    updateJobOfferStatus: builder.mutation<
      any,
      { id: string; status: "ACCEPTED" | "REJECTED" }
    >({
      query: ({ id, status }) => ({
        url: BASE_POINT + `/offers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.jobOffer, tagTypes.job, tagTypes.meta],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateJobOfferMutation,
  useGetSentJobOffersQuery,
  useGetReceivedJobOffersQuery,
  useUpdateJobOfferStatusMutation,
} = jobOfferApi;
