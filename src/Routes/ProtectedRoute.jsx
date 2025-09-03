import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserMeQuery } from '../api/userApi';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useGetUserMeQuery();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      navigate('/login', { replace: true });
    } else if (!allowedRoles.includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [isError, isLoading, user, allowedRoles, navigate]);

  // if (isLoading)
  if (!user || !allowedRoles.includes(user.role))
    // return (
    //   <div className="p-4">{/* <Loader2 className="animate-spin" /> */}</div>
    // );

    return null;

  return <>{children}</>;
};

export default ProtectedRoute;
