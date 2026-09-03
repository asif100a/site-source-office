import { BACKEND_URL } from "@/constants/env.config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../../type/tagType";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
  tagTypes: tagTypeList,
  endpoints: () => ({}),
});
