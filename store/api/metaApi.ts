import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

export const metaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMeta: builder.query<any, any>({
      query: (args) => ({
        url: `/meta/user`,
        method: "GET",
        params: args,
      }),
      providesTags: [
        tagTypes.meta,
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserMetaQuery } = metaApi;
