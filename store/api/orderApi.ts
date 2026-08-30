import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/orders";

interface OrderData {
  slot: string;
  fuelType: string;
  measurement: string;
  quantity: number;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  note?: string;
}

interface GetMyOrdersArgs {
  page?: number;
  limit?: number;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, OrderData>({
      query: (data) => ({
        url: BASE_POINT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.order, tagTypes.notification, tagTypes.meta],
    }),
    getOrderCalendar: builder.query<any, { date: string }>({
      query: (args) => ({
        url: BASE_POINT + "/order-calender",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.order],
    }),
    getMyOrders: builder.query<any, GetMyOrdersArgs | void>({
      query: (args) => ({
        url: BASE_POINT + "/my-orders",
        method: "GET",
        params: {
          page: args?.page ?? 1,
          limit: args?.limit ?? 10,
        },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData, { arg }) => {
        if ((arg?.page ?? 1) <= 1) {
          currentCache.meta = newData.meta;
          currentCache.data = newData.data;
          return;
        }

        const currentItems = Array.isArray(currentCache.data)
          ? currentCache.data
          : [];
        const nextItems = Array.isArray(newData.data) ? newData.data : [];
        const seenIds = new Set(currentItems.map((item: any) => item?._id));
        const appendedItems = nextItems.filter(
          (item: any) => item?._id && !seenIds.has(item._id),
        );

        currentCache.meta = newData.meta;
        currentCache.data = [...currentItems, ...appendedItems];
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page ||
        currentArg?.limit !== previousArg?.limit,
      providesTags: [tagTypes.order],
    }),
    getSingleOrder: builder.query<any, string>({
      query: (id) => ({
        url: BASE_POINT + `/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.order],
    }),
    createOrderSummary: builder.mutation<any, OrderData>({
      query: (data) => ({
        url: BASE_POINT + "/order-summary",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetOrderCalendarQuery,
  useGetMyOrdersQuery,
  useLazyGetSingleOrderQuery,
  useGetSingleOrderQuery,
  useCreateOrderSummaryMutation,
} = orderApi;
