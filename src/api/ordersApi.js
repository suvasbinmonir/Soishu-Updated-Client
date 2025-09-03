import { baseApi } from './baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Purchase Product (Create Order)
    purchaseProduct: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    // Get All Purchase Products
    getAllPurchaseProducts: builder.query({
      query: (params) => ({
        url: `/orders`,
        params,
      }),
      providesTags: ['Order'],
    }),

    // Get Order Summary
    getOrderSummary: builder.query({
      query: () => '/orders/summary',
    }),

    // Get Purchase Product by ID
    getPurchaseProductById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Add this inside endpoints:
    updateProductStock: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/update-stock`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order'],
    }),

    // Update Purchase Product by ID
    updatePurchaseProductById: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
      ],
    }),

    // Delete Purchase Product by ID
    deletePurchaseProductById: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),

    // Send Order Email
    sendOrderEmail: builder.mutation({
      query: (orderData) => ({
        url: '/orders/send-order-email',
        method: 'POST',
        body: orderData,
      }),
    }),
  }),
});

export const {
  usePurchaseProductMutation,
  useGetAllPurchaseProductsQuery,
  useGetOrderSummaryQuery,
  useGetPurchaseProductByIdQuery,
  useUpdatePurchaseProductByIdMutation,
  useDeletePurchaseProductByIdMutation,
  useUpdateProductStockMutation,
  useSendOrderEmailMutation,
} = orderApi;
