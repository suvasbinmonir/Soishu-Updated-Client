import { baseApi } from './baseApi';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => `/categories`,
      providesTags: ['Category'],
    }),

    addCategory: builder.mutation({
      query: (data) => ({
        url: `/categories`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    reorderCategories: builder.mutation({
      query: (orderData) => ({
        url: `/categories/reorder`,
        method: 'PATCH',
        body: orderData,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
} = categoryApi;
