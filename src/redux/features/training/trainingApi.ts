/* eslint-disable @typescript-eslint/no-explicit-any */

import TagTypes from "../../../constant/tagType.constant";
import { apiSlice } from "../api/apiSlice";

export const trainingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // All Orders
    getTrainingOrders: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value) {
              params.append(key, value as string);
            }
          });
        }
        return {
          url: "/in-person-trainings",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.orders],
    }),

    getTrainingCompanyOrders: builder.query({
      query: (args) => {
       const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value) {
              params.append(key, value as string);
            }
          });
        }
        return {
          url: "/in-person-trainings",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.orders],
    }),

    // Update Order
    updateTrainingOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/in-person-trainings/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _success, arg) => {
        if (result?.success) {
          return [TagTypes.orders, { type: TagTypes.order, id: arg.id }];
        }
        return [];
      },
    }),

  }),
});

export const { 
  useGetTrainingOrdersQuery,
  useGetTrainingCompanyOrdersQuery,
   useUpdateTrainingOrderMutation
   } = trainingApi;
