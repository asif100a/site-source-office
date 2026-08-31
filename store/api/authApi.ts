import {
  AuthResponse,
  GoogleLoginRequest,
  LoginRequest,
  RegisterData,
  VerifyOTPRequest,
} from "@/types/redux.type";
import {
  clearForgotToken,
  clearOtpToken,
  logout,
  setForgotToken,
  setOtpToken,
} from "../slices/authSlice";
import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_POINT = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: BASE_POINT + "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [tagTypes.auth, tagTypes.user, tagTypes.profile],
    }),
    googleLogin: builder.mutation<AuthResponse, GoogleLoginRequest>({
      query: (credentials) => ({
        url: BASE_POINT + "/google",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [tagTypes.auth, tagTypes.user, tagTypes.profile],
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: BASE_POINT + "/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    verifyOTP: builder.mutation<any, VerifyOTPRequest>({
      query: (data) => ({
        url: `/otp/verify`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      },
      invalidatesTags: [tagTypes.user],
    }),
    resendOTP: builder.mutation<any, { email: string }>({
      query: ({ email }) => ({
        url: `/otp/send-otp-in-email`,
        method: "POST",
        body: { email },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // const token = data?.data?.verificationToken || data?.data?.otpToken?.verificationToken;
          // if (token) {
          //   dispatch(setOtpToken(token));
          //   await AsyncStorage.setItem("otpToken", token);
          // }
        } catch (error) {
          console.error("Resend OTP failed:", error);
        }
      },
      invalidatesTags: [tagTypes.auth],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: BASE_POINT + "/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.auth, tagTypes.profile],
    }),
    forgotPassword: builder.mutation<
      AuthResponse,
      { email: string; purpose: "RESET_PASSWORD" }
    >({
      query: (data) => ({
        url: "/otp/send",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.verificationToken;

          dispatch(clearForgotToken());
          if (token) {
            dispatch(setForgotToken(token));
            await AsyncStorage.setItem("forgotToken", token);
          }
        } catch (error) {
          console.error("Forgot password failed:", error);
        }
      },
      invalidatesTags: [tagTypes.auth],
    }),
    verifyForgotOtp: builder.mutation<any, VerifyOTPRequest>({
      query: (data) => {
        console.log("Data from the verifyForgotOtp: ", data);
        return {
          url: `/otp/verify`,
          method: "POST",
          body: data,
        };
      },

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.resetToken ?? data?.resetToken;

          if (token) {
            dispatch(setForgotToken(token));
            await AsyncStorage.setItem("forgotToken", token);
          }
        } catch (error) {
          console.error("Forgot OTP verification failed:", error);
        }
      },
      invalidatesTags: [tagTypes.user],
    }),
    resetPassword: builder.mutation<
      any,
      { email: string; password: string; resetToken: string }
    >({
      query: (data) => ({
        url: BASE_POINT + "/reset-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearForgotToken());
          await AsyncStorage.removeItem("forgotToken");
        } catch (error) {
          console.error("Reset password failed:", error);
        }
      },
      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),
  }),

  overrideExisting: true,
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
} = authApi;
