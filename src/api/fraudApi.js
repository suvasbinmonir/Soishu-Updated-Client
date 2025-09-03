import { baseApi } from './baseApi';

export const fraudApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkFraud: builder.mutation({
      query: (phone) => ({
        url: '/fraud-check',
        method: 'POST',
        body: { phone },
      }),
    }),
  }),
});

export const { useCheckFraudMutation } = fraudApi;
