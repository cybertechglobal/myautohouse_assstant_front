import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function FallbackRoute() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (user) {
    switch (user.role) {
      case 'root':
        return <Navigate to="/company-groups" state={{ from: location }} replace />;
      case 'group_admin':
        return <Navigate to="/companies" state={{ from: location }} replace />;
      case 'admin':
        return <Navigate to="/assistants" state={{ from: location }} replace />;
      default:
        return <Navigate to="/user" state={{ from: location }} replace />;
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}
