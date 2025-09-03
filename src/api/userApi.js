import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Registration
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    // Login
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Get current user profile
    getUserMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Get all users (admin)
    getAllUsers: builder.query({
      query: () => '/auth/users',
      providesTags: ['User'],
    }),

    // Get a single user by ID
    getUserById: builder.query({
      query: (userId) => `/auth/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // Regenerate API Keys
    regenerateKeys: builder.mutation({
      query: (data) => ({
        url: '/auth/regenerate-keys',
        method: 'POST',
        body: data,
      }),
    }),

    // Update a user by ID
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete a user by ID
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useGetUserMeQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useRegenerateKeysMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
