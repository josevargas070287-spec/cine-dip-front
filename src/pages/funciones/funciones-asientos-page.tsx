import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Asiento, Funcion } from "@/types/cartelera";
import { Link, useParams, useNavigate } from "react-router";
import { carteleraService } from "@/services/cartelera.service";
import { useAuth } from "@/auth/context/auth-context";
import { reservaService } from "@/services/reserva.service";

export function FuncionAsientosPage() {
    const { id } = useParams<{ id: string }>();
    const idFuncion = Number(id);

    const [asientos, setAsientos] = useState<Asiento[]>([]);
    const [funcion, setFuncion] = useState<Funcion | undefined>();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [elegidos, setElegidos] = useState<number[]>([]);
    const [reservado, setReservado] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        setCargando(true);
        setError(null);

        Promise.all([
            carteleraService.asientosDeFuncion(idFuncion),
            carteleraService.listarFunciones(),
        ])
            .then(([butacas, funciones]) => {
                setAsientos(butacas);
                setFuncion(funciones.find((f) => f.idFuncion === idFuncion));
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [idFuncion]);

    const porFila = useMemo(() => {
        const mapa = new Map<string, Asiento[]>();

        for (const asiento of asientos) {
            const fila = mapa.get(asiento.fila) ?? [];
            fila.push(asiento);
            mapa.set(asiento.fila, fila);
        }

        return [...mapa.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([fila, butacas]) => ({
                fila,
                butacas: butacas.sort((a, b) => a.numero - b.numero),
            }));
    }, [asientos]);

    function alternar(idAsiento: number) {
        setElegidos((previos) =>
            previos.includes(idAsiento)
                ? previos.filter((x) => x !== idAsiento)
                : [...previos, idAsiento]
        );
    }

    const total = elegidos.length * (funcion?.precio ?? 0);

    const nombresElegidos = asientos
        .filter((a) => elegidos.includes(a.idAsiento))
        .map((a) => a.asiento)
        .join(", ");

    async function reservar() {
        if (!isAuthenticated || !user) {
            navigate(`/auth/signin?next=/funciones/${idFuncion}`);
            return;
        }

        if (!funcion || elegidos.length === 0) return;

        try {
            setReservado(true);
            setError(null);

            const respuesta = await reservaService.crear({
                idCliente: user.id,
                idFuncion: funcion.idFuncion,
                fechaReserva: new Date().toISOString(),
                codigoReserva: reservaService.generarCodigo(funcion.idFuncion),
                estado: "PENDIENTE",
                total,
                detalles: elegidos.map((idAsiento) => ({
                    idAsiento,
                    precio: funcion.precio,
                })),
            });

            alert(`Reserva creada: ${respuesta.data.reserva.codigo}`);
            navigate("/peliculas");
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setReservado(false);
        }
    }

    if (cargando) {
        return (
            <Container>
                <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                    <p className="text-muted-foreground">Cargando función y butacas...</p>
                </div>
            </Container>
        );
    }

    if (error && !funcion) {
        return (
            <Container>
                <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                    <p className="text-red-400">{error}</p>
                    <Button className="mt-5" variant="outline" onClick={() => navigate(-1)}>
                        Volver atrás
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container width="fluid">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
                {/* Botón para volver */}
                <Link
                    to={funcion ? `/peliculas/${funcion.idPelicula}` : "/peliculas"}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-[#ffb000] hover:text-[#ffb000]"
                >
                    <span aria-hidden="true">←</span>
                    Volver a la película
                </Link>

                {/* Encabezado */}
                <div className="mt-7 rounded-2xl border border-border bg-card p-5 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb000]">
                                CINÉLUX · Reserva de entradas
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {funcion?.pelicula ?? "Seleccionar butacas"}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Elige tus asientos para continuar con tu reserva.
                            </p>
                        </div>

                        {funcion && (
                            <div className="rounded-xl border border-[#ffb000]/30 bg-[#ffb000]/10 px-4 py-3">
                                <p className="text-xs text-muted-foreground">Hora de inicio</p>
                                <p className="mt-1 text-xl font-bold text-[#ffb000]">
                                    {funcion.horaInicio.slice(0, 5)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selección de butacas */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-7">
                        <div className="mx-auto w-full max-w-3xl">
                            <h2 className="text-center text-lg font-semibold text-foreground">
                                Selecciona tus butacas
                            </h2>

                            {/* Pantalla */}
                            <div className="mx-auto mt-8 w-[85%]">
                                <div className="h-2 rounded-t-[50%] bg-gradient-to-r from-transparent via-[#ffb000] to-transparent shadow-[0_-4px_18px_rgba(255,176,0,0.15)]" />
                                <p className="pt-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                    Pantalla
                                </p>
                            </div>

                            {/* Filas de asientos */}
                            <div className="mt-8 space-y-3 overflow-x-auto pb-2">
                                {porFila.map(({ fila, butacas }) => (
                                    <div
                                        key={fila}
                                        className="mx-auto flex w-max min-w-full items-center justify-center gap-2 sm:gap-3"
                                    >
                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-[#ffb000]">
                                            {fila}
                                        </span>

                                        <div className="flex gap-1.5 sm:gap-2">
                                            {butacas.map((butaca) => {
                                                const elegido = elegidos.includes(butaca.idAsiento);

                                                return (
                                                    <button
                                                        key={butaca.idAsiento}
                                                        type="button"
                                                        disabled={!butaca.disponible}
                                                        onClick={() => alternar(butaca.idAsiento)}
                                                        title={`${butaca.asiento}${!butaca.disponible ? " - Ocupado" : elegido ? " - Elegido" : " - Libre"}`}
                                                        aria-pressed={elegido}
                                                        className={[
                                                            "flex size-8 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold transition-all sm:size-9 sm:text-xs",
                                                            !butaca.disponible
                                                                ? "cursor-not-allowed border-neutral-800 bg-neutral-800 text-neutral-500 opacity-60"
                                                                : elegido
                                                                    ? "scale-105 border-[#ffb000] bg-[#ffb000] text-black shadow-md shadow-[#ffb000]/20"
                                                                    : "border-border bg-background text-foreground hover:border-[#ffb000] hover:bg-[#ffb000]/15",
                                                        ].join(" ")}
                                                    >
                                                        {butaca.numero}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-[#ffb000]">
                                            {fila}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Leyenda */}
                            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border pt-5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <span className="size-3.5 rounded border border-border bg-background" />
                                    Libre
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="size-3.5 rounded bg-[#ffb000]" />
                                    Elegido
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="size-3.5 rounded bg-neutral-700" />
                                    Ocupado
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Resumen de reserva */}
                    <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb000]">
                            Tu reserva
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-foreground">
                            Resumen de compra
                        </h2>

                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Butacas elegidas</span>
                                <span className="font-semibold text-foreground">
                                    {elegidos.length}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                                <span className="text-muted-foreground">Asientos</span>
                                <span className="max-w-[160px] text-right font-medium text-foreground">
                                    {nombresElegidos || "Ninguna"}
                                </span>
                            </div>

                            {funcion && (
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Precio por butaca</span>
                                    <span className="font-medium text-foreground">
                                        Bs {funcion.precio}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="my-5 border-t border-border" />

                        <div className="flex items-end justify-between gap-3">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="text-2xl font-extrabold text-[#ffb000]">
                                Bs {total}
                            </span>
                        </div>

                        {error && (
                            <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <Button
                            className="mt-6 w-full bg-[#ffb000] font-bold text-black hover:bg-[#e6a000]"
                            onClick={reservar}
                            disabled={elegidos.length === 0 || reservado}
                        >
                            {reservado ? "Reservando..." : "Confirmar reserva →"}
                        </Button>

                        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                            Selecciona tus butacas antes de confirmar la reserva.
                        </p>
                    </aside>
                </div>
            </div>
        </Container>
    );
}