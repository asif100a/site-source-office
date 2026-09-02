import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/jobs";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobApplication: builder.mutation<any, any>({
      query: (id) => ({
        url: BASE_POINT + `/${id}/apply`,
        method: "POST",
      }),
    }),
    getJobApplication: builder.query<
      any,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) => ({
        url: BASE_POINT + `/${id}/applications`,
        method: "GET",
        params: { page, limit },
      }),
    }),
    getAppliedJobs: builder.query<any, { page: number; limit: number }>({
      query: (args) => ({
        url: BASE_POINT + `/applied-jobs`,
        method: "GET",
        params: args,
      }),
    }),
    updatedJobApplicationStatus: builder.mutation<any, {id: string, status: "ACCEPTED" | "REJECTED"}>({

      query: ({id, status}) => ({
        url: BASE_POINT + `/applications/${id}/status`,
        method: "PATCH",
        body: {status}
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
 useCreateJobApplicationMutation,
 useGetJobApplicationQuery,
 useGetAppliedJobsQuery,
 useUpdatedJobApplicationStatusMutation
} = jobApi;
