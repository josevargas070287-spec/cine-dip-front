import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Bloquea las rutas privadas.
 *
 * Si no hay sesion, manda al formulario guardando en `next` a donde se
 * queria entrar, para volver ahi despues de iniciar sesion.
 */
export const RequireAuth = () => {
  //const { isAuthenticated, loading } = useAuth();
  const { isAuthenticated, loading, tieneRol } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
  if (!tieneRol('ADMINISTRADOR', 'ADMIN', 'GERENTE')) {
    return <Navigate to="/peliculas" replace />;
  }
  return <Outlet />;
};
