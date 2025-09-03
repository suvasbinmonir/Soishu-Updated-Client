import { useGetUserMeQuery } from '../api/userApi';

export const useUserRole = () => {
  const { data: user, isLoading, isError } = useGetUserMeQuery();

  return {
    role: user?.role || null,
    user,
    isLoading,
    isError,
  };
};
