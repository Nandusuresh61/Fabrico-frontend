import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, isAdmin }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is not logged in, redirect to login
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // If the route is admin-protected and the user is not an admin, redirect
  if (isAdmin && !userInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
