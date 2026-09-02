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
    getJobApplication: builder.query<any, any>({
      query: (id) => ({
        url: BASE_POINT + `/${id}/applications`,
        method: "GET",
      }),
    }),
    getAppliedJobs: builder.query<any, any>({
      query: (id) => ({
        url: BASE_POINT + `/applied-jobs`,
        method: "GET",
      }),
    }),
    updatedJobApplicationStatus: builder.mutation<any, {id: string, status: "ACCEPTED" | "REJECTED"}>({
      query: ({id, status}) => ({
        url: BASE_POINT + `/applications/${id}/status`,
        method: "POST",
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
