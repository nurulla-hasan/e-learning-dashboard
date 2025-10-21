import TagTypes from "../../../constant/tagType.constant";
import { ErrorToast, SuccessToast } from "../../../helper/ValidationHelper";
import { apiSlice } from "../api/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all companies
    getCompanies: builder.query({
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
          url: "/admin/users-with-company",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.companies],
    }),

    // Update company status
    updateCompanyStatus: builder.mutation({
      query: ({ userId }: { userId: string }) => ({
        url: `/admin/users/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result) => {
        if (result?.success) {
          return [TagTypes.companies];
        }
        return [];
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          SuccessToast("Company status updated successfully");
        } catch (err: any) {
          const status = err?.error?.status;
          const message = err?.error?.data?.message || "Something Went Wrong";
          if (status === 500) {
            ErrorToast("Something Went Wrong");
          } else {
            ErrorToast(message);
          }
        }
      },
    }),

  }),
});

export const {
  useGetCompaniesQuery,
  useUpdateCompanyStatusMutation,
} = companyApi;
