import { Route, Routes } from 'react-router-dom';
// import Logo from './components/Logo';
// import { Spinner } from './components/ui/spinner';
// import { useUser } from './hooks/useUser';
import AuthLayout from './layouts/auth.layout';
import { authRoutesPaths, protectedRoutesPaths } from './routes/route';
import UserLayout from './layouts/user.layout';

function App() {
  // const { user, isUserPending } = useUser();

  // if (isUserPending && !user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <Logo imgClass="size-12" showLogoText={true} />
  //       <Spinner className="w-6 h-6" />
  //     </div>
  //   );
  // }
  return (
    <div>
      <Routes>
        <Route element={<AuthLayout />}>
          {authRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<UserLayout />}>
          {protectedRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
