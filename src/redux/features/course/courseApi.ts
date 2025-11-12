import TagTypes from "../../../constant/tagType.constant";
import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all companies
    getCourses: builder.query({
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
          url: "/courses",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor: 600,
      providesTags: [TagTypes.courses],
    }),

    // Create course
    createCourse: builder.mutation({
      query: (bodyData) => ({
        url: "/courses",
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: [TagTypes.courses],
    }),

    // Get single course
    getSingleCourse: builder.query({
      query: (id: string) => ({
        url: `/courses/admin/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.courses],
    }),

    // Update course
    updateCourse: builder.mutation({
      query: ({ id, bodyData }: { id: string; bodyData: FormData }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: bodyData,
      }),
      invalidatesTags: [TagTypes.courses],
    }),

    // Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.courses],
    }),

  }),
});

export const { 
  useGetCoursesQuery,
   useCreateCourseMutation,
    useGetSingleCourseQuery,
     useUpdateCourseMutation,
      useDeleteCourseMutation 
    } =
  courseApi;
