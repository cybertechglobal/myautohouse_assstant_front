import { Routes, Route } from 'react-router-dom';
import { routesConfig } from './routesConfig';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import FallbackRoute from './FallbackRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AppRouter() {
  return (
    <Routes>
      {routesConfig.map(
        (
          { path, element: Component, protected: isProtected, roles, layout },
          i
        ) => {
          let routeElement = <Component />;

          // Wrap with RoleProtectedRoute if roles exist
          if (roles?.length) {
            routeElement = (
              <RoleProtectedRoute allowedRoles={roles}>
                {routeElement}
              </RoleProtectedRoute>
            );
          } else if (isProtected) {
            // If protected but no roles, wrap with simple ProtectedRoute
            routeElement = <ProtectedRoute>{routeElement}</ProtectedRoute>;
          }

          // Wrap with layout if specified
          if (layout === 'dashboard') {
            routeElement = <DashboardLayout>{routeElement}</DashboardLayout>;
          }

          return <Route key={i} path={path} element={routeElement} />;
        }
      )}

      {/* fallback route */}
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
}
