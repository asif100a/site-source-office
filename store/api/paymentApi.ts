import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";

const BASE_POINT = "/payments";

interface PaymentData {
  account: string;
  order: string;
  successUrl?: string;
  cancelUrl?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<any, PaymentData>({
      query: (data) => ({
        url: BASE_POINT + "/checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        tagTypes.payment,
        tagTypes.order,
        tagTypes.notification,
        tagTypes.meta,
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useCreatePaymentMutation } = paymentApi;
