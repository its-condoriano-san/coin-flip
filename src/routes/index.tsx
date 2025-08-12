import NotFound from '@/pages/notFound';
import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
const Cointoss = lazy(() => import('@/pages/coinToss'));

export default function AppRouter() {
  const publicRoutes = [
    {
      path: '/coinflip',
      element: <Cointoss />
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...publicRoutes]);

  return routes;
}
