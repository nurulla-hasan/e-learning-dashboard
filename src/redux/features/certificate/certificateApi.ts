import TagTypes from "../../../constant/tagType.constant";
import { apiSlice } from "../api/apiSlice";

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all certificates
    getIssuedCertificates: builder.query({
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
          url: "/certificates/all-issued-certificates",
          method: "GET",
          params: params,
        };
      },
      providesTags: [TagTypes.certificates],
    }),


    // Get single certificate
    getSingleCertificate: builder.query({
      query: (id) => ({
        url: `/certificates/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.certificates],
    }),

    // Create certificate
    createCertificate: builder.mutation({
      query: (data) => ({
        url: "/certificates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [TagTypes.certificates],
    }),

    // Update certificate
    updateCertificate: builder.mutation({
      query: ({data, id}) => ({
        url: `/certificates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [TagTypes.certificates],
    }),

    // Create certificate content
    createCertificateContent: builder.mutation({
      query: (data) => ({
        url: "/certificate-contents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [TagTypes.certificates],
    }),


  }),
});

export const {
   useGetIssuedCertificatesQuery,
   useCreateCertificateMutation,
   useUpdateCertificateMutation,
   useGetSingleCertificateQuery,
   useCreateCertificateContentMutation,
} =
  certificateApi;
