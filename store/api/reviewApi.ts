import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/reviews";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<
      any,
      {
        jobId: string;
        rating: number;
        feedback: string;
      }
    >({
      query: (data) => ({
        url: BASE_POINT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.review, tagTypes.job],
    }),
    getReviews: builder.query<any, {authId: string}>({
      query: ({authId, ...args}) => ({
        url: BASE_POINT+`/${authId}`,
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.review],
    }),
    getReviewSummary: builder.query<any, {authId: string}>({
      query: ({authId}) => ({
        url: BASE_POINT+`/${authId}/summary`,        
        method: "GET",
      }),
      providesTags: [tagTypes.review],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useGetReviewSummaryQuery,
} = reviewApi;
