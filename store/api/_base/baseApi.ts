import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../../type/tagType";
import { BACKEND_URL } from "@/constants/env.config";

const getUrl = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

const getAuthToken = (url: string, state: RootState) => {
  if (url.includes("/auth/reset-password")) {
    // console.log("Access token from the base api: ", state.auth.token);
    // console.log("OTP token from the base api: ", state.auth.otpToken);
    // console.log("Forgot token from the base api: ", state.auth.forgotToken);
    return state.auth.token;
  }

  if (url.includes("/otp/verify")) {
    console.log("OTP token from the base api: ", state.auth.otpToken);
    return url.includes("type=forgot")
      ? state.auth.forgotToken
      : state.auth.otpToken;
  }

  return state.auth.token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
});

// Custom base query with token handling
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const url = getUrl(args);
  const token = getAuthToken(url, state);
  let authArgs = args;
  // console.log("Token from the base api: ", token);

  if (token) {
    const headers = new Headers(
      typeof args === "string" ? undefined : (args.headers as HeadersInit)
    );
    headers.set("Authorization", token);

    authArgs =
      typeof args === "string"
        ? {
            url: args,
            headers,
          }
        : {
            ...args,
            headers,
          };
  }

  const result = await baseQuery(authArgs, api, extraOptions);

  // Only clear the login session when the access token itself was rejected.
  if (result.error?.status === 401 && token && token === state.auth.token) {
    api.dispatch(logout());
  }

  if (
    result.error?.status === 502 ||
    result.error?.status === "PARSING_ERROR"
  ) {
    console.error("Server Error (502/Parsing Error):", result.error);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: tagTypeList,
  endpoints: () => ({}),
});
