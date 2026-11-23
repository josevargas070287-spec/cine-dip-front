// Tipo de una película recibida desde la API.
export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  fechaEstreno: string;
  activo: boolean;
  // Solo nombres de archivos. La URL se construye con peliculaService.urlImagen().
  imagenes: string[];
}

// Tipo genérico reutilizable para respuestas paginadas.
export interface RespuestaPaginada<T> {
  status: string;
  message?: string;
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Datos de una película nueva. Las imágenes se envían aparte como File[].
export interface CrearPelicula {
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  /** Formato YYYY-MM-DD */
  fechaEstreno: string;
  activo: boolean;
}
