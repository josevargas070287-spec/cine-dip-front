
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clapperboard, Clock3, Ticket } from 'lucide-react';

import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Container } from '@/components/common/container';
import { Funcion } from '@/types/cartelera';
import { carteleraService } from '@/services/cartelera.service';
import { Button } from '@/components/ui/button';

export function PeliculasDellatePage() {

    const { id } = useParams<{ id: string }>();
    const idPelicula = Number(id);
    const navigate = useNavigate();

    const location = useLocation();

const desdePanel = location.pathname.startsWith('/panel/');
const rutaRetorno = desdePanel ? '/panel/peliculas' : '/peliculas';

    const [pelicula, setPelicula] = useState<Pelicula | undefined>();
    const [funciones, setFunciones] = useState<Funcion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCargando(true);
        setError(null);

        Promise.all([
            peliculaService.obtenerPelicula(idPelicula),
            carteleraService.listarFunciones(idPelicula),
        ])
            .then(([peliculaHallada, funcionesHalladas]) => {
                setPelicula(peliculaHallada);
                setFunciones(funcionesHalladas);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [idPelicula]);

    if (cargando) {
        return (
            <Container>
                <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-16 text-center">
                    <Clapperboard className="mx-auto mb-4 h-10 w-10 animate-pulse text-amber-500" />
                    <p className="text-muted-foreground">Cargando película...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <p className="mb-5 text-destructive">{error}</p>
                    <Button variant="outline" onClick={() => navigate(rutaRetorno)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la cartelera
                    </Button>
                </div>
            </Container>
        );
    }

    if (!pelicula) {
        return (
            <Container>
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <p className="mb-5">No se encontró esa película.</p>
                    <Button variant="outline" onClick={() => navigate(rutaRetorno)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la cartelera
                    </Button>
                </div>
            </Container>
        );
    }

    const poster = pelicula.imagenes?.[0];

    return (
        <Container width="fluid">
            <div className="min-h-[calc(100vh-120px)] w-full bg-background text-foreground">
                <div className="mx-auto box-border w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

                    {/* Botón para volver */}
                    <div className="mb-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="gap-2 rounded-xl border-border bg-card transition-colors hover:border-amber-500 hover:bg-amber-500/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a la cartelera
                        </Button>
                    </div>

                    {/* Contenido principal */}
                    <div className="grid items-start gap-8 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">

                        {/* Póster */}
                        <div className="mx-auto w-full max-w-[340px]">
                            <div className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/20">
                                {poster ? (
                                    <img
                                        src={peliculaService.urlImagen(poster)}
                                        alt={`Póster de ${pelicula.titulo}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                        <Clapperboard className="h-12 w-12 text-amber-500" />
                                        <span className="text-sm">Sin imagen disponible</span>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                    <p className="text-sm font-semibold text-white">
                                        CINÉLUX
                                    </p>
                                    <p className="text-xs text-white/70">
                                        Vive la experiencia del cine
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la película */}
                        <div className="min-w-0 space-y-8">
                            <section className="border-b border-border pb-7">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                                    <Clapperboard className="h-4 w-4" />
                                    Detalle de película
                                </div>

                                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                    {pelicula.titulo}
                                </h1>

                                <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                                    {pelicula.sinopsis || 'Sinopsis no disponible.'}
                                </p>
                            </section>

                            {/* Funciones y horarios */}
                            <section>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold sm:text-2xl">
                                            Funciones disponibles
                                        </h2>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Selecciona un horario para continuar con tu reserva.
                                        </p>
                                    </div>

                                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
                                        <Ticket className="h-4 w-4 text-amber-500" />
                                        {funciones.length}{' '}
                                        {funciones.length === 1 ? 'función' : 'funciones'}
                                    </span>
                                </div>

                                {funciones.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-10 text-center">
                                        <Clock3 className="mx-auto mb-3 h-9 w-9 text-amber-500" />
                                        <h3 className="font-semibold">
                                            No hay funciones programadas
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Vuelve a consultar más adelante.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {funciones.map((funcion) => (
                                            <Link
                                                key={funcion.idFuncion}
                                                to={`/funciones/${funcion.idFuncion}`}
                                                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/5"
                                            >
                                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 opacity-80 transition-opacity group-hover:opacity-100" />

                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                            Hora de inicio
                                                        </p>
                                                        <p className="mt-2 text-3xl font-bold tracking-tight text-amber-500">
                                                            {funcion.horaInicio.slice(0, 5)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-500">
                                                        <Ticket className="h-6 w-6" />
                                                    </div>
                                                </div>

                                                <div className="my-4 border-t border-border" />

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="text-sm text-muted-foreground">
                                                            Precio
                                                        </span>
                                                        <span className="font-semibold">
                                                            Bs {funcion.precio}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-start justify-between gap-3">
                                                        <span className="text-sm text-muted-foreground">
                                                            Sala
                                                        </span>
                                                        <span className="text-right text-sm font-medium">
                                                            {funcion.sala} - {funcion.tipoSala}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-black transition-colors group-hover:bg-amber-400">
                                                    Seleccionar función
                                                    <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
