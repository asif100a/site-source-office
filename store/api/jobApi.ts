import { baseApi } from "./_base/baseApi";
import { tagTypes } from "../type/tagType";

export type JobPostPayload = {
  title: string;
  trades: string[];
  hourlyRate: number;
  workersNeeded: number | { trade: string; howMany: number }[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  startDate: string;
  endDate: string;
  workingHours: {
    day: string;
    startTime: string;
    endTime: string;
    isPayOnePointFiveX: boolean;
    isPayTwoX: boolean;
  }[];
  mustHave: string[];
  note: string;
};

export type JobArgs = {
  page: number;
  limit: number;
  status?: "POSTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  searchTerm?: string;
  hourlyRate?: number;
  filter?: "best-match" | "nearby" | "closing-soon";
  trade?:
    | "GROUND_WORKER"
    | "CARPENTER"
    | "ELECTRICIAN"
    | "PLUMBER"
    | "BRICKLAYER"
    | "PAINTER"
    | "SCAFFOLDER";
  radius?: number;
  latitude?: number;
  longitude?: number;
  startDateFrom?: string;
  startDateTo?: string;
};

const BASE_POINT = "/jobs";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation<any, JobPostPayload>({
      query: (payload) => ({
        url: BASE_POINT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.job, tagTypes.meta],
    }),
    updateJob: builder.mutation<
      any,
      { id: string; body: Partial<JobPostPayload> }
    >({
      query: ({ id, body }) => ({
        url: BASE_POINT + `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.job, tagTypes.meta],
    }),
    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: BASE_POINT + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.job, tagTypes.meta],
    }),
    getAllJobs: builder.query<any, JobArgs>({
      query: (args) => {
        // console.log("args from the get all jobs api: ", args);
        return {
          url: BASE_POINT,
          method: "GET",
          params: args,
        };
      },
      providesTags: [tagTypes.job],
    }),
    getMyJobs: builder.query<
      any,
      {
        page: number;
        limit: number;
        status: "POSTED" | "ACTIVE" | "COMPLETED";
        searchTerm?: string;
      }
    >({
      query: (args) => {
        console.log("args from the get my jobs api: ", args);
        return {
          url: BASE_POINT + "/my-jobs",
          method: "GET",
          params: args,
        };
      },
      providesTags: [tagTypes.job],
    }),
    getSingleJob: builder.query<any, string>({
      query: (id) => ({
        url: BASE_POINT + `/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.job],
    }),
    getWorkersMapsJobs: builder.query<any, JobArgs>({
      query: (args) => {
        //  console.log("args from the get map jobs api: ", args);
        return {
          url: BASE_POINT + `/available-map-jobs`,
          method: "GET",
          params: args,
        };
      },
      providesTags: [tagTypes.job],
    }),
    completeJob: builder.mutation<any, { jobId: string }>({
      query: ({ jobId }) => ({
        url: BASE_POINT + `/completion/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.job],
    }),
    changeCompletionStatus: builder.mutation<
      any,
      { jobId: string; status: "COMPLETED" | "REJECTED" }
    >({
      query: ({ jobId, status }) => ({
        url: BASE_POINT + `/completion/${jobId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.job],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useGetMyJobsQuery,
  useGetSingleJobQuery,
  useGetWorkersMapsJobsQuery,
  useCompleteJobMutation,
  useChangeCompletionStatusMutation,
} = jobApi;
