import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { PublicoLayout } from '@/layouts/publico/layout';
import { PeliculasListaPage } from '@/pages/panel/peliculas-lista-page';
import { FuncionAsientosPage } from '@/pages/funciones/funciones-asientos-page';
import { PeliculaNuevaPage } from '@/pages/panel/pelicula-nueva-page';
import { PersonasPage } from '@/pages/panel/personas-page';
import { PeliculasDellatePage } from '@/pages/peliculas/peliculas-detalle-page';
import { PeliculasPage } from '@/pages/peliculas/peliculas-page';
import { Navigate, Route, Routes } from 'react-router';
import { FuncionesPeliculaPage } from '@/pages/panel/funciones-pelicula-page';


export function AppRoutingSetup() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<PublicoLayout />}>
        <Route path="/" element={<PeliculasPage />} />
        <Route path="/peliculas" element={<PeliculasPage />} />
        <Route path="/peliculas/:id" element={<PeliculasDellatePage />} />
        <Route path="/funciones/:id" element={<FuncionAsientosPage />} />
      </Route>


      {/* Rutas privadas: para Gerente y Administrador */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route
            path="/panel/personas"
            element={<PersonasPage />}
          />

          <Route
            path="/panel/peliculas/nueva"
            element={<PeliculaNuevaPage />}
          />

          <Route
            path="/panel/peliculas"
            element={<PeliculasListaPage />}
          />

          <Route
            path="/panel/peliculas/:id"
            element={<PeliculasDellatePage />}
          />

          <Route
            path="/panel/peliculas/:id/funciones"
            element={<FuncionesPeliculaPage />}
          />
        </Route>
      </Route>


      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
