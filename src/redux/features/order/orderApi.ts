/* eslint-disable @typescript-eslint/no-explicit-any */

import TagTypes from "../../../constant/tagType.constant";
import { ErrorToast, SuccessToast } from "../../../helper/ValidationHelper";
import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // All Orders
    getEnrolledStudentOrders: builder.query({
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
          url: "/enrolled-courses/students",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 120,
      providesTags: [TagTypes.orders],
    }),

    getCompanyOrders: builder.query({
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
          url: "/enrolled-courses/employees",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 120,
      providesTags: [TagTypes.orders],
    }),

    // Single Order
    // getSingleOrder: builder.query({
    //   query: (id) => ({
    //     url: `/order/get-single-order/${id}`,
    //     method: "GET",
    //   }),
    //   keepUnusedDataFor: 600,
    //   providesTags: (_result, _error, arg) => [
    //     { type: TagTypes.order, id: arg },
    //   ],
    // }),

    // Get all courses
    getAllCoursesAdmin: builder.query({
      query: () => ({
        url: "/admin/courses?limit=1000",
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: [TagTypes.orders],
    }),

    // Create employee
    addEmployee: builder.mutation({
      query: (data) => ({
        url: "admin/users-with-course-access",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [TagTypes.orders],
    }),

    // Update Order
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/update-order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _success, arg) => {
        if (result?.success) {
          return [TagTypes.orders, { type: TagTypes.order, id: arg.id }];
        }
        return [];
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
       try {
          await queryFulfilled;
          SuccessToast("Update Success");
        } catch (err:any) {
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

export const { 
  useGetEnrolledStudentOrdersQuery,
  useGetCompanyOrdersQuery,
  //  useGetSingleOrderQuery,
    useUpdateOrderMutation,
    useGetAllCoursesAdminQuery,
    useAddEmployeeMutation
   } = orderApi;
