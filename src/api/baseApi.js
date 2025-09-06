import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://localhost:5001/v1',
    baseUrl: 'https://soishu-backend.vercel.app/v1',
    // baseUrl: 'https://soishu.com/v1',
    credentials: 'include',
  }),
  tagTypes: ['User', 'Product', 'Order', 'Note'],
  endpoints: () => ({}),
});
