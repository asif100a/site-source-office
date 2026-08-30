import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";
import { logout } from "../slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateMe: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    deleteMe: builder.mutation<any, void>({
      query: () => ({
        url: "/user/me",
        method: "DELETE",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("otpToken");
          await AsyncStorage.removeItem("forgotToken");
        } catch (error) {
          console.error("❌ Delete user failed:", error);
        }
      },
      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
} = userApi;
