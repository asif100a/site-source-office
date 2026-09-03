import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/bookmarks";

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobBookmark: builder.mutation<
      any,
      {
        jobId: string;
      }
    >({
      query: (data) => ({
        url: BASE_POINT + "/jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.bookmark, tagTypes.job],
    }),
    createWorkerBookmark: builder.mutation<
      any,
      {
        workerAuthId: string;
      }
    >({
      query: (data) => ({
        url: BASE_POINT + "/workers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.bookmark, tagTypes.worker],
    }),
    getBookmarkJobs: builder.query<any, any>({
      query: (args) => ({
        url: BASE_POINT + "/jobs",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.bookmark, tagTypes.job],
    }),
    getBookmarkWorkers: builder.query<any, any>({
      query: (args) => ({
        url: BASE_POINT + "/workers",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.bookmark, tagTypes.worker],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateJobBookmarkMutation,
  useCreateWorkerBookmarkMutation,
  useGetBookmarkJobsQuery,
  useGetBookmarkWorkersQuery,
} = bookmarkApi;
