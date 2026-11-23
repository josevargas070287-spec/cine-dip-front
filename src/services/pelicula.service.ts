import { env } from '@/config/env';
import { http } from '@/lib/http';
import type { CrearPelicula, Pelicula, RespuestaPaginada } from '@/types/pelicula';

export const peliculaService = {
  async listarPeliculas(
    pagina = 1,
    porPagina = 20,
  ): Promise<RespuestaPaginada<Pelicula>> {
    const { data } = await http.get<RespuestaPaginada<Pelicula>>('/peliculas', {
      params: { pagina, porPagina },
    });
    return data;
  },

  async obtenerPelicula(id: number): Promise<Pelicula | undefined> {
    const respuesta = await this.listarPeliculas(1, 100);
    return respuesta.data.find((pelicula) => pelicula.id === id);
  },

  urlImagen(nombreArchivo: string): string {
    return `${env.apiUrl}/files/pelicula/${nombreArchivo}`;
  },

  // Envía datos e imágenes como multipart/form-data.
  // No establecer Content-Type manualmente: Axios agrega el boundary correcto.
  async crear(pelicula: CrearPelicula, imagenes: File[]) {
    const datos = new FormData();
    datos.append('titulo', pelicula.titulo);
    datos.append('sinopsis', pelicula.sinopsis);
    datos.append('duracionMinutos', String(pelicula.duracionMinutos));
    datos.append('fechaEstreno', pelicula.fechaEstreno);
    datos.append('activo', String(pelicula.activo));

    // El backend espera la misma clave "imagenes" repetida para cada archivo.
    for (const archivo of imagenes) {
      datos.append('imagenes', archivo);
    }

    const { data } = await http.post('/peliculas', datos);
    return data;
  },
};
