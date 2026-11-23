
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Film,
    Search,
} from 'lucide-react';

import { peliculaService } from '@/services/pelicula.service';
import type { Pelicula } from '@/types/pelicula';

const POR_PAGINA = 18;

function formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;

    return horas > 0
        ? `${horas} h ${resto} min`
        : `${resto} min`;
}

export function PeliculasPage() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [intentoCarga, setIntentoCarga] = useState(0);

    useEffect(() => {
        let activo = true;

        setCargando(true);
        setError(null);

        peliculaService
            .listarPeliculas(pagina, POR_PAGINA)
            .then((respuesta) => {
                if (!activo) return;

                setPeliculas(respuesta.data);
                setTotalPaginas(
                    Math.max(1, respuesta.totalPaginas ?? 1)
                );
            })
            .catch((e: Error) => {
                if (activo) {
                    setError(
                        e.message || 'No se pudieron cargar las películas.'
                    );
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [pagina, intentoCarga]);

    const peliculasFiltradas = peliculas.filter((pelicula) =>
        pelicula.titulo
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen w-full min-w-0 bg-background">
            <div className="mx-auto w-full  px-4 sm:px-6 lg:px-6">
                {/* Presentación y buscador */}
                <section className="border-b border-border py-2 sm:py-3">
                    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Film className="size-4 text-amber-500" />

                                <Link
                                    to="/"
                                    className="font-medium text-amber-500 hover:text-amber-400"
                                >
                                    CINÉLUX
                                </Link>

                                <ChevronRight className="size-4" />

                                <span>Cartelera</span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Vive la experiencia del cine
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Explora nuestra cartelera, descubre nuevas
                                historias y elige la película perfecta para ti.
                            </p>
                        </div>

                        <div className="w-full lg:w-[300px] lg:shrink-0">
                            <label
                                htmlFor="buscar-pelicula"
                                className="relative block w-full"
                            >
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                    id="buscar-pelicula"
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    placeholder="Buscar una película..."
                                    aria-label="Buscar una película por título"
                                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Listado de películas */}
                <section className="py-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">
                                Películas en cartelera
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Encuentra tu próxima película favorita.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                            <Film className="size-4" />

                            {busqueda.trim()
                                ? `${peliculasFiltradas.length} resultados`
                                : `${peliculas.length} películas`}
                        </div>
                    </div>

                    {/* Cargando */}
                    {cargando && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[2/3] rounded-xl bg-muted" />
                                    <div className="mt-3 h-4 rounded bg-muted" />
                                    <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {!cargando && error && (
                        <div className="rounded-xl border border-destructive/30 p-6 text-center">
                            <p className="text-sm text-destructive">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setIntentoCarga((actual) => actual + 1)
                                }
                                className="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                            >
                                Volver a intentar
                            </button>
                        </div>
                    )}

                    {/* Sin resultados */}
                    {!cargando && !error && peliculasFiltradas.length === 0 && (
                        <div className="rounded-xl border border-border p-10 text-center">
                            <Film className="mx-auto size-10 text-muted-foreground" />

                            <p className="mt-4 font-medium">
                                {busqueda.trim()
                                    ? 'No se encontraron películas con ese título.'
                                    : 'No hay películas en esta página.'}
                            </p>

                            {busqueda.trim() && (
                                <button
                                    type="button"
                                    onClick={() => setBusqueda('')}
                                    className="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                                >
                                    Limpiar búsqueda
                                </button>
                            )}
                        </div>
                    )}

                    {/* Tarjetas */}
                    {!cargando && !error && peliculasFiltradas.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                                {peliculasFiltradas.map((pelicula) => {
                                    const poster = pelicula.imagenes?.[0];

                                    return (
                                        <article
                                            key={pelicula.id}
                                            className="group min-w-0"
                                        >
                                            <Link
                                                to={`/peliculas/${pelicula.id}`}
                                                className="block"
                                            >
                                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-muted">
                                                    {poster ? (
                                                        <img
                                                            src={peliculaService.urlImagen(poster)}
                                                            alt={`Afiche de ${pelicula.titulo}`}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                                            <Film className="size-8" />

                                                            <span className="text-xs">
                                                                Sin imagen
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-black/75 px-3 py-2 text-xs font-medium text-white">
                                                        <Clock className="size-3.5 shrink-0" />

                                                        {formatearDuracion(
                                                            pelicula.duracionMinutos
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-amber-500">
                                                    {pelicula.titulo}
                                                </h3>
                                            </Link>

                                            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                                                <span className="text-muted-foreground">
                                                    Duración
                                                </span>

                                                <span className="font-medium text-foreground">
                                                    {formatearDuracion(
                                                        pelicula.duracionMinutos
                                                    )}
                                                </span>
                                            </div>

                                            <Link
                                                to={`/peliculas/${pelicula.id}`}
                                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold transition-colors hover:border-amber-500 hover:text-amber-500"
                                            >
                                                Ver detalles
                                                <ChevronRight className="size-4" />
                                            </Link>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* Paginación */}
                            {!busqueda.trim() && totalPaginas > 1 && (
                                <nav
                                    aria-label="Paginación de películas"
                                    className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-6"
                                >
                                    <button
                                        type="button"
                                        disabled={pagina <= 1 || cargando}
                                        onClick={() =>
                                            setPagina((actual) => actual - 1)
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="size-4" />
                                        Anterior
                                    </button>

                                    {Array.from(
                                        { length: totalPaginas },
                                        (_, i) => i + 1
                                    ).map((numero) => (
                                        <button
                                            key={numero}
                                            type="button"
                                            aria-current={
                                                pagina === numero
                                                    ? 'page'
                                                    : undefined
                                            }
                                            disabled={cargando}
                                            onClick={() => setPagina(numero)}
                                            className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                                                pagina === numero
                                                    ? 'border-amber-500 bg-amber-500 text-black'
                                                    : 'border-border hover:bg-muted'
                                            }`}
                                        >
                                            {numero}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={
                                            pagina >= totalPaginas || cargando
                                        }
                                        onClick={() =>
                                            setPagina((actual) => actual + 1)
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Siguiente
                                        <ChevronRight className="size-4" />
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
