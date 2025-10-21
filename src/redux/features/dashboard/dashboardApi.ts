import { apiSlice } from "../api/apiSlice.js";
import TagTypes from "../../../constant/tagType.constant.js";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => {
        return {
          url: `/user/get-stats`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.stats],
    }),
    getUserGrowth: builder.query({
      query: (year) => {
        return {
          url: `/user/get-user-overview/${year}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.userGrowth],
    }),
    getIncomeGrowth: builder.query({
      query: (year) => {
        return {
          url: `/order/get-income-overview/${year}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.incomeGrowth],
    }),
  }),
});

export const { useGetStatsQuery, useGetUserGrowthQuery, useGetIncomeGrowthQuery } = dashboardApi;
