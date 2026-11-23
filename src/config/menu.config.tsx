import {
  Clapperboard,
  Home,
  Users,
} from 'lucide-react';
import { type MenuConfig } from './types';

/** Menú de la aplicación de cine. */
export const MENU_SIDEBAR: MenuConfig = [
  { title: 'Inicio', icon: Home, path: '/' },
  { heading: 'Cartelera' },
 // { title: 'Funciones', icon: CalendarDays, path: '/cartelera' },
  { title: 'Películas', icon: Clapperboard, path: '/peliculas' },
 // { heading: 'Ventas' },
 // { title: 'Reservar', icon: Ticket, path: '/reservas/nueva', disabled: true },
 // { title: 'Mis reservas', icon: Popcorn, path: '/reservas', disabled: true },
  { heading: 'Administración' },
  { title: 'Películas', icon: Clapperboard, path: '/panel/peliculas' },
  { title: 'Registrar película', icon: Clapperboard, path: '/panel/peliculas/nueva' },
  { title: 'Personas', icon: Users, path: '/panel/personas' },
 // { title: 'Roles', icon: UserCog, path: '/roles', disabled: true },
];

/** El menú superior reutiliza las mismas entradas. */
export const MENU_MEGA: MenuConfig = [
  { title: 'Inicio', path: '/' },
  { title: 'Cartelera', path: '/cartelera' },
  { title: 'Películas', path: '/peliculas' },
];

export const MENU_MEGA_MOBILE: MenuConfig = MENU_MEGA;
