
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import {
  Clapperboard,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  Ticket,
  Popcorn,
  Star,
  ArrowRight,
  Sparkles,
  Film,
} from "lucide-react";
import { useAuth } from "@/auth/context/auth-context";

export function SignInPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await login(usuario, contrasena);

      const destino = searchParams.get("next") || "/panel/peliculas";
      navigate(destino, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08090b] text-white">
      {/* Fondo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-500/[0.07] blur-[120px]" />
        <div className="absolute -right-40 bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-orange-500/[0.05] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        {/* Panel de presentación */}
        <section className="relative hidden min-w-0 flex-col justify-between overflow-hidden border-r border-white/[0.07] px-12 py-10 lg:flex xl:px-16 2xl:px-24">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          <header>
            <Link
              to="/peliculas"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
              aria-label="Ir al listado de películas"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
                <Clapperboard className="h-6 w-6 text-amber-400" />
              </div>

              <div>
                <p className="text-xl font-black tracking-[0.12em]">
                  CINÉLUX
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                  Tu mundo de cine
                </p>
              </div>
            </Link>
          </header>

          <div className="my-12 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-amber-300">
              <Sparkles className="h-4 w-4" />
              VIVE UNA NUEVA EXPERIENCIA
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl 2xl:text-7xl">
              Cada película
              <span className="mt-2 block text-amber-400">
                es otro mundo.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-neutral-400 xl:text-lg">
              Descubre grandes historias, encuentra tus películas favoritas
              y disfruta la magia del cine con CINÉLUX.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#101113] bg-amber-500/20">
                  <Film className="h-4 w-4 text-amber-300" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#101113] bg-neutral-800">
                  <Ticket className="h-4 w-4 text-neutral-300" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#101113] bg-neutral-700">
                  <Star className="h-4 w-4 text-amber-300" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-200">
                  Tu próxima historia comienza aquí
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Cartelera, reservas y entretenimiento.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:gap-4">
            <Link
              to="/peliculas"
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-400/[0.05] xl:p-5"
            >
              <Ticket className="mb-4 h-6 w-6 text-amber-400" />

              <p className="text-sm font-bold">Cartelera</p>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Encuentra tu próxima película.
              </p>
            </Link>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 xl:p-5">
              <Popcorn className="mb-4 h-6 w-6 text-amber-400" />
              <p className="text-sm font-bold">Reservas</p>
              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Prepara tu visita al cine.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 xl:p-5">
              <Star className="mb-4 h-6 w-6 text-amber-400" />
              <p className="text-sm font-bold">Experiencia</p>
              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Disfruta cada momento.
              </p>
            </div>
          </div>

          <footer className="mt-8 text-xs tracking-wide text-neutral-600">
            © {new Date().getFullYear()} CINÉLUX · TODOS LOS DERECHOS RESERVADOS
          </footer>
        </section>

        {/* Panel de acceso */}
        <section className="flex min-h-screen min-w-0 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[440px]">
            {/* Marca visible también en celular */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
                <Clapperboard className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-xl font-black tracking-[0.12em]">
                CINÉLUX
              </span>
            </div>

            <div className="rounded-[28px] border border-white/[0.09] bg-[#101113]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9 lg:p-10">
              <div className="mb-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/[0.08]">
                  <LockKeyhole className="h-6 w-6 text-amber-400" />
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                  Acceso seguro
                </p>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  ¡Bienvenido!
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Ingresa tus datos para continuar y disfrutar de CINÉLUX.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="usuario"
                    className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-neutral-200"
                  >
                    <UserRound className="h-4 w-4 text-amber-400" />
                    Nombre de usuario
                  </label>

                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    autoComplete="username"
                    placeholder="Escribe tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none transition placeholder:text-neutral-600 hover:border-white/20 focus:border-amber-400/70 focus:ring-4 focus:ring-amber-400/[0.08]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contrasena"
                    className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-neutral-200"
                  >
                    <LockKeyhole className="h-4 w-4 text-amber-400" />
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      id="contrasena"
                      name="contrasena"
                      type={mostrarContrasena ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Escribe tu contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                      className="h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/30 px-4 pr-12 text-base text-white outline-none transition placeholder:text-neutral-600 hover:border-white/20 focus:border-amber-400/70 focus:ring-4 focus:ring-amber-400/[0.08]"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarContrasena((v) => !v)}
                      aria-label={
                        mostrarContrasena
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-neutral-500 transition hover:text-amber-400"
                    >
                      {mostrarContrasena ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-300"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 font-bold text-[#171109] shadow-lg shadow-amber-500/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {cargando ? "Verificando acceso..." : "Iniciar sesión"}
                  {!cargando && (
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>


              <div className="mt-6 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-gray-400">
                  ¿No tienes una cuenta?
                </p>

                <Link
                  to="/auth/signup"
                  className="mt-2 inline-flex items-center gap-2
      font-semibold text-amber-400 transition-colors
      hover:text-amber-300"
                >
                  Crear cuenta de cliente
                  <span aria-hidden="true">→</span>
                </Link>

                <p className="mt-2 text-xs text-gray-500">
                  Regístrate y comienza a disfrutar de CINÉLUX.
                </p>
              </div>

            </div>

            <p className="mt-6 text-center text-xs leading-5 text-neutral-600">
              Tu acceso está protegido. © {new Date().getFullYear()} CINÉLUX
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
