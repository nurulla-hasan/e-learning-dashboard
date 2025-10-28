import { apiSlice } from "../api/apiSlice.js";
import TagTypes from "../../../constant/tagType.constant.js";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => {
        return {
          url: `/admin/dashboard-stats`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.stats],
    }),

    getContactData: builder.query({
      query: () => {
        return {
          url: `/support`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.stats],
    }),

  }),
});

export const { useGetDashboardDataQuery, useGetContactDataQuery } = dashboardApi;
