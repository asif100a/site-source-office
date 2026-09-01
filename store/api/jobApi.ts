import { baseApi } from "./_base/baseApi";

export type JobPostPayload = {
  title: string;
  trades: string[];
  hourlyRate: number;
  workersNeeded: number;
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

const BASE_POINT = "/jobs";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation<any, JobPostPayload>({
      query: (payload) => ({
        url: BASE_POINT,
        method: "POST",
        body: payload,
      }),
    }),
    getMyJobs: builder.query<
      any,
      {
        page: number;
        limit: number;
        status: "POSTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
      }
    >({
      query: (args) => ({
        url: BASE_POINT + "/my-jobs",
        method: "GET",
        params: args,
      }),
    }),
    getSingleJob: builder.query<any, string>({
      query: (id) => ({
        url: BASE_POINT + `/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateJobMutation, useGetMyJobsQuery, useGetSingleJobQuery } =
  jobApi;
