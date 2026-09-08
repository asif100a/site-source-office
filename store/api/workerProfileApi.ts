import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";
import { logout } from "../slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_POINT = "/workers";

interface GetAllWorkerParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
}

export const workerProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkerProfile: builder.query<any, void>({
      query: () => ({
        url: BASE_POINT + "/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateWorkerProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: BASE_POINT + "/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    deleteWorkerProfile: builder.mutation<any, void>({
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
    getAllWorkers: builder.query<any, GetAllWorkerParams>({
      query: (params) => ({
        url: BASE_POINT,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),
    getSingleWorker: builder.query<any, { id: string }>({
      query: (params) => ({
        url: `${BASE_POINT}/details/${params.id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWorkerProfileQuery,
  useUpdateWorkerProfileMutation,
  useDeleteWorkerProfileMutation,
  useGetAllWorkersQuery,
  useGetSingleWorkerQuery,
} = workerProfileApi;
