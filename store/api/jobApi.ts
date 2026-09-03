import { baseApi } from "./_base/baseApi";
import { tagTypes } from "../type/tagType";

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
    getAllJobs: builder.query<any, JobArgs>({
      query: (args) => {
        console.log("args from the get all jobs api: ", args);
        return ({
        url: BASE_POINT,
        method: "GET",
        params: args,
      })
      },
      providesTags: [tagTypes.job],
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
      query: (args) => ({
        url: BASE_POINT + `/available-map-jobs`,
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.job],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateJobMutation,
  useGetAllJobsQuery,
  useGetMyJobsQuery,
  useGetSingleJobQuery,
  useGetWorkersMapsJobsQuery,
} = jobApi;
