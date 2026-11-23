import { Helmet } from 'react-helmet-async';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { Clapperboard, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/auth/context/auth-context';


const ENLACES = [
    { titulo: 'Cartelera', ruta: '/' },
];

export function PublicoLayout() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const rol = String(user?.roles ?? '').toUpperCase();
    const puedeVerPanel = ['ADMIN', 'ADMINISTRADOR', 'GERENTE'].includes(rol);

    const nombreCompleto = user
        ? [
            'nombres' in user ? user.nombres : '',
            'apellidos' in user ? user.apellidos : '',
        ]
            .filter(Boolean)
            .join(' ')
            .trim()
        : '';

    const nombreMostrar =
        nombreCompleto ||
        (user && 'nombre' in user ? String(user.nombre ?? '') : '') ||
        (user && 'usuario' in user ? String(user.usuario ?? '') : '');

    function cerrarSesion() {
        logout();
        navigate('/auth/signin', { replace: true });
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Helmet>
                <title>CINÉLUX | Cartelera de películas</title>
            </Helmet>

            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
                    <Link
                        to="/"
                        aria-label="CINÉLUX - Inicio"
                        className="flex shrink-0 items-center gap-2"
                    >
                        <Clapperboard className="size-7 text-amber-500" />
                        <span className="text-xl font-bold tracking-wide text-mono">
                            CINÉLUX
                        </span>
                    </Link>

                    <nav className="flex flex-1 items-center justify-center gap-5">
                        {ENLACES.map((enlace) => (
                            <NavLink
                                key={enlace.ruta}
                                to={enlace.ruta}
                                end
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-secondary-foreground hover:text-primary'
                                    }`
                                }
                            >
                                {enlace.titulo}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex shrink-0 items-center justify-end gap-3">
                        {isAuthenticated ? (
                            <>
                                <span
                                    className="hidden text-sm font-medium text-white sm:inline"
                                    title={nombreMostrar || 'Usuario'}
                                >
                                    Hola, {nombreMostrar || 'Usuario'}
                                </span>

                                {puedeVerPanel && (
                                    <Link
                                        to="/panel/peliculas"
                                        className="inline-flex items-center gap-2 rounded-md border border-amber-500/40 px-3 py-2 text-xs font-medium text-amber-500 transition hover:bg-amber-500/10"
                                    >
                                        <LayoutDashboard className="size-4" />
                                        <span>Panel</span>
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={cerrarSesion}
                                    className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-200 transition hover:border-amber-500 hover:bg-amber-500 hover:text-black"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="size-4" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/auth/signin"
                                className="rounded-md border border-input px-3 py-2 text-xs font-medium hover:bg-accent"
                            >
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="w-full min-w-0 flex-1">
                <Outlet />
            </main>

            <footer className="mt-auto border-t border-border">
                <Container className="py-5">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CINÉLUX. Todos los derechos reservados.
                    </p>
                </Container>
            </footer>
        </div>
    );
}