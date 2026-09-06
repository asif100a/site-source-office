import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/jobs";

type CreateTimesheetPayload = {
  week: number;
  timeSheetDays: {
    day: string;
    hours: number;
  }[];
};

export const timesheetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTimesheet: builder.mutation<
      any,
      { id: string; data: CreateTimesheetPayload }
    >({
      query: ({ id, data }) => ({
        url: BASE_POINT + `/${id}/timesheets`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.timesheet, tagTypes.job],
    }),
    getEmployerTimesheet: builder.query<any, { page: number; limit: number }>({
      query: (args) => ({
        url: BASE_POINT + "/timesheets/pending",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.timesheet, tagTypes.job],
    }),
    getWorkerTimesheet: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: BASE_POINT + `/${id}/timesheets`,
        method: "GET",
      }),
      providesTags: [tagTypes.timesheet, tagTypes.job],
    }),
    changeTimesheetStatus: builder.mutation<
      any,
      {
        id: string;
        status: "APPROVED" | "REJECTED";
      }
    >({
      query: ({ id, status }) => ({
        url: BASE_POINT + `/timesheet-days/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.timesheet, tagTypes.job],
    }),
    approveAllTimesheetStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: BASE_POINT + `/timesheets/${id}/approve-all`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.timesheet, tagTypes.job],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateTimesheetMutation,
  useGetEmployerTimesheetQuery,
  useGetWorkerTimesheetQuery,
  useChangeTimesheetStatusMutation,
  useApproveAllTimesheetStatusMutation,
} = timesheetApi;
