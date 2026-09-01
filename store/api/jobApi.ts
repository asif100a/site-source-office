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

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation<any, JobPostPayload>({
      query: (payload) => ({
        url: "/jobs",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateJobMutation } = jobApi;
