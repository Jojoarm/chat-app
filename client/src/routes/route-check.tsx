import { Navigate, Outlet } from 'react-router-dom';

const RouteCheck = ({ requireAuth }: { requireAuth?: boolean }) => {
  if (requireAuth) return <Navigate to="/" replace />;
  if (!requireAuth) return <Navigate to="/chat" replace />;

  return <Outlet />;
};

export default RouteCheck;
