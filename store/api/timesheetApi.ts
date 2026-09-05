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
      invalidatesTags: [tagTypes.timesheet],
    }),
    getEmployerTimesheet: builder.query<any, { page: number; limit: number }>({
      query: (args) => ({
        url: BASE_POINT + "/timesheets/pending",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.timesheet],
    }),
    getWorkerTimesheet: builder.query<any, { id: string }>({
      query: (id) => ({
        url: BASE_POINT + `/${id}/timesheets`,
        method: "GET",
      }),
      providesTags: [tagTypes.timesheet],
    }),
    changeTimesheetStatus: builder.mutation<
      any,
      {
        id: string;
        status: "ACCEPTED" | "REJECTED";
      }
    >({
      query: ({ id, status }) => ({
        url: BASE_POINT + `/timesheet-days/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: [tagTypes.timesheet],
    }),
    approveAllTimesheetStatus: builder.mutation<
      any,
      {
        id: string;
        status: "ACCEPTED" | "REJECTED";
      }
    >({
      query: ({ id, status }) => ({
        url: BASE_POINT + `/timesheets/${id}/approve-all`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: [tagTypes.timesheet],
    }),
  }),
  overrideExisting: true,
});

export const { 
    useCreateTimesheetMutation, useGetEmployerTimesheetQuery,
    useGetWorkerTimesheetQuery, useChangeTimesheetStatusMutation,
    useApproveAllTimesheetStatusMutation
 } =
  timesheetApi;
