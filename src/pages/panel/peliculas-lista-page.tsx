
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { peliculaService } from '@/services/pelicula.service';
import type { Pelicula } from '@/types/pelicula';

export function PeliculasListaPage() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  /*const cargarPeliculas = useCallback(async () => {
    try {
      setCargando(true);
      setError('');

      // Recupera todas las páginas disponibles de la API.
      const primera = await peliculaService.listarPeliculas(1, 100);
      let todas = [...primera.data];

      for (let pagina = 2; pagina <= primera.totalPaginas; pagina++) {
        const respuesta = await peliculaService.listarPeliculas(pagina, 100);
        todas = [...todas, ...respuesta.data];
      }

      setPeliculas(todas);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el listado de películas.',
      );
    } finally {
      setCargando(false);
    }
  }, []);*/

  const cargarPeliculas = useCallback(async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await peliculaService.listarPeliculas(1, 100);

      setPeliculas(respuesta.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el listado de películas.',
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPeliculas();
  }, [cargarPeliculas]);

  const peliculasFiltradas = peliculas.filter((pelicula) =>
    pelicula.titulo.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Listado de películas
          </h1>
          <p className="text-sm text-muted-foreground">
            Consulta y busca las películas registradas en CINÉLUX.
          </p>
        </div>

        <Button asChild>
          <Link to="/panel/peliculas/nueva">
            <Plus className="me-2 h-4 w-4" />
            Registrar película
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título..."
            className="pl-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void cargarPeliculas()}
          disabled={cargando}
        >
          <RefreshCw className="me-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
          {error}
          <Button
            variant="outline"
            className="ms-3"
            onClick={() => void cargarPeliculas()}
          >
            Reintentar
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Película</th>
              <th className="px-4 py-3">Estreno</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {cargando ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando películas...
                </td>
              </tr>
            ) : peliculasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {busqueda
                    ? 'No se encontraron películas con ese título.'
                    : 'Todavía no hay películas registradas.'}
                </td>
              </tr>
            ) : (
              peliculasFiltradas.map((pelicula) => (
                <tr key={pelicula.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">{pelicula.id}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {pelicula.imagenes?.[0] ? (
                        <img
                          src={peliculaService.urlImagen(pelicula.imagenes[0])}
                          alt={pelicula.titulo}
                          className="h-14 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-10 items-center justify-center rounded bg-muted">
                          <Clapperboard className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}

                      <span className="font-medium">{pelicula.titulo}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {pelicula.fechaEstreno
                      ? pelicula.fechaEstreno.slice(0, 10)
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    {pelicula.duracionMinutos} min
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        pelicula.activo
                          ? 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-500'
                          : 'rounded-full bg-muted px-2.5 py-1 text-muted-foreground'
                      }
                    >
                      {pelicula.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>


                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/panel/peliculas/${pelicula.id}`}>
                          Ver detalle
                        </Link>
                      </Button>

                      <Button asChild size="sm" variant="outline">
                        <Link
                          to={`/panel/peliculas/${pelicula.id}/funciones`}
                          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-amber-500 hover:text-amber-500"
                        >
                          Gestionar funciones
                        </Link>
                      </Button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        {cargando
          ? 'Cargando...'
          : `${peliculasFiltradas.length} película(s) encontrada(s)`}
      </p>
    </div>
  );
}
