import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<any, string>({
      query: (key) => ({
        url: `/settings?key=${key}`,
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
    }),
    getGeneralSettings: builder.query<any, void>({
      query: () => ({
        url: `/settings/generals`,
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSettingsQuery } = settingsApi;
