/* eslint-disable @typescript-eslint/no-explicit-any */

import TagTypes from "../../../constant/tagType.constant";
import { ErrorToast, SuccessToast } from "../../../helper/ValidationHelper";
import { apiSlice } from "../api/apiSlice";

export const informationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInformation: builder.query({
      query: () => ({
        url: "/information/get-information",
        method: "GET",
      }),
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.information],
    }),
    updateInformation: builder.mutation({
      query: (data) => ({
        url: `/information/create-update-information`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) => {
        if (result?.success) {
          return [TagTypes.information];
        }
        return [];
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          SuccessToast("Information is updated successfully");
        } catch (err: any) {
          const status = err?.error?.status;
          const message = err?.error?.data?.message || "Something Went Wrong";
          if (status === 500) {
            ErrorToast("Something Went Wrong");
          }
          else {
            ErrorToast(message);
          }
        }
      },
    }),
  }),
});

export const { useGetInformationQuery, useUpdateInformationMutation } = informationApi;
