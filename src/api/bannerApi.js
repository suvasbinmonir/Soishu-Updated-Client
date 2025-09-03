import { baseApi } from './baseApi';

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => `/banners`,
      providesTags: ['Banner'],
    }),

    createBanner: builder.mutation({
      query: (data) => ({
        url: `/banners`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Banner'],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),

    reorderBanners: builder.mutation({
      query: (orderData) => ({
        url: `/banners/reorder`,
        method: 'PATCH',
        body: orderData,
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useReorderBannersMutation,
} = bannerApi;
