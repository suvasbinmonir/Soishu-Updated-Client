import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shoe.soishu.com/api/v1',
    // baseUrl: 'http://192.168.0.2:5001/api/v1',
    // baseUrl: 'http://167.172.79.21/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['User', 'Product', 'Order', 'Note'],
  endpoints: () => ({}),
});
