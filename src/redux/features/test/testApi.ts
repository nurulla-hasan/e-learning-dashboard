import TagTypes from "../../../constant/tagType.constant";
import { apiSlice } from "../api/apiSlice";

export const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tests
    getTests: builder.query({
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
          url: "/tests",
          method: "GET",
          params: params,
        };
      },
      providesTags: [TagTypes.tests],
    }),

    // Create test
    createTest: builder.mutation({
      query: (bodyData) => ({
        url: "/tests",
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: [TagTypes.tests],
    }),

    // Delete test
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.tests],
    }),
    
  }),
});

export const { useGetTestsQuery, useCreateTestMutation, useDeleteTestMutation } =
  testApi;
