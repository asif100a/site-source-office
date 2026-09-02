import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/jobs";

export const jobOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobOffer: builder.mutation<any, any>({
      query: (id) => ({
        url: BASE_POINT + `/offers`,
        method: "POST",
      }),
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
    }),
    getReceivedJobOffers: builder.query<any, { page: number; limit: number }>({
      query: (args) => ({
        url: BASE_POINT + `/offers/received`,
        method: "GET",
        params: args,
      }),
    }),
    updateJobOfferStatus: builder.mutation<any, {id: string, status: "ACCEPTED" | "REJECTED"}>({
      query: ({id, status}) => ({
        url: BASE_POINT + `/offers/${id}/status`,
        method: "PATCH",
        body: {status}
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateJobOfferMutation,
  useGetSentJobOffersQuery,
  useGetReceivedJobOffersQuery,
  useUpdateJobOfferStatusMutation
} = jobOfferApi;
