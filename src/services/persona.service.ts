
import { http } from '@/lib/http';
import type {
  CrearPersona,
  PersonaCreada,
  Persona,
} from '@/types/persona';
import type { RespuestaPaginada } from '@/types/pelicula';

export const personaService = {
  // Registrar una persona: conservamos la funcionalidad existente.
  async registrar(persona: CrearPersona): Promise<PersonaCreada> {
    const { data } = await http.post<PersonaCreada>(
      '/persona',
      persona,
    );

    return data;
  },

  // Listar personas con paginación.
  async listar(
    pagina = 1,
    porPagina = 10,
  ): Promise<RespuestaPaginada<Persona>> {
    const { data } = await http.get<RespuestaPaginada<Persona>>(
      '/persona',
      {
        params: { pagina, porPagina },
      },
    );

    return data;
  },

  // Buscar por nombres, apellidos o ambos filtros.
  async buscar(
    nombres: string,
    apellidos: string,
    pagina = 1,
    porPagina = 10,
  ): Promise<RespuestaPaginada<Persona>> {
    const params: Record<string, string | number> = {
      pagina,
      porPagina,
    };

    if (nombres.trim()) {
      params.nombres = nombres.trim();
    }

    if (apellidos.trim()) {
      params.apellidos = apellidos.trim();
    }

    const { data } = await http.get<RespuestaPaginada<Persona>>(
      '/persona/buscar',
      { params },
    );

    return data;
  },
};
