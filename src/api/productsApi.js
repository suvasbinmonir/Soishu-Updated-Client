import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Product
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Get All Products
    getAllProducts: builder.query({
      query: (params) => ({
        url: `/products`,
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get All Products By Category
    getProductsByCategory: builder.query({
      query: (category) => `/products/category/${category}`,
    }),

    // Get Product Summary
    getProductSummary: builder.query({
      query: () => '/products/summary',
    }),

    // Get Product Summary for analytics
    getProductSummaryForAnalytics: builder.query({
      query: () => '/products/analytics-summary',
    }),

    // Get Product by ID
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (id) => [{ type: 'Product', id }],
    }),

    // Get Product by slug
    getProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
    }),

    // Update Product by ID
    updateProductById: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/products/${productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Delete Product by ID
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // ⚡ Delete Variant or Size (DELETE with body support)
    deleteVariantOrSize: builder.mutation({
      query: ({ productId, targetColor, targetSize }) => ({
        url: `/products/${productId}/variant`,
        method: 'DELETE',
        body: { targetColor, targetSize },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    // ⚡ Flexible Product Update
    flexibleProductUpdate: builder.mutation({
      query: ({ productId, productUpdates, variantUpdates }) => ({
        url: `/products/${productId}/flexible-update`,
        method: 'PATCH',
        body: { productUpdates, variantUpdates },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Add Coupon
    addCoupon: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/coupon`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Remove Coupon
    removeCoupon: builder.mutation({
      query: ({ productId, couponCode }) => ({
        url: `/products/${productId}/coupon/${couponCode}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Get All Coupons
    getAllCoupons: builder.query({
      query: (productId) => `/products/${productId}/coupons`,
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Validate Coupon
    validateCoupon: builder.query({
      query: ({ productId, couponCode }) =>
        `/products/${productId}/coupon/${couponCode}/validate`,
    }),

    // Update Coupon
    updateCoupon: builder.mutation({
      query: ({ productId, couponCode, data }) => ({
        url: `/products/${productId}/coupon/${couponCode}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductSummaryQuery,
  useGetProductSummaryForAnalyticsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useUpdateProductByIdMutation,
  useDeleteProductByIdMutation,
  useDeleteVariantOrSizeMutation,
  useFlexibleProductUpdateMutation,
  useAddCouponMutation,
  useRemoveCouponMutation,
  useGetAllCouponsQuery,
  useLazyValidateCouponQuery,
  useUpdateCouponMutation,
} = productApi;
