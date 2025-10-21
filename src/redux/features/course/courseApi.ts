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


  }),
});

export const {
  useGetCoursesQuery,
} = courseApi;
