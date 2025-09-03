import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all notifications (seen + unseen)
    getAllNotifications: builder.query({
      query: () => `/notifications`,
    }),

    // ✅ Get unseen notifications only
    getUnseenNotifications: builder.query({
      query: () => `/notifications/unseen`,
    }),

    // ✅ Mark specific notification as seen
    markNotificationAsSeen: builder.mutation({
      query: (noteId) => ({
        url: `/notifications/${noteId}/mark-seen`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetUnseenNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} = notificationApi;
