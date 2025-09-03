import { baseApi } from './baseApi';

export const fileUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // File Upload
    fileUpload: builder.mutation({
      query: (data) => ({
        url: '/upload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useFileUploadMutation } = fileUploadApi;
