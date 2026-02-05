import { useUser } from '@/hooks/use-user';
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/chat" replace />;
  }
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full mx-auto h-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
