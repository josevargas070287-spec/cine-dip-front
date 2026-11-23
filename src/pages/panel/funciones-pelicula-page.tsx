
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Clapperboard,
    Plus,
    Clock3,
    Ticket,
    CalendarDays,
    Film,
    Monitor,
    RefreshCw,
    CircleCheck,
    AlertCircle,
    LoaderCircle,
} from 'lucide-react';

import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { carteleraService } from '@/services/cartelera.service';
import { peliculaService } from '@/services/pelicula.service';
import type { Sala, CrearFuncion, Funcion } from '@/types/cartelera';
import type { Pelicula } from '@/types/pelicula';

export function FuncionesPeliculaPage() {
    const { id } = useParams<{ id: string }>();
    const idPelicula = Number(id);

    const [pelicula, setPelicula] = useState<Pelicula | undefined>();
    const [funciones, setFunciones] = useState<Funcion[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);

    const [cargandoPelicula, setCargandoPelicula] = useState(true);
    const [cargandoFunciones, setCargandoFunciones] = useState(true);
    const [cargandoSalas, setCargandoSalas] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [errorPelicula, setErrorPelicula] = useState('');
    const [errorFunciones, setErrorFunciones] = useState('');
    const [errorSalas, setErrorSalas] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [formulario, setFormulario] = useState({
        idSala: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        precio: '35',
    });

    // Cargar los datos de la película seleccionada.
    useEffect(() => {
        let vigente = true;

        const cargarPelicula = async () => {
            setCargandoPelicula(true);
            setErrorPelicula('');

            try {
                if (!Number.isInteger(idPelicula) || idPelicula <= 0) {
                    throw new Error('El ID de la película no es válido.');
                }

                const resultado =
                    await peliculaService.obtenerPelicula(idPelicula);

                if (vigente) {
                    setPelicula(resultado);
                    if (!resultado) {
                        setErrorPelicula(
                            'No se encontró la película seleccionada.',
                        );
                    }
                }
            } catch (err) {
                if (vigente) {
                    setErrorPelicula(
                        err instanceof Error
                            ? err.message
                            : 'No se pudo cargar la película.',
                    );
                }
            } finally {
                if (vigente) {
                    setCargandoPelicula(false);
                }
            }
        };

        void cargarPelicula();

        return () => {
            vigente = false;
        };
    }, [idPelicula]);

    // Cargar las funciones existentes de esta película.
    const cargarFunciones = useCallback(async () => {
        setCargandoFunciones(true);
        setErrorFunciones('');

        try {
            const resultado =
                await carteleraService.listarFunciones(idPelicula);

            setFunciones(
                resultado.filter(
                    (funcion) => funcion.idPelicula === idPelicula,
                ),
            );
        } catch (err) {
            setErrorFunciones(
                err instanceof Error
                    ? err.message
                    : 'No se pudieron cargar las funciones.',
            );
        } finally {
            setCargandoFunciones(false);
        }
    }, [idPelicula]);

    useEffect(() => {
        let vigente = true;

        const cargar = async () => {
            if (!Number.isInteger(idPelicula) || idPelicula <= 0) {
                setErrorFunciones('El ID de la película no es válido.');
                setCargandoFunciones(false);
                return;
            }

            setCargandoFunciones(true);
            setErrorFunciones('');

            try {
                const resultado =
                    await carteleraService.listarFunciones(idPelicula);

                if (vigente) {
                    setFunciones(
                        resultado.filter(
                            (funcion) =>
                                funcion.idPelicula === idPelicula,
                        ),
                    );
                }
            } catch (err) {
                if (vigente) {
                    setErrorFunciones(
                        err instanceof Error
                            ? err.message
                            : 'No se pudieron cargar las funciones.',
                    );
                }
            } finally {
                if (vigente) {
                    setCargandoFunciones(false);
                }
            }
        };

        void cargar();

        return () => {
            vigente = false;
        };
    }, [idPelicula]);

    // IMPORTANTE: cargar las salas y finalizar el estado de carga.
    useEffect(() => {
        let vigente = true;

        const cargarSalas = async () => {
            setCargandoSalas(true);
            setErrorSalas('');

            try {
                const resultado = await carteleraService.listarSalas();

                if (vigente) {
                    // Excluir las salas expresamente inactivas.
                    // Si el backend no envía "activa", conservarlas.
                    setSalas(
                        resultado.filter((sala) => sala.activa !== false),
                    );
                }
            } catch (err) {
                if (vigente) {
                    setSalas([]);
                    setErrorSalas(
                        err instanceof Error
                            ? err.message
                            : 'No se pudieron cargar las salas.',
                    );
                }
            } finally {
                if (vigente) {
                    setCargandoSalas(false);
                }
            }
        };

        void cargarSalas();

        return () => {
            vigente = false;
        };
    }, []);

    const cambiarCampo = (
        campo: keyof typeof formulario,
        valor: string,
    ) => {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));
        setError('');
        setMensaje('');
    };

    const guardarFuncion = async (
        evento: FormEvent<HTMLFormElement>,
    ) => {
        evento.preventDefault();
        setError('');
        setMensaje('');

        if (!Number.isInteger(idPelicula) || idPelicula <= 0) {
            setError('El ID de la película no es válido.');
            return;
        }

        if (cargandoSalas) {
            setError('Espera a que termine la carga de las salas.');
            return;
        }

        if (salas.length === 0) {
            setError('No hay salas disponibles para registrar la función.');
            return;
        }

        if (
            !formulario.idSala ||
            !formulario.fecha ||
            !formulario.horaInicio ||
            !formulario.horaFin
        ) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (formulario.horaFin <= formulario.horaInicio) {
            setError(
                'La hora de fin debe ser posterior a la hora de inicio.',
            );
            return;
        }

        const precio = Number(formulario.precio);

        if (!Number.isFinite(precio) || precio < 0) {
            setError('Introduce un precio válido, igual o mayor que cero.');
            return;
        }

        const salaSeleccionada = salas.find(
            (sala) => sala.idSala === Number(formulario.idSala),
        );

        if (!salaSeleccionada) {
            setError('Selecciona una sala válida.');
            return;
        }

        const nuevaFuncion: CrearFuncion = {
            idPelicula,
            idSala: Number(formulario.idSala),
            fecha: formulario.fecha,
            horaInicio: `${formulario.horaInicio}:00`,
            horaFin: `${formulario.horaFin}:00`,
            precio,
            estado: 'PROGRAMADA',
        };

        try {
            setGuardando(true);

            await carteleraService.crearFuncion(nuevaFuncion);

            setMensaje('¡La función se registró correctamente!');

            setFormulario({
                idSala: '',
                fecha: '',
                horaInicio: '',
                horaFin: '',
                precio: '35',
            });

            // Volver a consultar el backend para mostrar los datos reales.
            await cargarFunciones();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar la función.',
            );
        } finally {
            setGuardando(false);
        }
    };

    const formatearFecha = (fecha: string) => {
        const partes = fecha.slice(0, 10).split('-');

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    const formatearHora = (hora: string) => hora?.slice(0, 5) ?? '--:--';

    const poster = pelicula?.imagenes?.[0];

    return (
        <Container width="fluid">
            <div className="min-h-[calc(100vh-120px)] bg-background text-foreground">
                <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

                    {/* Navegación */}
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="gap-2 rounded-xl border-border transition-colors hover:border-amber-500 hover:bg-amber-500/10"
                        >
                            <Link to="/panel/peliculas">
                                <ArrowLeft className="h-4 w-4" />
                                Volver a películas
                            </Link>
                        </Button>
                    </div>

                    {/* Encabezado de la página */}
                    <header className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10">
                            <Clapperboard className="h-7 w-7 text-amber-500" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                                Administración de cartelera
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                                Gestionar funciones
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Programa y consulta los horarios de la película.
                            </p>
                        </div>
                    </header>

                    {/* Información de la película */}
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200" />

                        {cargandoPelicula ? (
                            <div className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                                <LoaderCircle className="h-5 w-5 animate-spin text-amber-500" />
                                Cargando información de la película...
                            </div>
                        ) : errorPelicula ? (
                            <div className="flex items-start gap-3 p-6 text-sm text-destructive">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <p>{errorPelicula}</p>
                            </div>
                        ) : pelicula ? (
                            <div className="grid gap-6 p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:p-7">
                                <div className="mx-auto w-full max-w-[180px] sm:max-w-none">
                                    <div className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-muted shadow-lg">
                                        {poster ? (
                                            <img
                                                src={peliculaService.urlImagen(poster)}
                                                alt={`Póster de ${pelicula.titulo}`}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                                <Film className="h-12 w-12 text-amber-500" />
                                                <span className="text-xs">
                                                    Sin portada
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex min-w-0 flex-col justify-center">
                                    <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500">
                                        <CircleCheck className="h-3.5 w-3.5" />
                                        Película seleccionada
                                    </span>

                                    <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                        {pelicula.titulo}
                                    </h2>

                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                                        {pelicula.sinopsis ||
                                            'Sinopsis no disponible.'}
                                    </p>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4">
                                            <div className="rounded-lg bg-amber-500/10 p-2.5">
                                                <Ticket className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Funciones registradas
                                                </p>
                                                <p className="mt-1 text-xl font-bold">
                                                    {funciones.length}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4">
                                            <div className="rounded-lg bg-amber-500/10 p-2.5">
                                                <Monitor className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Salas disponibles
                                                </p>
                                                <p className="mt-1 text-xl font-bold">
                                                    {cargandoSalas ? '...' : salas.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </section>

                    {/* Funciones registradas */}
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <CalendarDays className="h-5 w-5 text-amber-500" />
                                    Funciones asignadas
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Horarios programados para esta película.
                                </p>
                            </div>

                            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-500">
                                {funciones.length}{' '}
                                {funciones.length === 1 ? 'función' : 'funciones'}
                            </span>
                        </div>

                        <div className="p-5 sm:p-6">
                            {cargandoFunciones ? (
                                <div className="flex items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
                                    <LoaderCircle className="h-5 w-5 animate-spin text-amber-500" />
                                    Cargando funciones...
                                </div>
                            ) : errorFunciones ? (
                                <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="flex items-start gap-2 text-sm text-destructive">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                        {errorFunciones}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => void cargarFunciones()}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Reintentar
                                    </Button>
                                </div>
                            ) : funciones.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                                        <Clock3 className="h-7 w-7 text-amber-500" />
                                    </div>
                                    <h3 className="font-semibold">
                                        Todavía no hay funciones
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        Esta película aún no tiene horarios
                                        registrados. Utiliza el formulario de
                                        abajo para programar la primera función.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-border">
                                    <table className="w-full min-w-[680px] text-left text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                                                <th className="px-4 py-4 font-semibold">
                                                    Fecha
                                                </th>
                                                <th className="px-4 py-4 font-semibold">
                                                    Horario
                                                </th>
                                                <th className="px-4 py-4 font-semibold">
                                                    Sala
                                                </th>
                                                <th className="px-4 py-4 font-semibold">
                                                    Precio
                                                </th>
                                                <th className="px-4 py-4 font-semibold">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {funciones.map((funcion) => (
                                                <tr
                                                    key={funcion.idFuncion}
                                                    className="border-t border-border transition-colors hover:bg-muted/30"
                                                >
                                                    <td className="whitespace-nowrap px-4 py-4 font-medium">
                                                        {formatearFecha(funcion.fecha)}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        <span className="font-semibold text-amber-500">
                                                            {formatearHora(funcion.horaInicio)}
                                                        </span>
                                                        <span className="mx-2 text-muted-foreground">
                                                            –
                                                        </span>
                                                        {formatearHora(funcion.horaFin)}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div className="font-medium">
                                                            {funcion.sala || `Sala ${funcion.idSala}`}
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {funcion.tipoSala || 'Tipo no especificado'}
                                                        </div>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4 font-semibold">
                                                        Bs {funcion.precio}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                                                funcion.estado === 'PROGRAMADA'
                                                                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
                                                                    : 'border-border bg-muted text-muted-foreground'
                                                            }`}
                                                        >
                                                            {funcion.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Formulario para registrar función */}
                    <section
                        id="registrar-funcion"
                        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                    >
                        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200" />

                        <div className="border-b border-border p-5 sm:p-6">
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                                    <Plus className="h-5 w-5 text-amber-500" />
                                </span>
                                Registrar nueva función
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Completa los datos para programar un nuevo
                                horario de esta película.
                            </p>
                        </div>

                        <div className="p-5 sm:p-6">
                            {error && (
                                <div
                                    role="alert"
                                    className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                                >
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {mensaje && (
                                <div
                                    role="status"
                                    className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-600"
                                >
                                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" />
                                    <p>{mensaje}</p>
                                </div>
                            )}

                            {errorSalas && (
                                <div
                                    role="alert"
                                    className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                                >
                                    <p className="flex items-start gap-2 text-sm text-destructive">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                        No se pudieron cargar las salas: {errorSalas}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-3 gap-2"
                                        onClick={() => window.location.reload()}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Recargar página
                                    </Button>
                                </div>
                            )}

                            <form onSubmit={guardarFuncion} className="space-y-6">
                                {/* Selección de sala */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="idSala"
                                        className="text-sm font-semibold"
                                    >
                                        Sala <span className="text-amber-500">*</span>
                                    </label>

                                    <select
                                        id="idSala"
                                        value={formulario.idSala}
                                        onChange={(evento) =>
                                            cambiarCampo('idSala', evento.target.value)
                                        }
                                        required
                                        disabled={
                                            cargandoSalas ||
                                            salas.length === 0 ||
                                            Boolean(errorSalas)
                                        }
                                        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="">
                                            {cargandoSalas
                                                ? 'Cargando salas...'
                                                : errorSalas
                                                  ? 'Error al cargar las salas'
                                                  : salas.length === 0
                                                    ? 'No hay salas disponibles'
                                                    : 'Selecciona una sala'}
                                        </option>

                                        {salas.map((sala) => (
                                            <option
                                                key={sala.idSala}
                                                value={sala.idSala}
                                            >
                                                {sala.nombre} — {sala.tipo} (
                                                {sala.capacidad} asientos)
                                            </option>
                                        ))}
                                    </select>

                                    <p className="text-xs text-muted-foreground">
                                        {cargandoSalas
                                            ? 'Consultando las salas disponibles...'
                                            : errorSalas
                                              ? 'Comprueba que el endpoint de salas esté configurado en el backend.'
                                              : `${salas.length} sala(s) disponible(s).`}
                                    </p>
                                </div>

                                {/* Fecha */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="fecha"
                                        className="text-sm font-semibold"
                                    >
                                        Fecha <span className="text-amber-500">*</span>
                                    </label>

                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={formulario.fecha}
                                        onChange={(evento) =>
                                            cambiarCampo('fecha', evento.target.value)
                                        }
                                        required
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                {/* Horarios */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="horaInicio"
                                            className="text-sm font-semibold"
                                        >
                                            Hora de inicio{' '}
                                            <span className="text-amber-500">*</span>
                                        </label>

                                        <Input
                                            id="horaInicio"
                                            type="time"
                                            value={formulario.horaInicio}
                                            onChange={(evento) =>
                                                cambiarCampo(
                                                    'horaInicio',
                                                    evento.target.value,
                                                )
                                            }
                                            required
                                            className="h-11 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="horaFin"
                                            className="text-sm font-semibold"
                                        >
                                            Hora de fin{' '}
                                            <span className="text-amber-500">*</span>
                                        </label>

                                        <Input
                                            id="horaFin"
                                            type="time"
                                            value={formulario.horaFin}
                                            onChange={(evento) =>
                                                cambiarCampo(
                                                    'horaFin',
                                                    evento.target.value,
                                                )
                                            }
                                            required
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Precio */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="precio"
                                        className="text-sm font-semibold"
                                    >
                                        Precio del boleto (Bs){' '}
                                        <span className="text-amber-500">*</span>
                                    </label>

                                    <Input
                                        id="precio"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.precio}
                                        onChange={(evento) =>
                                            cambiarCampo('precio', evento.target.value)
                                        }
                                        required
                                        className="h-11 rounded-xl"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Introduce el precio de la entrada en bolivianos.
                                    </p>
                                </div>

                                {/* Botones */}
                                <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Los campos marcados con * son obligatorios.
                                    </p>

                                    <Button
                                        type="submit"
                                        disabled={
                                            guardando ||
                                            cargandoSalas ||
                                            salas.length === 0 ||
                                            cargandoPelicula ||
                                            !pelicula
                                        }
                                        className="h-11 gap-2 rounded-xl bg-amber-500 px-6 font-semibold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
                                    >
                                        {guardando ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        {guardando
                                            ? 'Registrando función...'
                                            : 'Registrar función'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </Container>
    );
}
