import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegals: builder.query<any, any>({
      query: (args) => ({
        url: `/legal`,
        method: "GET",
        params: args,
      }),
      providesTags: [
        tagTypes.legal,
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetLegalsQuery } = legalApi;
